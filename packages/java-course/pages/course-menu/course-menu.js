// packages/java-course/pages/course-menu/course-menu.js
const courseData = require('../../data/course_data');
const storage = require('../../../../utils/storage');

Page({
  data: {
    __themeDark: false,
    chapters: [],
    completedCount: 0,
    totalCount: 0,
    progressPercent: 0,
    completedMap: {}
  },

  onLoad: function () {
    this._applyTheme();
    
    // 计算总小节数
    let total = 0;
    courseData.chapters.forEach(ch => {
      if (Array.isArray(ch.lessons)) {
        total += ch.lessons.length;
      }
    });

    this.setData({
      chapters: courseData.chapters,
      totalCount: total
    });
  },

  onShow: function () {
    this._applyTheme();
    this.refreshProgress();
  },

  refreshProgress: function () {
    const progressList = storage.getJavaProgress() || [];
    const completedMap = {};
    progressList.forEach(id => {
      completedMap[id] = true;
    });

    // 计算每个章的已完成小节数
    const chapters = this.data.chapters.map(ch => {
      let chDone = 0;
      if (Array.isArray(ch.lessons)) {
        ch.lessons.forEach(l => {
          if (completedMap[l.id]) {
            chDone++;
          }
        });
      }
      return Object.assign({}, ch, {
        completedCount: chDone,
        percent: ch.lessons.length > 0 ? Math.round((chDone / ch.lessons.length) * 100) : 0
      });
    });

    const completedCount = progressList.length;
    const totalCount = this.data.totalCount;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    this.setData({
      chapters: chapters,
      completedMap: completedMap,
      completedCount: completedCount,
      progressPercent: progressPercent
    });
  },

  goToJavaLesson: function (e) {
    const lessonId = e.currentTarget.dataset.id;
    if (!lessonId) return;
    wx.navigateTo({
      url: `../lesson-view/lesson-view?id=${lessonId}`
    });
  },

  _applyTheme: function () {
    const app = getApp();
    const themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
});
