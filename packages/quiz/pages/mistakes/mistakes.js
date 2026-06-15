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

Page({
  data: {
    wrongList: [],
    totalCount: 0,
    reviewCount: 0,
    masteredCount: 0
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
      // 在题库中查找对应题目
      var question = null;
      for (var j = 0; j < allQuestions.length; j++) {
        if (allQuestions[j].id === wq.id) {
          question = allQuestions[j];
          break;
        }
      }
      if (question) {
        // 查找正确答案的文本
        var correctText = '';
        for (var k = 0; k < question.options.length; k++) {
          if (question.options[k].key === question.answer) {
            correctText = question.options[k].key + '. ' + question.options[k].textZh;
            break;
          }
        }
        wrongList.push({
          id: wq.id,
          exam: EXAM_NAMES[wq.exam] || wq.exam,
          sourceType: question.sourceType || 'lesson_quiz',
          sourceLabel: SOURCE_LABELS[question.sourceType] || '课程练习',
          questionZh: question.questionZh,
          questionJa: question.questionJa,
          correctAnswer: correctText,
          explanationZh: question.explanationZh,
          explanationJa: question.explanationJa,
          lastAnswer: wq.lastAnswer,
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
  },

  removeWrong: function (e) {
    var id = e.currentTarget.dataset.id;
    storage.removeWrongQuestion(id);
    this.loadWrongQuestions();
    wx.showToast({
      title: '已移除',
      icon: 'none',
      duration: 1000
    });
  },

  goStudy: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass'
    });
  },

  goPracticeWrong: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=wrong_only&sourceType=wrong_only'
    });
  }
});
