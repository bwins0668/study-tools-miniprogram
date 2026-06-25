'use strict';

var sr = require('../../utils/spaced-repetition/index');

Page({
  data: {
    dueCount: 0,
    todayCompleted: 0,
    groups: [],
    streak: 0,
    isEmpty: true,
    nextDueAt: null,
    nextReviewText: '',
    estimatedMinutes: 0
  },

  onShow: function () {
    this.refresh();
  },

  refresh: function () {
    var summary = sr.review.getTodayReviewSummary();
    var totalMins = 0;
    (summary.groups || []).forEach(function (g) { totalMins += g.estimatedMinutes || 0; });

    this.setData({
      dueCount: summary.dueCount,
      todayCompleted: summary.todayCompleted,
      groups: summary.groups || [],
      streak: summary.streak,
      isEmpty: summary.dueCount === 0,
      nextDueAt: summary.nextDueAt,
      nextReviewText: summary.dueCount === 0 ? sr.review.formatNextReview(summary.nextDueAt, Date.now()) : '',
      estimatedMinutes: totalMins
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

  goFlashcards: function () {
    wx.switchTab({ url: '/pages/flashcards/flashcards' });
  }
});
