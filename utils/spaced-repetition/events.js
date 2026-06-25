'use strict';

var constants = require('./constants');
var identity = require('./identity');
var schema = require('./schema');
var migration = require('./migration');
var scheduler = require('./scheduler');
var summary = require('./summary');
var eligibility = require('./eligibility');

function normalizeEvent(input, now) {
  if (!input || typeof input !== 'object') return { ok: false, reason: 'INVALID_EVENT' };
  var sourceType = input.sourceType;
  var sourceRef = input.sourceRef;
  var built = identity.createMemoryIdentity(sourceType, sourceRef);
  if (!built.ok) return { ok: false, reason: 'INVALID_IDENTITY', review: built.review };
  if (input.memoryItemId && input.memoryItemId !== built.memoryItemId) {
    return { ok: false, reason: 'MEMORY_ITEM_ID_MISMATCH', review: identity.createReview('MEMORY_ITEM_ID_MISMATCH', input) };
  }
  var occurredAt = schema.safeTimestamp(input.occurredAt, now);
  if (!occurredAt) return { ok: false, reason: 'OCCURRED_AT_REQUIRED' };
  var grade = input.grade || null;
  if (grade && !scheduler.isGrade(grade)) return { ok: false, reason: 'INVALID_GRADE' };
  var event = {
    memoryItemId: built.memoryItemId,
    sourceType: built.sourceType,
    action: input.action,
    grade: grade,
    occurredAt: occurredAt,
    sourceRef: built.sourceRef,
    metadata: identity.isSerializable(input.metadata || {}) ? JSON.parse(JSON.stringify(input.metadata || {})) : {}
  };
  if (!eligibility.isAction(event.action)) return { ok: false, reason: 'INVALID_ACTION' };
  event.eventId = input.eventId || (
    'sr:v1:event:' + encodeURIComponent(event.memoryItemId) + ':' +
    encodeURIComponent(event.action) + ':' + event.occurredAt + ':' +
    encodeURIComponent(event.grade || '') + ':' + encodeURIComponent(identity.stableStringify(event.metadata))
  );
  return { ok: true, event: event };
}

function cloneOrCreateState(state, now) {
  return state ? schema.clone(state) : schema.createEmptyState(now);
}

function eventWasProcessed(state, eventId) {
  return !!(state && state.processedEventIds && state.processedEventIds[eventId]);
}

function trimEventHistory(state, now) {
  var cutoff = schema.safeTimestamp(now, 0) - constants.REVIEW_LOG_MAX_AGE_DAYS * constants.DAY_MS;
  state.reviewLog = (state.reviewLog || []).filter(function (entry) {
    return entry && schema.isFiniteTimestamp(entry.occurredAt) && entry.occurredAt >= cutoff;
  }).sort(function (left, right) {
    if (left.occurredAt !== right.occurredAt) return left.occurredAt - right.occurredAt;
    return String(left.eventId).localeCompare(String(right.eventId));
  }).slice(-constants.REVIEW_LOG_MAX_ENTRIES);
  var allowed = {};
  state.reviewLog.forEach(function (entry) { allowed[entry.eventId] = entry.occurredAt; });
  state.processedEventIds = allowed;
}

function appendEvent(state, event) {
  state.reviewLog = state.reviewLog || [];
  state.processedEventIds = state.processedEventIds || {};
  state.reviewLog.push({
    eventId: event.eventId,
    memoryItemId: event.memoryItemId,
    sourceType: event.sourceType,
    action: event.action,
    grade: event.grade,
    occurredAt: event.occurredAt
  });
  state.processedEventIds[event.eventId] = event.occurredAt;
  trimEventHistory(state, event.occurredAt);
}

