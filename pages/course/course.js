// pages/course/course.js · Unified course shell (R1.4: honest state adapter)
var nav = require('../../utils/navigation');
var registry = require('../../utils/course-registry');
var courseState = require('../../utils/course-state');

Page({
  data: {
    courseId: '',
    course: null,
    notFound: false,
    // certification state
    state: null,
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
      this.setData({ state: state, lastMetaText: metaText });
    }
  },

  // Single primary action: go to real exam-menu practice
  goPractice: function () {
    var id = this.data.courseId;
    nav.goCoursePractice(id);
  },

  // Honest cross-course mistakes bridge
  goMistakes: function () {
    nav.goMistakes();
  },

  goBackHome: function () {
    nav.goCourseTab();
  }
});
