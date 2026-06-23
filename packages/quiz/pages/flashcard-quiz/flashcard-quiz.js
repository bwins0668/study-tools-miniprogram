// packages/quiz/pages/flashcard-quiz/flashcard-quiz.js
var adapter = require('../../data/flashcard_adapter');
var storage = require('../../../../utils/storage');

Page({
  data: {
    course: '',
    courseLabel: '',
    deckLabel: '',
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
    filterYear: '',
    filterCategory: '',
    yearOptions: [],
    categoryOptions: [],
    showFilter: false,
    timerText: '',
    startTime: 0,
    hasRestored: false
  },

  onLoad: function (options) {
    var course = options.course || options.exam || 'itpass';
    var filterYear = options.yearId || '';
    var filterCategory = options.category || '';

    this.setData({
      course: course,
      courseLabel: course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡',
      filterYear: filterYear,
      filterCategory: filterCategory
    });

    this.loadDeck(course, filterYear, filterCategory);
    this.startTimer();
  },

  onShow: function () {
    this.tryRestoreProgress();
  },

  onUnload: function () {
    this.stopTimer();
  },

  startTimer: function () {
    var startTime = Date.now();
    this.setData({ startTime: startTime });
    this._timerInterval = setInterval(function () {
      var diffSec = Math.floor((Date.now() - startTime) / 1000);
      var minutes = Math.floor(diffSec / 60);
      var seconds = diffSec % 60;
      this.setData({
        timerText: (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
      });
    }.bind(this), 1000);
  },

  stopTimer: function () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  loadDeck: function (course, yearId, category) {
    var deck = adapter.getFlashcardDeck(course);
    var cards = deck.cards;

    if (yearId) {
      cards = cards.filter(function (c) { return c.yearId === yearId; });
    }
    if (category) {
      cards = cards.filter(function (c) { return c.category === category; });
    }

    var yearOptions = [];
    var byYear = deck.stats.byYear;
    var yearsMeta = deck.stats.years || [];
    for (var i = 0; i < yearsMeta.length; i++) {
      var y = yearsMeta[i];
      if (!yearId || y.yearId === yearId) {
        yearOptions.push({
          yearId: y.yearId,
          label: y.label || y.year,
          count: byYear[y.yearId] || 0
        });
      }
    }

    var catMap = {};
    for (var j = 0; j < cards.length; j++) {
      if (cards[j].category) {
        if (!catMap[cards[j].category]) catMap[cards[j].category] = 0;
        catMap[cards[j].category]++;
      }
    }
    var categoryOptions = [];
    var catKeys = Object.keys(catMap);
    for (var k = 0; k < catKeys.length; k++) {
      categoryOptions.push({ label: catKeys[k], count: catMap[catKeys[k]] });
    }

    if (cards.length > 0) {
      this.setData({
        cards: cards,
        totalCards: cards.length,
        currentIndex: 0,
        currentCard: cards[0],
        deckLabel: (yearId ? (yearId + ' ') : '') + (category || '年度模拟'),
        progressPercent: Math.round(1 / cards.length * 100) || 0,
        yearOptions: yearOptions,
        categoryOptions: categoryOptions,
        isFinished: false,
        hasAnswered: false,
        selectedKey: '',
        isCorrect: false,
        showBack: false,
        answeredList: [],
        wrongIds: [],
        sessionCorrect: 0,
        sessionWrong: 0
      });
    } else {
      this.setData({
        cards: [],
        totalCards: 0,
        currentCard: null,
        isFinished: true,
        deckLabel: '无可用题目',
        yearOptions: yearOptions,
        categoryOptions: categoryOptions
      });
    }
  },

  tryRestoreProgress: function () {
    if (this.data.hasRestored) return;
    var progress = adapter.getFlashcardProgress();
    if (!progress || progress.course !== this.data.course) return;
    if (!progress.answeredList || progress.answeredList.length === 0) return;
    this.setData({ hasRestored: true });
  },

  saveProgress: function () {
    var progress = {
      course: this.data.course,
      examTitle: this.data.courseLabel,
      deckLabel: this.data.deckLabel,
      currentIndex: this.data.currentIndex,
      total: this.data.totalCards,
      answeredList: this.data.answeredList,
      wrongIds: this.data.wrongIds,
      sessionCorrect: this.data.sessionCorrect,
      sessionWrong: this.data.sessionWrong,
      updatedAt: Date.now()
    };
    adapter.saveFlashcardProgress(progress);
  },

  selectAnswer: function (event) {
    if (this.data.hasAnswered || !this.data.currentCard) return;

    var key = event.currentTarget.dataset.key;
    var card = this.data.currentCard;
    var isCorrect = false;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].key === key && card.options[i].isCorrect) {
        isCorrect = true;
        break;
      }
    }

    var answeredList = this.data.answeredList.slice();
    answeredList.push({
      cardId: card.id,
      selectedKey: key,
      isCorrect: isCorrect
    });

    var wrongIds = this.data.wrongIds.slice();
    if (!isCorrect) {
      wrongIds.push(card.id);
      storage.addWrongQuestion(
        card.sourceId,
        card.course,
        key,
        {
          id: card.sourceId,
          exam: card.course,
          sourceType: card.sourceType,
          yearId: card.yearId,
          year: card.examYear,
          number: card.number,
          category: card.category,
          level: card.level,
          questionZh: card.questionZh,
          questionJa: card.questionJa,
          options: card.options.map(function (o) {
            return { key: o.key, textZh: o.textZh, textJa: o.textJa };
          }),
          answer: card.answer,
          explanationZh: card.explanationZh,
          explanationJa: card.explanationJa,
          translationStatus: card.translationStatus,
          explanationStatus: card.explanationStatus
        }
      );
    }

    this.setData({
      hasAnswered: true,
      selectedKey: key,
      isCorrect: isCorrect,
      answeredList: answeredList,
      wrongIds: wrongIds,
      sessionCorrect: this.data.sessionCorrect + (isCorrect ? 1 : 0),
      sessionWrong: this.data.sessionWrong + (isCorrect ? 0 : 1)
    });

    this.saveProgress();
  },

  showExplanation: function () {
    this.setData({ showBack: true });
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
      isCorrect: false,
      showBack: false
    });

    this.saveProgress();
  },

  finishDeck: function () {
    this.stopTimer();
    this.setData({
      isFinished: true,
      showBack: false
    });
    this.saveProgress();
  },

  restartDeck: function () {
    this.setData({
      currentIndex: 0,
      currentCard: this.data.cards[0],
      progressPercent: Math.round(1 / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      isCorrect: false,
      showBack: false,
      isFinished: false,
      answeredList: [],
      wrongIds: [],
      sessionCorrect: 0,
      sessionWrong: 0
    });
    this.startTimer();
    this.saveProgress();
  },

  retryWrongCards: function () {
    var wrongIds = this.data.wrongIds.slice();
    if (wrongIds.length === 0) {
      wx.showToast({ title: '本次没有错题', icon: 'none' });
      return;
    }
    var wrongCards = [];
    for (var i = 0; i < this.data.cards.length; i++) {
      if (wrongIds.indexOf(this.data.cards[i].id) >= 0) {
        wrongCards.push(this.data.cards[i]);
      }
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

  toggleFilter: function () {
    this.setData({ showFilter: !this.data.showFilter });
  },

  selectYearFilter: function (event) {
    var yearId = event.currentTarget.dataset.yearId || '';
    this.setData({ filterYear: yearId, showFilter: false });
    this.loadDeck(this.data.course, yearId, this.data.filterCategory);
    this.startTimer();
  },

  selectCategoryFilter: function (event) {
    var cat = event.currentTarget.dataset.category || '';
    this.setData({ filterCategory: cat, showFilter: false });
    this.loadDeck(this.data.course, this.data.filterYear, cat);
    this.startTimer();
  },

  clearFilters: function () {
    this.setData({ filterYear: '', filterCategory: '', showFilter: false });
    this.loadDeck(this.data.course, '', '');
    this.startTimer();
  },

  goMistakes: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goHome: function () {
    wx.switchTab({ url: '/pages/home/home' });
  },

  goBack: function () {
    wx.navigateBack();
  }
});
