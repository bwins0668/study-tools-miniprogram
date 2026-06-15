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

function formatLastPracticeTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var now = new Date();
  var diffMs = now.getTime() - date.getTime();
  var diffMin = Math.floor(diffMs / 60000);
  var diffHour = Math.floor(diffMs / 3600000);
  var diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return diffMin + '分钟前';
  if (diffHour < 24) return diffHour + '小时前';
  if (diffDay < 7) return diffDay + '天前';

  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

function generateSuggestion(wrongCount, favoriteCount, hasLastAttempt, todayTotal) {
  if (wrongCount > 0) {
    return '有 ' + wrongCount + ' 道错题待复习，建议先去错题本巩固薄弱点';
  }
  if (favoriteCount > 0) {
    return '有 ' + favoriteCount + ' 个收藏术语，建议复习收藏加深记忆';
  }
  if (todayTotal > 0 && hasLastAttempt) {
    return '今天已练习 ' + todayTotal + ' 题，继续保持，也可以浏览术语表';
  }
  return '还没有学习记录，可以从术语表或练习开始，遇到重要术语先收藏再复习';
}

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
    lastSourceType: '',
    suggestion: '',
    lastPracticeTimeText: ''
  },

  onShow: function () {
    var favoriteCount = getFavoriteTermCount ? getFavoriteTermCount() : 0;
    var wrongQuestionCount = getWrongQuestionCount ? getWrongQuestionCount() : 0;
    var stats = getQuizStats ? getQuizStats() : { total: 0, correct: 0, wrong: 0, accuracy: 0, todayTotal: 0 };
    var totalAttempts = stats.total || 0;

    // 最近练习
    var lastAttempt = getLastAttempt ? getLastAttempt() : null;
    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '';
    var lastSourceLabel = '';
    var lastExam = '';
    var lastSourceType = '';
    var lastPracticeTimeText = '';

    if (lastAttempt) {
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
      lastPracticeTimeText = formatLastPracticeTime(lastAttempt.answeredAt);
    }

    // 生成建议
    var suggestion = generateSuggestion(wrongQuestionCount, favoriteCount, hasLastAttempt, stats.todayTotal || 0);

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      todayTotal: stats.todayTotal || 0,
      accuracy: stats.accuracy || 0,
      totalAttempts: totalAttempts,
      hasLastAttempt: hasLastAttempt,
      lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel,
      lastExam: lastExam,
      lastSourceType: lastSourceType,
      lastPracticeTimeText: lastPracticeTimeText,
      suggestion: suggestion
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
  },

  goToProfile: function () {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
