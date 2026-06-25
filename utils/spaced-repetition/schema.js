'use strict';

var constants = require('./constants');
var identity = require('./identity');

function isFiniteTimestamp(value) {
  return typeof value === 'number' && isFinite(value) && value >= 0;
}

function safeTimestamp(value, fallback) {
  return isFiniteTimestamp(value) ? Math.floor(value) : Math.floor(fallback || 0);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEmptyState(now) {
  return {
    schemaVersion: constants.SCHEMA_VERSION,
    items: {},
    daily: {},
    reviewLog: [],
    processedEventIds: {},
    updatedAt: safeTimestamp(now, 0)
  };
}

function createMemoryItem(memoryIdentity, now, options) {
  if (!memoryIdentity || !memoryIdentity.ok) return null;
  options = options || {};
  var timestamp = safeTimestamp(now, 0);
  return {
    memoryItemId: memoryIdentity.memoryItemId,
    sourceType: memoryIdentity.sourceType,
    sourceRef: clone(memoryIdentity.sourceRef),
    state: constants.STATES.NEW,
    createdAt: timestamp,
    lastReviewAt: null,
    dueAt: null,
    overdue: false,
    intervalDays: 0,
    stepIndex: -1,
    repetitions: 0,
    lapses: 0,
    correctCount: 0,
    wrongCount: 0,
    hardCount: 0,
    easyCount: 0,
    lastGrade: null,
    priority: typeof options.priority === 'number' ? options.priority : 0,
    isFavorite: !!options.isFavorite,
    isMistake: !!options.isMistake,
    updatedAt: timestamp
  };
}

function isValidState(value) {
  return Object.keys(constants.STATES).some(function (key) { return constants.STATES[key] === value; });
}

function isValidItem(item) {
  if (!item || typeof item !== 'object') return false;
  var parsed = identity.parseMemoryItemId(item.memoryItemId);
  if (!parsed || parsed.sourceType !== item.sourceType) return false;
  var rebuilt = identity.createMemoryIdentity(item.sourceType, item.sourceRef);
  if (!rebuilt.ok || rebuilt.memoryItemId !== item.memoryItemId) return false;
  return isValidState(item.state) && isFiniteTimestamp(item.createdAt);
}

function sanitizeItem(raw, now) {
  if (!raw || typeof raw !== 'object') return null;
  var parsed = identity.parseMemoryItemId(raw.memoryItemId);
  if (!parsed) return null;
  var rebuilt = identity.createMemoryIdentity(raw.sourceType, raw.sourceRef);
  if (!rebuilt.ok || rebuilt.memoryItemId !== raw.memoryItemId) return null;
  if (Object.prototype.hasOwnProperty.call(raw, 'dueAt') && raw.dueAt !== null && raw.dueAt !== undefined && !isFiniteTimestamp(raw.dueAt)) return null;
  var createdAt = safeTimestamp(raw.createdAt, now);
  var item = createMemoryItem(rebuilt, createdAt, {
    priority: typeof raw.priority === 'number' ? raw.priority : 0,
    isFavorite: !!raw.isFavorite,
    isMistake: !!raw.isMistake
  });
  item.state = isValidState(raw.state) ? raw.state : constants.STATES.NEW;
  item.lastReviewAt = isFiniteTimestamp(raw.lastReviewAt) ? raw.lastReviewAt : null;
  item.dueAt = isFiniteTimestamp(raw.dueAt) ? raw.dueAt : null;
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
  item.updatedAt = safeTimestamp(raw.updatedAt, createdAt);
  if (item.state === constants.STATES.SUSPENDED) item.dueAt = null;
  return item;
}

function getItemsArray(state) {
  if (!state || !state.items || typeof state.items !== 'object') return [];
  return Array.isArray(state.items) ? state.items : Object.keys(state.items).map(function (key) { return state.items[key]; });
}

module.exports = {
  isFiniteTimestamp: isFiniteTimestamp,
  safeTimestamp: safeTimestamp,
  clone: clone,
  createEmptyState: createEmptyState,
  createMemoryItem: createMemoryItem,
  isValidItem: isValidItem,
  sanitizeItem: sanitizeItem,
  getItemsArray: getItemsArray
};
