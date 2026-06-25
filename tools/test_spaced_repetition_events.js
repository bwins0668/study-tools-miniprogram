'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var events = require('../utils/spaced-repetition/events');
var scheduler = require('../utils/spaced-repetition/scheduler');
var schema = require('../utils/spaced-repetition/schema');

helpers.run('test_spaced_repetition_events', function () {
  var now = 1700000000000;
  var options = { now: now, timezoneOffsetMinutes: 540 };

  var passive = events.applyEvent(null, null, {
    sourceType: 'term',
    sourceRef: { termId: 'term-passive' },
    action: constants.ACTIONS.VIEWED,
    occurredAt: now
  }, options);
  helpers.equal(passive.accepted, false, 'PASSIVE_VIEW_DOES_NOT_CREATE_ITEM');
  helpers.equal(passive.reason, 'PASSIVE_VIEW', 'PASSIVE_VIEW_REASON');

  var favoriteInput = {
    eventId: 'event-favorite-term',
    sourceType: 'term',
    sourceRef: { termId: 'term-favorite' },
    action: constants.ACTIONS.FAVORITED,
    occurredAt: now,
    metadata: { source: 'term-detail' }
  };
  var favorite = events.applyEvent(null, null, favoriteInput, options);
  helpers.equal(favorite.accepted, true, 'ACTIVE_TERM_EVENT_ACCEPTED');
  helpers.equal(favorite.created, true, 'ACTIVE_TERM_EVENT_CREATES_ITEM');
  helpers.equal(favorite.item.isFavorite, true, 'FAVORITE_FLAG_SET');
  helpers.equal(favorite.item.priority, 1, 'FAVORITE_PRIORITY_SET');
  helpers.equal(favorite.state.reviewLog.length, 1, 'EVENT_LOGGED');

  var duplicate = events.applyEvent(favorite.state, favorite.summary, favoriteInput, options);
  helpers.equal(duplicate.accepted, true, 'DUPLICATE_EVENT_SAFE');
  helpers.equal(duplicate.duplicate, true, 'DUPLICATE_EVENT_DETECTED');
  helpers.equal(duplicate.state.reviewLog.length, 1, 'DUPLICATE_EVENT_NOT_RECORDED_TWICE');

  var wrong = events.applyEvent(duplicate.state, duplicate.summary, {
    eventId: 'event-exam-wrong',
    sourceType: 'exam',
    sourceRef: { course: 'itpass', deckId: 'itpass-2025', questionId: 'q-1' },
    action: constants.ACTIONS.ANSWERED_WRONG,
    occurredAt: now + 1
  }, { now: now + 1, timezoneOffsetMinutes: 540 });
  helpers.equal(wrong.accepted, true, 'EXAM_WRONG_ACCEPTED');
  helpers.equal(wrong.created, true, 'EXAM_WRONG_CREATES_ITEM');
  helpers.equal(wrong.item.state, constants.STATES.RELEARNING, 'WRONG_ENTERS_RELEARNING');
  helpers.equal(wrong.item.lastGrade, constants.GRADES.AGAIN, 'WRONG_DEFAULTS_TO_AGAIN');
  helpers.equal(wrong.summary.todayCompleted, 1, 'REAL_GRADE_COUNTS_AS_COMPLETED');

  var correct = events.applyEvent(wrong.state, wrong.summary, {
    eventId: 'event-exam-correct',
    sourceType: 'exam',
    sourceRef: { course: 'itpass', deckId: 'itpass-2025', questionId: 'q-1' },
    action: constants.ACTIONS.ANSWERED_CORRECT,
    occurredAt: wrong.item.dueAt
  }, { now: wrong.item.dueAt, timezoneOffsetMinutes: 540 });
  helpers.equal(correct.accepted, true, 'EXAM_CORRECT_ACCEPTED');
  helpers.equal(correct.item.state, constants.STATES.REVIEW, 'CORRECT_PROMOTES_TO_REVIEW');
  helpers.equal(correct.item.lastGrade, constants.GRADES.GOOD, 'CORRECT_DEFAULTS_TO_GOOD');

  var ankiAdded = events.applyEvent(correct.state, correct.summary, {
    eventId: 'event-anki-add',
    sourceType: 'anki',
    sourceRef: { cardId: 'anki-1' },
    action: constants.ACTIONS.MANUALLY_ADDED,
    occurredAt: now + 2
  }, { now: now + 2, timezoneOffsetMinutes: 540 });
  helpers.equal(ankiAdded.accepted, true, 'ANKI_MANUAL_ADD_ACCEPTED');
  helpers.equal(ankiAdded.item.state, constants.STATES.LEARNING, 'MANUAL_ADD_ACTIVATES_LEARNING');

  var suspended = events.applyEvent(ankiAdded.state, ankiAdded.summary, {
    eventId: 'event-anki-suspend',
    sourceType: 'anki',
    sourceRef: { cardId: 'anki-1' },
    action: constants.ACTIONS.SUSPENDED,
    occurredAt: now + 3
  }, { now: now + 3, timezoneOffsetMinutes: 540 });
  helpers.equal(suspended.accepted, true, 'SUSPEND_ACCEPTED');
  helpers.equal(suspended.item.state, constants.STATES.SUSPENDED, 'SUSPEND_STATE_SET');
  helpers.equal(scheduler.getDueItems(schema.getItemsArray(suspended.state), now + constants.DAY_MS).filter(function (item) {
    return item.memoryItemId === suspended.item.memoryItemId;
  }).length, 0, 'SUSPENDED_NOT_IN_DUE_QUEUE');

  var missingIdentity = events.applyEvent(suspended.state, suspended.summary, {
    sourceType: 'exam',
    sourceRef: { course: 'itpass', questionId: 'missing-deck' },
    action: constants.ACTIONS.ANSWERED_CORRECT,
    occurredAt: now + 4
  }, { now: now + 4, timezoneOffsetMinutes: 540 });
  helpers.equal(missingIdentity.accepted, false, 'MISSING_STABLE_ID_REJECTED');
  helpers.equal(missingIdentity.reason, 'INVALID_IDENTITY', 'MISSING_STABLE_ID_REASON');

  return {
    itemCount: Object.keys(suspended.state.items).length,
    reviewLogCount: suspended.state.reviewLog.length,
    todayCompleted: suspended.summary.todayCompleted
  };
});
