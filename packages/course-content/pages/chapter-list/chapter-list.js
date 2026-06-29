// packages/course-content/pages/chapter-list/chapter-list.js
// Lazy textbook chapter directory. Detailed unit data stays in this subpackage.
var manifest = require('../../data/manifest');

Page({
  data: {
    courseId: '',
    courseName: '',
    sourceTitle: '',
    chapters: [],
    notFound: false,
    __themeDark: false
  },

  onLoad: function (options) {
    this._applyTheme();
    var courseId = (options && options.courseId) || '';
    var course = manifest.getCourseManifest(courseId);
    if (!course) {
      this.setData({ courseId: courseId, notFound: true });
      return;
    }
    this.setData({
      courseId: courseId,
      courseName: course.courseName,
      sourceTitle: course.sourceTitle,
      chapters: course.chapters,
      notFound: false
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  openUnit: function (e) {
    var unitId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.unitId;
    if (!unitId) return;
    wx.navigateTo({
      url: '/packages/course-content/pages/unit-detail/unit-detail?courseId=' +
        this.data.courseId + '&unitId=' + unitId,
      fail: function () { wx.showToast({ title: '教材章节暂时无法打开', icon: 'none' }); }
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
