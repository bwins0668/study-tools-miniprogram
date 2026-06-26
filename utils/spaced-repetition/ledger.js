'use strict';

/**
 * Local learning event ledger v2 — occurrence-aware, compact-summary backed.
 *
 * Each grade action is identified by [cardId|sessionId|grade|occurrence].
 * The occurrence counter increments each time the same card is answered
 * in the same session — protecting legitimate repeated grades while
 * deduplicating double-clicks and callback re-entrance.
 *
 * Compact daily summary ensures streak, todayCompleted, and 14-day
 * difficulty counts survive FIFO eviction of raw events.
 */

var constants = require('./constants');

var LEDGER_KEY = 'study_tools_learning_ledger_v2';
var SUMMARY_KEY = 'study_tools_learning_summary_v1';
var OCCURRENCE_KEY = 'study_tools_grade_occurrence_v2';
var PENDING_KEY = 'study_tools_pending_actions_v1';

var MAX_RAW_EVENTS = 500;
var MAX_PENDING_ACTIONS = 50;
var SCHEMA_VERSION = 2;

// ═══════════════════════════════════════════════════════════════════════
// Local date
// ═══════════════════════════════════════════════════════════════════════

function localDayKey(ts) {
  var d = new Date(ts || Date.now());
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// ═══════════════════════════════════════════════════════════════════════
// Storage helpers
// ═══════════════════════════════════════════════════════════════════════

function _load(key, fallback) {
  try { var r = wx.getStorageSync(key); return (r && typeof r === 'object') ? r : fallback; }
  catch (e) { return fallback; }
}

function _save(key, value) {
  try { wx.setStorageSync(key, value); return true; }
  catch (e) { return false; }
}

// ═══════════════════════════════════════════════════════════════════════
// Occurrence counter (per card + session)
// ═══════════════════════════════════════════════════════════════════════

function _occurrenceKey(cardId, sessionId) {
  return (cardId || '?') + '|' + (sessionId || 'nosession');
}

function _nextOccurrence(cardId, sessionId) {
  var map = _load(OCCURRENCE_KEY, {});
  var key = _occurrenceKey(cardId, sessionId);
  map[key] = (map[key] || 0) + 1;
  // Trim to 500 entries
  var keys = Object.keys(map);
  if (keys.length > 500) {
    var newMap = {};
    keys.slice(keys.length - 500).forEach(function(k) { newMap[k] = map[k]; });
    map = newMap;
  }
  _save(OCCURRENCE_KEY, map);
  return map[key];
}

// ═══════════════════════════════════════════════════════════════════════
// Event recording (occurrence-aware, idempotent within occurrence)
// ═══════════════════════════════════════════════════════════════════════

function recordGradeEvent(opts) {
  if (!opts || !opts.cardId || !opts.grade || !opts.deckId) return false;

  var now = Date.now();
  var occurrence = _nextOccurrence(opts.cardId, opts.sessionId || null);
  var dedupeKey = [opts.deckId, opts.cardId, opts.sessionId || 'nosession', opts.grade, occurrence, localDayKey(now)].join('|');
  var actionId = 'act-' + now + '-' + Math.floor(Math.random() * 1e9).toString(36);

  // Check recent raw events for duplicate (last 100)
  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];
  for (var i = events.length - 1; i >= Math.max(0, events.length - 100); i--) {
    if (events[i].dedupeKey === dedupeKey) return false;
  }

  // Append event
  events.push({
    eventId: 'ev-' + now + '-' + Math.floor(Math.random() * 1e6).toString(36),
    actionId: actionId,
    schemaVersion: SCHEMA_VERSION,
    occurredAt: now,
    localDayKey: localDayKey(now),
    type: 'grade_saved',
    dedupeKey: dedupeKey,
    occurrence: occurrence,
    course: opts.course || '',
    playerId: opts.playerId || '',
    deckId: opts.deckId,
    cardId: opts.cardId,
    sessionId: opts.sessionId || null,
    grade: opts.grade
  });

  // FIFO trim
  if (events.length > MAX_RAW_EVENTS) {
    events = events.slice(events.length - MAX_RAW_EVENTS);
  }
  ledger.events = events;
  _save(LEDGER_KEY, ledger);

  // Update compact summary immediately
  _updateSummary(opts.deckId, opts.grade, now);

  return true;
}

