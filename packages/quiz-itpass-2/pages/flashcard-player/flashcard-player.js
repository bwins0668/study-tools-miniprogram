'use strict';
var deckManifest = require('../../data/deck-manifest');
var loader = require('../../data/loader');

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();
}

function hasKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function isGenuineChinese(text) {
  if (!text || text.length < 3) return false;
  var hasChinese = false;
  var hasKana = false;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0x4E00 && c <= 0x9FFF) hasChinese = true;
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) hasKana = true;
  }
  if (hasChinese && !hasKana) return true;
  if (hasChinese) {
    var chineseCount = 0;
    var kanaCount = 0;
    for (var j = 0; j < text.length; j++) {
      var cc = text.charCodeAt(j);
      if (cc >= 0x4E00 && cc <= 0x9FFF) chineseCount++;
      if ((cc >= 0x3040 && cc <= 0x309F) || (cc >= 0x30A0 && cc <= 0x30FF)) kanaCount++;
    }
    return chineseCount > kanaCount * 3;
  }
  return false;
}

function detectContentStatus(card) {
  var hasRealZhQuestion = card.questionZh && card.questionZh !== card.questionJa && isGenuineChinese(card.questionZh);
  var hasRealZhOptions = false;
  var hasOptionExplanations = false;
  if (card.options && card.options.length > 0) {
    var zhOptCount = 0;
    var explCount = 0;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].textZh && card.options[i].textZh !== card.options[i].textJa && isGenuineChinese(card.options[i].textZh)) zhOptCount++;
      if (card.options[i].explanationJa || card.options[i].explanationZh) explCount++;
    }
    hasRealZhOptions = zhOptCount === card.options.length;
    hasOptionExplanations = explCount === card.options.length;
  }
  var hasRealZhExplanation = card.explanationZh && card.explanationZh !== card.explanationJa && isGenuineChinese(card.explanationZh);
  var hasRealMnemonic = (card.mnemonicJa && card.mnemonicJa.length > 5) || (card.mnemonicZh && isGenuineChinese(card.mnemonicZh));
  if (hasRealZhQuestion && hasRealZhOptions && hasOptionExplanations && hasRealZhExplanation && hasRealMnemonic) return 'bilingual_complete';
  if (hasRealZhQuestion || hasRealZhOptions || hasRealZhExplanation) return 'bilingual_partial';
  return 'japanese_only';
}

function normalizeCard(raw, course, yearId) {
  if (!raw || !raw.id) return null;
  var qJa = stripHtml(raw.questionJa || '');
  var qZh = stripHtml(raw.questionZh || '');
  if (!qJa && !qZh) return null;
  var options = Array.isArray(raw.options) ? raw.options : [];
  if (options.length < 2) return null;
  var normalizedOptions = [];
  var hasCorrect = false;
  for (var i = 0; i < options.length; i++) {
    var o = options[i];
    var oJa = stripHtml(o.textJa || o.text || '');
    var oZh = stripHtml(o.textZh || o.text || '');
    if (!oJa && !oZh) continue;
    var isCorrect = o.key === raw.answer || o.isCorrect === true;
    if (isCorrect) hasCorrect = true;
    normalizedOptions.push({
      key: o.key || String.fromCharCode(65 + i),
      textJa: oJa,
      textZh: oZh,
      isCorrect: isCorrect,
      explanationJa: stripHtml(o.explanationJa || ''),
      explanationZh: stripHtml(o.explanationZh || '')
    });
  }
  if (!hasCorrect || normalizedOptions.length < 2) return null;
  var card = {
    id: 'fc_' + raw.id,
    questionJa: qJa || qZh,
    questionZh: qZh || qJa,
    options: normalizedOptions,
    answer: raw.answer || '',
    explanationJa: stripHtml(raw.explanationJa || ''),
    explanationZh: stripHtml(raw.explanationZh || ''),
    mnemonicJa: raw.mnemonicJa || '',
    mnemonicZh: raw.mnemonicZh || '',
    contentStatus: 'japanese_only'
  };
  card.contentStatus = detectContentStatus(card);
  return card;
}

