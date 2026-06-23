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
    isNavigating: false
  },

  onShow: function () {
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
          title: 'IT Passport 闪卡',
          desc: '年度模拟 / 分类 / 错题 / 收藏',
          tags: ['IT', '年度模拟', '日语'],
          mockCount: this.data.itpassCount || 0,
          mastered: 0,
          pending: 0
        },
        {
          exam: 'sg',
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
    var self = this;
    // Load stats asynchronously to avoid blocking UI
    setTimeout(function () {
      try {
        var pastExamIndex = require('../../packages/quiz/data/past_exam_bank/index');
        var itpassYears = pastExamIndex.getYears('itpass') || [];
        var sgYears = pastExamIndex.getYears('sg') || [];
        var itpassTotal = 0;
        var sgTotal = 0;
        for (var i = 0; i < itpassYears.length; i++) {
          itpassTotal += itpassYears[i].count || 0;
        }
        for (var j = 0; j < sgYears.length; j++) {
          sgTotal += sgYears[j].count || 0;
        }
        self.setData({
          itpassCount: itpassTotal,
          sgCount: sgTotal
        });
        // Update courses with real counts
        self.loadCourses();
      } catch (e) {
        console.warn('[flashcards] loadDeckStats failed:', e);
      }
    }, 100);
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
    self.setData({ isNavigating: true });

    wx.navigateTo({
      url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + course,
      success: function () {
        self.setData({ isNavigating: false });
      },
      fail: function (err) {
        console.error('[flashcards] navigate to deck-select failed:', err);
        self.setData({ isNavigating: false });
        // Fallback: try old direct route
        wx.navigateTo({
          url: '/packages/quiz/pages/exam-menu/exam-menu?exam=' + course,
          fail: function (err2) {
            console.error('[flashcards] fallback navigate also failed:', err2);
            wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
          }
        });
      }
    });
  },

  openAnkiFromFlashcards: function () {
    if (this.data.isNavigating) return;
    var self = this;
    self.setData({ isNavigating: true });

    wx.navigateTo({
      url: '/packages/glossary/pages/anki-player/anki-player?from=flashcards',
      success: function () {
        self.setData({ isNavigating: false });
      },
      fail: function (err) {
        console.error('[flashcards] anki navigate failed:', err);
        self.setData({ isNavigating: false });
        wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
      }
    });
  }
});
