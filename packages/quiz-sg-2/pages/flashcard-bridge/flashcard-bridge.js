'use strict';
var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
require('../../data/flashcard-export');
Page({
  onShow: function () {
    this._applyTheme();
  },
  data: {
    __themeDark: false,},
  onLoad: function (options) {
    this._applyTheme();
    console.log('[flashcard-bridge] sg-2 bridge loaded, data ready');
    var cache = app.globalData.__flashcard_cache || {};
    var key = 'sg-2';
    var questions = cache[key] || [];
    var eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.emit('flashcardDataReady', {
        packageKey: key,
        count: questions.length,
        success: true
      });
    }
            if (questions.length > 0) {
      try {
        var pages = getCurrentPages();
        if (pages && pages.length > 1) {
          wx.navigateBack({ delta: 1 });
        }
      } catch (e) {
        console.error('[flashcard-bridge] navigation error:', e);
      }
    };
  }
,

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
});


