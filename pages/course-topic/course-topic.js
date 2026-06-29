// pages/course-topic/course-topic.js · Generic exam-topic page (R1.6)
// Read-only. No storage. No textbook, chapter progress, review count, or accuracy.
// Resolves (courseId, topicId) strictly via course-content-registry; unknown
// targets (including MOS/Python/Java/algorithm, which own no topics) fail safe.
var nav = require('../../utils/navigation');
var courseRegistry = require('../../utils/course-registry');
var contentRegistry = require('../../utils/course-content-registry');

Page({
  data: {
    courseId: '',
    topicId: '',
    notFound: false,
    courseName: '',
    topic: null,
    practiceVerified: false,
    __themeDark: false
  },

  onLoad: function (options) {
    this._applyTheme();
    var courseId = (options && options.courseId) || '';
    var topicId = (options && options.topicId) || '';
    var course = courseRegistry.getCourseById(courseId);
    var topic = contentRegistry.getTopicById(courseId, topicId);

    // Safe empty state for unknown course/topic or non-available structure.
    if (!course || !topic || topic.availability !== 'available') {
      this.setData({ notFound: true, courseId: courseId, topicId: topicId });
      return;
    }

    this.setData({
      courseId: courseId,
      topicId: topicId,
      courseName: course.displayName,
      topic: { id: topic.id, title: topic.title, titleJa: topic.titleJa },
      practiceVerified: contentRegistry.isTopicPracticeAvailable(courseId, topicId)
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  // Honest cross-course mistakes bridge (same contract as Course Shell).
  goMistakes: function () {
    nav.goMistakes();
  },

  goBack: function () {
    var pages = getCurrentPages();
    if (pages && pages.length > 1) {
      wx.navigateBack({ fail: function () { nav.goCourseTab(); } });
    } else {
      nav.goCourseTab();
    }
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
});
