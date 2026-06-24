'use strict';
// flashcard-player.js — Lives INSIDE the data subpackage.
// Requires LOCAL flashcard-export.js (no cross-package require).
// Receives deckId via query, filters and displays cards from globalData cache.

var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};

// Require LOCAL flashcard-export at module level — populates globalData cache
try {
  require('../../data/flashcard-export');
} catch (e) {
  console.error('[flashcard-player] flashcard-export require failed:', e);
}

// Shared UI logic (kept minimal — full UI lives in quiz subpackage flashcard-quiz)
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
}

Page({
  data: {
    isLoading: true,
    loadError: '',
    isEmpty: false,
    loadingMsg: '正在准备闪卡...',
    course: '',
    deckLabel: '',
    yearId: '',
    cards: [],
    totalCards: 0,
    currentIndex: 0,
    currentCard: null,
    hasAnswered: false,
    selectedKey: '',
    isCorrect: false,
    showBack: false,
    isFinished: false,
    progressPercent: 0,
    answeredList: [],
    wrongIds: [],
    sessionCorrect: 0,
    sessionWrong: 0,
    errorDetail: ''
  },

  onLoad: function (options) {
    console.log('[flashcard-player] onLoad', options);

    var course = options.course || 'sg';
    var yearId = options.yearId || '';
    var deckLabel = options.deckLabel || yearId || '年度模拟';

    this.setData({
      course: course,
      deckLabel: deckLabel,
      yearId: yearId,
      loadingMsg: '正在加载 ' + deckLabel + '...'
    });

    if (!yearId) {
      this.setData({ isLoading: false, loadError: '缺少牌组参数', errorDetail: '请从牌组选择页进入' });
      return;
    }

    // Read from globalData cache (populated by flashcard-export require above)
    // cacheKey is passed as query param from adapter, or derived from page path
    var cacheKey = options.cacheKey || '';
    if (!cacheKey) {
      // Derive from current page path: /packages/quiz-sg-1/pages/flashcard-player/...
      try {
        var pages = getCurrentPages();
        var pagePath = pages && pages.length > 0 ? pages[pages.length - 1].route : '';
        var match = pagePath.match(/packages\/(quiz-[a-z]+-\d+)\//);
        if (match) {
          var pkgName = match[1];
          // quiz-sg-1 → sg-1, quiz-itpass-1 → itpass-1
          cacheKey = pkgName.replace('quiz-', '');
        }
      } catch (e) {}
    }
    if (!cacheKey) {
      cacheKey = course === 'sg' ? 'sg-1' : 'itpass-1';
    }
    var cache = app.globalData.__flashcard_cache || {};
    var allQuestions = cache[cacheKey] || [];

    console.log('[flashcard-player] cache key:', cacheKey, 'questions:', allQuestions.length);

    if (allQuestions.length === 0) {
      this.setData({
        isLoading: false,
        loadError: '闪卡数据加载失败',
        errorDetail: '数据分包 (' + cacheKey + ') 未注册题目，请重试',
        errorCourse: course,
        errorYearId: yearId,
        errorPackageName: cacheKey
      });
      return;
    }

    // Filter by yearId
    var filtered = allQuestions.filter(function (q) {
      return q.yearId === yearId && q.exam === course;
    });

    console.log('[flashcard-player] filtered:', filtered.length, 'for yearId:', yearId);

    if (filtered.length === 0) {
      this.setData({
        isLoading: false,
        loadError: '该牌组无有效题目',
        errorDetail: '年份 ' + yearId + ' 在 ' + cacheKey + ' 中没有匹配题目',
        errorCourse: course,
        errorYearId: yearId,
        errorPackageName: cacheKey
      });
      return;
    }

    // Normalize cards
    var cards = [];
    for (var i = 0; i < filtered.length; i++) {
      var q = filtered[i];
      var qJa = stripHtml(q.questionJa || '');
      var qZh = stripHtml(q.questionZh || '');
      if (!qJa && !qZh) continue;

      var opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length < 2) continue;

      var normalizedOpts = [];
      var hasCorrect = false;
      for (var j = 0; j < opts.length; j++) {
        var o = opts[j];
        var oJa = stripHtml(o.textJa || o.text || '');
        var oZh = stripHtml(o.textZh || o.text || '');
        if (!oJa && !oZh) continue;
        var isCorr = o.key === q.answer;
        if (isCorr) hasCorrect = true;
        normalizedOpts.push({
          key: o.key || String.fromCharCode(65 + j),
          textJa: oJa,
          textZh: oZh,
          isCorrect: isCorr,
          explanationJa: stripHtml(o.explanationJa || ''),
          explanationZh: stripHtml(o.explanationZh || '')
        });
      }

      if (!hasCorrect || normalizedOpts.length < 2) continue;

      cards.push({
        id: 'fc_' + q.id,
        questionJa: qJa || qZh,
        questionZh: qZh || qJa,
        options: normalizedOpts,
        answer: q.answer || '',
        explanationJa: stripHtml(q.explanationJa || ''),
        explanationZh: stripHtml(q.explanationZh || '')
      });
    }

    console.log('[flashcard-player] normalized:', cards.length, 'cards');

    if (cards.length === 0) {
      this.setData({
        isLoading: false,
        isEmpty: true,
        loadError: '该牌组无可用闪卡',
        errorDetail: '年份 ' + yearId + ' 的题目无法转换为闪卡格式'
      });
      return;
    }

    this.setData({
      isLoading: false,
      cards: cards,
      totalCards: cards.length,
      currentIndex: 0,
      currentCard: cards[0],
      progressPercent: Math.round(1 / cards.length * 100) || 0
    });

    console.log('[flashcard-player] loaded successfully:', cards.length, 'cards');
  },

  selectAnswer: function (e) {
    if (this.data.hasAnswered) return;
    var key = e.currentTarget.dataset.key;
    var card = this.data.currentCard;
    var isCorrect = false;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].key === key && card.options[i].isCorrect) {
        isCorrect = true;
        break;
      }
    }
    this.setData({
      hasAnswered: true,
      selectedKey: key,
      isCorrect: isCorrect
    });
  },

  showExplanation: function () {
    this.setData({ showBack: true });
  },

  nextCard: function () {
    var next = this.data.currentIndex + 1;
    if (next >= this.data.totalCards) {
      this.setData({ isFinished: true });
      return;
    }
    this.setData({
      currentIndex: next,
      currentCard: this.data.cards[next],
      progressPercent: Math.round((next + 1) / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      isCorrect: false,
      showBack: false
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1,
      fail: function () {
        wx.switchTab({ url: '/pages/flashcards/flashcards' });
      }
    });
  }
});
