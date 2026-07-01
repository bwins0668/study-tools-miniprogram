// pages/course/course.js · Unified course shell (R1.4: honest state adapter;
// R1.6: surface verified exam-topic structure)
var nav = require('../../utils/navigation');
var registry = require('../../utils/course-registry');
var courseState = require('../../utils/course-state');
var contentRegistry = require('../../utils/course-content-registry');

Page({
  data: {
    courseId: '',
    course: null,
    notFound: false,
    // certification state
    state: null,
    lastMetaText: '',
    // R1.6: verified exam-topic structure (only real registry topics)
    topics: [],
    __themeDark: false
  },

  onLoad: function (options) {
    this._applyTheme();
    var courseId = options.courseId || '';
    var course = registry.getCourseById(courseId);

    if (!course || course.availability === 'unresolved' || !course.capabilities || !course.capabilities.courseShell) {
      this.setData({ notFound: true, courseId: courseId });
      return;
    }

    this.setData({ courseId: courseId, course: course });

    if (course.courseKind === 'certification') {
      var state = courseState.getCertificationCourseState(courseId);
      var metaText = '';
      if (state.lastAttempt) {
        var label = state.lastAttempt.sourceType === 'wrong_only' ? '错题重练' :
                    (state.lastAttempt.sourceType === 'lesson_quiz' ? '模拟练习' :
                     state.lastAttempt.sourceType === 'past_exam_japanese' ? '真题练习' : '');
        var time = courseState.formatRelativeTime(state.lastAttempt.answeredAt);
        metaText = label;
        if (time) metaText = metaText ? metaText + ' · ' + time : time;
      }
      // Only certification courses surface verified topic structure.
      var topics = contentRegistry.getTopicsForCourse(courseId).map(function (t) {
        return {
          id: t.id,
          title: t.title,
          titleJa: t.titleJa,
          enterable: t.availability === 'available'
        };
      });
      this.setData({ state: state, lastMetaText: metaText, topics: topics });
    }
  },

  onShow: function () {
    this._applyTheme();
  },

  // Single primary action: go to real exam-menu practice
  goPractice: function () {
    var id = this.data.courseId;
    nav.goCoursePractice(id);
  },

  // Enter a verified exam-topic page (R1.6). Non-enterable rows fail safe in nav.
  goTopic: function (e) {
    var topicId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.topicId;
    if (!topicId) return;
    nav.goCourseTopic(this.data.courseId, topicId);
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },

  // Honest cross-course mistakes bridge
  goMistakes: function () {
    nav.goMistakes();
  },

  // R2.8: navigate to course question organizer (wrong + favorite tabs)
  goQuestionOrganizer: function () {
    nav.goCourseQuestionOrganizer(this.data.courseId);
  },

  goTextbook: function () {
    nav.goCourseTextbook(this.data.courseId);
  },

  goBackHome: function () {
    nav.goCourseTab();
  }
});
