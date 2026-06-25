'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var scheduler = require('../utils/spaced-repetition/scheduler');
var summary = require('../utils/spaced-repetition/summary');

helpers.run('test_spaced_repetition_scheduler', function () {
  var now = 1700000000000;
  var built = identity.createTermIdentity('term-1');
  var item = schema.createMemoryItem(built, now);
  var activated = scheduler.activateItem(item, now);
  helpers.equal(activated.item.state, constants.STATES.LEARNING, 'NEW_TO_LEARNING');
  helpers.equal(activated.item.dueAt, now + constants.LEARNING_DELAY_MS, 'LEARNING_DELAY');

  var firstGood = scheduler.applyGrade(activated.item, constants.GRADES.GOOD, now + constants.LEARNING_DELAY_MS);
  helpers.equal(firstGood.item.state, constants.STATES.REVIEW, 'FIRST_GOOD_TO_REVIEW');
  helpers.equal(firstGood.item.intervalDays, 1, 'FIRST_GOOD_ONE_DAY');

  var hard = scheduler.applyGrade(firstGood.item, constants.GRADES.HARD, firstGood.item.dueAt);
  var good = scheduler.applyGrade(firstGood.item, constants.GRADES.GOOD, firstGood.item.dueAt);
  helpers.assert(hard.item.dueAt < good.item.dueAt, 'HARD_SHORTER_THAN_GOOD');

  var easyFromLearning = scheduler.applyGrade(activated.item, constants.GRADES.EASY, now + constants.LEARNING_DELAY_MS);
  helpers.assert(easyFromLearning.item.intervalDays <= 3, 'EASY_MUST_NOT_SKIP_FAR_FROM_NEW');
  helpers.assert(easyFromLearning.item.intervalDays < 30, 'EASY_MUST_NOT_JUMP_TO_THIRTY_DAYS');

  var again = scheduler.applyGrade(good.item, constants.GRADES.AGAIN, good.item.dueAt);
  helpers.equal(again.item.state, constants.STATES.RELEARNING, 'AGAIN_TO_RELEARNING');
  helpers.equal(again.item.dueAt, good.item.dueAt + constants.LEARNING_DELAY_MS, 'AGAIN_TEN_MINUTES');
  helpers.equal(again.item.lapses, 1, 'LAPSE_INCREMENT');

  var relearnGood = scheduler.applyGrade(again.item, constants.GRADES.GOOD, again.item.dueAt);
  helpers.equal(relearnGood.item.state, constants.STATES.REVIEW, 'RELEARNING_GOOD_TO_REVIEW');
  helpers.assert(relearnGood.item.intervalDays >= 1, 'RELEARNING_INTERVAL');

  var stable = schema.clone(firstGood.item);
  stable.stepIndex = 5;
  stable.intervalDays = 60;
  stable.dueAt = now;
  var stableGood = scheduler.applyGrade(stable, constants.GRADES.GOOD, now);
  helpers.equal(stableGood.item.intervalDays, 120, 'STABLE_REVIEW_GROWTH');

  var suspended = scheduler.suspendItem(stableGood.item, stableGood.item.dueAt);
  helpers.equal(scheduler.getDueItems([suspended.item], suspended.item.updatedAt + constants.DAY_MS).length, 0, 'SUSPENDED_EXCLUDED');

  var backwards = scheduler.applyGrade(firstGood.item, constants.GRADES.GOOD, now - constants.DAY_MS);
  helpers.assert(backwards.item.lastReviewAt >= firstGood.item.updatedAt, 'CLOCK_ROLLBACK_SAFE');
  var sameTimestamp = scheduler.applyGrade(backwards.item, constants.GRADES.GOOD, backwards.item.lastReviewAt);
  helpers.assert(sameTimestamp.item.dueAt > sameTimestamp.item.lastReviewAt, 'SAME_TIMESTAMP_SAFE');
  helpers.equal(scheduler.applyGrade(firstGood.item, 'NOPE', now).accepted, false, 'INVALID_GRADE_SAFE');

  var dueItem = schema.clone(firstGood.item);
  dueItem.dueAt = now - 1;
  var overdue = scheduler.getDueItems([dueItem], now)[0];
  helpers.assert(overdue.overdue, 'OVERDUE_ANNOTATED');
  helpers.equal(summary.isOverdue(dueItem, now, 540), true, 'PAST_DUE_TIMESTAMP_IS_OVERDUE');

  return { intervalSequence: constants.REVIEW_INTERVAL_DAYS, dailyNewLimit: constants.DAILY_NEW_LIMIT };
});
