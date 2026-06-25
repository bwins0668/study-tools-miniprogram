'use strict';

var constants = require('./constants');
var schema = require('./schema');
var scheduler = require('./scheduler');

function normalizeTimezoneOffset(offsetMinutes) {
  return typeof offsetMinutes === 'number' && isFinite(offsetMinutes) ? Math.floor(offsetMinutes) : 0;
}

function localDayKey(timestamp, timezoneOffsetMinutes) {
  var safe = schema.safeTimestamp(timestamp, 0);
  var shifted = new Date(safe + normalizeTimezoneOffset(timezoneOffsetMinutes) * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

function localDayStart(timestamp, timezoneOffsetMinutes) {
  var safe = schema.safeTimestamp(timestamp, 0);
  var offset = normalizeTimezoneOffset(timezoneOffsetMinutes) * 60 * 1000;
  var shifted = new Date(safe + offset);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - offset;
}

function moduleKey(item) {
  if (item && item.sourceType === 'exam' && item.sourceRef && item.sourceRef.course) return item.sourceRef.course;
  return item && item.sourceType ? item.sourceType : 'unknown';
}

function emptySummary(now) {
  return {
    dueCount: 0,
    overdueCount: 0,
    todayCompleted: 0,
    todayNewCount: 0,
    streak: 0,
    moduleDueCounts: {},
    updatedAt: schema.safeTimestamp(now, 0)
  };
}

function dailyRecord(daily, dayKey) {
  var current = daily && daily[dayKey];
  return {
    completed: current && typeof current.completed === 'number' && current.completed > 0 ? Math.floor(current.completed) : 0,
    newCount: current && typeof current.newCount === 'number' && current.newCount > 0 ? Math.floor(current.newCount) : 0,
    updatedAt: current && schema.isFiniteTimestamp(current.updatedAt) ? current.updatedAt : 0
  };
}

function remainingDailyNewSlots(daily, now, timezoneOffsetMinutes, limit) {
  var resolvedLimit = typeof limit === 'number' && limit >= 0 ? Math.floor(limit) : constants.DAILY_NEW_LIMIT;
  var record = dailyRecord(daily, localDayKey(now, timezoneOffsetMinutes));
  return Math.max(0, resolvedLimit - record.newCount);
}

function normalizeSummary(raw, now) {
  var normalized = emptySummary(now);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return normalized;
  normalized.dueCount = typeof raw.dueCount === 'number' && raw.dueCount > 0 ? Math.floor(raw.dueCount) : 0;
  normalized.overdueCount = typeof raw.overdueCount === 'number' && raw.overdueCount > 0 ? Math.floor(raw.overdueCount) : 0;
  normalized.todayCompleted = typeof raw.todayCompleted === 'number' && raw.todayCompleted > 0 ? Math.floor(raw.todayCompleted) : 0;
  normalized.todayNewCount = typeof raw.todayNewCount === 'number' && raw.todayNewCount > 0 ? Math.floor(raw.todayNewCount) : 0;
  normalized.streak = typeof raw.streak === 'number' && raw.streak > 0 ? Math.floor(raw.streak) : 0;
  if (raw.moduleDueCounts && typeof raw.moduleDueCounts === 'object' && !Array.isArray(raw.moduleDueCounts)) {
    Object.keys(raw.moduleDueCounts).forEach(function (key) {
      var count = raw.moduleDueCounts[key];
      if (typeof count === 'number' && count > 0) normalized.moduleDueCounts[key] = Math.floor(count);
    });
  }
  normalized.updatedAt = schema.safeTimestamp(raw.updatedAt, now);
  return normalized;
}

function recordDailyActivity(daily, now, timezoneOffsetMinutes, options) {
  options = options || {};
  var result = schema.clone(daily || {});
  var dayKey = localDayKey(now, timezoneOffsetMinutes);
  var record = dailyRecord(result, dayKey);
  if (options.completed) record.completed += 1;
  if (options.created) record.newCount += 1;
  record.updatedAt = schema.safeTimestamp(now, record.updatedAt);
  result[dayKey] = record;
  return result;
}

function dayBefore(dayKey) {
  var parsed = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dayKey);
  if (!parsed) return null;
  var date = new Date(Date.UTC(Number(parsed[1]), Number(parsed[2]) - 1, Number(parsed[3])) - constants.DAY_MS);
  return date.toISOString().slice(0, 10);
}

function calculateStreak(daily, now, timezoneOffsetMinutes) {
  var cursor = localDayKey(now, timezoneOffsetMinutes);
  var todayRecord = dailyRecord(daily, cursor);
  if (todayRecord.completed < 1) cursor = dayBefore(cursor);
  var streak = 0;
  while (cursor) {
    if (dailyRecord(daily, cursor).completed < 1) break;
    streak += 1;
    cursor = dayBefore(cursor);
  }
  return streak;
}

function isOverdue(item, now) {
  if (!scheduler.isDue(item, now)) return false;
  return item.dueAt < schema.safeTimestamp(now, 0);
}

function deriveSummary(state, now, timezoneOffsetMinutes) {
  var summary = emptySummary(now);
  var items = schema.getItemsArray(state);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!scheduler.isDue(item, now)) continue;
    summary.dueCount += 1;
    if (isOverdue(item, now, timezoneOffsetMinutes)) summary.overdueCount += 1;
    var key = moduleKey(item);
    summary.moduleDueCounts[key] = (summary.moduleDueCounts[key] || 0) + 1;
  }
  var day = localDayKey(now, timezoneOffsetMinutes);
  var record = dailyRecord(state && state.daily, day);
  summary.todayCompleted = record.completed;
  summary.todayNewCount = record.newCount;
  summary.streak = calculateStreak(state && state.daily, now, timezoneOffsetMinutes);
  return summary;
}

