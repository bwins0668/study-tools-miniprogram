// pages/home/home.js
var app = getApp();
const {
  getFavoriteTermCount,
  getWrongQuestionCount,
  getQuizStats,
  getLastAttempt
} = require("../../utils/storage");

function formatLastPracticeTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var now = new Date();
  var diffMs = now.getTime() - date.getTime();
  var diffMin = Math.floor(diffMs / 60000);
  var diffHour = Math.floor(diffMs / 3600000);
  var diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return diffMin + '分钟前';
  if (diffHour < 24) return diffHour + '小时前';
  if (diffDay < 7) return diffDay + '天前';

  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

Page({
  data: {
    // ===== 真实业务数据 =====
    favoriteCount: 0,
    wrongQuestionCount: 0,
    todayTotal: 0,
    accuracy: 0,
    totalAttempts: 0,
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: '',
    itpassTotal: 0,
    itpassAccuracy: 0,
    sgTotal: 0,
    sgAccuracy: 0,
    streakCount: 0,
    itpassWeak: false,
    sgWeak: false,
    // ===== 真实派生显示 =====
    headDateText: '',
    lastMetaText: '',
    // ===== 功能字段 =====
    navSafeTop: 64,
    showBackToTop: false,
    isNavigating: false,
    navigationTarget: '',
    __themeDark: false,
    // ===== 只读文案（不属假数据，是静态 UI text） =====
    uiText: {
      panelTitle: '学习面板',
      continueKicker: 'CONTINUE · 继续上次',
      startKicker: 'START · 今日练习',
      startTitle: '开始今日练习',
      startSub: '从 IT Passport 课程练习入手，循序积累',
      startDesc: '尚未开始 · 从第一组练习开始',
      continueButton: '继续练习  →',
      startButton: '开始练习  →',
      reviewSection: '待复习',
      mistakeReview: '错题复习',
      flashcardReview: '闪卡复习',
      weakSection: '需要加强',
      practiceSection: '开始练习',
      itpassTitle: 'IT Passport',
      sgTitle: 'SG 信息安全',
      itpassEmpty: 'ITパスポート試験 · 按年度模拟',
      sgEmpty: '情報セキュリティ · 专项强化',
      javaTitle: 'Java 编程核心',
      javaEmpty: 'Javaプログラミング · 双语零基础',
      toolsSection: '更多工具',
      glossary: '术语表',
      anki: 'Anki 闪卡',
      profile: '我的统计'
    }
  },

  /**
   * R20.1: 运行时深色模式检测
   * 同步主题状态到页面 data（app.js 的 wx.onThemeChange 会自动更新所有页面）
   */
  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },

  onLoad: function () {
    this._syncNavLayout();
  },

  _syncNavLayout: function () {
    var navSafeTop = 64;
    try {
      var menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      var sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      if (menu && menu.bottom) {
        navSafeTop = menu.bottom + 14;
      } else {
        navSafeTop = (sysInfo.statusBarHeight || 20) + 52;
      }
    } catch (e) {
      navSafeTop = 64;
    }
    if (this.data.navSafeTop !== navSafeTop) {
      this.setData({ navSafeTop: navSafeTop });
    }
  },

  onShow: function () {
    this._clearNavigationLock();
    this._applyTheme();
    this._syncNavLayout();

    var favoriteCount = getFavoriteTermCount ? getFavoriteTermCount() : 0;
    var wrongQuestionCount = getWrongQuestionCount ? getWrongQuestionCount() : 0;
    var stats = getQuizStats ? getQuizStats() : { total: 0, correct: 0, wrong: 0, accuracy: 0, todayTotal: 0 };
    var totalAttempts = stats.total || 0;

    // 最近练习
    var lastAttempt = getLastAttempt ? getLastAttempt() : null;
    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '';
    var lastSourceLabel = '';
    var lastExam = '';
    var lastSourceType = '';
    var lastPracticeTimeText = '';

    if (lastAttempt) {
      if (lastAttempt.sourceType === 'wrong_only') {
        lastExamLabel = '错题练习';
        lastSourceLabel = '错题重练';
        lastExam = 'wrong_only';
        lastSourceType = 'wrong_only';
      } else {
        lastExamLabel = EXAM_LABELS[lastAttempt.exam] || lastAttempt.exam;
        lastSourceLabel = SOURCE_LABELS[lastAttempt.sourceType] || lastAttempt.sourceType;
        lastExam = lastAttempt.exam || '';
        lastSourceType = lastAttempt.sourceType || '';
      }
      lastPracticeTimeText = formatLastPracticeTime(lastAttempt.answeredAt);
    }
    var lastMetaText = '';
    if (lastSourceLabel) {
      lastMetaText = lastSourceLabel;
    }
    if (lastPracticeTimeText) {
      lastMetaText = lastMetaText ? lastMetaText + ' · ' + lastPracticeTimeText : lastPracticeTimeText;
    }

    // 按考试方向统计
    var byExam = stats.byExam || {};
    var itpassStats = byExam.itpass || { total: 0, accuracy: 0 };
    var sgStats = byExam.sg || { total: 0, accuracy: 0 };
    var itpassTotal = itpassStats.total || 0;
    var itpassAccuracy = itpassStats.accuracy || 0;
    var sgTotal = sgStats.total || 0;
    var sgAccuracy = sgStats.accuracy || 0;

    // 弱项检测
    var itpassWeak = false;
    var sgWeak = false;
    if (itpassTotal > 0 && sgTotal > 0) {
      var gap = Math.abs(itpassAccuracy - sgAccuracy);
      if (gap >= 20) {
        if (itpassAccuracy < sgAccuracy && itpassAccuracy < 70) {
          itpassWeak = true;
        } else if (sgAccuracy < itpassAccuracy && sgAccuracy < 70) {
          sgWeak = true;
        }
      }
    }

    // streak
    var streakCount = 0;
    try {
      var streakData = wx.getStorageSync('study-tools-mini-streak-v1');
      if (streakData && streakData.lastDate) {
        var lastDate = new Date(streakData.lastDate);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        var todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var diffDays = Math.floor((todayDay - lastDay) / 86400000);
        if (diffDays === 0) {
          streakCount = streakData.count || 1;
        } else if (diffDays === 1) {
          streakCount = (streakData.count || 0) + 1;
          wx.setStorageSync('study-tools-mini-streak-v1', {
            lastDate: today.toISOString(),
            count: streakCount
          });
        } else {
          streakCount = 0;
        }
      }
    } catch (e) {
      streakCount = 0;
    }

    // 顶部日期
    var nowD = new Date();
    var weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var headDateText = (nowD.getMonth() + 1) + '/' + nowD.getDate() + ' ' + weekNames[nowD.getDay()];

    // Java 课程进度
    var javaCompleted = 0;
    try {
      var javaProgress = wx.getStorageSync('study-tools-mini-java-progress-v1') || [];
      javaCompleted = javaProgress.length;
    } catch (e) {}

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      todayTotal: stats.todayTotal || 0,
      accuracy: stats.accuracy || 0,
      totalAttempts: totalAttempts,
      hasLastAttempt: hasLastAttempt,
      lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel,
      lastExam: lastExam,
      lastSourceType: lastSourceType,
      lastMetaText: lastMetaText,
      itpassTotal: itpassTotal,
      itpassAccuracy: itpassAccuracy,
      sgTotal: sgTotal,
      sgAccuracy: sgAccuracy,
      itpassWeak: itpassWeak,
      sgWeak: sgWeak,
      streakCount: streakCount,
      headDateText: headDateText,
      javaCompleted: javaCompleted
    });
  },

  onHide: function () {
    this._clearNavigationLock();
  },

  onUnload: function () {
    this._clearNavigationLock();
  },

  _clearNavigationLock: function () {
    if (this._navigationUnlockTimer) {
      clearTimeout(this._navigationUnlockTimer);
      this._navigationUnlockTimer = null;
    }
    if (this.data.isNavigating || this.data.navigationTarget) {
      this.setData({ isNavigating: false, navigationTarget: '' });
    }
  },

  _releaseNavigationSoon: function () {
    var self = this;
    if (self._navigationUnlockTimer) clearTimeout(self._navigationUnlockTimer);
    self._navigationUnlockTimer = setTimeout(function () {
      self._clearNavigationLock();
    }, 600);
  },

  _navigateOnce: function (method, url, target) {
    if (this.data.isNavigating) return;
    var self = this;
    var navigate = wx[method];
    if (typeof navigate !== 'function') return;
    self.setData({ isNavigating: true, navigationTarget: target || '' });
    navigate({
      url: url,
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (error) {
        console.error('[home] navigation failed:', error);
        self._clearNavigationLock();
        wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
      }
    });
  },

  continueLearning: function () {
    var exam = this.data.lastExam;
    var sourceType = this.data.lastSourceType;
    if (exam && sourceType) {
      this._navigateOnce('navigateTo', '/packages/quiz/pages/quiz/quiz?exam=' + exam + '&sourceType=' + sourceType, 'continue');
    }
  },


  goToGlossary: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/term-search/term-search', 'glossary');
  },

  goToMistakes: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/mistakes/mistakes', 'mistakes');
  },

  goToJavaCourse: function () {
    this._navigateOnce('navigateTo', '/packages/java-course/pages/course-menu/course-menu', 'java');
  },

  goToItPassport: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass', 'itpass');
  },

  goToSG: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/exam-menu/exam-menu?exam=sg', 'sg');
  },

  goToFavoriteReview: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/favorite-review/favorite-review');
  },

  goToAnki: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/anki-player/anki-player?from=home', 'anki');
  },

  quickStart: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/quiz/quiz?exam=itpass&sourceType=lesson_quiz', 'itpass');
  },

  goToProfile: function () {
    this._navigateOnce('switchTab', '/pages/profile/profile', 'profile');
  },


  // R3.55 首页分享 streak
  onShareAppMessage: function () {
    var streakCount = this.data.streakCount || 0;
    var title = 'Study Tools 学习打卡';
    if (streakCount > 0) {
      title = '我已在 Study Tools 连续学习 ' + streakCount + ' 天，一起来学习吧！';
    }
    return {
      title: title,
      path: '/pages/home/home',
      imageUrl: ''
    };
  },

  // R3.65 下拉刷新
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  // R3.72 返回顶部按钮
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop || 0;
    var showBackToTop = scrollTop > 500;
    if (showBackToTop !== this.data.showBackToTop) {
      this.setData({
        showBackToTop: showBackToTop
      });
    }
  },

  scrollToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },


  // R3.79 关闭最近更新提示
  dismissUpdateBanner: function () {
    this.setData({
      showUpdateBanner: false
    });
  }});
