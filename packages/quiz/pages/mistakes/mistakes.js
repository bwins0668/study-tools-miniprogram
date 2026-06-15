// pages/mistakes/mistakes.js
var questionsModule = require('../../data/questions');
var storage = require("../../../../utils/storage");

var EXAM_NAMES = {
  itpass: 'IT Passport',
  sg: 'SG 考试'
};

var SOURCE_LABELS = {
  lesson_quiz: '课程练习',
  past_exam_japanese: '日文真题'
};

var FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'itpass', label: 'IT Passport' },
  { key: 'sg', label: 'SG' },
  { key: 'past_exam_japanese', label: '日文题' }
];

function formatTime(ts) {
  if (!ts) return '';
  var d = new Date(ts);
  var now = new Date();
  var diff = now.getTime() - d.getTime();
  var dayMs = 24 * 60 * 60 * 1000;

  if (diff < dayMs && d.getDate() === now.getDate()) {
    return '今天 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  if (diff < 2 * dayMs && d.getDate() === now.getDate() - 1) {
    return '昨天 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

Page({
  data: {
    wrongList: [],
    filteredList: [],
    totalCount: 0,
    reviewCount: 0,
    masteredCount: 0,
    activeFilter: 'all',
    filterOptions: FILTER_OPTIONS,
    emptyHint: '当前没有错题，继续练习后会自动记录需要复习的题目。'
  },

  onShow: function () {
    this.loadWrongQuestions();
  },

  loadWrongQuestions: function () {
    var wrongQuestions = storage.getWrongQuestions();
    var allQuestions = questionsModule.questions;
    var wrongList = [];

    for (var i = 0; i < wrongQuestions.length; i++) {
      var wq = wrongQuestions[i];
      var question = null;
      for (var j = 0; j < allQuestions.length; j++) {
        if (allQuestions[j].id === wq.id) {
          question = allQuestions[j];
          break;
        }
      }
      if (question) {
        var correctText = '';
        for (var k = 0; k < question.options.length; k++) {
          if (question.options[k].key === question.answer) {
            correctText = question.options[k].key + '. ' + question.options[k].textZh;
            break;
          }
        }
        wrongList.push({
          id: wq.id,
          exam: wq.exam,
          examLabel: EXAM_NAMES[wq.exam] || wq.exam,
          sourceType: question.sourceType || 'lesson_quiz',
          sourceLabel: SOURCE_LABELS[question.sourceType] || '课程练习',
          questionZh: question.questionZh,
          questionJa: question.questionJa,
          correctAnswer: correctText,
          explanationZh: question.explanationZh,
          explanationJa: question.explanationJa,
          lastAnswer: wq.lastAnswer,
          wrongAt: wq.wrongAt,
          wrongAtLabel: formatTime(wq.wrongAt),
          translationStatus: question.translationStatus || 'complete',
          explanationStatus: question.explanationStatus || 'complete'
        });
      }
    }

    this.setData({
      wrongList: wrongList,
      totalCount: wrongList.length,
      reviewCount: wrongList.length,
      masteredCount: 0
    });

    this.applyFilter(this.data.activeFilter);
  },

  applyFilter: function (filterKey) {
    var list = this.data.wrongList;
    var filtered = list;

    if (filterKey === 'itpass') {
      filtered = list.filter(function (item) { return item.exam === 'itpass'; });
    } else if (filterKey === 'sg') {
      filtered = list.filter(function (item) { return item.exam === 'sg'; });
    } else if (filterKey === 'past_exam_japanese') {
      filtered = list.filter(function (item) { return item.sourceType === 'past_exam_japanese'; });
    }

    this.setData({
      activeFilter: filterKey,
      filteredList: filtered
    });
  },

  onFilterChange: function (e) {
    var key = e.currentTarget.dataset.key;
    this.applyFilter(key);
  },

  removeWrong: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '确认移除',
      content: '将该题目从错题本移除？移除后可以重新练习时再次记录。',
      confirmColor: '#f44336',
      success: function (res) {
        if (res.confirm) {
          storage.removeWrongQuestion(id);
          that.loadWrongQuestions();
          wx.showToast({
            title: '已移除',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },

  goPracticeWrong: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=wrong_only&sourceType=wrong_only'
    });
  },

  goStudy: function () {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
});
