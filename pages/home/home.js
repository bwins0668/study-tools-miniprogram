// pages/home/home.js
const {
  getFavoriteTermCount,
  getWrongQuestionCount,
  getQuizStats,
  getLastAttempt,
  getLastAttemptByExam
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
    nextActionHint: '',
    lastPracticeTimeText: '',
    sectionTitle: '快速开始',
    itpassTotal: 0,
    itpassAccuracy: 0,
    sgTotal: 0,
    sgAccuracy: 0,
    itpassStatusText: '未练习',
    sgStatusText: '未练习',
    itpassLastTime: '',
    sgLastTime: '',
    itpassWeak: false,
    sgWeak: false,
    // v0.21.0 第四批：继续练习入口增强
    lastAttemptAccuracy: 0,
    continueSuggestion: ''
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
    var sectionTitle = '快速开始';

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
      sectionTitle = '继续学习';
    }

    // 按考试方向统计
    var byExam = stats.byExam || {};
    var itpassStats = byExam.itpass || { total: 0, accuracy: 0 };
    var sgStats = byExam.sg || { total: 0, accuracy: 0 };
    var itpassTotal = itpassStats.total || 0;
    var itpassAccuracy = itpassStats.accuracy || 0;
    var sgTotal = sgStats.total || 0;
    var sgAccuracy = sgStats.accuracy || 0;

    // 练习状态文案
    function getStatusText(total, accuracy) {
      if (total === 0) return '未练习';
      if (accuracy >= 80) return '继续练习';
      if (accuracy < 60 && total > 0) return '复习错题';
      return '继续练习';
    }
    var itpassStatusText = getStatusText(itpassTotal, itpassAccuracy);
    var sgStatusText = getStatusText(sgTotal, sgAccuracy);

    // 各考试方向最近练习时间
    var itpassLastTs = getLastAttemptByExam('itpass');
    var sgLastTs = getLastAttemptByExam('sg');
    var itpassLastTime = itpassLastTs ? formatLastPracticeTime(itpassLastTs) : '';
    var sgLastTime = sgLastTs ? formatLastPracticeTime(sgLastTs) : '';

    // 弱项检测：两个方向正确率差距 >= 20% 且较低者 < 70% 标记为弱项
    var itpassWeak = false;
    var sgWeak = false;
    if (itpassTotal > 0 && sgTotal > 0) {
      var gap = Math.abs(itpassAccuracy - sgAccuracy);
      if (gap >= 20) {
        if (itpassAccuracy < sgAccuracy && itpassAccuracy < 70) {
          itpassWeak = true;
        } else if (sgAccuracy < itpassAccuracy && sgAccuracy < 70) {
          sgWeak = true;
        }
      }
    }

    // 生成建议
    var suggestion = generateSuggestion(wrongQuestionCount, favoriteCount, hasLastAttempt, stats.todayTotal || 0);

    // 生成下一步行动提示
    var nextActionHint = '';
    if (wrongQuestionCount > 0) {
      nextActionHint = '去错题本 →';
    } else if (favoriteCount > 0) {
      nextActionHint = '复习收藏 →';
    } else if (hasLastAttempt) {
      nextActionHint = '继续练习 →';
    } else {
      nextActionHint = '开始学习 →';
    }

    // 继续练习入口增强：上次练习方向准确率 + 建议
    var lastAttemptAccuracy = 0;
    var continueSuggestion = '';
    if (lastAttempt && lastAttempt.exam && lastAttempt.sourceType !== 'wrong_only') {
      var examStats = byExam[lastAttempt.exam];
      if (examStats && examStats.total > 0) {
        lastAttemptAccuracy = examStats.accuracy || 0;
      }
    }
    if (lastAttemptAccuracy > 0) {
      if (lastAttemptAccuracy >= 80) {
        continueSuggestion = '上次表现不错，继续保持节奏';
      } else if (lastAttemptAccuracy >= 60) {
        continueSuggestion = '上次正确率一般，建议再练一组巩固';
      } else {
        continueSuggestion = '上次正确率较低，建议先复盘错题';
      }
    }

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
      suggestion: suggestion,
      nextActionHint: nextActionHint,
      sectionTitle: sectionTitle,
      itpassTotal: itpassTotal,
      itpassAccuracy: itpassAccuracy,
      sgTotal: sgTotal,
      sgAccuracy: sgAccuracy,
      itpassStatusText: itpassStatusText,
      sgStatusText: sgStatusText,
      itpassLastTime: itpassLastTime,
      sgLastTime: sgLastTime,
      itpassWeak: itpassWeak,
      sgWeak: sgWeak,
      lastAttemptAccuracy: lastAttemptAccuracy,
      continueSuggestion: continueSuggestion
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

  quickStart: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=itpass&sourceType=lesson_quiz'
    });
  },

  goToProfile: function () {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
