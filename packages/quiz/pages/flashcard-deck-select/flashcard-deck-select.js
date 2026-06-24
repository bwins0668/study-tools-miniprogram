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
      this.setData({ _lastTap: Date.now() });

      var dataset = (e && e.currentTarget && e.currentTarget.dataset) || {};
      var yearId = dataset.yearId;
      var label = dataset.label || yearId || '年度模拟';
      var course = this.data.course;

      console.log('[deck-nav:selectDeck] course=' + course + ' yearId=' + yearId + ' label=' + label);

      if (!course) {
        wx.showToast({ title: '课程信息缺失', icon: 'none' });
        return;
      }

      if (!yearId) {
        wx.showToast({ title: '牌组信息缺失', icon: 'none' });
        return;
      }

      var deckInfo = manifest.getDeckInfo(course, yearId);
      if (!deckInfo) {
        console.error('[deck-nav] getDeckInfo failed for', course, yearId);
        wx.showToast({ title: '找不到牌组信息', icon: 'none' });
        return;
      }

      var deckId = course + '/' + yearId;
      var backPath = '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + encodeURIComponent(course);
      var playerUrl = deckInfo.playerRoute + '?deckId=' + encodeURIComponent(deckId) + '&backCourse=' + encodeURIComponent(course) + '&backPath=' + encodeURIComponent(backPath);

      console.log('[deck-nav] navigating to player:', playerUrl);

      wx.showLoading({ title: '加载牌组...' });
      wx.loadSubPackage({
        name: deckInfo.packageName,
        success: function () {
          wx.hideLoading();
          wx.navigateTo({
            url: playerUrl,
            fail: function (err) {
              console.error('[deck-nav] navigate to player failed:', err);
              wx.showToast({ title: '闪卡启动失败', icon: 'none' });
            }
          });
        },
        fail: function (err) {
          wx.hideLoading();
          console.error('[deck-nav] loadSubPackage failed:', deckInfo.packageName, err);
          wx.showToast({ title: '牌组加载失败', icon: 'none' });
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
