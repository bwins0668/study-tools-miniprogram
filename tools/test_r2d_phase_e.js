'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var scheduler = require('../utils/spaced-repetition/scheduler');
var storage = require('../utils/spaced-repetition/storage');
var summary = require('../utils/spaced-repetition/summary');

// ═══════════════════════════════════════════════════════════════════════
// Mock wx global for review module
// ═══════════════════════════════════════════════════════════════════════
var mockStorage = {};
global.wx = {
  getStorageSync: function (key) { return mockStorage[key] || ''; },
  setStorageSync: function (key, value) { mockStorage[key] = value; },
  removeStorageSync: function (key) { delete mockStorage[key]; }
};

var review = require('../utils/spaced-repetition/review');

// ═══════════════════════════════════════════════════════════════════════
// E1: Grade Scheduling
// ═══════════════════════════════════════════════════════════════════════
helpers.run('r2d_e1_grade_scheduling', function () {
  var now = 1700000000000;

  // Create item and advance to REVIEW state
  var built = identity.createTermIdentity('e1-grade');
  var item = schema.createMemoryItem(built, now);
  var activated = scheduler.activateItem(item, now);
  helpers.equal(activated.item.state, constants.STATES.LEARNING, 'INITIAL_LEARNING');
  var reviewed = scheduler.applyGrade(activated.item, constants.GRADES.GOOD, now + constants.LEARNING_DELAY_MS);
  helpers.equal(reviewed.item.state, constants.STATES.REVIEW, 'ADVANCED_TO_REVIEW');
  helpers.equal(reviewed.item.stepIndex, 0, 'REVIEW_STEP_0');
  helpers.equal(reviewed.item.intervalDays, 1, 'REVIEW_INTERVAL_1');

  function makeReviewItem(tag) {
    var b = identity.createTermIdentity('e1-' + tag);
    var it = schema.createMemoryItem(b, now);
    var act = scheduler.activateItem(it, now);
    return scheduler.applyGrade(act.item, constants.GRADES.GOOD, now + constants.LEARNING_DELAY_MS);
  }

  // AGAIN from REVIEW: state→RELEARNING, dueAt +10min, stepIndex-1, lapses+1
  var againSrc = makeReviewItem('again');
  var again = scheduler.applyGrade(againSrc.item, constants.GRADES.AGAIN, againSrc.item.dueAt);
  helpers.equal(again.item.state, constants.STATES.RELEARNING, 'AGAIN_STATE');
  helpers.equal(again.item.stepIndex, -1, 'AGAIN_STEP');
  helpers.equal(again.item.lapses, 1, 'AGAIN_LAPSES');
  var againDueDelta = again.item.dueAt - againSrc.item.dueAt;
  helpers.equal(againDueDelta, constants.LEARNING_DELAY_MS, 'AGAIN_DUE_10MIN');

  // HARD from REVIEW: state stays REVIEW, stepIndex unchanged, hardCount+1
  var hardSrc = makeReviewItem('hard');
  var hard = scheduler.applyGrade(hardSrc.item, constants.GRADES.HARD, hardSrc.item.dueAt);
  helpers.equal(hard.item.state, constants.STATES.REVIEW, 'HARD_STATE');
  helpers.equal(hard.item.stepIndex, 0, 'HARD_STEP_UNCHANGED');
  helpers.equal(hard.item.hardCount, 1, 'HARD_COUNT');
  helpers.equal(hard.item.intervalDays, 1, 'HARD_INTERVAL_SAME');

  // GOOD from REVIEW: stepIndex +1, REVIEW, correctCount+1
  var goodSrc = makeReviewItem('good');
  var good = scheduler.applyGrade(goodSrc.item, constants.GRADES.GOOD, goodSrc.item.dueAt);
  helpers.equal(good.item.state, constants.STATES.REVIEW, 'GOOD_STATE');
  helpers.equal(good.item.stepIndex, 1, 'GOOD_STEP');
  helpers.equal(good.item.correctCount, goodSrc.item.correctCount + 1, 'GOOD_CORRECT');
  helpers.equal(good.item.intervalDays, 2, 'GOOD_INTERVAL');

  // EASY from REVIEW: stepIndex +2, REVIEW, easyCount+1, correctCount+1
  var easySrc = makeReviewItem('easy');
  var easy = scheduler.applyGrade(easySrc.item, constants.GRADES.EASY, easySrc.item.dueAt);
  helpers.equal(easy.item.state, constants.STATES.REVIEW, 'EASY_STATE');
  helpers.equal(easy.item.stepIndex, 2, 'EASY_STEP');
  helpers.equal(easy.item.easyCount, 1, 'EASY_COUNT');
  helpers.equal(easy.item.correctCount, easySrc.item.correctCount + 1, 'EASY_CORRECT');
  helpers.equal(easy.item.intervalDays, 4, 'EASY_INTERVAL');

  // EASY 120-day cap: at stepIndex=7, EASY can't go beyond 120
  var capItem = schema.clone(reviewed.item);
  capItem.stepIndex = 7;
  capItem.intervalDays = 120;
  var capEasy = scheduler.applyGrade(capItem, constants.GRADES.EASY, now);
  helpers.equal(capEasy.item.stepIndex, 7, 'EASY_CAP_STEP');
  helpers.equal(capEasy.item.intervalDays, 120, 'EASY_CAP_120');
  helpers.assert(capEasy.item.intervalDays <= 120, 'EASY_CAP_BOUNDED');

  return { grades: ['AGAIN', 'HARD', 'GOOD', 'EASY', 'EASY_CAP'] };
});

