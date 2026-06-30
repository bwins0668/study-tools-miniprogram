// pages/practice/practice.js
// Practice tab — global quick-start for exam practice.
// Does not require entering a course first.
var nav = require('../../utils/navigation');
var practiceState = require('../../utils/practice-state');

// R6.5: JST Japanese era date (display only)
function getJSTDateString() {
  var now = new Date();
  var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  var jst = new Date(utc + (9 * 3600000));
  var y = jst.getFullYear();
  var m = jst.getMonth() + 1;
  var d = jst.getDate();
  if (y >= 2019) {
    var reiwa = y - 2018;
    if (y === 2019 && m < 5) return '平成31年' + m + '月' + d + '日';
    return '令和' + reiwa + '年' + m + '月' + d + '日';
  }
  if (y >= 1989) { var heisei = y - 1988; return '平成' + heisei + '年' + m + '月' + d + '日'; }
  return y + '年' + m + '月' + d + '日';
}

Page({
  data: {
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: '',
    jstDateStr: ''
  },

  onLoad: function () {
    this.setData({ jstDateStr: getJSTDateString() });
  },

  onShow: function () {
    this._loadState();
  },

  _loadState: function () {
    var state = practiceState.getPracticeLandingState();
    state.jstDateStr = getJSTDateString();
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
