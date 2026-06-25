'use strict';

var constants = require('./constants');
var identity = require('./identity');
var schema = require('./schema');
var migration = require('./migration');
var summary = require('./summary');

var BLOCKED_KEYS = Object.freeze({
  __proto__: true,
  constructor: true,
  prototype: true
});

var ITEM_KNOWN_KEYS = Object.freeze({
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

function assertAdapter(adapter) {
  if (!adapter || typeof adapter.get !== 'function' || typeof adapter.set !== 'function') {
    throw new Error('SPACED_REPETITION_STORAGE_ADAPTER_REQUIRED');
  }
  return adapter;
}

function isSafeKey(key) {
  return typeof key === 'string' && !BLOCKED_KEYS[key];
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return migration.isPlainObject(value);
}

function mergeValues(left, right) {
  if (right === undefined) return cloneValue(left);
  if (left === undefined) return cloneValue(right);
  if (!isPlainObject(left) || !isPlainObject(right)) return cloneValue(right);
  var result = {};
  var keys = {};
  Object.keys(left).forEach(function (key) { if (isSafeKey(key)) keys[key] = true; });
  Object.keys(right).forEach(function (key) { if (isSafeKey(key)) keys[key] = true; });
  Object.keys(keys).sort().forEach(function (key) {
    var hasLeft = Object.prototype.hasOwnProperty.call(left, key);
    var hasRight = Object.prototype.hasOwnProperty.call(right, key);
    if (hasLeft && hasRight) result[key] = mergeValues(left[key], right[key]);
    else if (hasRight) result[key] = cloneValue(right[key]);
    else result[key] = cloneValue(left[key]);
  });
  return result;
}

function choosePreferred(left, right, timestampKey) {
  if (!left) return right;
  if (!right) return left;
  var leftTime = schema.safeTimestamp(left[timestampKey], 0);
  var rightTime = schema.safeTimestamp(right[timestampKey], 0);
  if (leftTime !== rightTime) return leftTime > rightTime ? left : right;
  return identity.stableStringify(left) >= identity.stableStringify(right) ? left : right;
}

function sourceRefKeys(sourceType) {
  if (sourceType === 'term') return ['termId'];
  if (sourceType === 'anki') return ['cardId'];
  if (sourceType === 'exam') return ['course', 'deckId', 'questionId'];
  return [];
}

function mergeItem(left, right, now) {
  if (!left) return migration.sanitizeItem(right, now);
  if (!right) return migration.sanitizeItem(left, now);
  var preferred = choosePreferred(left, right, 'updatedAt');
  var secondary = preferred === left ? right : left;
  var merged = mergeValues(secondary, preferred);
  Object.keys(ITEM_KNOWN_KEYS).forEach(function (key) {
    if (key !== 'sourceRef') merged[key] = cloneValue(preferred[key]);
  });
  var mergedSourceRef = mergeValues(secondary.sourceRef || {}, preferred.sourceRef || {});
  sourceRefKeys(preferred.sourceType).forEach(function (key) {
    mergedSourceRef[key] = cloneValue(preferred.sourceRef[key]);
  });
  merged.sourceRef = mergedSourceRef;
  return migration.sanitizeItem(merged, now);
}

function mergeDailyRecord(left, right) {
  if (!left) return cloneValue(right);
  if (!right) return cloneValue(left);
  var preferred = choosePreferred(left, right, 'updatedAt');
  var secondary = preferred === left ? right : left;
  var merged = mergeValues(secondary, preferred);
  merged.completed = Math.max(typeof left.completed === 'number' ? left.completed : 0, typeof right.completed === 'number' ? right.completed : 0);
  merged.newCount = Math.max(typeof left.newCount === 'number' ? left.newCount : 0, typeof right.newCount === 'number' ? right.newCount : 0);
  merged.updatedAt = Math.max(schema.safeTimestamp(left.updatedAt, 0), schema.safeTimestamp(right.updatedAt, 0));
  return merged;
}

function mergeReviewLogEntry(left, right) {
  if (!left) return cloneValue(right);
  if (!right) return cloneValue(left);
  var preferred = choosePreferred(left, right, 'occurredAt');
  var secondary = preferred === left ? right : left;
  return mergeValues(secondary, preferred);
}

function mergeReviewLogs(left, right) {
  var byEventId = {};
  (Array.isArray(left) ? left : []).concat(Array.isArray(right) ? right : []).forEach(function (entry) {
    if (!entry || !entry.eventId || !isSafeKey(String(entry.eventId))) return;
    var key = String(entry.eventId);
    byEventId[key] = mergeReviewLogEntry(byEventId[key], entry);
  });
  return Object.keys(byEventId).map(function (key) { return byEventId[key]; });
}

function mergeProcessedEventIds(left, right) {
  var result = {};
  [left, right].forEach(function (source) {
    if (!isPlainObject(source)) return;
    Object.keys(source).forEach(function (eventId) {
      if (!isSafeKey(eventId)) return;
      result[eventId] = Math.max(result[eventId] || 0, schema.safeTimestamp(source[eventId], 0));
    });
  });
  return result;
}

function mergeSpacedRepetitionStates(currentRaw, importedRaw, now, timezoneOffsetMinutes) {
  var current = migration.migrateState(currentRaw, now, timezoneOffsetMinutes).state;
  var imported = migration.migrateState(importedRaw, now, timezoneOffsetMinutes).state;
  var preferred = choosePreferred(current, imported, 'updatedAt');
  var secondary = preferred === current ? imported : current;
  var merged = mergeValues(secondary, preferred);
  merged.schemaVersion = constants.SCHEMA_VERSION;
  merged.updatedAt = Math.max(schema.safeTimestamp(current.updatedAt, 0), schema.safeTimestamp(imported.updatedAt, 0));

  merged.items = {};
  var itemIds = {};
  Object.keys(current.items || {}).forEach(function (key) { itemIds[key] = true; });
  Object.keys(imported.items || {}).forEach(function (key) { itemIds[key] = true; });
  Object.keys(itemIds).forEach(function (memoryItemId) {
    var item = mergeItem(current.items[memoryItemId], imported.items[memoryItemId], now);
    if (item) merged.items[memoryItemId] = item;
  });

  merged.daily = {};
  var dailyKeys = {};
  Object.keys(current.daily || {}).forEach(function (key) { dailyKeys[key] = true; });
  Object.keys(imported.daily || {}).forEach(function (key) { dailyKeys[key] = true; });
  Object.keys(dailyKeys).forEach(function (dayKey) {
    merged.daily[dayKey] = mergeDailyRecord(current.daily[dayKey], imported.daily[dayKey]);
  });

  merged.reviewLog = mergeReviewLogs(current.reviewLog, imported.reviewLog);
  merged.processedEventIds = mergeProcessedEventIds(current.processedEventIds, imported.processedEventIds);
  merged.reviewLog.forEach(function (entry) {
    merged.processedEventIds[entry.eventId] = Math.max(merged.processedEventIds[entry.eventId] || 0, schema.safeTimestamp(entry.occurredAt, 0));
  });

  return migration.migrateState(merged, now, timezoneOffsetMinutes).state;
}

function createMemoryStorageAdapter(seed) {
  var data = schema.clone(seed || {});
  return {
    get: function (key) { return data[key]; },
    set: function (key, value) { data[key] = schema.clone(value); },
    remove: function (key) { delete data[key]; },
    snapshot: function () { return schema.clone(data); }
  };
}

function createWxStorageAdapter(wxApi) {
  if (!wxApi || typeof wxApi.getStorageSync !== 'function' || typeof wxApi.setStorageSync !== 'function') {
    throw new Error('WX_STORAGE_API_REQUIRED');
  }
  return {
    get: function (key) {
      try { return wxApi.getStorageSync(key); } catch (error) { return null; }
    },
    set: function (key, value) {
      try { wxApi.setStorageSync(key, value); return true; } catch (error) { return false; }
    },
    remove: function (key) {
      try {
        if (typeof wxApi.removeStorageSync === 'function') wxApi.removeStorageSync(key);
        return true;
      } catch (error) { return false; }
    }
  };
}

function loadSpacedRepetitionState(adapter, now, timezoneOffsetMinutes) {
  assertAdapter(adapter);
  var raw = adapter.get(constants.STORAGE_KEY);
  var migrated = migration.migrateState(raw, now, timezoneOffsetMinutes);
  if (migrated.quarantine) {
    adapter.set(constants.QUARANTINE_KEY, {
      capturedAt: schema.safeTimestamp(now, 0),
      reason: migrated.review.map(function (entry) { return entry && entry.reason ? entry.reason : 'MIGRATION_REVIEW'; }),
      raw: typeof raw === 'string' ? raw.slice(0, 20000) : raw
    });
  }
  return migrated;
}

function saveSpacedRepetitionState(adapter, state, now, timezoneOffsetMinutes) {
  assertAdapter(adapter);
  var migrated = migration.migrateState(state, now, timezoneOffsetMinutes);
  adapter.set(constants.STORAGE_KEY, migrated.state);
  adapter.set(constants.SUMMARY_KEY, migrated.summary);
  return migrated;
}

function loadSummary(adapter, now, timezoneOffsetMinutes) {
  assertAdapter(adapter);
  var stored = adapter.get(constants.SUMMARY_KEY);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return null;
  var required = ['dueCount', 'overdueCount', 'todayCompleted', 'todayNewCount', 'streak', 'moduleDueCounts'];
  for (var i = 0; i < required.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(stored, required[i])) return null;
  }
  return summary.normalizeSummary(stored, now);
}

function exportSpacedRepetitionState(state, now, timezoneOffsetMinutes) {
  var migrated = migration.migrateState(state, now, timezoneOffsetMinutes);
  return { spacedRepetition: migrated.state };
}

function validateImportedSpacedRepetitionState(payload, now, timezoneOffsetMinutes) {
  var candidate = payload && Object.prototype.hasOwnProperty.call(payload, 'spacedRepetition') ? payload.spacedRepetition : payload;
  var hasSupportedSchema = !!candidate && typeof candidate === 'object' && !Array.isArray(candidate) && candidate.schemaVersion === constants.SCHEMA_VERSION;
  var migrated = migration.migrateState(candidate, now, timezoneOffsetMinutes);
  return {
    valid: hasSupportedSchema && !migrated.quarantine,
    state: migrated.state,
    summary: migrated.summary,
    skippedItems: migrated.review.length,
    review: migrated.review
  };
}

function restoreSpacedRepetitionState(adapter, payload, now, timezoneOffsetMinutes) {
  assertAdapter(adapter);
  var validation = validateImportedSpacedRepetitionState(payload, now, timezoneOffsetMinutes);
  if (!validation.valid) {
    validation.restored = false;
    return validation;
  }
  var mergedState = mergeSpacedRepetitionStates(adapter.get(constants.STORAGE_KEY), validation.state, now, timezoneOffsetMinutes);
  var mergedSummary = summary.deriveSummary(mergedState, now, timezoneOffsetMinutes);
  adapter.set(constants.STORAGE_KEY, mergedState);
  adapter.set(constants.SUMMARY_KEY, mergedSummary);
  validation.state = mergedState;
  validation.summary = mergedSummary;
  validation.restored = true;
  return validation;
}

module.exports = {
  createMemoryStorageAdapter: createMemoryStorageAdapter,
  createWxStorageAdapter: createWxStorageAdapter,
  loadSpacedRepetitionState: loadSpacedRepetitionState,
  saveSpacedRepetitionState: saveSpacedRepetitionState,
  loadSummary: loadSummary,
  exportSpacedRepetitionState: exportSpacedRepetitionState,
  validateImportedSpacedRepetitionState: validateImportedSpacedRepetitionState,
  mergeSpacedRepetitionStates: mergeSpacedRepetitionStates,
  restoreSpacedRepetitionState: restoreSpacedRepetitionState
};
