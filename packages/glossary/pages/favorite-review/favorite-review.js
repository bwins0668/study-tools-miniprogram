// packages/glossary/pages/favorite-review/favorite-review.js
// 收藏术语复习模式
var glossaryIndex = require('../../data/glossary_index').glossaryIndex;
var glossaryLoader = require('../../data/glossary_loader');
var storage = require("../../../../utils/storage");

function extractFavoriteId(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }
  if (item && typeof item === 'object' && item.id !== undefined && item.id !== null && item.id !== '') {
    return item.id;
  }
  return '';
}

function getExampleText(term) {
  if (!term || typeof term !== 'object') {
    return '';
  }

  if (typeof term.example === 'string' && term.example.trim()) {
    return term.example;
  }

  if (!Array.isArray(term.examples)) {
    return '';
  }

  var safeExamples = [];
  for (var i = 0; i < term.examples.length; i++) {
    if (typeof term.examples[i] === 'string' && term.examples[i].trim()) {
      safeExamples.push(term.examples[i]);
    }
  }

  return safeExamples.join('\n');
}

Page({
  data: {
    favorites: [],
    currentIndex: 0,
    currentTerm: null,
    detail: null,
    exampleText: '',
    showExplanation: false,
    hasFavorites: false,
    totalCount: 0,
    isFirstItem: true,
    isLastItem: false,
    nextBtnText: '下一个'
  },

  onShow: function () {
    this.loadFavorites();
  },

  loadFavorites: function () {
    var favoriteItems = storage.getFavoriteTerms();
    var allGlossary = glossaryIndex;
    var matched = [];
    var glossaryById = {};
    var seenIds = {};

    if (!Array.isArray(favoriteItems)) {
      favoriteItems = [];
    }
    if (!Array.isArray(allGlossary)) {
      allGlossary = [];
    }

    for (var g = 0; g < allGlossary.length; g++) {
      if (allGlossary[g] && allGlossary[g].id) {
        glossaryById[allGlossary[g].id] = allGlossary[g];
      }
    }

    for (var i = 0; i < favoriteItems.length; i++) {
      var favId = extractFavoriteId(favoriteItems[i]);
      if (!favId || !glossaryById[favId] || seenIds[favId]) {
        continue;
      }
      matched.push(glossaryById[favId]);
      seenIds[favId] = true;
    }

    if (matched.length > 0) {
      this.setData({
        favorites: matched,
        currentIndex: 0,
        currentTerm: matched[0],
        detail: null,
        exampleText: '',
        showExplanation: false,
        hasFavorites: true,
        totalCount: matched.length,
        isFirstItem: true,
        isLastItem: matched.length <= 1,
        nextBtnText: matched.length <= 1 ? '已到最后' : '下一个'
      });
    } else {
      this.setData({
        favorites: [],
        currentIndex: 0,
        currentTerm: null,
        detail: null,
        exampleText: '',
        showExplanation: false,
        hasFavorites: false,
        totalCount: 0,
        isFirstItem: true,
        isLastItem: false,
        nextBtnText: '下一个'
      });
    }
  },

  revealExplanation: function () {
    var current = this.data.currentTerm;
    var detail = current ? glossaryLoader.getTermById(current.id) : null;
    if (!detail) {
      wx.showToast({
        title: '术语详情不存在',
        icon: 'none'
      });
      return;
    }
    this.setData({
      detail: detail,
      exampleText: getExampleText(detail),
      showExplanation: true
    });
  },

  updateCurrentTerm: function (newIdx) {
    var favorites = this.data.favorites || [];
    if (newIdx < 0 || newIdx >= favorites.length) {
      return;
    }

    this.setData({
      currentIndex: newIdx,
      currentTerm: favorites[newIdx],
      detail: null,
      exampleText: '',
      showExplanation: false,
      isFirstItem: newIdx === 0,
      isLastItem: newIdx >= favorites.length - 1,
      nextBtnText: newIdx >= favorites.length - 1 ? '已到最后' : '下一个'
    });
  },

  prevTerm: function () {
    var idx = this.data.currentIndex;
    if (idx <= 0) {
      return;
    }
    this.updateCurrentTerm(idx - 1);
  },

  nextTerm: function () {
    var idx = this.data.currentIndex;
    if (idx >= this.data.favorites.length - 1) {
      return;
    }
    this.updateCurrentTerm(idx + 1);
  },

  goDetail: function () {
    var termId = this.data.currentTerm ? this.data.currentTerm.id : '';
    if (termId) {
      wx.navigateTo({
        url: '/packages/glossary/pages/term-detail/term-detail?id=' + termId
      });
    }
  },

  goSearch: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/term-search/term-search'
    });
  }
});
