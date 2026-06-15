// pages/exam-menu/exam-menu.js
var storage = require("../../../../utils/storage");

var EXAM_INFO = {
  itpass: {
    title: 'IT Passport',
    desc: 'IT パスポート試験'
  },
  sg: {
    title: 'SG 情報セキュリティマネジメント',
    desc: '情報セキュリティマネジメント試験'
  }
};

Page({
  data: {
    exam: '',
    examTitle: '',
    examDesc: '',
    lessonTotal: 0,
    lessonAccuracy: 0,
    pastTotal: 0,
    pastAccuracy: 0
  },

  onLoad: function (options) {
    var exam = options.exam || 'itpass';
    var info = EXAM_INFO[exam] || EXAM_INFO.itpass;
    this.setData({
      exam: exam,
      examTitle: info.title,
      examDesc: info.desc
    });
  },

  onShow: function () {
    var exam = this.data.exam;
    var lessonStats = storage.getQuizStatsByFilter(exam, 'lesson_quiz');
    var pastStats = storage.getQuizStatsByFilter(exam, 'past_exam_japanese');
    this.setData({
      lessonTotal: lessonStats.total || 0,
      lessonAccuracy: lessonStats.accuracy || 0,
      pastTotal: pastStats.total || 0,
      pastAccuracy: pastStats.accuracy || 0
    });
  },

  goLessonQuiz: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=' + this.data.exam + '&sourceType=lesson_quiz'
    });
  },

  goPastExam: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=' + this.data.exam + '&sourceType=past_exam_japanese'
    });
  }
});
