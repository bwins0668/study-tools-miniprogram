'use strict';
var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
require('../../data/flashcard-export');
Page({
  data: {},
  onLoad: function(options) {
    console.log('[flashcard-bridge] itpass-1 bridge loaded, data ready');
    var cache = app.globalData.__flashcard_cache || {};
    var key = 'itpass-1';
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
});


