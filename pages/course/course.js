// pages/course/course.js · Unified course shell
var nav = require('../../utils/navigation');
var registry = require('../../utils/course-registry');
var storage = require('../../utils/storage');

Page({
  data: {
    courseId: '',
    course: null,
    notFound: false,
    hasLastAttempt: false,
    lastMetaText: ''
  },

  onLoad: function (options) {
    var courseId = options.courseId || '';
    var course = registry.getCourseById(courseId);

    if (!course || course.availability === 'unresolved' || !course.capabilities || !course.capabilities.courseShell) {
      this.setData({ notFound: true, courseId: courseId });
      return;
    }

    this.setData({ courseId: courseId, course: course });
    this._loadLastAttempt(courseId);
  },

  _loadLastAttempt: function (courseId) {
    var lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
    if (!lastAttempt) return;

    // Only show if lastAttempt exam matches current course
    if (lastAttempt.exam !== courseId && lastAttempt.sourceType !== 'wrong_only') return;

    var examLabel = '';
    if (lastAttempt.sourceType === 'wrong_only') {
      examLabel = '错题练习';
    } else {
      examLabel = (lastAttempt.exam === 'itpass') ? 'IT Passport' :
                  (lastAttempt.exam === 'sg') ? 'SG 信息安全' : '';
    }
    var sourceLabel = lastAttempt.sourceType === 'wrong_only' ? '错题重练' :
                      (lastAttempt.sourceType === 'lesson_quiz' ? '模拟练习' : '');
    var timeText = '';
    if (lastAttempt.answeredAt) {
      var diff = Date.now() - lastAttempt.answeredAt;
      var min = Math.floor(diff / 60000);
      var hour = Math.floor(diff / 3600000);
      var day = Math.floor(diff / 86400000);
      if (min < 1) timeText = '刚刚';
      else if (min < 60) timeText = min + '分钟前';
      else if (hour < 24) timeText = hour + '小时前';
      else if (day < 7) timeText = day + '天前';
    }
    var meta = sourceLabel;
    if (timeText) meta = meta ? meta + ' · ' + timeText : timeText;

    this.setData({ hasLastAttempt: true, lastMetaText: meta });
  },

  goPractice: function () {
    var id = this.data.courseId;
    if (id === 'itpass' || id === 'sg') nav.goCoursePractice(id);
  },

  goExamMenu: function () {
    var id = this.data.courseId;
    if (id === 'itpass' || id === 'sg') nav.goCoursePractice(id);
  },

  goMistakes: function () {
    nav.goMistakes();
  },

  goBackHome: function () {
    nav.goCourseTab();
  }
});
