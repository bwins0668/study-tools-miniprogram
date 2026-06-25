'use strict';

var constants = require('./constants');
var identity = require('./identity');
var schema = require('./schema');
var summary = require('./summary');

var BLOCKED_KEYS = Object.freeze({
  __proto__: true,
  constructor: true,
  prototype: true
});

var STATE_KEYS = Object.freeze({
  schemaVersion: true,
  items: true,
  daily: true,
  reviewLog: true,
  processedEventIds: true,
  updatedAt: true
});

var ITEM_KEYS = Object.freeze({
  memoryItemId: true,
  sourceType: true,
  sourceRef: true,
  state: true,
  createdAt: true,
  lastReviewAt: true,
  dueAt: true,
  overdue: true,
  intervalDays: true,
  stepIndex: true,
  repetitions: true,
  lapses: true,
  correctCount: true,
  wrongCount: true,
  hardCount: true,
  easyCount: true,
  lastGrade: true,
  priority: true,
  isFavorite: true,
  isMistake: true,
  updatedAt: true
});

var DAILY_KEYS = Object.freeze({
  completed: true,
  newCount: true,
  updatedAt: true
});

var REVIEW_LOG_KEYS = Object.freeze({
  eventId: true,
  memoryItemId: true,
  sourceType: true,
  action: true,
  grade: true,
  occurredAt: true
});

function isSafeKey(key) {
  return typeof key === 'string' && !BLOCKED_KEYS[key];
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneSerializable(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return undefined;
  }
}

function copyUnknownFields(target, raw, knownKeys) {
  if (!isPlainObject(target) || !isPlainObject(raw)) return target;
  Object.keys(raw).forEach(function (key) {
    if (!isSafeKey(key) || knownKeys[key]) return;
    var cloned = cloneSerializable(raw[key]);
    if (cloned !== undefined) target[key] = cloned;
  });
  return target;
}

function sourceRefKnownKeys(sourceType) {
  if (sourceType === 'term') return { termId: true };
  if (sourceType === 'anki') return { cardId: true };
  if (sourceType === 'exam') return { course: true, deckId: true, questionId: true };
  return {};
}

function preserveSourceRef(memoryIdentity, rawSourceRef) {
  var sourceRef = schema.clone(memoryIdentity.sourceRef);
  return copyUnknownFields(sourceRef, rawSourceRef, sourceRefKnownKeys(memoryIdentity.sourceType));
}

function parseRaw(raw) {
  if (typeof raw !== 'string') return { ok: true, value: raw };
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (error) {
    return { ok: false, error: 'INVALID_JSON' };
  }
}

function sanitizeDaily(rawDaily) {
  var daily = {};
  if (!isPlainObject(rawDaily)) return daily;
  Object.keys(rawDaily).forEach(function (key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
    var item = rawDaily[key] || {};
    if (!isPlainObject(item)) return;
    var record = {
      completed: typeof item.completed === 'number' && item.completed > 0 ? Math.floor(item.completed) : 0,
      newCount: typeof item.newCount === 'number' && item.newCount > 0 ? Math.floor(item.newCount) : 0,
      updatedAt: schema.safeTimestamp(item.updatedAt, 0)
    };
    daily[key] = copyUnknownFields(record, item, DAILY_KEYS);
  });
  return daily;
}

function sanitizeProcessedEvents(raw, now) {
  var output = {};
  if (!isPlainObject(raw)) return output;
  Object.keys(raw).forEach(function (eventId) {
    if (!isSafeKey(eventId) || !eventId || eventId.length > 1024) return;
    var timestamp = schema.safeTimestamp(raw[eventId], now);
    if (timestamp) output[eventId] = timestamp;
  });
  return output;
}

