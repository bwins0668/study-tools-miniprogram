// pages/practice/practice.js
// Practice tab — global quick-start for exam practice.
// Does not require entering a course first.
var nav = require('../../utils/navigation');
var storage = require('../../utils/storage');

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
    var lastAttempt = null;
    try {
      lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
    } catch (e) {
      lastAttempt = null;
    }

    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '';
    var lastSourceLabel = '';
    var lastExam = '';
    var lastSourceType = '';

    if (lastAttempt) {
      if (lastAttempt.sourceType === 'wrong_only') {
        lastExamLabel = '错题练习';
        lastSourceLabel = '错题重练';
        lastExam = 'wrong_only';
        lastSourceType = 'wrong_only';
      } else {
        lastExamLabel = (lastAttempt.exam === 'itpass') ? 'IT Passport' :
                        (lastAttempt.exam === 'sg') ? 'SG 信息安全' :
                        (lastAttempt.exam || '');
        lastSourceLabel = lastAttempt.sourceType || '';
        lastExam = lastAttempt.exam || '';
        lastSourceType = lastAttempt.sourceType || '';
      }
    }

    this.setData({
      hasLastAttempt: hasLastAttempt,
      lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel,
      lastExam: lastExam,
      lastSourceType: lastSourceType
    });
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
