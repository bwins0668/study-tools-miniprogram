'use strict';

var constants = require('./constants');
var identity = require('./identity');
var schema = require('./schema');
var scheduler = require('./scheduler');
var storage = require('./storage');
var summary = require('./summary');

// ═══════════════════════════════════════════════════════════════════════
// Review sessions (persistent, not globalData)
// ═══════════════════════════════════════════════════════════════════════

var SESSION_KEY = 'study_tools_review_session_v1';
var SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// ── Player route lookup (avoids cross-package require) ─────────────
var PLAYER_ROUTES = {
  'itpass-1': '/packages/quiz-itpass-1/pages/flashcard-player/flashcard-player',
  'itpass-2': '/packages/quiz-itpass-2/pages/flashcard-player/flashcard-player',
  'itpass-3': '/packages/quiz-itpass-3/pages/flashcard-player/flashcard-player',
  'itpass-4': '/packages/quiz-itpass-4/pages/flashcard-player/flashcard-player',
  'itpass-5': '/packages/quiz-itpass-5/pages/flashcard-player/flashcard-player',
  'sg-1': '/packages/quiz-sg-1/pages/flashcard-player/flashcard-player',
  'sg-2': '/packages/quiz-sg-2/pages/flashcard-player/flashcard-player'
};

var PACKAGE_MAP = {
  'itpass/01_aki': 'itpass-1', 'itpass/02_aki': 'itpass-1', 'itpass/03_haru': 'itpass-1',
  'itpass/04_haru': 'itpass-2', 'itpass/05_haru': 'itpass-2', 'itpass/06_haru': 'itpass-2',
  'itpass/07_haru': 'itpass-3', 'itpass/08_haru': 'itpass-3', 'itpass/28_aki': 'itpass-3',
  'itpass/28_haru': 'itpass-4', 'itpass/29_aki': 'itpass-4', 'itpass/29_haru': 'itpass-4',
  'itpass/30_aki': 'itpass-5', 'itpass/30_haru': 'itpass-5', 'itpass/31_haru': 'itpass-5',
  'sg/sg_01_aki': 'sg-1', 'sg/sg_05_haru': 'sg-1', 'sg/sg_06_haru': 'sg-1', 'sg/sg_07_haru': 'sg-1', 'sg/sg_28_aki': 'sg-1',
  'sg/sg_28_haru': 'sg-2', 'sg/sg_29_aki': 'sg-2', 'sg/sg_29_haru': 'sg-2',
  'sg/sg_30_aki': 'sg-2', 'sg/sg_30_haru': 'sg-2', 'sg/sg_31_haru': 'sg-2'
};

function getPlayerRoute(course, deckId) {
  var pkgKey = PACKAGE_MAP[deckId] || PACKAGE_MAP[course + '/' + deckId] || null;
  return pkgKey ? PLAYER_ROUTES[pkgKey] : null;
}

function _getStorage() {
  try { return wx.getStorageSync || null; } catch(e) { return null; }
}

function _readStorage(key) {
  try { return wx.getStorageSync(key); } catch(e) { return null; }
}

function _writeStorage(key, value) {
  try { wx.setStorageSync(key, value); return true; } catch(e) { return false; }
}

function createReviewSession(course, deckId, itemIds, backPath) {
  var now = Date.now();
  var session = {
    reviewSessionId: 'rs-' + identity.shortId(),
    course: course,
    deckId: deckId,
    itemIds: itemIds || [],
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    backPath: backPath || '/pages/review-center/review-center',
    mode: 'due',
    completedAt: null,
    completedItemIds: []
  };
  _writeStorage(SESSION_KEY, session);
  return session;
}

function getReviewSession() {
  var session = _readStorage(SESSION_KEY);
  if (!session || !session.reviewSessionId) return null;
  if (Date.now() > session.expiresAt && !session.completedAt) {
    // Expired — mark it but still return for display
    session._expired = true;
  }
  return session;
}

function completeReviewSessionItem(itemId) {
  var session = getReviewSession();
  if (!session) return null;
  if (session.completedItemIds.indexOf(itemId) < 0) {
    session.completedItemIds.push(itemId);
  }
  var remaining = session.itemIds.length - session.completedItemIds.length;
  if (remaining <= 0) {
    session.completedAt = Date.now();
  }
  _writeStorage(SESSION_KEY, session);
  return session;
}

