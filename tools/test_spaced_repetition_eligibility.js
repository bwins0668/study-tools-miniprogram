'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var eligibility = require('../utils/spaced-repetition/eligibility');

helpers.run('test_spaced_repetition_eligibility', function () {
  var now = 1700000000000;

  helpers.equal(eligibility.evaluateEventEligibility({
    sourceType: 'term',
    action: constants.ACTIONS.VIEWED
  }).reason, 'PASSIVE_VIEW', 'PASSIVE_VIEW_IS_NOT_ELIGIBLE');
  helpers.equal(eligibility.evaluateEventEligibility({
    sourceType: 'term',
    action: constants.ACTIONS.SELF_GRADED
  }).createsItem, true, 'TERM_SELF_GRADE_CREATES_ITEM');
  helpers.equal(eligibility.evaluateEventEligibility({
    sourceType: 'anki',
    action: constants.ACTIONS.MANUALLY_ADDED
  }).createsItem, true, 'ANKI_MANUAL_ADD_CREATES_ITEM');
  helpers.equal(eligibility.evaluateEventEligibility({
    sourceType: 'exam',
    action: constants.ACTIONS.MISTAKE_ADDED
  }).createsItem, true, 'EXAM_MISTAKE_CREATES_ITEM');
  helpers.equal(eligibility.evaluateEventEligibility({
    sourceType: 'unknown',
    action: constants.ACTIONS.MANUALLY_ADDED
  }).eligible, false, 'UNKNOWN_SOURCE_REJECTED');

  var identityValue = identity.createTermIdentity('eligibility-term');
  var item = schema.createMemoryItem(identityValue, now);
  helpers.equal(eligibility.evaluateItemEligibility(item, now).status, 'LEARNABLE', 'NEW_ITEM_LEARNABLE');

  var future = schema.clone(item);
  future.state = constants.STATES.LEARNING;
  future.dueAt = now + 1;
  helpers.equal(eligibility.evaluateItemEligibility(future, now).status, 'NOT_DUE', 'FUTURE_ITEM_NOT_DUE');

  var due = schema.clone(future);
  due.dueAt = now;
  helpers.equal(eligibility.evaluateItemEligibility(due, now).status, 'LEARNABLE', 'DUE_ITEM_LEARNABLE');

  var suspended = schema.clone(due);
  suspended.state = constants.STATES.SUSPENDED;
  suspended.dueAt = null;
  helpers.equal(eligibility.evaluateItemEligibility(suspended, now).status, 'SUSPENDED', 'SUSPENDED_ITEM_EXCLUDED');

  helpers.equal(eligibility.evaluateItemEligibility({ sourceType: 'term' }, now).status, 'MISSING_STABLE_ID', 'MISSING_STABLE_ID_DISTINGUISHED');
  helpers.equal(eligibility.evaluateItemEligibility({
    memoryItemId: identityValue.memoryItemId,
    sourceType: 'exam',
    sourceRef: { course: 'itpass', deckId: 'a', questionId: 'b' },
    state: constants.STATES.NEW,
    createdAt: now
  }, now).status, 'INVALID_CARD', 'INVALID_CARD_DISTINGUISHED');

  return { statuses: ['LEARNABLE', 'NOT_DUE', 'SUSPENDED', 'INVALID_CARD', 'MISSING_STABLE_ID'] };
});
