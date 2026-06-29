// pages/glossary/glossary.js - 术语 tab 轻入口
var storage = require("../../utils/storage");
var nav = require("../../utils/navigation");

Page({
  onLoad: function (options) {
    this._applyTheme();
    this._applyTheme();
  },
  data: {
    __themeDark: false,
    __themeDark: false,
    favoriteCount: 0
  },

  onShow: function () {
    this._applyTheme();
    this._applyTheme();
    var count = storage.getFavoriteTermCount ? storage.getFavoriteTermCount() : 0;
    this.setData({ favoriteCount: count });
  },

  goToGlossarySearch: function () {
    nav.goTermSearch();
  },

  goToFavoriteReview: function () {
    nav.goFavoriteReview();
  },

  goToAnkiPlayer: function () {
    nav.goGlossaryAnkiReview();
  },

  // R3.54 随机术语：跳转到术语搜索页，并触发随机筛选
  goToRandomTerm: function () {
    nav.goGlossaryRandomTerm();
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
