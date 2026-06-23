// pages/flashcards/flashcards.js
Page({
  data: {
    hasLastProgress: false,
    lastProgress: null,
    courses: [],
    ankiFavoriteCount: 0
  },

  onShow: function () {
    this.loadLastProgress();
    this.loadCourses();
    this.loadAnkiStats();
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
          mockCount: '--',
          mastered: '--',
          pending: '--'
        },
        {
          exam: 'sg',
          title: 'SG 闪卡',
          desc: '年度模拟 / 分类 / 错题 / 收藏',
          tags: ['SG', '年度模拟', '日语'],
          mockCount: '--',
          mastered: '--',
          pending: '--'
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

  continueLastProgress: function () {
    var p = this.data.lastProgress;
    if (!p) return;
    var exam = p.exam || '';
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=' + exam,
      fail: function () { wx.showToast({ title: '打开失败', icon: 'none' }); }
    });
  },

  openCourse: function (e) {
    var exam = e.currentTarget.dataset.exam;
    if (!exam) return;
    wx.navigateTo({
      url: '/packages/quiz/pages/exam-menu/exam-menu?exam=' + exam,
      fail: function () { wx.showToast({ title: '打开失败', icon: 'none' }); }
    });
  },

  openAnkiFromFlashcards: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/anki-player/anki-player?from=flashcards',
      fail: function () { wx.showToast({ title: '打开失败', icon: 'none' }); }
    });
  }
});
