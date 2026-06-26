'use strict';

/**
 * Local learning event ledger v3 — actionId-based deduplication.
 *
 * Each real user action generates a unique `actionId` at the caller level.
 * The ledger deduplicates by actionId, not by business dimensions.
 *
 * Compact daily summary survives FIFO eviction of raw events.
 * Pending actions support crash recovery.
 */

var constants = require('./constants');

var LEDGER_KEY = 'study_tools_learning_ledger_v2';
var SUMMARY_KEY = 'study_tools_learning_summary_v1';
var PENDING_KEY = 'study_tools_pending_actions_v1';

var MAX_RAW_EVENTS = 500;
var MAX_PENDING = 50;
var SCHEMA_VERSION = 3;

function localDayKey(ts) {
  var d = new Date(ts || Date.now());
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function _load(key, fallback) {
  try { var r = wx.getStorageSync(key); return (r && typeof r === 'object') ? r : fallback; }
  catch (e) { return fallback; }
}
function _save(key, value) {
  try { wx.setStorageSync(key, value); return true; }
  catch (e) { return false; }
}

// ═══════════════════════════════════════════════════════════════════════
// Pending actions (crash recovery support)
// ═══════════════════════════════════════════════════════════════════════

function savePendingAction(actionId, opts) {
  var pending = _load(PENDING_KEY, []);
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].actionId === actionId) return true; // already pending
  }
  pending.push({ actionId: actionId, opts: opts, createdAt: Date.now() });
  if (pending.length > MAX_PENDING) pending = pending.slice(-MAX_PENDING);
  _save(PENDING_KEY, pending);
  return true;
}

function resolvePendingAction(actionId) {
  var pending = _load(PENDING_KEY, []);
  pending = pending.filter(function(p) { return p.actionId !== actionId; });
  _save(PENDING_KEY, pending);
}

function getPendingActions() {
  return _load(PENDING_KEY, []);
}

// ═══════════════════════════════════════════════════════════════════════
// Event recording (actionId-based dedup)
// ═══════════════════════════════════════════════════════════════════════

function recordGradeEvent(opts) {
  // opts: { actionId?, playerId, deckId, cardId, sessionId, grade, course }
  if (!opts || !opts.cardId || !opts.grade || !opts.deckId) return false;

  var now = Date.now();
  var actionId = opts.actionId || ('act-' + now + '-' + Math.floor(Math.random() * 1e9).toString(36));
  var dedupeKey = 'action:' + actionId;

  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];

  // Check duplicate by actionId (last 200 events)
  for (var i = events.length - 1; i >= Math.max(0, events.length - 200); i--) {
    if (events[i].dedupeKey === dedupeKey) return false;
  }

  // Resolve any pending action with same actionId
  resolvePendingAction(opts.actionId || actionId);

  events.push({
    eventId: 'ev-' + now + '-' + Math.floor(Math.random() * 1e6).toString(36),
    actionId: actionId,
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

  if (events.length > MAX_RAW_EVENTS) events = events.slice(-MAX_RAW_EVENTS);
  ledger.events = events;
  _save(LEDGER_KEY, ledger);
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
    occurredAt: now, localDayKey: localDayKey(now),
    type: 'session_completed', dedupeKey: dedupeKey,
    course: opts.course || '', deckId: opts.deckId,
    sessionId: opts.sessionId, cardCount: opts.cardCount || 0
  });

  if (events.length > MAX_RAW_EVENTS) events = events.slice(-MAX_RAW_EVENTS);
  ledger.events = events;
  _save(LEDGER_KEY, ledger);
  return true;
}

// ═══════════════════════════════════════════════════════════════════════
// Compact daily summary
// ═══════════════════════════════════════════════════════════════════════

function _updateSummary(deckId, grade, now) {
  var day = localDayKey(now);
  var summary = _load(SUMMARY_KEY, { days: {} });
  if (!summary.days[day]) summary.days[day] = { day: day, totalGrades: 0, deckCounts: {}, gradeCounts: {} };
  var s = summary.days[day];
  s.totalGrades += 1;
  s.deckCounts[deckId] = (s.deckCounts[deckId] || 0) + 1;
  s.gradeCounts[grade] = (s.gradeCounts[grade] || 0) + 1;

  var keys = Object.keys(summary.days).sort();
  if (keys.length > 400) {
    var trimmed = {};
    keys.slice(-400).forEach(function(k) { trimmed[k] = summary.days[k]; });
    summary.days = trimmed;
  }
  _save(SUMMARY_KEY, summary);
}

// ═══════════════════════════════════════════════════════════════════════
// Query helpers
// ═══════════════════════════════════════════════════════════════════════

function getTodayCompleted() {
  var day = localDayKey(Date.now());
  var summary = _load(SUMMARY_KEY, { days: {} });
  var s = summary.days[day];
  return s ? (s.totalGrades || 0) : 0;
}

function countRecentDifficulties(deckId, lookbackDays) {
  var cutoff = Date.now() - lookbackDays * constants.DAY_MS;
  var ledger = _load(LEDGER_KEY, { events: [] });
  var events = ledger.events || [];
  var count = 0;
  for (var i = events.length - 1; i >= 0; i--) {
    if (events[i].occurredAt < cutoff) break;
    if (events[i].deckId !== deckId) continue;
    if (events[i].grade === constants.GRADES.AGAIN || events[i].grade === constants.GRADES.HARD) count++;
  }
  if (count === 0 && events.length >= MAX_RAW_EVENTS) {
    var summary = _load(SUMMARY_KEY, { days: {} });
    var keys = Object.keys(summary.days).sort();
    for (var k = keys.length - 1; k >= 0; k--) {
      if (keys[k] < localDayKey(cutoff)) break;
      var ds = summary.days[keys[k]];
      if (ds.deckCounts && ds.deckCounts[deckId]) count += Math.round(ds.deckCounts[deckId] * 0.3);
    }
  }
  return count;
}

