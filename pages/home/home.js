// pages/home/home.js
const {
  getFavoriteTermCount,
  getWrongQuestionCount,
  getQuizStats,
  getLastAttempt
} = require("../../utils/storage");

var EXAM_LABELS = {
  itpass: 'IT Passport',
  sg: 'SG 考试'
};
var SOURCE_LABELS = {
  lesson_quiz: '课程练习',
  past_exam_japanese: '日文真题'
};

Page({
  data: {
    favoriteCount: 0,
    wrongQuestionCount: 0,
    todayTotal: 0,
    accuracy: 0,
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: ''
  },

  onShow: function () {
    const favoriteCount = getFavoriteTermCount ? getFavoriteTermCount() : 0;
    const wrongQuestionCount = getWrongQuestionCount ? getWrongQuestionCount() : 0;
    const stats = getQuizStats ? getQuizStats() : { todayTotal: 0, accuracy: 0 };

    // 最近练习
    var lastAttempt = getLastAttempt ? getLastAttempt() : null;
    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '';
    var lastSourceLabel = '';
    var lastExam = '';
    var lastSourceType = '';
    if (lastAttempt) {
      // 错题重练模式特殊显示
      if (lastAttempt.sourceType === 'wrong_only') {
        lastExamLabel = '错题练习';
        lastSourceLabel = '错题重练';
        lastExam = 'wrong_only';
        lastSourceType = 'wrong_only';
      } else {
        lastExamLabel = EXAM_LABELS[lastAttempt.exam] || lastAttempt.exam;
        lastSourceLabel = SOURCE_LABELS[lastAttempt.sourceType] || lastAttempt.sourceType;
        lastExam = lastAttempt.exam || '';
        lastSourceType = lastAttempt.sourceType || '';
      }
    }

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      todayTotal: stats.todayTotal || 0,
      accuracy: stats.accuracy || 0,
      hasLastAttempt: hasLastAttempt,
      lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel,
      lastExam: lastExam,
      lastSourceType: lastSourceType
    });
  },

  continueLearning: function () {
    var exam = this.data.lastExam;
    var sourceType = this.data.lastSourceType;
    if (exam && sourceType) {
      wx.navigateTo({
        url: '/packages/quiz/pages/quiz/quiz?exam=' + exam + '&sourceType=' + sourceType
      });
    }
  },

  goToGlossary: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/term-search/term-search'
    });
  },

  goToMistakes: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goToItPassport: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass'
    });
  },

  goToSG: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=sg'
    });
  },

  goToFavoriteReview: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/favorite-review/favorite-review'
    });
  }
});
