// pages/practice/practice.js
// Practice tab — global quick-start for exam practice.
// Does not require entering a course first.
var nav = require('../../utils/navigation');
var practiceState = require('../../utils/practice-state');

Page({
  data: {
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: ''
  },

  onShow: function () {
    this._loadState();
  },

  _loadState: function () {
    var state = practiceState.getPracticeLandingState();
    this.setData(state);
  },

  continueLast: function () {
    var exam = this.data.lastExam;
    var sourceType = this.data.lastSourceType;
    if (exam && sourceType) {
      nav.continueLastQuiz(exam, sourceType);
    }
  },

  goITPassport: function () {
    nav.goItPassport();
  },

  goSG: function () {
    nav.goSG();
  }
});
