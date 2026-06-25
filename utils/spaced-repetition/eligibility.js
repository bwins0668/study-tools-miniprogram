'use strict';

var constants = require('./constants');
var identity = require('./identity');
var schema = require('./schema');

function isAction(value) {
  return Object.keys(constants.ACTIONS).some(function (key) { return constants.ACTIONS[key] === value; });
}

function evaluateEventEligibility(event) {
  if (!event || typeof event !== 'object') return { eligible: false, createsItem: false, reason: 'INVALID_EVENT' };
  if (!isAction(event.action)) return { eligible: false, createsItem: false, reason: 'UNKNOWN_ACTION' };
  if (event.action === constants.ACTIONS.VIEWED) return { eligible: false, createsItem: false, reason: 'PASSIVE_VIEW' };
  if (!event.sourceType) return { eligible: false, createsItem: false, reason: 'SOURCE_TYPE_REQUIRED' };

  if (event.sourceType === 'term') {
    var termActions = [constants.ACTIONS.SELF_GRADED, constants.ACTIONS.FAVORITED, constants.ACTIONS.MANUALLY_ADDED];
    return {
      eligible: termActions.indexOf(event.action) !== -1 || event.action === constants.ACTIONS.UNFAVORITED || event.action === constants.ACTIONS.SUSPENDED,
      createsItem: termActions.indexOf(event.action) !== -1,
      reason: termActions.indexOf(event.action) !== -1 ? 'ACTIVE_TERM_EVENT' : 'EXISTING_ITEM_ONLY'
    };
  }

  if (event.sourceType === 'anki') {
    var ankiActions = [constants.ACTIONS.SELF_GRADED, constants.ACTIONS.MANUALLY_ADDED];
    return {
      eligible: ankiActions.indexOf(event.action) !== -1 || event.action === constants.ACTIONS.SUSPENDED,
      createsItem: ankiActions.indexOf(event.action) !== -1,
      reason: ankiActions.indexOf(event.action) !== -1 ? 'ACTIVE_ANKI_EVENT' : 'EXISTING_ITEM_ONLY'
    };
  }

  if (event.sourceType === 'exam') {
    var examActions = [
      constants.ACTIONS.ANSWERED_CORRECT,
      constants.ACTIONS.ANSWERED_WRONG,
      constants.ACTIONS.FAVORITED,
      constants.ACTIONS.MISTAKE_ADDED,
      constants.ACTIONS.MANUALLY_ADDED
    ];
    return {
      eligible: examActions.indexOf(event.action) !== -1 ||
        event.action === constants.ACTIONS.UNFAVORITED ||
        event.action === constants.ACTIONS.MISTAKE_REMOVED ||
        event.action === constants.ACTIONS.SUSPENDED,
      createsItem: examActions.indexOf(event.action) !== -1,
      reason: examActions.indexOf(event.action) !== -1 ? 'ACTIVE_EXAM_EVENT' : 'EXISTING_ITEM_ONLY'
    };
  }

  return { eligible: false, createsItem: false, reason: 'UNSUPPORTED_SOURCE_TYPE' };
}

function evaluateItemEligibility(item, now) {
  if (!item || typeof item !== 'object') return { eligible: false, status: 'INVALID_CARD' };
  if (!item.memoryItemId) return { eligible: false, status: 'MISSING_STABLE_ID' };

  var parsed = identity.parseMemoryItemId(item.memoryItemId);
  if (!parsed) return { eligible: false, status: 'MISSING_STABLE_ID' };
  if (!schema.isValidItem(item)) return { eligible: false, status: 'INVALID_CARD' };
  if (item.state === constants.STATES.SUSPENDED) return { eligible: false, status: 'SUSPENDED' };
  if (item.state === constants.STATES.NEW) return { eligible: true, status: 'LEARNABLE' };
  if (!schema.isFiniteTimestamp(item.dueAt) || item.dueAt > schema.safeTimestamp(now, 0)) {
    return { eligible: false, status: 'NOT_DUE' };
  }
  return { eligible: true, status: 'LEARNABLE' };
}

module.exports = {
  isAction: isAction,
  evaluateEventEligibility: evaluateEventEligibility,
  evaluateItemEligibility: evaluateItemEligibility
};