function applyEvent(state, currentSummary, input, options) {
  options = options || {};
  var now = schema.safeTimestamp(options.now, 0);
  var timezoneOffsetMinutes = options.timezoneOffsetMinutes;
  var normalized = normalizeEvent(input, now);
  if (!normalized.ok) return { accepted: false, reason: normalized.reason, state: cloneOrCreateState(state, now), summary: currentSummary || null };
  var event = normalized.event;
  var gate = eligibility.evaluateEventEligibility(event);
  if (!gate.eligible) return { accepted: false, reason: gate.reason, event: event, state: cloneOrCreateState(state, now), summary: currentSummary || null };

  var baseState = cloneOrCreateState(state, now);
  if (eventWasProcessed(baseState, event.eventId)) {
    return { accepted: true, duplicate: true, event: event, state: baseState, summary: currentSummary || summary.deriveSummary(baseState, now, timezoneOffsetMinutes) };
  }

  var previousItem = baseState.items && baseState.items[event.memoryItemId] ? schema.clone(baseState.items[event.memoryItemId]) : null;
  var nextState = baseState;
  var nextItem = previousItem;
  var created = false;

  if (gate.createsItem) {
    var ensured = migration.ensureItem(nextState, {
      ok: true,
      memoryItemId: event.memoryItemId,
      sourceType: event.sourceType,
      sourceRef: event.sourceRef
    }, event.occurredAt);
    nextState = ensured.state;
    nextItem = ensured.item;
    created = ensured.created;
  }

  if (!nextItem && (event.action === constants.ACTIONS.UNFAVORITED || event.action === constants.ACTIONS.MISTAKE_REMOVED || event.action === constants.ACTIONS.SUSPENDED)) {
    return { accepted: false, reason: 'ITEM_NOT_FOUND', event: event, state: nextState, summary: currentSummary || null };
  }

  if (event.action === constants.ACTIONS.ANSWERED_CORRECT || event.action === constants.ACTIONS.ANSWERED_WRONG || event.action === constants.ACTIONS.SELF_GRADED) {
    var grade = event.grade || (event.action === constants.ACTIONS.ANSWERED_CORRECT ? constants.GRADES.GOOD : constants.GRADES.AGAIN);
    var graded = scheduler.applyGrade(nextItem, grade, event.occurredAt);
    if (!graded.accepted) return { accepted: false, reason: graded.reason, event: event, state: nextState, summary: currentSummary || null };
    nextItem = graded.item;
    nextState.daily = summary.recordDailyActivity(nextState.daily, event.occurredAt, timezoneOffsetMinutes, { completed: true, created: created });
  } else if (event.action === constants.ACTIONS.MANUALLY_ADDED) {
    var activated = scheduler.activateItem(nextItem, event.occurredAt);
    if (!activated.accepted) return { accepted: false, reason: activated.reason, event: event, state: nextState, summary: currentSummary || null };
    nextItem = activated.item;
    nextState.daily = summary.recordDailyActivity(nextState.daily, event.occurredAt, timezoneOffsetMinutes, { created: created });
  } else {
    nextItem = schema.clone(nextItem);
    if (event.action === constants.ACTIONS.FAVORITED) {
      nextItem.isFavorite = true;
      nextItem.priority = Math.max(nextItem.priority || 0, 1);
    }
    if (event.action === constants.ACTIONS.UNFAVORITED) nextItem.isFavorite = false;
    if (event.action === constants.ACTIONS.MISTAKE_ADDED) {
      nextItem.isMistake = true;
      nextItem.priority = Math.max(nextItem.priority || 0, 2);
    }
    if (event.action === constants.ACTIONS.MISTAKE_REMOVED) nextItem.isMistake = false;
    if (event.action === constants.ACTIONS.SUSPENDED) {
      var suspended = scheduler.suspendItem(nextItem, event.occurredAt);
      if (!suspended.accepted) return { accepted: false, reason: suspended.reason, event: event, state: nextState, summary: currentSummary || null };
      nextItem = suspended.item;
    }
    nextItem.updatedAt = Math.max(nextItem.updatedAt || 0, event.occurredAt);
    if (created) nextState.daily = summary.recordDailyActivity(nextState.daily, event.occurredAt, timezoneOffsetMinutes, { created: true });
  }

  nextState.items[nextItem.memoryItemId] = nextItem;
  nextState.updatedAt = Math.max(nextState.updatedAt || 0, event.occurredAt);
  appendEvent(nextState, event);
  var nextSummary = summary.updateSummaryIncrementally(
    currentSummary || summary.deriveSummary(baseState, now, timezoneOffsetMinutes),
    previousItem,
    nextItem,
    nextState,
    now,
    timezoneOffsetMinutes
  );
  return {
    accepted: true,
    event: event,
    state: nextState,
    summary: nextSummary,
    previousItem: previousItem,
    item: nextItem,
    created: created
  };
}

module.exports = {
  normalizeEvent: normalizeEvent,
  trimEventHistory: trimEventHistory,
  applyEvent: applyEvent
};
