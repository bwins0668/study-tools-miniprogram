// pages/term-detail/term-detail.js
var glossaryLoader = require('../../data/glossary_loader');
const {
  isFavoriteTerm,
  addFavoriteTerm,
  removeFavoriteTerm
} = require("../../../../utils/storage");

Page({
  data: {
    term: null,
    exampleText: '',
    isFavorite: false,
    // Round 3.23: 收藏操作反馈
    favoriteAction: ''
  },

  onLoad: function (options) {
    var id = options && options.id !== undefined ? String(options.id) : '';
    var found = glossaryLoader.getTermById(id);
    var exampleText = '';
    if (found) {
      if (typeof found.example === 'string') {
        exampleText = found.example;
      } else if (Array.isArray(found.examples)) {
        exampleText = found.examples.filter(function (item) {
          return typeof item === 'string' && item.trim();
        }).join('\n');
      }
    } else {
      wx.showToast({
        title: '术语不存在',
        icon: 'none'
      });
    }
    // id 已经是 'term-0001' 格式，直接用作 storage key
    var strId = String(id);
    this.setData({
      term: found,
      exampleText: exampleText,
      isFavorite: found ? isFavoriteTerm(strId) : false
    });
  },

  // Round 3.23: 返回术语搜索
  onBackToSearch: function () {
    wx.navigateBack({
      fail: function () {
        // 若无法返回（直接打开详情），跳转到术语表 tab
        wx.switchTab({
          url: '/pages/glossary/glossary'
        });
      }
    });
  },

  onFavorite: function () {
    var term = this.data.term;
    if (!term) return;

    var strId = String(term.id);

    if (this.data.isFavorite) {
      removeFavoriteTerm(strId);
      this.setData({ isFavorite: false, favoriteAction: 'removed' });
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      addFavoriteTerm(strId);
      this.setData({ isFavorite: true, favoriteAction: 'added' });
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 1500
      });
    }
  }
});
