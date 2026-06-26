'use strict';

/**
 * Local learning event ledger — lightweight, append-only, compressed.
 *
 * Records scoring events and session completions with minimal fields.
 * Never stores full question text, answers, or private content.
 *
 * Capacity: max 2000 events (FIFO), auto-compression on overflow.
 */

var constants = require('./constants');
var identity = require('./identity');

var LEDGER_KEY = 'study_tools_learning_ledger_v1';
var MAX_EVENTS = 2000;
var SCHEMA_VERSION = 1;

// ═══════════════════════════════════════════════════════════════════════
// Local date (device-local, not UTC)
// ═══════════════════════════════════════════════════════════════════════

function localDayKey(ts) {
  var d = new Date(ts || Date.now());
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// ═══════════════════════════════════════════════════════════════════════
// Loading / saving
// ═══════════════════════════════════════════════════════════════════════

function _load() {
  try {
    var raw = wx.getStorageSync(LEDGER_KEY);
    if (!raw || typeof raw !== 'object') return { schemaVersion: SCHEMA_VERSION, events: [] };
    return raw;
  } catch (e) { return { schemaVersion: SCHEMA_VERSION, events: [] }; }
}

function _save(ledger) {
  try {
    wx.setStorageSync(LEDGER_KEY, ledger);
    return true;
  } catch (e) { return false; }
}

// ═══════════════════════════════════════════════════════════════════════
// Event recording (idempotent)
// ═══════════════════════════════════════════════════════════════════════

function recordGradeEvent(opts) {
  // opts: { playerId, deckId, cardId, sessionId, grade, course }
  if (!opts || !opts.cardId || !opts.grade || !opts.deckId) return false;

  var now = Date.now();
  var dedupeKey = ['grade', opts.deckId, opts.cardId, opts.sessionId || 'nosession', opts.grade, localDayKey(now)].join('|');

  var ledger = _load();
  if (!Array.isArray(ledger.events)) ledger.events = [];

  // Check for duplicate
  for (var i = ledger.events.length - 1; i >= Math.max(0, ledger.events.length - 50); i--) {
    if (ledger.events[i].dedupeKey === dedupeKey) return false; // already recorded
  }

  ledger.events.push({
    eventId: id(),
    schemaVersion: SCHEMA_VERSION,
    occurredAt: now,
    localDayKey: localDayKey(now),
    type: 'grade_saved',
    dedupeKey: dedupeKey,
    course: opts.course || '',
    playerId: opts.playerId || '',
    deckId: opts.deckId,
    cardId: opts.cardId,
    sessionId: opts.sessionId || null,
    grade: opts.grade
  });

  // Capacity control: trim oldest if over limit
  if (ledger.events.length > MAX_EVENTS) {
    ledger.events = ledger.events.slice(ledger.events.length - MAX_EVENTS);
  }

  _save(ledger);
  return true;
}

function recordSessionComplete(opts) {
  if (!opts || !opts.deckId || !opts.sessionId) return false;

  var now = Date.now();
  var dedupeKey = ['session_complete', opts.sessionId, localDayKey(now)].join('|');

  var ledger = _load();
  if (!Array.isArray(ledger.events)) ledger.events = [];

  for (var i = ledger.events.length - 1; i >= 0; i--) {
    if (ledger.events[i].dedupeKey === dedupeKey) return false;
  }

  ledger.events.push({
    eventId: id(),
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

  if (ledger.events.length > MAX_EVENTS) {
    ledger.events = ledger.events.slice(ledger.events.length - MAX_EVENTS);
  }

  _save(ledger);
  return true;
}

// ═══════════════════════════════════════════════════════════════════════
// Query helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Count AGAIN/HARD events in the last N days for a specific deck.
 */
function countRecentDifficulties(deckId, lookbackDays) {
  var cutoff = Date.now() - lookbackDays * constants.DAY_MS;
  var ledger = _load();
  var count = 0;
  var events = ledger.events || [];
  for (var i = events.length - 1; i >= 0; i--) {
    if (events[i].occurredAt < cutoff) break; // events are chronological
    if (events[i].deckId !== deckId) continue;
    if (events[i].grade === constants.GRADES.AGAIN || events[i].grade === constants.GRADES.HARD) {
      count++;
    }
  }
  return count;
}

function getTodayCompleted() {
  var today = localDayKey(Date.now());
  var ledger = _load();
  var count = 0;
  var events = ledger.events || [];
  // Count unique grade events for today
  var seen = {};
  for (var i = events.length - 1; i >= 0; i--) {
    if (events[i].localDayKey !== today) continue;
    if (events[i].type !== 'grade_saved') continue;
    var key = events[i].deckId + '|' + events[i].cardId;
    if (seen[key]) continue;
    seen[key] = true;
    count++;
  }
  return count;
}

function getStreakDays() {
  var ledger = _load();
  var events = ledger.events || [];
  // Collect unique days with events
  var days = {};
  for (var i = 0; i < events.length; i++) {
    if (events[i].localDayKey) days[events[i].localDayKey] = true;
  }
  var sorted = Object.keys(days).sort().reverse();
  if (sorted.length === 0) return 0;

  var today = localDayKey(Date.now());
  // Check if today has events
  if (!days[today]) {
    // Check if yesterday has events
    var yesterday = localDayKey(Date.now() - constants.DAY_MS);
    if (!days[yesterday]) return 0;
    // Start from yesterday
    var streak = 1;
    for (var i = 1; i < sorted.length; i++) {
      var expected = localDayKey(Date.now() - (i + 1) * constants.DAY_MS);
      if (days[expected]) streak++;
      else break;
    }
    return streak;
  }

  var streak = 1;
  for (var j = 1; j < sorted.length; j++) {
    var exp = localDayKey(Date.now() - j * constants.DAY_MS);
    if (days[exp]) streak++;
    else break;
  }
  return streak;
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function id() {
  return 'ev-' + Date.now() + '-' + Math.floor(Math.random() * 1e9).toString(36);
}

function getEvents(limit) {
  var ledger = _load();
  var events = ledger.events || [];
  if (limit) events = events.slice(Math.max(0, events.length - limit));
  return events;
}

module.exports = {
  recordGradeEvent: recordGradeEvent,
  recordSessionComplete: recordSessionComplete,
  countRecentDifficulties: countRecentDifficulties,
  getTodayCompleted: getTodayCompleted,
  getStreakDays: getStreakDays,
  getEvents: getEvents,
  localDayKey: localDayKey,
  LEDGER_KEY: LEDGER_KEY,
  MAX_EVENTS: MAX_EVENTS
};
