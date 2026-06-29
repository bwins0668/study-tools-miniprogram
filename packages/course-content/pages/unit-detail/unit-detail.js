// packages/course-content/pages/unit-detail/unit-detail.js
var loader = require('../../data/loader');

Page({
  data: {
    courseId: '',
    unitId: '',
    unit: null,
    sourceText: '',
    practiceAvailable: false,
    notFound: false,
    __themeDark: false
  },

  onLoad: function (options) {
    this._applyTheme();
    var courseId = (options && options.courseId) || '';
    var unitId = (options && options.unitId) || '';
    var unit = loader.getUnitById(courseId, unitId);
    if (!unit) {
      this.setData({ courseId: courseId, unitId: unitId, notFound: true });
      return;
    }
    this.setData({
      courseId: courseId,
      unitId: unitId,
      unit: unit,
      sourceText: loader.formatPrimarySource(unit),
      practiceAvailable: !!unit.topicId,
      notFound: false
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  startPractice: function () {
    var unit = this.data.unit;
    if (!unit || !unit.topicId) {
      wx.showToast({ title: '本节暂无可用主题练习', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=' + unit.exam +
        '&sourceType=lesson_quiz&topicId=' + unit.topicId,
      fail: function () { wx.showToast({ title: '练习暂时无法打开', icon: 'none' }); }
    });
  },

  goBack: function () {
    var pages = getCurrentPages();
    if (pages && pages.length > 1) {
      wx.navigateBack({ fail: function () { wx.switchTab({ url: '/pages/home/home' }); } });
    } else {
      wx.switchTab({ url: '/pages/home/home' });
    }
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) this.setData({ __themeDark: themeDark });
  }
});
