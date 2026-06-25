'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var constants = require('../utils/spaced-repetition/constants');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var summary = require('../utils/spaced-repetition/summary');

function dueItem(memoryIdentity, now, sourceType) {
  var item = schema.createMemoryItem(memoryIdentity, now - constants.DAY_MS);
  item.state = constants.STATES.REVIEW;
  item.dueAt = now;
  item.sourceType = sourceType || item.sourceType;
  return item;
}

helpers.run('test_spaced_repetition_summary', function () {
  var now = Date.UTC(2024, 0, 3, 12, 0, 0);
  var offset = 540;
  var state = schema.createEmptyState(now);

  var term = dueItem(identity.createTermIdentity('summary-term'), now);
  var itpass = dueItem(identity.createExamIdentity('itpass', 'deck-1', 'q-1'), now);
  var sgOverdue = dueItem(identity.createExamIdentity('sg', 'deck-2', 'q-2'), now);
  sgOverdue.dueAt = now - 1;
  var futureAnki = dueItem(identity.createAnkiIdentity('summary-anki'), now);
  futureAnki.dueAt = now + constants.DAY_MS;
  var suspended = dueItem(identity.createTermIdentity('summary-suspended'), now);
  suspended.state = constants.STATES.SUSPENDED;
  suspended.dueAt = null;

  state.items[term.memoryItemId] = term;
  state.items[itpass.memoryItemId] = itpass;
  state.items[sgOverdue.memoryItemId] = sgOverdue;
  state.items[futureAnki.memoryItemId] = futureAnki;
  state.items[suspended.memoryItemId] = suspended;
  state.daily = summary.recordDailyActivity(state.daily, now - 2 * constants.DAY_MS, offset, { completed: true });
  state.daily = summary.recordDailyActivity(state.daily, now - constants.DAY_MS, offset, { completed: true });
  state.daily = summary.recordDailyActivity(state.daily, now, offset, { completed: true, created: true });

  var derived = summary.deriveSummary(state, now, offset);
  helpers.equal(derived.dueCount, 3, 'DUE_COUNT_EXCLUDES_FUTURE_AND_SUSPENDED');
  helpers.equal(derived.overdueCount, 1, 'OVERDUE_COUNT');
  helpers.equal(derived.todayCompleted, 1, 'TODAY_COMPLETED');
  helpers.equal(derived.todayNewCount, 1, 'TODAY_NEW');
  helpers.equal(derived.streak, 3, 'THREE_DAY_STREAK');
  helpers.equal(derived.moduleDueCounts.term, 1, 'TERM_MODULE_DUE_COUNT');
  helpers.equal(derived.moduleDueCounts.itpass, 1, 'ITPASS_MODULE_DUE_COUNT');
  helpers.equal(derived.moduleDueCounts.sg, 1, 'SG_MODULE_DUE_COUNT');
  helpers.equal(Object.prototype.hasOwnProperty.call(derived, 'items'), false, 'SUMMARY_NEVER_EMBEDS_ITEMS');
  helpers.equal(Object.prototype.hasOwnProperty.call(derived, 'reviewLog'), false, 'SUMMARY_NEVER_EMBEDS_LOG');

  var advancedTerm = schema.clone(term);
  advancedTerm.dueAt = now + constants.DAY_MS;
  var incremental = summary.updateSummaryIncrementally(derived, term, advancedTerm, state, now, offset);
  helpers.equal(incremental.dueCount, 2, 'INCREMENTAL_DUE_UPDATE');
  helpers.equal(incremental.moduleDueCounts.term, 0, 'INCREMENTAL_MODULE_UPDATE');
  helpers.equal(summary.remainingDailyNewSlots(state.daily, now, offset), constants.DAILY_NEW_LIMIT - 1, 'DAILY_NEW_REMAINING');

  return { summary: derived, incrementalDueCount: incremental.dueCount };
});