Page({
  data: {
    course: '',
    courseLabel: '',
    deckLabel: '',
    yearId: '',
    deckId: '',
    cards: [],
    totalCards: 0,
    currentIndex: 0,
    currentCard: null,
    answeredList: [],
    wrongIds: [],
    sessionCorrect: 0,
    sessionWrong: 0,
    hasAnswered: false,
    selectedKey: '',
    isCorrect: false,
    showBack: false,
    isFinished: false,
    progressPercent: 0,
    timerText: '',
    startTime: 0,
    userChoice: '',
    correctAnswer: '',
    optionExplanations: [],
    isLoading: true,
    loadError: '',
    isEmpty: false,
    loadingMsg: '正在准备闪卡...',
    errorCourse: '',
    errorDeckLabel: '',
    errorYearId: '',
    errorPackageName: '',
    errorDetail: '',
    rawLoadedCount: 0,
    renderableCardCount: 0
  },

  onLoad: function (options) {
    console.log('[flashcard-player] onLoad', JSON.stringify(options));
    var deckId = options.deckId || '';
    var backCourse = options.backCourse || '';
    var backPath = options.backPath || '';
    this.setData({ backCourse: backCourse, backPath: backPath });
    if (!deckId) {
      this.setData({ isLoading: false, loadError: '缺少牌组参数 (deckId)', errorDetail: '请从牌组选择页进入闪卡' });
      return;
    }
    var parts = deckId.split('/');
    var course = parts[0] || 'itpass';
    var yearId = parts[1] || '';
    if (!yearId) {
      this.setData({ isLoading: false, loadError: '无效的牌组参数', errorDetail: 'deckId=' + deckId });
      return;
    }
    var deckInfo = deckManifest.getDeckInfo(deckId);
    if (!deckInfo) {
      this.setData({
        isLoading: false,
        loadError: '闪卡数据加载失败',
        errorDetail: '找不到牌组信息: ' + deckId,
        errorCourse: course,
        errorYearId: yearId,
        errorPackageName: '',
        course: course,
        yearId: yearId,
        deckLabel: yearId
      });
      console.error('[flashcard-player] deckId not found in local manifest:', deckId, 'known:', JSON.stringify(deckManifest.getAllLocalDecks().map(function(d) { return d.deckId; })));
      return;
    }
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';
    var deckLabel = deckInfo.yearLabel || yearId;
    this.setData({
      course: course,
      courseLabel: courseLabel,
      deckLabel: deckLabel,
      yearId: deckInfo.yearId,
      deckId: deckId,
      errorCourse: course,
      errorDeckLabel: deckLabel,
      errorYearId: deckInfo.yearId,
      errorPackageName: deckInfo.deckId,
      rawLoadedCount: deckInfo.rawExpectedCount,
      loadingMsg: '正在加载「' + deckLabel + '」' + courseLabel + '…'
    });
    this.loadCards(course, deckInfo.yearId, deckInfo.rawExpectedCount);
  },

  loadCards: function (course, yearId, expectedCount) {
    var self = this;
    console.log('[flashcard-player] loadCards', { course: course, yearId: yearId, expectedCount: expectedCount });
    try {
      var rawQuestions = loader.getQuestionsByYear(course, yearId);
      console.log('[flashcard-player] loader.getQuestionsByYear returned', rawQuestions ? rawQuestions.length : 0);
      self.setData({ rawLoadedCount: rawQuestions ? rawQuestions.length : 0 });
      if (!rawQuestions || rawQuestions.length === 0) {
        self.setData({ isLoading: false, loadError: '闪卡数据加载失败', errorDetail: '该牌组 (' + yearId + ') 在分包内未找到题目, rawExpectedCount=' + expectedCount + ' rawLoadedCount=0', isEmpty: true });
        return;
      }
      var cards = [];
      for (var i = 0; i < rawQuestions.length; i++) {
        var card = normalizeCard(rawQuestions[i], course, yearId);
        if (card) cards.push(card);
      }
      console.log('[flashcard-player] normalized', cards.length, 'of', rawQuestions.length);
      if (cards.length === 0) {
        self.setData({ isLoading: false, isEmpty: true, loadError: '该牌组无可用闪卡', errorDetail: '年份 ' + yearId + ' 的题目无法转换为闪卡格式' });
        return;
      }
      self.setData({
        isLoading: false,
        cards: cards,
        totalCards: cards.length,
        renderableCardCount: cards.length,
        currentIndex: 0,
        currentCard: cards[0],
        progressPercent: Math.round(1 / cards.length * 100) || 0
      });
      self.startTimer();
      console.log('[flashcard-player] loaded successfully:', cards.length, 'cards');
    } catch (e) {
      console.error('[flashcard-player] loadCards error:', e);
      self.setData({ isLoading: false, loadError: '闪卡数据加载失败', errorDetail: e.message || '未知错误', rawLoadedCount: 0, isEmpty: true });
    }
  },

  startTimer: function () {
    var startTime = Date.now();
    this.setData({ startTime: startTime });
    this._timerInterval = setInterval(function () {
      var diffSec = Math.floor((Date.now() - startTime) / 1000);
      var minutes = Math.floor(diffSec / 60);
      var seconds = diffSec % 60;
      this.setData({ timerText: (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) });
    }.bind(this), 1000);
  },

  stopTimer: function () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  onUnload: function () {
    this.stopTimer();
  },

  selectAnswer: function (e) {
    if (this.data.hasAnswered || !this.data.currentCard) return;
    var key = e.currentTarget.dataset.key;
    var card = this.data.currentCard;
    var isCorrect = false;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].key === key && card.options[i].isCorrect) {
        isCorrect = true;
        break;
      }
    }
    var answeredList = this.data.answeredList.slice();
    answeredList.push({ cardId: card.id, selectedKey: key, isCorrect: isCorrect });
    var wrongIds = this.data.wrongIds.slice();
    if (!isCorrect) wrongIds.push(card.id);
    this.setData({
      hasAnswered: true,
      selectedKey: key,
      userChoice: key,
      isCorrect: isCorrect,
      answeredList: answeredList,
      wrongIds: wrongIds,
      sessionCorrect: this.data.sessionCorrect + (isCorrect ? 1 : 0),
      sessionWrong: this.data.sessionWrong + (isCorrect ? 0 : 1)
    });
  },

  showExplanation: function () {
    var card = this.data.currentCard;
    var correctKey = '';
    var explanations = [];
    if (card && card.options) {
      for (var i = 0; i < card.options.length; i++) {
        if (card.options[i].isCorrect) correctKey = card.options[i].key;
      }
    }
    this.setData({ showBack: true, correctAnswer: correctKey, optionExplanations: explanations });
  },

  nextCard: function () {
    var nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.totalCards) {
      this.finishDeck();
      return;
    }
    this.setData({
      currentIndex: nextIndex,
      currentCard: this.data.cards[nextIndex],
      progressPercent: Math.round((nextIndex + 1) / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false
    });
  },

  finishDeck: function () {
    this.stopTimer();
    this.setData({ isFinished: true, showBack: false });
  },

  restartDeck: function () {
    this.setData({
      currentIndex: 0,
      currentCard: this.data.cards[0],
      progressPercent: Math.round(1 / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false,
      isFinished: false,
      answeredList: [],
      wrongIds: [],
      sessionCorrect: 0,
      sessionWrong: 0
    });
    this.startTimer();
  },

  retryWrongCards: function () {
    var wrongIds = this.data.wrongIds.slice();
    if (wrongIds.length === 0) {
      wx.showToast({ title: '本次没有错题', icon: 'none' });
      return;
    }
    var wrongCards = [];
    for (var i = 0; i < this.data.cards.length; i++) {
      if (wrongIds.indexOf(this.data.cards[i].id) >= 0) wrongCards.push(this.data.cards[i]);
    }
    if (wrongCards.length === 0) {
      wx.showToast({ title: '未找到错题', icon: 'none' });
      return;
    }
    this.stopTimer();
    this.setData({
      cards: wrongCards,
      totalCards: wrongCards.length,
      currentIndex: 0,
      currentCard: wrongCards[0],
      progressPercent: Math.round(1 / wrongCards.length * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false,
      isFinished: false,
      answeredList: [],
      wrongIds: [],
      sessionCorrect: 0,
      sessionWrong: 0,
      deckLabel: '错题重练'
    });
    this.startTimer();
  },

  goHome: function () {
    wx.switchTab({ url: '/pages/home/home' });
  },

  goBack: function () {
    var bp = this.data.backPath;
    if (bp) {
      wx.redirectTo({ url: bp, fail: function () {
        wx.navigateBack({ delta: 1, fail: function () {
          wx.switchTab({ url: '/pages/flashcards/flashcards' });
        }});
      }});
    } else {
      wx.navigateBack({ delta: 1, fail: function () {
        wx.switchTab({ url: '/pages/flashcards/flashcards' });
      }});
    }
  }
});