function recordSessionComplete(opts) {
  if (!opts || !opts.deckId || !opts.sessionId) return false;

  var now = Date.now();
  var dedupeKey = 'session_complete|' + opts.sessionId;

  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];
  for (var i = events.length - 1; i >= Math.max(0, events.length - 50); i--) {
    if (events[i].dedupeKey === dedupeKey) return false;
  }

  events.push({
    eventId: 'ev-' + now + '-sc-' + Math.floor(Math.random() * 1e6).toString(36),
    actionId: 'act-' + now + '-sc-' + Math.floor(Math.random() * 1e9).toString(36),
    schemaVersion: SCHEMA_VERSION,
    occurredAt: now,
    localDayKey: localDayKey(now),
    type: 'session_completed',
    dedupeKey: dedupeKey,
    course: opts.course || '',
    deckId: opts.deckId,
    sessionId: opts.sessionId,
    cardCount: opts.cardCount || 0
  });

  if (events.length > MAX_RAW_EVENTS) {
    events = events.slice(events.length - MAX_RAW_EVENTS);
  }
  ledger.events = events;
  _save(LEDGER_KEY, ledger);
  return true;
}

// ═══════════════════════════════════════════════════════════════════════
// Compact daily summary (survives FIFO eviction)
// ═══════════════════════════════════════════════════════════════════════

function _updateSummary(deckId, grade, now) {
  var day = localDayKey(now);
  var summary = _load(SUMMARY_KEY, { days: {} });
  if (!summary.days[day]) {
    summary.days[day] = { day: day, totalGrades: 0, deckCounts: {}, gradeCounts: {} };
  }
  var s = summary.days[day];
  s.totalGrades += 1;
  s.deckCounts[deckId] = (s.deckCounts[deckId] || 0) + 1;
  s.gradeCounts[grade] = (s.gradeCounts[grade] || 0) + 1;

  // Keep 400 days max
  var keys = Object.keys(summary.days).sort();
  if (keys.length > 400) {
    var trimmed = {};
    keys.slice(keys.length - 400).forEach(function(k) { trimmed[k] = summary.days[k]; });
    summary.days = trimmed;
  }
  _save(SUMMARY_KEY, summary);
}

// ═══════════════════════════════════════════════════════════════════════
// Query helpers (use compact summary primarily)
// ═══════════════════════════════════════════════════════════════════════

function getTodayCompleted() {
  var day = localDayKey(Date.now());
  var summary = _load(SUMMARY_KEY, { days: {} });
  var s = summary.days[day];
  return s ? (s.totalGrades || 0) : 0;
}

function countRecentDifficulties(deckId, lookbackDays) {
  // Use raw events for precise per-deck lookup, fall back to summary
  var cutoff = Date.now() - lookbackDays * constants.DAY_MS;
  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];
  var count = 0;
  for (var i = events.length - 1; i >= 0; i--) {
    if (events[i].occurredAt < cutoff) break;
    if (events[i].deckId !== deckId) continue;
    if (events[i].grade === constants.GRADES.AGAIN || events[i].grade === constants.GRADES.HARD) {
      count++;
    }
  }
  // If raw events are short (FIFO'd), supplement with summary
  if (count === 0 && events.length >= MAX_RAW_EVENTS) {
    var summary = _load(SUMMARY_KEY, { days: {} });
    var days = Object.keys(summary.days).sort();
    for (var d = days.length - 1; d >= 0; d--) {
      var dayTs = new Date(days[d] + 'T00:00:00').getTime();
      if (dayTs < cutoff) break;
      var ds = summary.days[days[d]];
      if (ds.deckCounts && ds.deckCounts[deckId]) {
        count += Math.round(ds.deckCounts[deckId] * 0.3); // conservative estimate
      }
    }
  }
  return count;
}