function getStreakDays() {
  var summary = _load(SUMMARY_KEY, { days: {} });
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
  return streak;
}

function getEvents(limit) {
  var ledger = _load(LEDGER_KEY, { events: [] });
  var e = ledger.events || [];
  return limit ? e.slice(Math.max(0, e.length - limit)) : e;
}

function getSummary() { return _load(SUMMARY_KEY, { days: {} }); }

// v1 migration
function migrateFromV1() {
  try {
    var old = wx.getStorageSync('study_tools_learning_ledger_v1');
    if (!old || !old.events) return;
    var v2 = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
    if (v2.events.length > 0) { try { wx.removeStorageSync('study_tools_learning_ledger_v1'); } catch(e) {} return; }
    old.events.forEach(function(e, i) {
      v2.events.push({
        eventId: e.eventId || 'ev-mig-' + i,
        actionId: e.actionId || e.eventId || 'act-mig-' + i,
        schemaVersion: SCHEMA_VERSION, occurredAt: e.occurredAt || Date.now(),
        localDayKey: e.localDayKey || localDayKey(e.occurredAt),
        type: e.type || 'grade_saved', dedupeKey: 'action:' + (e.actionId || e.eventId || 'act-mig-' + i),
        course: e.course || '', playerId: e.playerId || '', deckId: e.deckId || '',
        cardId: e.cardId || '', sessionId: e.sessionId || null, grade: e.grade || ''
      });
    });
    v2.events = v2.events.slice(-MAX_RAW_EVENTS);
    _save(LEDGER_KEY, v2);
    v2.events.forEach(function(e) { if (e.type === 'grade_saved' && e.deckId && e.grade) _updateSummary(e.deckId, e.grade, e.occurredAt); });
    try { wx.removeStorageSync('study_tools_learning_ledger_v1'); } catch(e) {}
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════════
// Presentation token + crash recovery
// ═══════════════════════════════════════════════════════════════════════

function buildPresentationToken(opts) {
  var ts = Date.now();
  return {
    presentationId: 'pres-' + ts + '-' + Math.floor(Math.random() * 1e9).toString(36),
    actionId: 'act-' + ts + '-' + Math.floor(Math.random() * 1e9).toString(36),
    playerId: opts.playerId || '',
    deckId: opts.deckId || '',
    cardId: opts.cardId || '',
    sessionId: opts.sessionId || null,
    course: opts.course || '',
    createdAt: ts
  };
}

function recoverPendingTransactions() {
  var pending = getPendingActions();
  if (!pending.length) return { recovered: 0, errors: 0, aborted: 0 };

  var recovered = 0;
  var errors = 0;
  var aborted = 0;
  var ledger = _load(LEDGER_KEY, { schemaVersion: SCHEMA_VERSION, events: [] });
  var events = ledger.events || [];

  for (var i = 0; i < pending.length; i++) {
    var p = pending[i];
    if (!p.actionId) { errors++; continue; }

    var dedupeKey = 'action:' + p.actionId;
    var eventExists = false;
    for (var j = events.length - 1; j >= Math.max(0, events.length - 200); j--) {
      if (events[j].dedupeKey === dedupeKey) { eventExists = true; break; }
    }

    var coreApplied = wasCoreActionApplied(p.actionId);

    // Recovery decision matrix
    if (eventExists) {
      // Event exists → just resolve pending
      resolvePendingAction(p.actionId);
      recovered++;
    } else if (coreApplied) {
      // Core applied, event missing → safe to project event
      try {
        recordGradeEvent(p.opts);
        resolvePendingAction(p.actionId);
        recovered++;
      } catch (e) { errors++; }
    } else {
      // Core NOT applied → abort pending, do NOT create fake event
      resolvePendingAction(p.actionId);
      aborted++;
    }
  }

  return { recovered: recovered, errors: errors, aborted: aborted };
}

/**
 * Check if a grading action was actually applied to core SR state.
 * Scans all SR items for matching appliedActionId.
 */
function wasCoreActionApplied(actionId) {
  if (!actionId) return false;
  try {
    var raw = wx.getStorageSync('study_tools_spaced_repetition_state_v1');
    if (!raw || !raw.items) return false;
    var items = raw.items;
    for (var key in items) {
      if (items[key] && items[key].appliedActionId === actionId) return true;
    }
  } catch (e) {}
  return false;
}

module.exports = {
  recordSessionComplete: recordSessionComplete,
  savePendingAction: savePendingAction,
  resolvePendingAction: resolvePendingAction,
  getPendingActions: getPendingActions,
  countRecentDifficulties: countRecentDifficulties,
  getTodayCompleted: getTodayCompleted,
  getStreakDays: getStreakDays,
  getEvents: getEvents,
  getSummary: getSummary,
  recoverPendingTransactions: recoverPendingTransactions,
  wasCoreActionApplied: wasCoreActionApplied,
  buildPresentationToken: buildPresentationToken,
  localDayKey: localDayKey,
  migrateFromV1: migrateFromV1,
  LEDGER_KEY: LEDGER_KEY, SUMMARY_KEY: SUMMARY_KEY, MAX_RAW_EVENTS: MAX_RAW_EVENTS
};