function sanitizeReviewLog(raw, now) {
  if (!Array.isArray(raw)) return [];
  var cutoff = schema.safeTimestamp(now, 0) - constants.REVIEW_LOG_MAX_AGE_DAYS * constants.DAY_MS;
  var result = [];
  for (var i = 0; i < raw.length; i++) {
    var entry = raw[i];
    if (!isPlainObject(entry) || !entry.eventId || !entry.memoryItemId) continue;
    var parsed = identity.parseMemoryItemId(entry.memoryItemId);
    if (!parsed) continue;
    var occurredAt = schema.safeTimestamp(entry.occurredAt, 0);
    if (!occurredAt || occurredAt < cutoff) continue;
    var grade = entry.grade === null || entry.grade === undefined ? null : entry.grade;
    if (grade !== null && !Object.keys(constants.GRADES).some(function (key) { return constants.GRADES[key] === grade; })) continue;
    var sanitized = {
      eventId: String(entry.eventId),
      memoryItemId: entry.memoryItemId,
      sourceType: parsed.sourceType,
      action: typeof entry.action === 'string' ? entry.action : '',
      grade: grade,
      occurredAt: occurredAt
    };
    result.push(copyUnknownFields(sanitized, entry, REVIEW_LOG_KEYS));
  }
  result.sort(function (left, right) {
    if (left.occurredAt !== right.occurredAt) return left.occurredAt - right.occurredAt;
    return String(left.eventId).localeCompare(String(right.eventId));
  });
  return result.slice(-constants.REVIEW_LOG_MAX_ENTRIES);
}

function migrateLegacyRecord(record) {
  if (!record || typeof record !== 'object') return identity.createReview('LEGACY_RECORD_INVALID', record);
  if (record.memoryItemId && identity.parseMemoryItemId(record.memoryItemId)) {
    return { status: 'MIGRATABLE', memoryItemId: record.memoryItemId };
  }
  var sourceType = record.sourceType;
  var sourceRef = record.sourceRef;
  if (!sourceRef && sourceType === 'term') sourceRef = { termId: record.termId || record.id };
  if (!sourceRef && sourceType === 'anki') sourceRef = { cardId: record.cardId || record.id };
  if (!sourceRef && sourceType === 'exam') {
    sourceRef = {
      course: record.course || record.exam,
      deckId: record.deckId || record.yearId,
      questionId: record.questionId || record.id
    };
  }
  var result = identity.createMemoryIdentity(sourceType, sourceRef);
  return result.ok ? { status: 'MIGRATABLE', memoryItemId: result.memoryItemId } : result.review;
}

function sanitizeItem(raw, now) {
  if (!isPlainObject(raw)) return null;
  var parsed = identity.parseMemoryItemId(raw.memoryItemId);
  if (!parsed) return null;
  var rebuilt = identity.createMemoryIdentity(raw.sourceType, raw.sourceRef);
  if (!rebuilt.ok || rebuilt.memoryItemId !== raw.memoryItemId) return null;
  if (Object.prototype.hasOwnProperty.call(raw, 'dueAt') && raw.dueAt !== null && raw.dueAt !== undefined && !schema.isFiniteTimestamp(raw.dueAt)) return null;

  var createdAt = schema.safeTimestamp(raw.createdAt, now);
  var item = schema.createMemoryItem(rebuilt, createdAt, {
    priority: typeof raw.priority === 'number' ? raw.priority : 0,
    isFavorite: !!raw.isFavorite,
    isMistake: !!raw.isMistake
  });
  item.sourceRef = preserveSourceRef(rebuilt, raw.sourceRef);
  item.state = Object.keys(constants.STATES).some(function (key) { return constants.STATES[key] === raw.state; }) ? raw.state : constants.STATES.NEW;
  item.lastReviewAt = schema.isFiniteTimestamp(raw.lastReviewAt) ? raw.lastReviewAt : null;
  item.dueAt = schema.isFiniteTimestamp(raw.dueAt) ? raw.dueAt : null;
  item.overdue = !!raw.overdue;
  item.intervalDays = typeof raw.intervalDays === 'number' && raw.intervalDays >= 0 ? raw.intervalDays : 0;
  item.stepIndex = typeof raw.stepIndex === 'number' && isFinite(raw.stepIndex) ? Math.floor(raw.stepIndex) : -1;
  item.repetitions = typeof raw.repetitions === 'number' && raw.repetitions >= 0 ? Math.floor(raw.repetitions) : 0;
  item.lapses = typeof raw.lapses === 'number' && raw.lapses >= 0 ? Math.floor(raw.lapses) : 0;
  item.correctCount = typeof raw.correctCount === 'number' && raw.correctCount >= 0 ? Math.floor(raw.correctCount) : 0;
  item.wrongCount = typeof raw.wrongCount === 'number' && raw.wrongCount >= 0 ? Math.floor(raw.wrongCount) : 0;
  item.hardCount = typeof raw.hardCount === 'number' && raw.hardCount >= 0 ? Math.floor(raw.hardCount) : 0;
  item.easyCount = typeof raw.easyCount === 'number' && raw.easyCount >= 0 ? Math.floor(raw.easyCount) : 0;
  item.lastGrade = Object.keys(constants.GRADES).some(function (key) { return constants.GRADES[key] === raw.lastGrade; }) ? raw.lastGrade : null;
  item.updatedAt = schema.safeTimestamp(raw.updatedAt, createdAt);
  if (item.state === constants.STATES.SUSPENDED) item.dueAt = null;
  return copyUnknownFields(item, raw, ITEM_KEYS);
}

