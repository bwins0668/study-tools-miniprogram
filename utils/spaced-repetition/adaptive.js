'use strict';

/**
 * Adaptive Learning Engine v2 — trusted, evidence-based.
 *
 * Every recommendation carries a reasonCode and evidenceLevel.
 * "Near 14-day hardship" claims are backed by the event ledger.
 * Without ledger events, signals fall back to current-state only.
 */

var constants = require('./constants');
var schema = require('./schema');
var storage = require('./storage');
var scheduler = require('./scheduler');
var summary = require('./summary');
var ledger = require('./ledger');

// ═══════════════════════════════════════════════════════════════════════
// Main entry
// ═══════════════════════════════════════════════════════════════════════

function getLearningRecommendation() {
  var now = Date.now();
  var wxAdapter = storage.createWxStorageAdapter(wx);
  var loadResult = storage.loadSpacedRepetitionState(wxAdapter, now, 0);
  var state = loadResult.state || schema.createEmptyState(now);
  var items = schema.getItemsArray(state);

  var unfinishedSession = _getUnfinishedSession();
  var dueItems = scheduler.getDueItems(items, now);

  var overdueItems = [];
  var normalDueItems = [];
  for (var i = 0; i < dueItems.length; i++) {
    if (dueItems[i].dueAt < now) overdueItems.push(dueItems[i]);
    else normalDueItems.push(dueItems[i]);
  }

  var learningItems = [];
  var relearningItems = [];
  for (var j = 0; j < items.length; j++) {
    if (items[j].state === constants.STATES.LEARNING) learningItems.push(items[j]);
    if (items[j].state === constants.STATES.RELEARNING) relearningItems.push(items[j]);
  }

  var weakSignals = _computeWeakSignals(items);
  var newCardDecks = _computeNewCardAvailability(items);

  var todayCompleted = ledger.getTodayCompleted();
  var streak = ledger.getStreakDays();

  var priority = _buildPriority({
    hasUnfinishedSession: !!unfinishedSession,
    unfinishedSession: unfinishedSession,
    overdueItems: overdueItems,
    normalDueItems: normalDueItems,
    learningItems: learningItems,
    relearningItems: relearningItems,
    weakSignals: weakSignals,
    newCardDecks: newCardDecks,
    todayCompleted: todayCompleted,
    streak: streak
  });

  return {
    priority: priority,
    todayCompleted: todayCompleted,
    streak: streak,
    dueCount: dueItems.length,
    hasUnfinishedSession: !!unfinishedSession
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Unfinished session
// ═══════════════════════════════════════════════════════════════════════

function _getUnfinishedSession() {
  try {
    var raw = wx.getStorageSync('study_tools_review_session_v1');
    if (!raw || !raw.reviewSessionId) return null;
    if (raw.completedAt) return null;
    var remaining = (raw.itemIds || []).length - (raw.completedItemIds || []).length;
    if (remaining <= 0) return null;
    return {
      reviewSessionId: raw.reviewSessionId,
      course: raw.course,
      deckId: raw.deckId,
      totalItems: (raw.itemIds || []).length,
      remainingItems: remaining
    };
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════════════════════
// Weak signals — current-state only (no fake history)
// ═══════════════════════════════════════════════════════════════════════

function _computeWeakSignals(items) {
  var deckSignals = {};

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.state === constants.STATES.SUSPENDED || item.state === constants.STATES.NEW) continue;
    if (!item.sourceRef || !item.sourceRef.course || !item.sourceRef.deckId) continue;

    var deckKey = item.sourceRef.course + '/' + item.sourceRef.deckId;
    if (!deckSignals[deckKey]) {
      deckSignals[deckKey] = {
        course: item.sourceRef.course, deckId: item.sourceRef.deckId,
        totalSRItems: 0, relearningCount: 0, highLapseCount: 0,
        recentDifficultyCount: 0, weakScore: 0, evidenceLevel: 'current_state'
      };
    }
    var ds = deckSignals[deckKey];
    ds.totalSRItems += 1;
    if (item.state === constants.STATES.RELEARNING) ds.relearningCount += 1;
    if ((item.lapses || 0) >= 3) ds.highLapseCount += 1;
  }

  // Enrich with ledger-based difficulty counts (real event history)
  for (var key in deckSignals) {
    var ds = deckSignals[key];
    var ledgerCount = ledger.countRecentDifficulties(ds.deckId, 14);
    ds.recentDifficultyCount = ledgerCount;
    if (ledgerCount > 0) ds.evidenceLevel = 'ledger_backed';
  }

  var signals = [];
  for (var k in deckSignals) {
    var s = deckSignals[k];
    if (s.totalSRItems === 0) continue;
    var score = 0;
    if (s.relearningCount > 0) score += s.relearningCount * 3;
    if (s.highLapseCount > 0) score += s.highLapseCount * 2;
    if (s.recentDifficultyCount > 0) score += s.recentDifficultyCount * 1;
    s.weakScore = Math.min(100, Math.round(score / Math.max(1, s.totalSRItems) * 100));
    if (s.weakScore >= 5) signals.push(s);
  }

  signals.sort(function (a, b) { return b.weakScore - a.weakScore; });
  return signals.slice(0, 5);
}

// ═══════════════════════════════════════════════════════════════════════
// New card availability
// ═══════════════════════════════════════════════════════════════════════

function _computeNewCardAvailability(items) {
  var newByDeck = {};
  for (var i = 0; i < items.length; i++) {
    if (items[i].state !== constants.STATES.NEW) continue;
    var deckKey = (items[i].sourceRef.course || '') + '/' + (items[i].sourceRef.deckId || '');
    if (!newByDeck[deckKey]) newByDeck[deckKey] = { course: items[i].sourceRef.course, deckId: items[i].sourceRef.deckId, newCount: 0 };
    newByDeck[deckKey].newCount += 1;
  }
  return Object.keys(newByDeck).map(function (k) { return newByDeck[k]; });
}

// ═══════════════════════════════════════════════════════════════════════
// Priority with reasonCode
// ═══════════════════════════════════════════════════════════════════════

function _buildPriority(ctx) {
  var actions = [];

  // 1: Unfinished session
  if (ctx.hasUnfinishedSession) {
    actions.push({
      kind: 'resume_session', priority: 1, reasonCode: 'UNFINISHED_SESSION_EXISTS',
      label: '继续上次复习', sub: '还剩 ' + ctx.unfinishedSession.remainingItems + ' 张',
      course: ctx.unfinishedSession.course, deckId: ctx.unfinishedSession.deckId,
      count: ctx.unfinishedSession.remainingItems, evidenceLevel: 'session_state'
    });
  }

  // 2: Overdue
  if (ctx.overdueItems.length > 0) {
    actions.push({
      kind: 'overdue_review', priority: 2, reasonCode: 'ITEMS_OVERDUE',
      label: '优先复习', sub: ctx.overdueItems.length + ' 张已过期',
      count: ctx.overdueItems.length, evidenceLevel: 'sr_state'
    });
  }

  // 3: Due
  if (ctx.normalDueItems.length > 0) {
    actions.push({
      kind: 'due_review', priority: 3, reasonCode: 'ITEMS_DUE_TODAY',
      label: '今日复习', sub: ctx.normalDueItems.length + ' 张待复习',
      count: ctx.normalDueItems.length, evidenceLevel: 'sr_state'
    });
  }

  // 4: Consolidate learning/relearning
  var learningTotal = ctx.learningItems.length + ctx.relearningItems.length;
  if (learningTotal > 0 && actions.length === 0) {
    actions.push({
      kind: 'consolidate_learning', priority: 4, reasonCode: 'LEARNING_ITEMS_EXIST',
      label: '继续巩固', sub: learningTotal + ' 张学习中',
      count: learningTotal, evidenceLevel: 'sr_state'
    });
  }

  // 5: Weak focus (only if ledger-backed or strong state signals)
  for (var i = 0; i < Math.min(2, ctx.weakSignals.length); i++) {
    var ws = ctx.weakSignals[i];
    if (ws.weakScore < 10) continue;
    var kind = ws.evidenceLevel === 'ledger_backed' ? 'weak_focus' : 'weak_focus_state';
    var reasonCode = ws.evidenceLevel === 'ledger_backed'
      ? 'RECENT_DIFFICULTY_DETECTED'
      : 'NEEDS_CONSOLIDATION';
    var sub = ws.evidenceLevel === 'ledger_backed'
      ? _deckLabel(ws.deckId) + ' 近期出现 ' + ws.recentDifficultyCount + ' 次困难评分'
      : _deckLabel(ws.deckId) + ' 有 ' + (ws.relearningCount + ws.highLapseCount) + ' 张待巩固';
    actions.push({
      kind: kind, priority: 5 + i, reasonCode: reasonCode,
      label: '重点巩固', sub: sub,
      course: ws.course, deckId: ws.deckId,
      weakScore: ws.weakScore, evidenceLevel: ws.evidenceLevel
    });
  }

  // 6: New learning (only no due/overdue)
  if (ctx.newCardDecks.length > 0 && ctx.overdueItems.length === 0 && ctx.normalDueItems.length === 0) {
    var top = ctx.newCardDecks[0];
    actions.push({
      kind: 'new_learning', priority: 6, reasonCode: 'NEW_CARDS_AVAILABLE',
      label: '开始新学习', sub: '可学习新内容',
      course: top.course, deckId: top.deckId, evidenceLevel: 'sr_state'
    });
  }

  // Fallback: all done
  if (actions.length === 0) {
    actions.push({
      kind: 'all_done', priority: 99, reasonCode: 'NO_ACTIVE_ITEMS',
      label: '今天的复习已完成', sub: ctx.streak > 0 ? '连续 ' + ctx.streak + ' 天学习' : '可以休息或学习新内容',
      evidenceLevel: 'conclusive'
    });
  }

  return actions;
}

function _deckLabel(deckId) {
  var labels = { '01_aki': '令和元年秋期', '30_aki': '平成30年秋期', 'sg_29_haru': '平成29年春期' };
  return labels[deckId] || deckId;
}

module.exports = {
  getLearningRecommendation: getLearningRecommendation,
  _getUnfinishedSession: _getUnfinishedSession,
  _computeWeakSignals: _computeWeakSignals,
  _computeNewCardAvailability: _computeNewCardAvailability,
  _buildPriority: _buildPriority
};
