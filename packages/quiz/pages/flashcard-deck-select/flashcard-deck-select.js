// packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js
// Deck selection page: user picks a specific year/deck before entering flashcard-quiz.
'use strict';

var manifest = require('../../data/flashcard-manifest');

Page({
  data: {
    course: '',
    courseLabel: '',
    courseDesc: '',
    decks: [],
    isLoading: true,
    loadError: ''
  },

  onLoad: function (options) {
    var course = options.course || options.exam || 'itpass';
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';
    var courseDesc = course === 'sg' ? '情報セキュリティマネジメント' : 'IT パスポート試験';

    this.setData({
      course: course,
      courseLabel: courseLabel,
      courseDesc: courseDesc
    });

    this.loadDecks(course);
  },

  loadDecks: function (course) {
    var self = this;
    console.log('[flashcard-deck-select] loading decks for', course);

    try {
      var decks = manifest.getDecksForCourse(course);
      console.log('[flashcard-deck-select] found', decks.length, 'decks');

      if (!decks || decks.length === 0) {
        self.setData({
          isLoading: false,
          loadError: '暂无可用牌组'
        });
        return;
      }

      self.setData({
        decks: decks,
        isLoading: false,
        loadError: ''
      });
    } catch (e) {
      console.error('[flashcard-deck-select] error:', e);
      self.setData({
        isLoading: false,
        loadError: '加载牌组列表失败: ' + (e.message || '未知错误')
      });
    }
  },

  selectDeck: function (e) {
    var dataset = e.currentTarget.dataset || {};
    var yearId = dataset.yearId;
    var label = dataset.label || yearId || '年度模拟';
    var course = this.data.course;

    if (!yearId) {
      console.warn('[flashcard-deck-select] selectDeck: missing yearId');
      wx.showToast({ title: '牌组信息缺失', icon: 'none' });
      return;
    }

    console.log('[flashcard-deck-select] navigating to flashcard-quiz', {
      course: course,
      yearId: yearId,
      deckLabel: label
    });

    wx.navigateTo({
      url: '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=' + course + '&yearId=' + yearId + '&deckLabel=' + encodeURIComponent(label),
      fail: function (err) {
        console.error('[flashcard-deck-select] navigate failed:', err);
        wx.showToast({ title: '打开闪卡失败', icon: 'none' });
      }
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1,
      fail: function () {
        wx.switchTab({ url: '/pages/flashcards/flashcards' });
      }
    });
  }
});
