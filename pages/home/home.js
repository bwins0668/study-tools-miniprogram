// pages/home/home.js · Course Center landing page
var app = getApp();
var nav = require('../../utils/navigation');
var registry = require('../../utils/course-registry');
var storage = require('../../utils/storage');
var streakPersistence = require('../../utils/home-streak-persistence');

var EXAM_LABELS = { itpass: 'IT Passport', sg: 'SG 信息安全' };
var SOURCE_LABELS = { lesson_quiz: '模拟练习', past_exam_japanese: '真题练习', wrong_only: '错题重练' };

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
    // Learning state
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: '',
    lastMetaText: '',
    streakCount: 0,
    // Course & exam sections from registry
    languageCourses: [],
    examCourses: [],
    // Layout
    navSafeTop: 64,
    showBackToTop: false,
    isNavigating: false,
    __themeDark: false
  },

  onLoad: function () { this._syncNavLayout(); },

  _syncNavLayout: function () {
    var navSafeTop = 64;
    try {
      var menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      var sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      navSafeTop = (menu && menu.bottom) ? menu.bottom + 14 : ((sysInfo.statusBarHeight || 20) + 52);
    } catch (e) { navSafeTop = 64; }
    if (this.data.navSafeTop !== navSafeTop) this.setData({ navSafeTop: navSafeTop });
  },

  _applyTheme: function () {
    var app = getApp();
    var dark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== dark) this.setData({ __themeDark: dark });
  },

  onShow: function () {
    this._clearNavigationLock();
    this._applyTheme();
    this._syncNavLayout();
    this._loadState();
  },

  _loadState: function () {
    var lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '', lastSourceLabel = '', lastExam = '', lastSourceType = '', lastPracticeTimeText = '';

    if (lastAttempt) {
      if (lastAttempt.sourceType === 'wrong_only') {
        lastExamLabel = '错题练习'; lastSourceLabel = '错题重练';
        lastExam = 'wrong_only'; lastSourceType = 'wrong_only';
      } else {
        lastExamLabel = EXAM_LABELS[lastAttempt.exam] || lastAttempt.exam || '';
        lastSourceLabel = SOURCE_LABELS[lastAttempt.sourceType] || lastAttempt.sourceType || '';
        lastExam = lastAttempt.exam || ''; lastSourceType = lastAttempt.sourceType || '';
      }
      lastPracticeTimeText = formatLastPracticeTime(lastAttempt.answeredAt);
    }
    var lastMetaText = lastSourceLabel;
    if (lastPracticeTimeText) lastMetaText = lastMetaText ? lastMetaText + ' · ' + lastPracticeTimeText : lastPracticeTimeText;

    // Streak (R3.7: extracted to home-streak-persistence)
    var streakCount = streakPersistence.getStreakCount();

    // Course sections from registry (no hardcoding)
    var languageCourses = registry.getCoursesByKind('language').concat(registry.getCoursesByKind('fundamentals'));
    var examCourses = registry.getCoursesByKind('exam').concat(registry.getCoursesByKind('certification'));

    this.setData({
      hasLastAttempt: hasLastAttempt, lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel, lastExam: lastExam, lastSourceType: lastSourceType,
      lastMetaText: lastMetaText, streakCount: streakCount,
      languageCourses: languageCourses, examCourses: examCourses
    });
  },

  // --- Navigation ---
  _clearNavigationLock: function () {
    if (this._navTimer) { clearTimeout(this._navTimer); this._navTimer = null; }
    if (this.data.isNavigating) this.setData({ isNavigating: false });
  },
  _releaseNavSoon: function () {
    var s = this; if (s._navTimer) clearTimeout(s._navTimer);
    s._navTimer = setTimeout(function () { s._clearNavigationLock(); }, 600);
  },

  continueLearning: function () {
    var exam = this.data.lastExam, st = this.data.lastSourceType;
    if (exam && st) nav.continueLastQuiz(exam, st);
  },

  goPractice:  function () { nav.goPracticeTab(); },
  goReview:    function () { nav.goReviewTab(); },
  goItPassport: function () { nav.goItPassport(); },
  goSG:        function () { nav.goSG(); },
  goProfile:   function () { nav.goProfileTab(); },

  // R1.3: unified course navigation via data-course-id
  goToCourse: function (e) {
    var courseId = e.currentTarget.dataset.courseId;
    if (courseId) nav.goCourseHome(courseId);
  },
  goToPractice: function (e) {
    var courseId = e.currentTarget.dataset.courseId;
    if (courseId) nav.goCoursePractice(courseId);
  },

  goToCourseArea: function () {
    wx.pageScrollTo({ selector: '.cc-section--courses', duration: 300 });
  },

  onPlannedCourse: function () {
    wx.showToast({ title: '课程正在建设中', icon: 'none' });
  },

  // --- Retained from UI Freeze v1 ---
  onHide: function () { this._clearNavigationLock(); },
  onUnload: function () { this._clearNavigationLock(); },

  onShareAppMessage: function () {
    var sc = this.data.streakCount || 0;
    return { title: sc > 0 ? '我已在 Study Tools 连续学习 ' + sc + ' 天，一起来学习吧！' : 'Study Tools 学习打卡', path: '/pages/home/home', imageUrl: '' };
  },

  onPullDownRefresh: function () { this.onShow(); wx.stopPullDownRefresh(); },

  onPageScroll: function (e) {
    var show = (e.scrollTop || 0) > 500;
    if (show !== this.data.showBackToTop) this.setData({ showBackToTop: show });
  },

  scrollToTop: function () { wx.pageScrollTo({ scrollTop: 0, duration: 300 }); },

  dismissUpdateBanner: function () { this.setData({ showUpdateBanner: false }); }
});
