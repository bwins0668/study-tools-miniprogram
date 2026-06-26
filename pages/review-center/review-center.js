'use strict';

var sr = require('../../utils/spaced-repetition/index');

function deckLabel(deckId) {
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

Page({
  data: {
    dueCount: 0,
    todayCompleted: 0,
    groups: [],
    streak: 0,
    isEmpty: true,
    nextDueAt: null,
    nextReviewText: '',
    estimatedMinutes: 0,
    // Recovery session state
    recoverySession: null,
    recoveryCourseLabel: '',
    recoveryDeckLabel: '',
    recoveryProgress: '',
    recoveryExpired: false
  },

  onShow: function () {
    this.refresh();
  },

  refresh: function () {
    var summary = sr.review.getTodayReviewSummary();
    var totalMins = 0;
    (summary.groups || []).forEach(function (g) { totalMins += g.estimatedMinutes || 0; });

    // ── Check for interrupted session ──
    var recoveryData = null;
    var recoveryCourseLabel = '';
    var recoveryDeckLabel = '';
    var recoveryProgress = '';
    var recoveryExpired = false;
    try {
      var session = sr.review.getReviewSession();
      if (session && !session.completedAt) {
        if (session._expired) {
          recoveryExpired = true;
          recoveryData = session;
          recoveryCourseLabel = session.course === 'sg' ? 'SG' : 'IT Passport';
          recoveryDeckLabel = deckLabel(session.deckId) || session.deckId;
          recoveryProgress = session.completedItemIds.length + '/' + session.itemIds.length;
        } else {
          recoveryData = session;
          recoveryCourseLabel = session.course === 'sg' ? 'SG' : 'IT Passport';
          recoveryDeckLabel = deckLabel(session.deckId) || session.deckId;
          recoveryProgress = session.completedItemIds.length + '/' + session.itemIds.length;
        }
      }
    } catch (e) { console.warn('[review-center] recovery check failed:', e); }

    this.setData({
      dueCount: summary.dueCount,
      todayCompleted: summary.todayCompleted,
      groups: summary.groups || [],
      streak: summary.streak,
      isEmpty: summary.dueCount === 0 && !recoveryData,
      nextDueAt: summary.nextDueAt,
      nextReviewText: summary.dueCount === 0 ? sr.review.formatNextReview(summary.nextDueAt, Date.now()) : '',
      estimatedMinutes: totalMins,
      recoverySession: recoveryData,
      recoveryCourseLabel: recoveryCourseLabel,
      recoveryDeckLabel: recoveryDeckLabel,
      recoveryProgress: recoveryProgress,
      recoveryExpired: recoveryExpired
    });
  },

  startReview: function (event) {
    var dataset = event.currentTarget.dataset;
    var course = dataset.course;
    var deckId = dataset.deckId;
    if (!course || !deckId) return;

    var group = (this.data.groups || []).find(function (g) {
      return g.course === course && g.deckId === deckId;
    });
    if (!group || !group.count) return;

    var session = sr.review.createReviewSession(course, deckId, group.itemIds, '/pages/review-center/review-center');

    var playerRoute = sr.review.getPlayerRoute(course, deckId);
    if (!playerRoute) return;

    var playerUrl = playerRoute +
      '?deckId=' + encodeURIComponent(course + '/' + deckId) +
      '&backCourse=' + encodeURIComponent(course) +
      '&backPath=' + encodeURIComponent('/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + encodeURIComponent(course)) +
      '&mode=due' +
      '&reviewSessionId=' + encodeURIComponent(session.reviewSessionId);

    wx.navigateTo({ url: playerUrl });
  },

  resumeReview: function () {
    var session = this.data.recoverySession;
    if (!session) return;
    if (session._expired) {
      sr.review.clearReviewSession();
      this.refresh();
      return;
    }
    var playerRoute = sr.review.getPlayerRoute(session.course, session.deckId);
    if (!playerRoute) return;

    var resumeUrl = playerRoute +
      '?deckId=' + encodeURIComponent(session.course + '/' + session.deckId) +
      '&backCourse=' + encodeURIComponent(session.course) +
      '&backPath=' + encodeURIComponent('/pages/review-center/review-center') +
      '&mode=due' +
      '&reviewSessionId=' + encodeURIComponent(session.reviewSessionId);

    wx.navigateTo({ url: resumeUrl });
  },

  dismissRecovery: function () {
    sr.review.clearReviewSession();
    this.refresh();
  },

  goFlashcards: function () {
    wx.switchTab({ url: '/pages/flashcards/flashcards' });
  }
});
