// packages/java-course/pages/lesson-view/lesson-view.js
const courseData = require('../../data/course_data');
const storage = require('../../../../utils/storage');

Page({
  data: {
    __themeDark: false,
    lesson: null,
    isCompleted: false,
    readMode: 'bilingual', // 'bilingual' | 'zh' | 'ja'
    nextLessonId: null,
    prevLessonId: null
  },

  onLoad: function (options) {
    this._applyTheme();

    const lessonId = options.id || 'lesson-java-1-01';
    this.loadLesson(lessonId);

    // 从 Storage 获取上次使用的阅读模式偏好
    try {
      const mode = wx.getStorageSync('study-tools-mini-java-readmode-v1') || 'bilingual';
      this.setData({ readMode: mode });
    } catch (e) {}
  },

  onShow: function () {
    this._applyTheme();
  },

  loadLesson: function (lessonId) {
    let targetLesson = null;
    let flatLessons = [];

    // 平铺所有小节以计算上一节/下一节
    courseData.chapters.forEach(ch => {
      if (Array.isArray(ch.lessons)) {
        ch.lessons.forEach(l => {
          flatLessons.push(l);
          if (l.id === lessonId) {
            targetLesson = l;
          }
        });
      }
    });

    if (!targetLesson) {
      wx.showToast({ title: '未找到小节内容', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 查找上一小节和下一小节
    const idx = flatLessons.findIndex(x => x.id === lessonId);
    const prevLessonId = idx > 0 ? flatLessons[idx - 1].id : null;
    const nextLessonId = idx < flatLessons.length - 1 ? flatLessons[idx + 1].id : null;

    const isCompleted = storage.isJavaLessonCompleted(lessonId);

    this.setData({
      lesson: targetLesson,
      isCompleted: isCompleted,
      prevLessonId: prevLessonId,
      nextLessonId: nextLessonId
    });

    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: targetLesson.titleZh.split(' ')[0] || '小节学习'
    });
  },

  switchReadMode: function (e) {
    const mode = e.currentTarget.dataset.mode;
    if (!mode) return;

    this.setData({ readMode: mode });
    
    // 异步存入缓存
    try {
      wx.setStorageSync('study-tools-mini-java-readmode-v1', mode);
    } catch (e) {}
  },

  toggleCompleted: function () {
    const lesson = this.data.lesson;
    if (!lesson) return;

    const currentStatus = this.data.isCompleted;
    if (currentStatus) {
      storage.unmarkJavaLessonCompleted(lesson.id);
      this.setData({ isCompleted: false });
      wx.showToast({ title: '已标记为未学', icon: 'none' });
    } else {
      storage.markJavaLessonCompleted(lesson.id);
      this.setData({ isCompleted: true });
      wx.showToast({ title: '已标记为已学', icon: 'success' });
    }
  },

  goToNext: function () {
    if (this.data.nextLessonId) {
      this.loadLesson(this.data.nextLessonId);
      wx.pageScrollTo({ scrollTop: 0, duration: 100 });
    }
  },

  goToPrev: function () {
    if (this.data.prevLessonId) {
      this.loadLesson(this.data.prevLessonId);
      wx.pageScrollTo({ scrollTop: 0, duration: 100 });
    }
  },

  goBackToMenu: function () {
    wx.navigateBack();
  },

  _applyTheme: function () {
    const app = getApp();
    const themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
});