function migrateState(raw, now, timezoneOffsetMinutes) {
  var timestamp = schema.safeTimestamp(now, 0);
  var parsed = parseRaw(raw);
  if (!parsed.ok) {
    var emptyForInvalidJson = schema.createEmptyState(timestamp);
    return {
      state: emptyForInvalidJson,
      summary: summary.deriveSummary(emptyForInvalidJson, timestamp, timezoneOffsetMinutes),
      review: [identity.createReview(parsed.error, null)],
      quarantine: true
    };
  }
  var source = parsed.value;
  if (source === undefined || source === null) {
    var empty = schema.createEmptyState(timestamp);
    return { state: empty, summary: summary.deriveSummary(empty, timestamp, timezoneOffsetMinutes), review: [], quarantine: false };
  }
  if (!isPlainObject(source)) {
    var invalidEmpty = schema.createEmptyState(timestamp);
    return {
      state: invalidEmpty,
      summary: summary.deriveSummary(invalidEmpty, timestamp, timezoneOffsetMinutes),
      review: [identity.createReview('INVALID_STATE_SHAPE', source)],
      quarantine: true
    };
  }

  var state = copyUnknownFields(schema.createEmptyState(timestamp), source, STATE_KEYS);
  var review = [];
  var rawItems = source.items || {};
  var itemList = Array.isArray(rawItems) ? rawItems : Object.keys(rawItems).map(function (key) { return rawItems[key]; });
  for (var i = 0; i < itemList.length; i++) {
    var item = sanitizeItem(itemList[i], timestamp);
    if (!item) {
      review.push(identity.createReview('INVALID_MEMORY_ITEM', itemList[i]));
      continue;
    }
    if (state.items[item.memoryItemId]) {
      review.push(identity.createReview('DUPLICATE_MEMORY_ITEM_ID', itemList[i]));
      continue;
    }
    state.items[item.memoryItemId] = item;
  }
  state.daily = sanitizeDaily(source.daily);
  state.reviewLog = sanitizeReviewLog(source.reviewLog, timestamp);
  state.processedEventIds = sanitizeProcessedEvents(source.processedEventIds, timestamp);
  state.reviewLog.forEach(function (entry) { state.processedEventIds[entry.eventId] = entry.occurredAt; });
  state.updatedAt = schema.safeTimestamp(source.updatedAt, timestamp);
  state.schemaVersion = constants.SCHEMA_VERSION;

  return {
    state: state,
    summary: summary.deriveSummary(state, timestamp, timezoneOffsetMinutes),
    review: review,
    quarantine: source.schemaVersion !== undefined && source.schemaVersion !== constants.SCHEMA_VERSION
  };
}

function ensureItem(state, memoryIdentity, now, options) {
  var nextState = schema.clone(state || schema.createEmptyState(now));
  if (!nextState.items || typeof nextState.items !== 'object' || Array.isArray(nextState.items)) nextState.items = {};
  if (!memoryIdentity || !memoryIdentity.ok) return { state: nextState, item: null, created: false };
  var existing = nextState.items[memoryIdentity.memoryItemId];
  if (existing) return { state: nextState, item: existing, created: false };
  var item = schema.createMemoryItem(memoryIdentity, now, options);
  nextState.items[item.memoryItemId] = item;
  nextState.updatedAt = schema.safeTimestamp(now, nextState.updatedAt);
  return { state: nextState, item: item, created: true };
}

module.exports = {
  parseRaw: parseRaw,
  isPlainObject: isPlainObject,
  copyUnknownFields: copyUnknownFields,
  sanitizeItem: sanitizeItem,
  migrateLegacyRecord: migrateLegacyRecord,
  migrateState: migrateState,
  ensureItem: ensureItem
};
