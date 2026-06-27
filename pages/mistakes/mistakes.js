// pages/mistakes/mistakes.js - 错题 tab 轻入口
var storage = require("../../utils/storage");

/**
 * 格式化时间戳为简单日期（用于"最近错误时间"）
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  var d = new Date(timestamp);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  return month + '月' + day + '日';
}

Page({
  onLoad: function (options) {
    this._applyTheme();
    this._applyTheme();
  },
  data: {
    __themeDark: false,
    __themeDark: false,
    wrongCount: 0,
    itpassCount: 0,
    sgCount: 0,
    lastWrongTime: ''
  },

  onShow: function () {
    this._applyTheme();
    this._applyTheme();
    var count = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0;
    var stats = storage.getWrongQuestionStats ? storage.getWrongQuestionStats() : { itpass: 0, sg: 0 };
    var lastTime = storage.getLastWrongTime ? storage.getLastWrongTime() : null;
    this.setData({
      wrongCount: count,
      itpassCount: stats.itpass || 0,
      sgCount: stats.sg || 0,
      lastWrongTime: lastTime ? formatDate(lastTime) : ''
    });
  },

  goToMistakesList: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goToAnkiMistakes: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/anki-player/anki-player?source=mistakes&from=mistakes'
    });
  },

  goStudy: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass'
    });
  }
,

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
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
