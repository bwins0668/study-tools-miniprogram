// packages/quiz/pages/flashcard-quiz/flashcard-quiz.js
// v3: Bulletproof loading, structured logging, guaranteed 3-state UI
var adapter;
try {
  adapter = require('../../data/flashcard_adapter');
} catch (e) {
  console.error('[flashcard-quiz] CRITICAL: adapter require failed', e);
  adapter = null;
}
var storage;
try {
  storage = require('../../../../utils/storage');
} catch (e) {
  console.error('[flashcard-quiz] CRITICAL: storage require failed', e);
  storage = null;
}

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
    hasRestored: false,
    isLoading: true,
    loadError: '',
    loadingMsg: '正在准备闪卡...'
  },

  onLoad: function (options) {
    console.log('[flashcard-quiz] onLoad', options);
    var course = options.course || options.exam || 'itpass';
    var filterYear = options.yearId || '';
    var filterCategory = options.category || '';

    this.setData({
      course: course,
      courseLabel: course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡',
      loadingMsg: '正在准备' + (course === 'sg' ? 'SG' : 'IT Passport') + '闪卡...',
      filterYear: filterYear,
      filterCategory: filterCategory
    });

    this.loadDeckSafe(course, filterYear, filterCategory);
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

  loadDeckSafe: function (course, yearId, category) {
    var self = this;
    console.log('[flashcard-quiz] loadDeckSafe start', { course: course, yearId: yearId, category: category });

    if (!adapter) {
      console.error('[flashcard-quiz] adapter not loaded');
      self.setData({ isLoading: false, loadError: '模块加载失败，请退出重进' });
      return;
    }

    self.setData({ isLoading: true, loadError: '', loadingMsg: '正在加载题目...' });

    setTimeout(function () {
      try {
        console.log('[flashcard-quiz] calling getFlashcardDeck', course);
        var deck = adapter.getFlashcardDeck(course);
        console.log('[flashcard-quiz] getFlashcardDeck returned', {
          total: deck.stats.total,
          deduped: deck.stats.deduped,
          years: deck.stats.years ? deck.stats.years.length : 0
        });

        var cards = deck.cards;

        if (yearId) {
          cards = cards.filter(function (c) { return c.yearId === yearId; });
        }
        if (category) {
          cards = cards.filter(function (c) { return c.category === category; });
        }

        console.log('[flashcard-quiz] filtered cards:', cards.length);

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
          console.log('[flashcard-quiz] loading', cards.length, 'cards');
          self.setData({
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
            sessionWrong: 0,
            isLoading: false
          });
          self.startTimer();
          console.log('[flashcard-quiz] loaded successfully');
        } else {
          console.log('[flashcard-quiz] no cards found');
          self.setData({
            cards: [],
            totalCards: 0,
            currentCard: null,
            isFinished: true,
            deckLabel: '无可用题目',
            yearOptions: yearOptions,
            categoryOptions: categoryOptions,
            isLoading: false
          });
        }
      } catch (e) {
        console.error('[flashcard-quiz] loadDeckSafe FAILED:', e);
        console.error('[flashcard-quiz] error message:', e && e.message);
        console.error('[flashcard-quiz] error stack:', e && e.stack);
        self.setData({
          isLoading: false,
          loadError: '题目加载失败: ' + (e && e.message ? e.message : '未知错误'),
          cards: [],
          totalCards: 0,
          currentCard: null,
          isFinished: true
        });
      }
    }, 50);
  },

  retryLoad: function () {
    this.loadDeckSafe(this.data.course, this.data.filterYear, this.data.filterCategory);
  },

  tryRestoreProgress: function () {
    if (this.data.hasRestored) return;
    try {
      if (!adapter) return;
      var progress = adapter.getFlashcardProgress();
      if (!progress || progress.course !== this.data.course) return;
      if (!progress.answeredList || progress.answeredList.length === 0) return;
      var cards = this.data.cards;
      var total = cards.length;
      if (total === 0) return;
      var restoreIndex = Math.min(progress.currentIndex || 0, total - 1);
      this.setData({
        hasRestored: true,
        currentIndex: restoreIndex,
        currentCard: cards[restoreIndex],
        progressPercent: Math.round((restoreIndex + 1) / total * 100) || 0,
        answeredList: progress.answeredList || [],
        wrongIds: progress.wrongIds || [],
        sessionCorrect: progress.sessionCorrect || 0,
        sessionWrong: progress.sessionWrong || 0
      });
    } catch (e) {
      console.warn('[flashcard-quiz] tryRestoreProgress failed:', e);
    }
  },

  saveProgress: function () {
    try {
      if (!adapter) return;
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
    } catch (e) {
      console.warn('[flashcard-quiz] saveProgress failed:', e);
    }
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
      try {
        if (storage) {
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
      } catch (e) {
        console.warn('[flashcard-quiz] addWrongQuestion failed:', e);
      }
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
    this.saveProgress();
  },

  toggleFilter: function () {
    this.setData({ showFilter: !this.data.showFilter });
  },

  selectYearFilter: function (event) {
    var yearId = event.currentTarget.dataset.yearId || '';
    this.setData({ filterYear: yearId, showFilter: false });
    this.loadDeckSafe(this.data.course, yearId, this.data.filterCategory);
  },

  selectCategoryFilter: function (event) {
    var cat = event.currentTarget.dataset.category || '';
    this.setData({ filterCategory: cat, showFilter: false });
    this.loadDeckSafe(this.data.course, this.data.filterYear, cat);
  },

  clearFilters: function () {
    this.setData({ filterYear: '', filterCategory: '', showFilter: false });
    this.loadDeckSafe(this.data.course, '', '');
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
    wx.navigateBack({
      delta: 1,
      fail: function () {
        wx.switchTab({ url: '/pages/flashcards/flashcards' });
      }
    });
  }
});
