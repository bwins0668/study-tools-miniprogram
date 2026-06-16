var glossaryData = require("../../data/glossary_index");
var STORAGE_KEY = "study-tools-mini-anki-status-v1";
var SWIPE_THRESHOLD = 80;

Page({
  data: {
    currentTerm: null,
    currentIndex: 0,
    totalCount: 0,
    isFlipped: false,
    isComplete: false,
    masteredCount: 0,
    progressPercent: 0,
    swipeStyle: "",
    categories: [],
    selectedCategory: "all",
    showFilter: false
  },

  onLoad: function () { this.initSession(); },

  initSession: function (category) {
    var allTerms = glossaryData.glossaryIndex || [];
    if (!allTerms || allTerms.length === 0) {
      this.setData({ totalCount: 0, categories: [] });
      return;
    }
    if (this.data.categories.length === 0) {
      var catMap = {};
      var cats = [];
      for (var i = 0; i < allTerms.length; i++) {
        var c = allTerms[i].category;
        if (c && !catMap[c]) { catMap[c] = true; cats.push(c); }
      }
      cats.sort();
      this.setData({ categories: cats });
    }
    category = category || this.data.selectedCategory || "all";
    var ankiStatus = {};
    try { ankiStatus = wx.getStorageSync(STORAGE_KEY) || {}; } catch (e) {}
    var queue = [];
    for (var i = 0; i < allTerms.length; i++) {
      var t = allTerms[i];
      if (category !== "all" && t.category !== category) continue;
      var s = ankiStatus[t.id];
      if (!s || s.status !== "mastered") queue.push(t);
    }
    this.ankiStatus = ankiStatus;
    this.queue = queue;
    this.setData({
      selectedCategory: category,
      totalCount: queue.length,
      currentIndex: 0,
      isComplete: queue.length === 0,
      masteredCount: this.countMastered(),
      progressPercent: queue.length > 0 ? 0 : 100
    });
    if (queue.length > 0) this.setData({ currentTerm: queue[0] });
  },

  countMastered: function () {
    var c = 0;
    if (!this.ankiStatus) return 0;
    for (var k in this.ankiStatus) {
      if (this.ankiStatus[k].status === "mastered") c++;
    }
    return c;
  },

  persistStatus: function (id, status) {
    if (!this.ankiStatus) this.ankiStatus = {};
    var now = Date.now();
    var existing = this.ankiStatus[id] || { reviewCount: 0, status: "new", lastReview: 0 };
    existing.status = status;
    existing.reviewCount = (existing.reviewCount || 0) + 1;
    existing.lastReview = now;
    this.ankiStatus[id] = existing;
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
    this._sw = false;
    if (this._tx === undefined) return;
    var dx = e.changedTouches[0].clientX - this._tx;
    if (dx > SWIPE_THRESHOLD) { this.markMastered(); }
    else if (dx < -SWIPE_THRESHOLD) { this.markForgot(); }
    else { this.setData({ swipeStyle: "transform:translateX(0);opacity:1" }); }
    this._tx = undefined; this._ty = undefined;
  },

  loadAllTerms: function () { this.initSession(); },
  goBack: function () { wx.navigateBack(); }
});
