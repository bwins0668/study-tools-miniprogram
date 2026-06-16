var glossaryData = require("../../data/glossary_index");
var STORAGE_KEY = "study-tools-mini-anki-status-v1";
var SWIPE_THRESHOLD = 80;

Page({
  data: {
    currentTerm: null, currentIndex: 0, totalCount: 0,
    isFlipped: false, isComplete: false,
    masteredCount: 0, progressPercent: 0, swipeStyle: "",
    categories: [], selectedCategory: "all", showFilter: false,
    dataSource: "glossary"
  },

  onLoad: function (options) {
    var source = (options && options.source) || "glossary";
    this.setData({ dataSource: source });
    this.initSession();
  },

  initSession: function (category) {
    var source = this.data.dataSource;
    var items = (source === "mistakes") ? this.loadMistakesData() : this.loadGlossaryData();
    if (!items || items.length === 0) {
      this.setData({ totalCount: 0, categories: [] });
      return;
    }
    // glossary 源提取分类
    if (source === "glossary" && this.data.categories.length === 0) {
      var catMap = {}, cats = [];
      for (var i = 0; i < items.length; i++) {
        var c = items[i].category;
        if (c && !catMap[c]) { catMap[c] = true; cats.push(c); }
      }
      cats.sort();
      this.setData({ categories: cats });
    }
    category = category || this.data.selectedCategory || "all";
    // 加载 anki 状态
    var ankiStatus = {};
    try { ankiStatus = wx.getStorageSync(STORAGE_KEY) || {}; } catch (e) {}
    // 过滤已掌握 + 分类
    var queue = [];
    for (var i = 0; i < items.length; i++) {
      var t = items[i];
      if (category !== "all" && t.category !== category && source === "glossary") continue;
      var s = ankiStatus[t.id];
      if (!s || s.status !== "mastered") queue.push(t);
    }
    this.ankiStatus = ankiStatus;
    this.queue = queue;
    this.setData({
      selectedCategory: category,
      totalCount: queue.length, currentIndex: 0,
      isComplete: queue.length === 0,
      masteredCount: this.countMastered(),
      progressPercent: queue.length > 0 ? 0 : 100
    });
    if (queue.length > 0) this.setData({ currentTerm: queue[0] });
  },

  // ===== 数据源加载器 =====

  loadGlossaryData: function () {
    return glossaryData.glossaryIndex || [];
  },

  loadMistakesData: function () {
    var storage = require("../../../../utils/storage");
    var wrongQ = storage.getWrongQuestions() || [];
    var allQ = require("../../../../data/questions").questions || [];
    var result = [];
    for (var i = 0; i < wrongQ.length; i++) {
      var wq = wrongQ[i];
      var q = null;
      for (var j = 0; j < allQ.length; j++) {
        if (allQ[j].id === wq.id) { q = allQ[j]; break; }
      }
      if (!q) continue;
      var correctOpt = "";
      for (var k = 0; k < q.options.length; k++) {
        if (q.options[k].key === q.answer) {
          correctOpt = (q.options[k].textZh || q.options[k].textJa || "");
          break;
        }
      }
      var frontText = q.questionZh || q.questionJa || "未知题目";
      var backZh = "正确答案: " + q.answer + ". " + (correctOpt || "");
      var backJa = (q.explanationZh || q.explanationJa || "");
      result.push({
        id: "mistake_" + wq.id,
        term: frontText,
        reading: "",
        zh: backZh,
        ja: backJa,
        category: wq.exam || "unknown"
      });
    }
    return result;
  },

  countMastered: function () {
    var c = 0; if (!this.ankiStatus) return 0;
    for (var k in this.ankiStatus) { if (this.ankiStatus[k].status === "mastered") c++; }
    return c;
  },

  persistStatus: function (id, status) {
    if (!this.ankiStatus) this.ankiStatus = {};
    var now = Date.now();
    var e = this.ankiStatus[id] || { reviewCount: 0, status: "new", lastReview: 0 };
    e.status = status; e.reviewCount = (e.reviewCount || 0) + 1; e.lastReview = now;
    this.ankiStatus[id] = e;
    try { wx.setStorageSync(STORAGE_KEY, this.ankiStatus); } catch (e) {}
  },

  toggleFlip: function () { this.setData({ isFlipped: !this.data.isFlipped }); },
  toggleFilter: function () { this.setData({ showFilter: !this.data.showFilter }); },
  selectCategory: function (e) {
    var cat = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: cat, currentIndex: 0, isFlipped: false, showFilter: false });
    this.initSession(cat);
  },

  nextCard: function () {
    var n = this.data.currentIndex + 1;
    if (n >= this.queue.length) {
      this.setData({ isComplete: true, isFlipped: false, swipeStyle: "" });
      return;
    }
    this.setData({
      currentIndex: n, currentTerm: this.queue[n],
      isFlipped: false,
      progressPercent: Math.round((n / this.queue.length) * 100),
      swipeStyle: ""
    });
  },

  markForgot: function () {
    var t = this.data.currentTerm; if (!t) return;
    this.persistStatus(t.id, "review");
    this.setData({ swipeStyle: "transform:translateX(-120rpx);opacity:0;transition:all 0.25s" });
    setTimeout(this.nextCard.bind(this), 280);
  },

  markMastered: function () {
    var t = this.data.currentTerm; if (!t) return;
    this.persistStatus(t.id, "mastered");
    // 错题源：记忆后自动从错题本移除（错题斩）
    if (this.data.dataSource === "mistakes") {
      var storage = require("../../../../utils/storage");
      var realId = t.id.replace("mistake_", "");
      storage.removeWrongQuestion(realId);
    }
    this.setData({
      swipeStyle: "transform:translateX(120rpx);opacity:0;transition:all 0.25s",
      masteredCount: this.countMastered()
    });
    setTimeout(this.nextCard.bind(this), 280);
  },

  onTouchStart: function (e) {
    this._tx = e.touches[0].clientX; this._ty = e.touches[0].clientY; this._sw = true;
  },
  onTouchMove: function (e) {
    if (!this._sw) return;
    var dx = e.touches[0].clientX - this._tx;
    if (Math.abs(dx) > 20) {
      this.setData({ swipeStyle: "transform:translateX(" + dx + "px);opacity:" + Math.max(0, 1 - Math.abs(dx) / 400) });
    }
  },
  onTouchEnd: function (e) {
    this._sw = false; if (this._tx === undefined) return;
    var dx = e.changedTouches[0].clientX - this._tx;
    if (dx > SWIPE_THRESHOLD) { this.markMastered(); }
    else if (dx < -SWIPE_THRESHOLD) { this.markForgot(); }
    else { this.setData({ swipeStyle: "transform:translateX(0);opacity:1" }); }
    this._tx = undefined; this._ty = undefined;
  },

  loadAllTerms: function () { this.initSession(); },
  goBack: function () { wx.navigateBack(); }
});
