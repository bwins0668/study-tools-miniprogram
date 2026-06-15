// pages/mistakes/mistakes.js - 错题 tab 轻入口
var storage = require("../../utils/storage");

/**
 * 格式化时间戳为简单日期（用于"最近错误时间"）
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  var d = new Date(timestamp);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  return month + '月' + day + '日';
}

Page({
  data: {
    wrongCount: 0,
    itpassCount: 0,
    sgCount: 0,
    lastWrongTime: ''
  },

  onShow: function () {
    var count = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0;
    var stats = storage.getWrongQuestionStats ? storage.getWrongQuestionStats() : { itpass: 0, sg: 0 };
    var lastTime = storage.getLastWrongTime ? storage.getLastWrongTime() : null;
    this.setData({
      wrongCount: count,
      itpassCount: stats.itpass || 0,
      sgCount: stats.sg || 0,
      lastWrongTime: lastTime ? formatDate(lastTime) : ''
    });
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