function clearReviewSession() {
  try { wx.removeStorageSync(SESSION_KEY); } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════════
// Review decision recording
// ═══════════════════════════════════════════════════════════════════════

function recordReviewDecision(sourceRef, grade, now, reviewSessionId, actionId) {
  if (!sourceRef || !sourceRef.questionId || !sourceRef.course || !sourceRef.deckId) {
    return { accepted: false, reason: 'INVALID_SOURCE_REF', item: null };
  }
  if (!constants.GRADES[grade]) {
    return { accepted: false, reason: 'INVALID_GRADE', item: null };
  }

  var memoryIdentity = identity.createMemoryIdentity('exam', sourceRef);
  if (!memoryIdentity.ok) return { accepted: false, reason: 'IDENTITY_FAILED', item: null };

  var nowTs = schema.safeTimestamp(now, Date.now());
  var wxAdapter = storage.createWxStorageAdapter(wx);
  var loadResult = storage.loadSpacedRepetitionState(wxAdapter, nowTs, 0);

  var state = loadResult.state || schema.createEmptyState(nowTs);
  var existingItem = state.items[memoryIdentity.memoryItemId];

  // Idempotency: check if this exact event was already processed
  var eventId = identity.buildEventId('exam', sourceRef.course, sourceRef.deckId, sourceRef.questionId, grade, nowTs);
  var dedupKey = eventId + '|' + (reviewSessionId || 'nosession');
  if (state.processedEventIds && state.processedEventIds[dedupKey]) {
    return { accepted: false, reason: 'DUPLICATE_EVENT', item: existingItem || null };
  }

  var item;
  if (!existingItem) {
    item = schema.createMemoryItem(memoryIdentity, nowTs, {});
    item = scheduler.activateItem(item, nowTs).item;
    if (!item) return { accepted: false, reason: 'ACTIVATE_FAILED', item: null };
  } else {
    item = schema.clone(existingItem);
  }

  var result = scheduler.applyGrade(item, grade, nowTs);
  if (!result.accepted) return { accepted: false, reason: 'GRADE_FAILED', item: item };
  item = result.item;
  if (actionId) { item.appliedActionId = actionId; }

  // ── Durable applied action journal (survives subsequent actions on same card) ──
  if (actionId) {
    if (!state.appliedActions) state.appliedActions = {};
    state.appliedActions[actionId] = {
      actionId: actionId,
      memoryItemId: item.memoryItemId,
      deckId: sourceRef.deckId,
      cardId: sourceRef.questionId,
      sessionId: reviewSessionId || null,
      grade: grade,
      localDayKey: ledger ? ledger.localDayKey(nowTs) : localDayKey(nowTs),
      appliedAt: nowTs
    };
    // Keep max 500 entries
    var keys = Object.keys(state.appliedActions);
    if (keys.length > 500) {
      var trimmed = {};
      keys.slice(keys.length - 500).forEach(function(k) { trimmed[k] = state.appliedActions[k]; });
      state.appliedActions = trimmed;
    }
  }

  state.items[item.memoryItemId] = item;
  if (!state.processedEventIds) state.processedEventIds = {};
  state.processedEventIds[dedupKey] = nowTs;
  state.updatedAt = nowTs;

  // Append review log entry
  if (!Array.isArray(state.reviewLog)) state.reviewLog = [];
  state.reviewLog.push({
    eventId: eventId,
    memoryItemId: item.memoryItemId,
    grade: grade,
    occurredAt: nowTs,
    stateAfter: item.state,
    stepIndexAfter: item.stepIndex,
    dueAtAfter: item.dueAt,
    reviewSessionId: reviewSessionId || null
  });

  // Trim log if needed
  if (state.reviewLog.length > constants.REVIEW_LOG_MAX_ENTRIES) {
    state.reviewLog = state.reviewLog.slice(state.reviewLog.length - constants.REVIEW_LOG_MAX_ENTRIES);
  }

  // Update daily stats
  var dayKey = _dayKey(nowTs);
  if (!state.daily) state.daily = {};
  if (!state.daily[dayKey]) {
    state.daily[dayKey] = { day: dayKey, completed: 0, newCount: 0, updatedAt: nowTs };
  }
  state.daily[dayKey].completed += 1;
  state.daily[dayKey].updatedAt = nowTs;

  var derivedSummary = summary.deriveSummary(state, nowTs, 0);
  storage.saveSpacedRepetitionState(wxAdapter, state, nowTs, 0);

  return {
    accepted: true,
    item: item,
    summary: derivedSummary,
    eventId: eventId
  };
}

function _dayKey(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ═══════════════════════════════════════════════════════════════════════
// Due queue & summary
// ═══════════════════════════════════════════════════════════════════════

function getTodayReviewSummary() {
  var nowTs = Date.now();
  var wxAdapter = storage.createWxStorageAdapter(wx);
  var loadResult = storage.loadSpacedRepetitionState(wxAdapter, nowTs, 0);
  var state = loadResult.state || schema.createEmptyState(nowTs);
  var items = schema.getItemsArray(state);
  var dueItems = scheduler.getDueItems(items, nowTs);

  var dayKey = _dayKey(nowTs);
  var todayCompleted = (state.daily && state.daily[dayKey]) ? state.daily[dayKey].completed : 0;

  // Group by course → deckId
  var groups = {};
  for (var i = 0; i < dueItems.length; i++) {
    var item = dueItems[i];
    if (!item.sourceRef || item.state === constants.STATES.SUSPENDED) continue;
    var course = item.sourceRef.course || 'unknown';
    var deckId = item.sourceRef.deckId || 'unknown';
    if (!groups[course]) groups[course] = {};
    if (!groups[course][deckId]) groups[course][deckId] = [];
    groups[course][deckId].push(item);
  }

  // Convert to array
  var groupList = [];
  Object.keys(groups).sort().forEach(function (course) {
    Object.keys(groups[course]).sort().forEach(function (deckId) {
      groupList.push({
        course: course,
        courseLabel: course === 'sg' ? 'SG' : 'IT Passport',
        deckId: deckId,
        deckLabel: _deckLabel(deckId),
        itemIds: groups[course][deckId].map(function (it) { return it.memoryItemId; }),
        count: groups[course][deckId].length,
        estimatedMinutes: Math.ceil(groups[course][deckId].length * 0.5) // ~30s per card
      });
    });
  });

  return {
    dueCount: dueItems.length,
    todayCompleted: todayCompleted,
    groups: groupList,
    streak: summary.calculateStreak(state.daily, nowTs, 0),
    nextDueAt: dueItems.length > 0 ? dueItems[0].dueAt : null
  };
}

function _deckLabel(deckId) {
  var labels = {
    '01_aki': '令和元年秋期', '02_aki': '令和2年秋期', '03_haru': '令和3年',
    '04_haru': '令和4年', '05_haru': '令和5年', '06_haru': '令和6年',
    '07_haru': '令和7年', '08_haru': '令和8年',
    '28_aki': '平成28年秋期', '28_haru': '平成28年春期',
    '29_aki': '平成29年秋期', '29_haru': '平成29年春期',
    '30_aki': '平成30年秋期', '30_haru': '平成30年春期', '31_haru': '平成31年春期',
    'sg_01_aki': '令和元年秋期', 'sg_05_haru': '令和5年', 'sg_06_haru': '令和6年',
    'sg_07_haru': '令和7年', 'sg_28_aki': '平成28年秋期', 'sg_28_haru': '平成28年春期',
    'sg_29_aki': '平成29年秋期', 'sg_29_haru': '平成29年春期',
    'sg_30_aki': '平成30年秋期', 'sg_30_haru': '平成30年春期', 'sg_31_haru': '平成31年春期'
  };
  return labels[deckId] || deckId;
}

function formatNextReview(dueAt, now) {
  if (!schema.isFiniteTimestamp(dueAt)) return '暂无计划';
  var nowTs = now || Date.now();
  if (dueAt <= nowTs) return '现在';
  var diff = dueAt - nowTs;
  if (diff < 60 * 1000) return '不到1分钟';
  if (diff < 60 * 60 * 1000) return Math.ceil(diff / 60 / 1000) + '分钟后';
  if (diff < 24 * 60 * 60 * 1000) {
    var h = Math.ceil(diff / 60 / 60 / 1000);
    return h + '小时后';
  }
  var d = Math.ceil(diff / 24 / 60 / 60 / 1000);
  if (d === 1) return '明天';
  if (d <= 7) return d + '天后';
  return Math.ceil(d / 7) + '周后';
}

function formatStage(item) {
  if (!item) return '';
  if (item.state === constants.STATES.LEARNING || item.state === constants.STATES.RELEARNING) return '初学';
  var idx = Math.max(0, item.stepIndex || 0);
  return '第 ' + (idx + 1) + ' 次巩固';
}

// ═══════════════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  createReviewSession: createReviewSession,
  getReviewSession: getReviewSession,
  completeReviewSessionItem: completeReviewSessionItem,
  clearReviewSession: clearReviewSession,
  recordReviewDecision: recordReviewDecision,
  getTodayReviewSummary: getTodayReviewSummary,
  formatNextReview: formatNextReview,
  formatStage: formatStage,
  getPlayerRoute: getPlayerRoute
};