function adjustCount(count, wasDue, isNowDue) {
  var next = typeof count === 'number' ? count : 0;
  if (wasDue) next -= 1;
  if (isNowDue) next += 1;
  return Math.max(0, next);
}

function updateSummaryIncrementally(summary, previousItem, nextItem, state, now, timezoneOffsetMinutes) {
  var nextSummary = normalizeSummary(summary, now);
  var previousDue = scheduler.isDue(previousItem, now);
  var nextDue = scheduler.isDue(nextItem, now);
  var previousOverdue = isOverdue(previousItem, now, timezoneOffsetMinutes);
  var nextOverdue = isOverdue(nextItem, now, timezoneOffsetMinutes);

  nextSummary.dueCount = adjustCount(nextSummary.dueCount, previousDue, nextDue);
  nextSummary.overdueCount = adjustCount(nextSummary.overdueCount, previousOverdue, nextOverdue);

  var previousKey = previousItem ? moduleKey(previousItem) : null;
  var nextKey = nextItem ? moduleKey(nextItem) : null;
  if (previousDue && previousKey) {
    nextSummary.moduleDueCounts[previousKey] = Math.max(0, (nextSummary.moduleDueCounts[previousKey] || 0) - 1);
  }
  if (nextDue && nextKey) {
    nextSummary.moduleDueCounts[nextKey] = (nextSummary.moduleDueCounts[nextKey] || 0) + 1;
  }

  var day = localDayKey(now, timezoneOffsetMinutes);
  var record = dailyRecord(state && state.daily, day);
  nextSummary.todayCompleted = record.completed;
  nextSummary.todayNewCount = record.newCount;
  nextSummary.streak = calculateStreak(state && state.daily, now, timezoneOffsetMinutes);
  nextSummary.updatedAt = schema.safeTimestamp(now, nextSummary.updatedAt);
  return nextSummary;
}

module.exports = {
  normalizeTimezoneOffset: normalizeTimezoneOffset,
  localDayKey: localDayKey,
  localDayStart: localDayStart,
  moduleKey: moduleKey,
  emptySummary: emptySummary,
  dailyRecord: dailyRecord,
  remainingDailyNewSlots: remainingDailyNewSlots,
  normalizeSummary: normalizeSummary,
  recordDailyActivity: recordDailyActivity,
  calculateStreak: calculateStreak,
  isOverdue: isOverdue,
  deriveSummary: deriveSummary,
  updateSummaryIncrementally: updateSummaryIncrementally
};
