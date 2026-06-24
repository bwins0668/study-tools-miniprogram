// pages/flashcards/flashcards.js
// v2: Fixed navigation, real stats, click lock, better UX
Page({
  data: {
    hasLastProgress: false,
    lastProgress: null,
    courses: [],
    ankiFavoriteCount: 0,
    itpassCount: 0,
    sgCount: 0,
    isNavigating: false,
    navigatingCourse: ''
  },

  onShow: function () {
    this._clearNavigationLock();
    this.loadLastProgress();
    this.loadCourses();
    this.loadAnkiStats();
    this.loadDeckStats();
  },

  loadLastProgress: function () {
    try {
      var raw = wx.getStorageSync('flashcard_progress_v1');
      if (!raw || typeof raw !== 'object') {
        this.setData({ hasLastProgress: false, lastProgress: null });
        return;
      }
      var progress = raw;
      var lastTimeText = this._formatTimeAgo(progress.updatedAt);
      this.setData({
        hasLastProgress: true,
        lastProgress: {
          course: progress.course || progress.exam || '',
          exam: progress.course || progress.exam || '',
          examTitle: progress.examTitle || '',
          deckLabel: progress.deckLabel || '年度模拟',
          currentIndex: progress.currentIndex || 0,
          total: progress.total || 0,
          lastTimeText: lastTimeText
        }
      });
    } catch (e) {
      this.setData({ hasLastProgress: false, lastProgress: null });
    }
  },

  _formatTimeAgo: function (ts) {
    if (!ts) return '';
    var now = Date.now();
    var diff = now - ts;
    if (diff < 0) return '';
    var minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return minutes + ' 分钟前';
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + ' 小时前';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + ' 天前';
    var d = new Date(ts);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  },

  loadCourses: function () {
    this.setData({
      courses: [
        {
          exam: 'itpass',
          iconKey: 'document',
          title: 'IT Passport 闪卡',
          desc: '年度模拟 / 分类 / 错题 / 收藏',
          tags: ['IT', '年度模拟', '日语'],
          mockCount: this.data.itpassCount || 0,
          mastered: 0,
          pending: 0
        },
        {
          exam: 'sg',
          iconKey: 'shield',
          title: 'SG 闪卡',
          desc: '年度模拟 / 分类 / 错题 / 收藏',
          tags: ['SG', '年度模拟', '日语'],
          mockCount: this.data.sgCount || 0,
          mastered: 0,
          pending: 0
        }
      ]
    });
  },

  loadAnkiStats: function () {
    try {
      var arr = wx.getStorageSync('study-tools-mini-favorite-terms-v1');
      this.setData({ ankiFavoriteCount: Array.isArray(arr) ? arr.length : 0 });
    } catch (e) {
      this.setData({ ankiFavoriteCount: 0 });
    }
  },

  loadDeckStats: function () {
    try {
      var summary = require('../../data/flashcard-summary-manifest');
      this.setData({
        itpassCount: summary.itpass.playableCount,
        sgCount: summary.sg.playableCount
      });
      this.loadCourses();
    } catch (e) {
      console.warn('[flashcards] loadDeckStats failed:', e);
      this.setData({ itpassCount: 0, sgCount: 0 });
    }
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
    if (this.data.isNavigating || this.data.navigatingCourse) {
      this.setData({ isNavigating: false, navigatingCourse: '' });
    }
  },

  _releaseNavigationSoon: function () {
    var self = this;
    if (self._navigationUnlockTimer) clearTimeout(self._navigationUnlockTimer);
    self._navigationUnlockTimer = setTimeout(function () {
      self._clearNavigationLock();
    }, 600);
  },

  continueLastProgress: function () {
    if (this.data.isNavigating) return;
    var p = this.data.lastProgress;
    if (!p) return;
    var course = p.course || p.exam || 'itpass';
    this.navigateToFlashcard(course);
  },

  openCourse: function (e) {
    if (this.data.isNavigating) return;
    var exam = e.currentTarget.dataset.exam;
    if (!exam) return;
    this.navigateToFlashcard(exam);
  },

  navigateToFlashcard: function (course) {
    var self = this;
    self.setData({ isNavigating: true, navigatingCourse: course });

    wx.navigateTo({
      url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + course,
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (err) {
        console.error('[flashcards] navigate to deck-select failed:', err);
        self._clearNavigationLock();
        wx.showToast({ title: '闪卡入口暂时无法打开，请重试', icon: 'none' });
      }
    });
  },

  openAnkiFromFlashcards: function () {
    if (this.data.isNavigating) return;
    var self = this;
    self.setData({ isNavigating: true, navigatingCourse: 'anki' });

    wx.navigateTo({
      url: '/packages/glossary/pages/anki-player/anki-player?from=flashcards',
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (err) {
        console.error('[flashcards] anki navigate failed:', err);
        self._clearNavigationLock();
        wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
      }
    });
  }
});
