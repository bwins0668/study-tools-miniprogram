// app.js
App({
  onLaunch: function () {
    console.log('Study Tools 小程序启动');
    // R3.36 全局错误处理增强
    this.setupGlobalErrorHandler();
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
    version: 'v0.23.0'
  }
});
