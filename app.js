// app.js
App({
  onLaunch: function () {
    console.log('Study Tools 小程序启动');
    this.setupGlobalErrorHandler();
    // R10: Recover pending learning transactions on cold start
    try {
      var recoverLdr = require('./utils/spaced-repetition/ledger');
      recoverLdr.recoverPendingTransactions();
    } catch (e) {}
  },

  setupGlobalErrorHandler: function () {
    var self = this;
    // 捕获未处理的 Promise 拒绝
    if (typeof Promise !== 'undefined' && Promise.prototype) {
      // 小程序环境：通过 App onError 捕获
    }
  },

  onError: function (err) {
    console.error('[Global Error]', err);
    // 生产环境可在这里上报错误到监控服务
  },

  globalData: {
    version: 'v0.28.0'
  }
});
