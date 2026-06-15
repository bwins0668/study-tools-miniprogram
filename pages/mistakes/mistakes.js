// pages/mistakes/mistakes.js - 错题 tab 轻入口
var storage = require("../../utils/storage");

Page({
  data: {
    wrongCount: 0
  },

  onShow: function () {
    var count = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0;
    this.setData({ wrongCount: count });
  },

  goToMistakesList: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goStudy: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass'
    });
  }
});
