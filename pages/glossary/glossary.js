// pages/glossary/glossary.js - 术语 tab 轻入口
var storage = require("../../utils/storage");

Page({
  data: {
    favoriteCount: 0
  },

  onShow: function () {
    var count = storage.getFavoriteTermCount ? storage.getFavoriteTermCount() : 0;
    this.setData({ favoriteCount: count });
  },

  goToGlossarySearch: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/term-search/term-search'
    });
  },

  goToFavoriteReview: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/favorite-review/favorite-review'
    });
  }
});
