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
    if (typeof wx.loadSubPackage !== 'function') {
      console.warn('[flashcard-deck-select] wx.loadSubPackage missing — installing shim (preloadRule handles actual loading)');
      wx.loadSubPackage = function (opts) {
        var name = opts && opts.name ? opts.name : '';
        console.log('[flashcard-deck-select] loadSubPackage shim called for:', name);
        setTimeout(function () {
          if (opts && typeof opts.success === 'function') opts.success();
        }, 50);
      };
    }

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
    try {
      // VISIBLE MARKER: toggle a data field so automation can confirm event fired
      this.setData({ _lastTap: Date.now() });

      console.log('[deck-nav:tap]', JSON.stringify({
        eventType: e && e.type,
        hasCurrentTarget: !!e.currentTarget,
        hasTarget: !!e.target,
        currentTargetTag: e && e.currentTarget ? e.currentTarget.tagName : 'N/A',
        currentTargetId: e && e.currentTarget ? e.currentTarget.id : 'N/A',
        fullDataset: e && e.currentTarget ? e.currentTarget.dataset : null,
      }));

      var dataset = (e && e.currentTarget && e.currentTarget.dataset) || {};
      var yearId = dataset.yearId;
      var label = dataset.label || yearId || '年度模拟';
      var course = this.data.course;

      console.log('[deck-nav:parsed]', JSON.stringify({
        yearId: yearId,
        yearIdType: typeof yearId,
        label: label,
        course: course,
        courseEmpty: !course,
        decksCount: this.data.decks ? this.data.decks.length : 0
      }));

      if (!course) {
        console.warn('[deck-nav:blocked] reason=course_empty', JSON.stringify({ course: course }));
        wx.showToast({ title: '课程信息缺失', icon: 'none' });
        return;
      }

      if (!yearId) {
        console.warn('[deck-nav:blocked] reason=yearId_empty', JSON.stringify({ yearId: yearId, dataset: dataset }));
        wx.showToast({ title: '牌组信息缺失', icon: 'none' });
        return;
      }

      var navUrl = '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=' + encodeURIComponent(course) + '&yearId=' + encodeURIComponent(yearId) + '&deckLabel=' + encodeURIComponent(label);
      console.log('[deck-nav:url]', navUrl);
      console.log('[deck-nav:calling-navigateTo]', navUrl);

      // Navigate to flashcard-quiz (redirectTo replaces deck-select in stack)
      console.log('[deck-nav:redirect-to-quiz]', navUrl);
      wx.redirectTo({
        url: navUrl,
        success: function (res) {
          console.log('[deck-nav:redirect-success]', JSON.stringify({ errMsg: res && res.errMsg }));
        },
        fail: function (err) {
          console.error('[deck-nav:redirect-fail]', JSON.stringify({ errMsg: err && err.errMsg }));
        },
        complete: function (res) {
          console.log('[deck-nav:redirect-complete]', JSON.stringify({ errMsg: res && res.errMsg }));
        }
      });
    } catch (ex) {
      console.error('[deck-nav:exception]', ex && ex.message, ex && ex.stack);
      this.setData({ _error: ex && ex.message });
    }
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