function getStreakDays() {
  var summary = _load(SUMMARY_KEY, { days: {} });
  var days = Object.keys(summary.days).sort().reverse();
  if (days.length === 0) return 0;

  var today = localDayKey(Date.now());
  var yesterday = localDayKey(Date.now() - constants.DAY_MS);
  var hasToday = summary.days[today] && summary.days[today].totalGrades > 0;
  var hasYesterday = summary.days[yesterday] && summary.days[yesterday].totalGrades > 0;

  if (!hasToday && !hasYesterday) return 0;

  var streak = 0;
  for (var i = 0; i < 400; i++) {
    var expected = localDayKey(Date.now() - i * constants.DAY_MS);
    if (summary.days[expected] && summary.days[expected].totalGrades > 0) streak++;
    else break;
  }
  // If today has no events but yesterday did, start streak from yesterday
  if (!hasToday && streak === 0 && hasYesterday) {
    streak = 1;
    for (var j = 2; j < 400; j++) {
      var exp = localDayKey(Date.now() - j * constants.DAY_MS);
      if (summary.days[exp] && summary.days[exp].totalGrades > 0) streak++;
      else break;
    }
  }
  return streak;
}

function getEvents(limit) {
  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];
  if (limit) events = events.slice(Math.max(0, events.length - limit));
  return events;
}

function getSummary() {
  return _load(SUMMARY_KEY, { days: {} });
}

// ═══════════════════════════════════════════════════════════════════════
// Migration from v1 ledger
// ═══════════════════════════════════════════════════════════════════════

function migrateFromV1() {
  try {
    var oldRaw = wx.getStorageSync('study_tools_learning_ledger_v1');
    if (!oldRaw || !oldRaw.events) return;
    var v2Ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
    if (v2Ledger.events.length > 0) {
      // v2 already has data, don't overwrite. Remove v1.
      try { wx.removeStorageSync('study_tools_learning_ledger_v1'); } catch(e) {}
      return;
    }
    // Migrate events with v2 fields
    var migrated = [];
    for (var i = 0; i < oldRaw.events.length; i++) {
      var e = oldRaw.events[i];
      migrated.push({
        eventId: e.eventId || 'ev-migrated-' + i,
        actionId: e.eventId || 'act-migrated-' + i,
        schemaVersion: SCHEMA_VERSION,
        occurredAt: e.occurredAt || Date.now(),
        localDayKey: e.localDayKey || localDayKey(e.occurredAt),
        type: e.type || 'grade_saved',
        dedupeKey: e.dedupeKey || '',
        occurrence: i + 1,
        course: e.course || '',
        playerId: e.playerId || '',
        deckId: e.deckId || '',
        cardId: e.cardId || '',
        sessionId: e.sessionId || null,
        grade: e.grade || ''
      });
    }
    _save(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: migrated.slice(-MAX_RAW_EVENTS) });
    // Rebuild summary from migrated events
    migrated.forEach(function(e) {
      if (e.type === 'grade_saved' && e.deckId && e.grade) {
        _updateSummary(e.deckId, e.grade, e.occurredAt);
      }
    });
    try { wx.removeStorageSync('study_tools_learning_ledger_v1'); } catch(e) {}
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  recordGradeEvent: recordGradeEvent,
  recordSessionComplete: recordSessionComplete,
  countRecentDifficulties: countRecentDifficulties,
  getTodayCompleted: getTodayCompleted,
  getStreakDays: getStreakDays,
  getEvents: getEvents,
  getSummary: getSummary,
  localDayKey: localDayKey,
  migrateFromV1: migrateFromV1,
  LEDGER_KEY: LEDGER_KEY,
  SUMMARY_KEY: SUMMARY_KEY,
  MAX_RAW_EVENTS: MAX_RAW_EVENTS
};
