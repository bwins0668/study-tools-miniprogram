'use strict';

var constants = require('./constants');
var schema = require('./schema');

function isGrade(value) {
  return Object.keys(constants.GRADES).some(function (key) { return constants.GRADES[key] === value; });
}

function safeNow(item, now) {
  var candidate = schema.safeTimestamp(now, item && item.updatedAt);
  var floor = 0;
  if (item && schema.isFiniteTimestamp(item.lastReviewAt)) floor = Math.max(floor, item.lastReviewAt);
  if (item && schema.isFiniteTimestamp(item.updatedAt)) floor = Math.max(floor, item.updatedAt);
  return Math.max(candidate, floor);
}

function cloneItem(item) {
  return schema.clone(item);
}

function isDue(item, now) {
  if (!item || item.state === constants.STATES.SUSPENDED) return false;
  return schema.isFiniteTimestamp(item.dueAt) && item.dueAt <= schema.safeTimestamp(now, 0);
}

function overdueMs(item, now) {
  if (!isDue(item, now)) return 0;
  return Math.max(0, schema.safeTimestamp(now, 0) - item.dueAt);
}

function annotateDue(item, now) {
  var copy = cloneItem(item);
  copy.overdue = overdueMs(copy, now) > 0;
  return copy;
}

function activateItem(item, now) {
  if (!schema.isValidItem(item)) return { accepted: false, reason: 'INVALID_ITEM', item: null };
  var next = cloneItem(item);
  var timestamp = safeNow(next, now);
  if (next.state === constants.STATES.SUSPENDED) return { accepted: false, reason: 'SUSPENDED', item: next };
  if (next.state !== constants.STATES.NEW) return { accepted: true, reason: 'ALREADY_ACTIVE', item: annotateDue(next, timestamp) };

  next.state = constants.STATES.LEARNING;
  next.dueAt = timestamp + constants.LEARNING_DELAY_MS;
  next.overdue = false;
  next.intervalDays = constants.LEARNING_DELAY_MS / constants.DAY_MS;
  next.stepIndex = -1;
  next.updatedAt = timestamp;
  return { accepted: true, reason: 'ACTIVATED', item: next };
}

function intervalAt(stepIndex) {
  var intervals = constants.REVIEW_INTERVAL_DAYS;
  var safeIndex = Math.max(0, Math.min(intervals.length - 1, stepIndex));
  return intervals[safeIndex];
}

function applyGrade(item, grade, now) {
  if (!schema.isValidItem(item)) return { accepted: false, reason: 'INVALID_ITEM', item: null };
  if (!isGrade(grade)) return { accepted: false, reason: 'INVALID_GRADE', item: cloneItem(item) };
  if (item.state === constants.STATES.SUSPENDED) return { accepted: false, reason: 'SUSPENDED', item: cloneItem(item) };

  var working = cloneItem(item);
  var timestamp = safeNow(working, now);
  if (working.state === constants.STATES.NEW) working = activateItem(working, timestamp).item;

  working.lastReviewAt = timestamp;
  working.updatedAt = timestamp;
  working.lastGrade = grade;
  working.repetitions += 1;
  working.overdue = false;

  if (grade === constants.GRADES.AGAIN) {
    working.state = constants.STATES.RELEARNING;
    working.dueAt = timestamp + constants.LEARNING_DELAY_MS;
    working.intervalDays = constants.LEARNING_DELAY_MS / constants.DAY_MS;
    working.stepIndex = Math.max(-1, working.stepIndex - 1);
    working.lapses += 1;
    working.wrongCount += 1;
    return { accepted: true, item: working };
  }

  if (grade === constants.GRADES.HARD) {
    working.hardCount += 1;
    if (working.state === constants.STATES.LEARNING || working.state === constants.STATES.RELEARNING) {
      working.state = constants.STATES.LEARNING;
      working.dueAt = timestamp + constants.HARD_LEARNING_DELAY_MS;
      working.intervalDays = constants.HARD_LEARNING_DELAY_MS / constants.DAY_MS;
      working.stepIndex = -1;
    } else {
      working.state = constants.STATES.REVIEW;
      working.stepIndex = Math.max(0, working.stepIndex);
      working.intervalDays = intervalAt(working.stepIndex);
      working.dueAt = timestamp + working.intervalDays * constants.DAY_MS;
    }
    return { accepted: true, item: working };
  }

  working.correctCount += 1;
  if (grade === constants.GRADES.GOOD) {
    if (working.state === constants.STATES.LEARNING || working.state === constants.STATES.RELEARNING) {
      working.stepIndex = 0;
    } else {
      working.stepIndex = Math.min(constants.REVIEW_INTERVAL_DAYS.length - 1, Math.max(0, working.stepIndex) + 1);
    }
  } else if (grade === constants.GRADES.EASY) {
    working.easyCount += 1;
    if (working.state === constants.STATES.LEARNING || working.state === constants.STATES.RELEARNING) {
      working.stepIndex = 1;
    } else {
      // Easy may move only one base stage farther than the normal GOOD result.
      working.stepIndex = Math.min(constants.REVIEW_INTERVAL_DAYS.length - 1, Math.max(0, working.stepIndex) + 2);
    }
  }

  working.state = constants.STATES.REVIEW;
  working.intervalDays = intervalAt(working.stepIndex);
  working.dueAt = timestamp + working.intervalDays * constants.DAY_MS;
  return { accepted: true, item: working };
}

function suspendItem(item, now) {
  if (!schema.isValidItem(item)) return { accepted: false, reason: 'INVALID_ITEM', item: null };
  var next = cloneItem(item);
  next.state = constants.STATES.SUSPENDED;
  next.dueAt = null;
  next.overdue = false;
  next.updatedAt = safeNow(next, now);
  return { accepted: true, item: next };
}

function getDueItems(items, now, options) {
  options = options || {};
  var list = Array.isArray(items) ? items : [];
  var timestamp = schema.safeTimestamp(now, 0);
  var result = [];
  for (var i = 0; i < list.length; i++) {
    if (isDue(list[i], timestamp)) result.push(annotateDue(list[i], timestamp));
  }
  result.sort(function (left, right) {
    if ((right.priority || 0) !== (left.priority || 0)) return (right.priority || 0) - (left.priority || 0);
    if (left.dueAt !== right.dueAt) return left.dueAt - right.dueAt;
    return left.memoryItemId < right.memoryItemId ? -1 : 1;
  });
  return typeof options.limit === 'number' ? result.slice(0, Math.max(0, options.limit)) : result;
}

module.exports = {
  isGrade: isGrade,
  isDue: isDue,
  overdueMs: overdueMs,
  annotateDue: annotateDue,
  activateItem: activateItem,
  applyGrade: applyGrade,
  suspendItem: suspendItem,
  getDueItems: getDueItems,
  safeNow: safeNow
};
