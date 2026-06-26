'use strict';

/**
 * Adaptive Learning Engine — explainable, testable, rule-based.
 *
 * Provides daily study recommendations, weak-item signals, pacing,
 * and session-awareness without breaking existing SR scheduling.
 */

var constants = require('./constants');
var schema = require('./schema');
var storage = require('./storage');
var scheduler = require('./scheduler');
var summary = require('./summary');
var identity = require('./identity');

// ═══════════════════════════════════════════════════════════════════════
// Recommendation state
// ═══════════════════════════════════════════════════════════════════════

function getLearningRecommendation() {
  var now = Date.now();
  var wxAdapter = storage.createWxStorageAdapter(wx);
  var loadResult = storage.loadSpacedRepetitionState(wxAdapter, now, 0);
  var state = loadResult.state || schema.createEmptyState(now);
  var items = schema.getItemsArray(state);

  // ── 1. Unfinished session ──────────────────────────────────────
  var unfinishedSession = _getUnfinishedSession();
  var hasUnfinishedSession = !!unfinishedSession;

  // ── 2. Due items ───────────────────────────────────────────────
  var dueItems = scheduler.getDueItems(items, now);
  var overdueItems = [];
  var normalDueItems = [];
  for (var i = 0; i < dueItems.length; i++) {
    if (dueItems[i].dueAt < now) overdueItems.push(dueItems[i]);
    else normalDueItems.push(dueItems[i]);
  }

  // ── 3. Learning / relearning items ────────────────────────────
  var learningItems = [];
  var relearningItems = [];
  for (var j = 0; j < items.length; j++) {
    if (items[j].state === constants.STATES.LEARNING) learningItems.push(items[j]);
    if (items[j].state === constants.STATES.RELEARNING) relearningItems.push(items[j]);
  }

  // ── 4. Weak-item signals ─────────────────────────────────────
  var weakSignals = _computeWeakSignals(items, now, 14);

  // ── 5. New card availability ─────────────────────────────────
  var newCardDecks = _computeNewCardAvailability(items, state, now);

  // ── 6. Today's stats ─────────────────────────────────────────
  var dayKey = _dayKey(now);
  var todayRecord = summary.dailyRecord(state.daily, dayKey);
  var todayCompleted = todayRecord.completed;
  var streak = summary.calculateStreak(state.daily, now, 0);

  // ── 7. Build priority-ordered recommendation ──────────────────
  var priority = _buildPriority({
    hasUnfinishedSession: hasUnfinishedSession,
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
    stats: {
      dueCount: dueItems.length,
      overdueCount: overdueItems.length,
      learningCount: learningItems.length,
      relearningCount: relearningItems.length,
      todayCompleted: todayCompleted,
      streak: streak,
      totalItems: items.length,
      weakDeckCount: weakSignals.length
    },
    hasUnfinishedSession: hasUnfinishedSession,
    weakSignals: weakSignals,
    newCardDecks: newCardDecks
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Unfinished session detection
// ═══════════════════════════════════════════════════════════════════════

function _getUnfinishedSession() {
  try {
    var raw = wx.getStorageSync('study_tools_review_session_v1');
    if (!raw || !raw.reviewSessionId) return null;
    if (raw.completedAt) return null;  // already done
    var remaining = (raw.itemIds || []).length - (raw.completedItemIds || []).length;
    if (remaining <= 0) return null;
    return {
      reviewSessionId: raw.reviewSessionId,
      course: raw.course,
      deckId: raw.deckId,
      totalItems: (raw.itemIds || []).length,
      remainingItems: remaining,
      createdAt: raw.createdAt,
      backPath: raw.backPath
    };
  } catch (e) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Weak-item signals (explainable rules)
// ═══════════════════════════════════════════════════════════════════════

function _computeWeakSignals(items, now, lookbackDays) {
  var cutoff = now - lookbackDays * constants.DAY_MS;
  var deckSignals = {};

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.state === constants.STATES.SUSPENDED || item.state === constants.STATES.NEW) continue;
    if (!item.sourceRef || !item.sourceRef.course || !item.sourceRef.deckId) continue;

    var deckKey = item.sourceRef.course + '/' + item.sourceRef.deckId;
    if (!deckSignals[deckKey]) {
      deckSignals[deckKey] = {
        course: item.sourceRef.course,
        deckId: item.sourceRef.deckId,
        totalSRItems: 0,
        relearningCount: 0,
        highLapseCount: 0,
        recentAgainCount: 0,
        weakScore: 0
      };
    }
    var ds = deckSignals[deckKey];
    ds.totalSRItems += 1;

    if (item.state === constants.STATES.RELEARNING) ds.relearningCount += 1;
    if ((item.lapses || 0) >= 3) ds.highLapseCount += 1;

    // Recent AGAIN/HARD in review log
    if (item.lastReviewAt && item.lastReviewAt >= cutoff) {
      if (item.lastGrade === constants.GRADES.AGAIN || item.lastGrade === constants.GRADES.HARD) {
        ds.recentAgainCount += 1;
      }
    }
  }

  // Compute weak score per deck
  var signals = [];
  Object.keys(deckSignals).forEach(function (key) {
    var ds = deckSignals[key];
    if (ds.totalSRItems === 0) return;
    var score = 0;
    if (ds.relearningCount > 0) score += ds.relearningCount * 3;
    if (ds.highLapseCount > 0) score += ds.highLapseCount * 2;
    if (ds.recentAgainCount > 0) score += ds.recentAgainCount * 1;

    // Normalize by deck size (0-100)
    var normalized = Math.min(100, Math.round(score / Math.max(1, ds.totalSRItems) * 100));
    ds.weakScore = normalized;

    if (normalized >= 5) {  // Only report meaningful weakness
      signals.push(ds);
    }
  });

  signals.sort(function (a, b) { return b.weakScore - a.weakScore; });
  return signals.slice(0, 5);  // Top 5
}

// ═══════════════════════════════════════════════════════════════════════
// New card availability
// ═══════════════════════════════════════════════════════════════════════

function _computeNewCardAvailability(items, state, now) {
  // We can't know all cards without the deck manifest, but we can
  // check which of the known SR items are still NEW (unstudied).
  var newByDeck = {};
  for (var i = 0; i < items.length; i++) {
    if (items[i].state !== constants.STATES.NEW) continue;
    var deckKey = (items[i].sourceRef.course || '') + '/' + (items[i].sourceRef.deckId || '');
    if (!newByDeck[deckKey]) newByDeck[deckKey] = { course: items[i].sourceRef.course, deckId: items[i].sourceRef.deckId, newCount: 0 };
    newByDeck[deckKey].newCount += 1;
  }
  var result = Object.keys(newByDeck).map(function (k) { return newByDeck[k]; });
  result.sort(function (a, b) { return b.newCount - a.newCount; });
  return result;
}

// ═══════════════════════════════════════════════════════════════════════
// Priority builder
// ═══════════════════════════════════════════════════════════════════════

function _buildPriority(ctx) {
  var actions = [];

  // Priority 1: Unfinished session
  if (ctx.hasUnfinishedSession && ctx.unfinishedSession) {
    actions.push({
      type: 'resume_session',
      priority: 1,
      label: '继续上次复习',
      subtitle: '还剩 ' + ctx.unfinishedSession.remainingItems + ' 张',
      deckId: ctx.unfinishedSession.deckId,
      course: ctx.unfinishedSession.course,
      sessionId: ctx.unfinishedSession.reviewSessionId
    });
  }

  // Priority 2: Overdue review
  if (ctx.overdueItems.length > 0) {
    actions.push({
      type: 'overdue_review',
      priority: 2,
      label: '优先复习',
      subtitle: ctx.overdueItems.length + ' 张已过期',
      count: ctx.overdueItems.length
    });
  }

  // Priority 3: Normal due review
  if (ctx.normalDueItems.length > 0) {
    actions.push({
      type: 'due_review',
      priority: 3,
      label: '今日复习',
      subtitle: ctx.normalDueItems.length + ' 张待复习',
      count: ctx.normalDueItems.length
    });
  }

  // Priority 4: Learning / relearning consolidation
  var learningTotal = ctx.learningItems.length + ctx.relearningItems.length;
  if (learningTotal > 0 && actions.length === 0) {
    actions.push({
      type: 'consolidate',
      priority: 4,
      label: '继续巩固',
      subtitle: learningTotal + ' 张学习中',
      count: learningTotal
    });
  }

  // Priority 5: Weak deck focus
  if (ctx.weakSignals.length > 0) {
    for (var i = 0; i < Math.min(2, ctx.weakSignals.length); i++) {
      var ws = ctx.weakSignals[i];
      if (ws.weakScore >= 10) {
        actions.push({
          type: 'weak_focus',
          priority: 5 + i,
          label: '重点巩固',
          subtitle: _deckLabel(ws.deckId) + ' 有较多待巩固内容',
          course: ws.course,
          deckId: ws.deckId,
          weakScore: ws.weakScore
        });
      }
    }
  }

  // Priority 6: New card suggestion (only when no due/overdue)
  if (ctx.newCardDecks.length > 0 && ctx.normalDueItems.length === 0 && ctx.overdueItems.length === 0) {
    var top = ctx.newCardDecks[0];
    actions.push({
      type: 'new_learning',
      priority: 6,
      label: '开始新学习',
      subtitle: top.newCount + ' 张新卡可学习',
      course: top.course,
      deckId: top.deckId
    });
  }

  // Fallback: All done
  if (actions.length === 0) {
    actions.push({
      type: 'all_done',
      priority: 99,
      label: '今天的复习已完成',
      subtitle: ctx.streak > 0 ? '连续 ' + ctx.streak + ' 天学习' : '可以休息或学习新内容'
    });
  }

  return actions;
}

function _deckLabel(deckId) {
  var labels = {
    '01_aki': '令和元年秋期', '02_aki': '令和2年秋期', '03_haru': '令和3年',
    '28_haru': '平成28年春期', '30_aki': '平成30年秋期',
    'sg_01_aki': '令和元年秋期', 'sg_29_haru': '平成29年春期'
  };
  return labels[deckId] || deckId;
}

function _dayKey(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ═══════════════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  getLearningRecommendation: getLearningRecommendation,
  _getUnfinishedSession: _getUnfinishedSession,
  _computeWeakSignals: _computeWeakSignals,
  _computeNewCardAvailability: _computeNewCardAvailability,
  _buildPriority: _buildPriority
};
