'use strict';
var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
require('../../data/flashcard-export');
Page({
  data: {},
  onLoad: function(options) {
    console.log('[flashcard-bridge] itpass-5 bridge loaded, data ready');
    var cache = app.globalData.__flashcard_cache || {};
    var key = 'itpass-5';
    var questions = cache[key] || [];
    var eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.emit('flashcardDataReady', {
        packageKey: key,
        count: questions.length,
        success: true
      });
    }
    wx.navigateBack({ delta: 1 });
  }
});