// ═══════════════════════════════════════════════════════════════════════
// E2: Event Dedup
// ═══════════════════════════════════════════════════════════════════════
helpers.run('r2d_e2_event_dedup', function () {
  mockStorage = {};
  var now = 1700000000000;
  var session = review.createReviewSession('test', 'dedup-deck', ['q1', 'q2'], '/pages/review-center/review-center');
  var sid = session.reviewSessionId;
  var src = { course: 'test', deckId: 'dedup-deck', questionId: 'q1' };

  var r1 = review.recordReviewDecision(src, 'GOOD', now, sid);
  helpers.equal(r1.accepted, true, 'FIRST_ACCEPTED');
  helpers.equal(r1.item.correctCount, 1, 'FIRST_CORRECT');

  var r2 = review.recordReviewDecision(src, 'GOOD', now, sid);
  helpers.equal(r2.accepted, false, 'SECOND_REJECTED');
  helpers.equal(r2.reason, 'DUPLICATE_EVENT', 'DUPLICATE_REASON');
  helpers.equal(r2.item.correctCount, 1, 'COUNT_UNCHANGED');

  review.clearReviewSession();
  return { dedup: true };
});

// ═══════════════════════════════════════════════════════════════════════
// E3: Session Completion
// ═══════════════════════════════════════════════════════════════════════
helpers.run('r2d_e3_session_completion', function () {
  mockStorage = {};
  var session = review.createReviewSession('itpass', '01_aki', ['a', 'b', 'c'], '/pages/review-center/review-center');
  helpers.assert(session.reviewSessionId, 'SESSION_CREATED');
  helpers.equal(session.mode, 'due', 'SESSION_MODE');
  helpers.equal(session.itemIds.length, 3, 'SESSION_ITEMS');

  var s0 = review.getReviewSession();
  helpers.equal(s0.completedItemIds.length, 0, 'INITIAL_COMPLETED');

  var s1 = review.completeReviewSessionItem('a');
  helpers.equal(s1.completedItemIds.length, 1, 'AFTER_A');
  helpers.assert(!s1.completedAt, 'NOT_DONE_YET');

  var s2 = review.completeReviewSessionItem('b');
  helpers.equal(s2.completedItemIds.length, 2, 'AFTER_B');

  var s3 = review.completeReviewSessionItem('c');
  helpers.equal(s3.completedItemIds.length, 3, 'AFTER_C');
  helpers.assert(!!s3.completedAt, 'SESSION_COMPLETED');

  // Idempotency: completing same item again doesn't duplicate
  var s4 = review.completeReviewSessionItem('c');
  helpers.equal(s4.completedItemIds.length, 3, 'IDEMPOTENT');

  review.clearReviewSession();
  var s5 = review.getReviewSession();
  helpers.assert(!s5 || !s5.reviewSessionId, 'CLEARED');

  return { session: true };
});

// ═══════════════════════════════════════════════════════════════════════
// E4: TTL & Restart
// ═══════════════════════════════════════════════════════════════════════
helpers.run('r2d_e4_ttl_restart', function () {
  mockStorage = {};
  var now = 1700000000000;
  var TTL_MS = 2 * 60 * 60 * 1000;

  // Valid session
  var valid = review.createReviewSession('itpass', '01_aki', ['x1'], '/pages/review-center/review-center');
  helpers.assert(valid.reviewSessionId, 'VALID_CREATED');
  var validRead = review.getReviewSession();
  helpers.assert(validRead && !validRead._expired, 'VALID_NOT_EXPIRED');

  // Expired session
  var expired = {
    reviewSessionId: 'rs-expired',
    course: 'itpass', deckId: '01_aki', itemIds: ['y1'],
    createdAt: now - TTL_MS - 1000,
    expiresAt: now - 1000,
    backPath: '/pages/review-center/review-center',
    mode: 'due', completedAt: null, completedItemIds: []
  };
  wx.setStorageSync('study_tools_review_session_v1', expired);
  var expiredRead = review.getReviewSession();
  helpers.assert(expiredRead, 'EXPIRED_READABLE');
  helpers.equal(expiredRead._expired, true, 'EXPIRED_DETECTED');

  // Clear
  review.clearReviewSession();
  var afterClear = review.getReviewSession();
  helpers.assert(!afterClear || !afterClear.reviewSessionId, 'CLEARED');

  // Simulate restart: create session, write to storage, re-read
  mockStorage = {};
  var session2 = review.createReviewSession('itpass', '02_aki', ['r1', 'r2'], '/pages/review-center/review-center');
  var stored = wx.getStorageSync('study_tools_review_session_v1');
  helpers.assert(stored, 'SESSION_PERSISTED');
  var restored = review.getReviewSession();
  helpers.equal(restored.itemIds.length, 2, 'RESTORED_ITEMS');
  helpers.equal(restored.deckId, '02_aki', 'RESTORED_DECK');
  review.clearReviewSession();

  return { ttl: true, restart: true };
});

// ═══════════════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════════════
process.stdout.write('\n=== R2d Phase E Node.js Tests Complete ===\n');
