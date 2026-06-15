// pages/glossary/glossary.js
var glossaryIndex = require('../../data/glossary_index').glossaryIndex;
const {
  getFavoriteTerms
} = require("../../../../utils/storage");

var MAX_DEFAULT = 30;
var MAX_SEARCH = 50;

Page({
  data: {
    keyword: '',
    allData: [],
    filteredList: [],
    favoriteSet: {},
    totalCount: 0,
    showCount: 0,
    resultHint: ''
  },

  onLoad: function () {
    var data = glossaryIndex;
    this.setData({
      allData: data,
      filteredList: data.slice(0, MAX_DEFAULT),
      totalCount: data.length,
      showCount: Math.min(data.length, MAX_DEFAULT),
      resultHint: '当前显示 ' + Math.min(data.length, MAX_DEFAULT) + ' 条 / 共 ' + data.length + ' 条'
    });
  },

  onShow: function () {
    this.refreshFavoriteStatus();
  },

  refreshFavoriteStatus: function () {
    var favSet = {};
    var favList = getFavoriteTerms();
    for (var i = 0; i < favList.length; i++) {
      favSet[favList[i].id] = true;
    }
    var data = this.data.allData;
    var marked = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      marked.push({
        id: item.id,
        term: item.term,
        zh: item.zh,
        ja: item.ja,
        category: item.category,
        level: item.level,
        _isFavorite: !!favSet[String(item.id)]
      });
    }
    var keyword = this.data.keyword;
    var filtered;
    if (keyword) {
      filtered = this.filterData(keyword, marked);
    } else {
      filtered = marked.slice(0, MAX_DEFAULT);
    }
    var showCount = filtered.length;
    var matchCount = keyword ? this.filterData(keyword, marked, true).length : marked.length;
    this.setData({
      allData: marked,
      favoriteSet: favSet,
      filteredList: filtered,
      totalCount: matchCount,
      showCount: showCount,
      resultHint: keyword
        ? '当前显示 ' + showCount + ' 条 / 共 ' + matchCount + ' 条匹配'
        : '当前显示 ' + showCount + ' 条 / 共 ' + marked.length + ' 条'
    });
  },

  onSearchInput: function (e) {
    var keyword = e.detail.value.trim();
    var favSet = this.data.favoriteSet;
    var filtered;
    if (keyword) {
      var all = this.filterData(keyword, this.data.allData, true);
      var sliced = all.slice(0, MAX_SEARCH);
      // Apply favorite status
      for (var i = 0; i < sliced.length; i++) {
        sliced[i] = {
          id: sliced[i].id, term: sliced[i].term, zh: sliced[i].zh, ja: sliced[i].ja,
          category: sliced[i].category, level: sliced[i].level,
          _isFavorite: !!favSet[String(sliced[i].id)]
        };
      }
      filtered = sliced;
      this.setData({
        keyword: keyword,
        filteredList: filtered,
        totalCount: all.length,
        showCount: filtered.length,
        resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + all.length + ' 条匹配'
      });
    } else {
      var raw = this.data.allData.slice(0, MAX_DEFAULT);
      var marked = [];
      for (var i = 0; i < raw.length; i++) {
        marked.push({
          id: raw[i].id, term: raw[i].term, zh: raw[i].zh, ja: raw[i].ja,
          category: raw[i].category, level: raw[i].level,
          _isFavorite: !!favSet[String(raw[i].id)]
        });
      }
      filtered = marked;
      this.setData({
        keyword: '',
        filteredList: filtered,
        totalCount: this.data.allData.length,
        showCount: filtered.length,
        resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + this.data.allData.length + ' 条'
      });
    }
  },

  clearSearch: function () {
    var favSet = this.data.favoriteSet;
    var raw = this.data.allData.slice(0, MAX_DEFAULT);
    var filtered = [];
    for (var i = 0; i < raw.length; i++) {
      filtered.push({
        id: raw[i].id, term: raw[i].term, zh: raw[i].zh, ja: raw[i].ja,
        category: raw[i].category, level: raw[i].level,
        _isFavorite: !!favSet[String(raw[i].id)]
      });
    }
    this.setData({
      keyword: '',
      filteredList: filtered,
      totalCount: this.data.allData.length,
      showCount: filtered.length,
      resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + this.data.allData.length + ' 条'
    });
  },

  filterData: function (keyword, source, returnAll) {
    var data = source || this.data.allData;
    if (!keyword) {
      return returnAll ? data : data.slice(0, MAX_DEFAULT);
    }
    var lower = keyword.toLowerCase();
    var results = data.filter(function (item) {
      if (item.term.toLowerCase().indexOf(lower) !== -1) return true;
      if (item.zh.indexOf(keyword) !== -1) return true;
      if (item.ja.indexOf(keyword) !== -1) return true;
      if (item.category.indexOf(keyword) !== -1) return true;
      if (Array.isArray(item.aliases)) {
        for (var i = 0; i < item.aliases.length; i++) {
          if (String(item.aliases[i]).toLowerCase().indexOf(lower) !== -1) return true;
        }
      }
      return false;
    });
    return returnAll ? results : results.slice(0, MAX_SEARCH);
  },

  goToDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packages/glossary/pages/term-detail/term-detail?id=' + id
    });
  }
});
