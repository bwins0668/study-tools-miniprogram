// pages/exam-menu/exam-menu.js
var storage = require("../../../../utils/storage");
var pastExamIndex = require("../../data/past_exam_bank/index");

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

function formatTimeAgo(ts) {
  if (!ts) return '';
  var now = Date.now();
  var diff = now - ts;
  if (diff < 0) return '';
  var minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return minutes + ' 分钟前';
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' 小时前';
  var days = Math.floor(hours / 24);
  if (days < 7) return days + ' 天前';
  if (days < 30) return Math.floor(days / 7) + ' 周前';
  return Math.floor(days / 30) + ' 个月前';
}

Page({
  data: {
    exam: '',
    examTitle: '',
    examDesc: '',
    lessonTotal: 0,
    lessonAccuracy: 0,
    pastTotal: 0,
    pastAccuracy: 0,
    overallTotal: 0,
    overallAccuracy: 0,
    lastPracticeText: '',
    suggestion: { text: '', level: '' },
    pastExamList: [],
    pastExamExpanded: false,
    activePastExamYearId: ''
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

    var overallTotal = (lessonStats.total || 0) + (pastStats.total || 0);
    var overallCorrect = (lessonStats.correct || 0) + (pastStats.correct || 0);
    var overallAccuracy = overallTotal > 0 ? Math.round(overallCorrect / overallTotal * 100) : 0;

    var lastTs = storage.getLastAttemptByExam(exam);
    var lastText = formatTimeAgo(lastTs);

    var suggestion = { text: '', level: '' };
    if (overallTotal === 0) {
      suggestion = { text: '从课程练习开始，逐步了解考试内容', level: 'start' };
    } else if (overallAccuracy >= 80) {
      suggestion = { text: '掌握良好，可以尝试日文真题挑战', level: 'good' };
    } else if (overallAccuracy >= 60) {
      suggestion = { text: '建议多做课程练习巩固基础', level: 'moderate' };
    } else {
      suggestion = { text: '建议先复习基础知识点再继续练习', level: 'review' };
    }

    // 构建过去问年份列表：只读轻量索引，不加载真题正文
    var pastExamList = pastExamIndex.getYears(exam);

    this.setData({
      lessonTotal: lessonStats.total || 0,
      lessonAccuracy: lessonStats.accuracy || 0,
      pastTotal: pastStats.total || 0,
      pastAccuracy: pastStats.accuracy || 0,
      overallTotal: overallTotal,
      overallAccuracy: overallAccuracy,
      lastPracticeText: lastText,
      suggestion: suggestion,
      pastExamList: pastExamList
    });
  },

  togglePastExamList: function () {
    this.setData({
      pastExamExpanded: !this.data.pastExamExpanded
    });
  },

  goPastExamYear: function (event) {
    var dataset = event.currentTarget.dataset || {};
    var yearId = dataset.yearId;
    if (!yearId) {
      console.warn('[exam-menu] goPastExamYear: yearId missing in dataset', dataset);
      wx.showToast({ title: '试卷信息缺失', icon: 'none' });
      return;
    }
    this.setData({ activePastExamYearId: yearId });
    var route = pastExamIndex.getRoute(this.data.exam, yearId);
    if (!route || !route.route) {
      console.warn('[exam-menu] goPastExamYear: route missing', this.data.exam, yearId);
      wx.showToast({ title: '试卷分包缺失', icon: 'none' });
      return;
    }
    var url = route.route;
    wx.navigateTo({
      url: url,
      fail: function (err) {
        console.error('[exam-menu] navigate to past exam failed', url, err);
        wx.showToast({ title: '打开试卷失败', icon: 'none' });
      }
    });
  },

  goLessonQuiz: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=' + this.data.exam + '&sourceType=lesson_quiz'
    });
  },

  goPastExam: function () {
    var first = (this.data.pastExamList || [])[0];
    if (!first) {
      wx.showToast({ title: '暂无真题年份', icon: 'none' });
      return;
    }
    var route = pastExamIndex.getRoute(this.data.exam, first.yearId);
    if (!route || !route.route) {
      wx.showToast({ title: '试卷分包缺失', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: route.route
    });
  }
});
