// pages/mistakes/mistakes.js - 错题 tab 轻入口
var mistakesState = require("../../utils/mistakes-state");
var nav = require("../../utils/navigation");

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
    var state = mistakesState.getMistakesLandingState();
    this.setData(state);
  },

  goToMistakesList: function () {
    nav.goMistakes();
  },

  goToAnkiMistakes: function () {
    nav.goMistakesAnkiReview();
  },

  goStudy: function () {
    nav.goItPassport();
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
