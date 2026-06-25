'use strict';

var manifest = require('../../data/flashcard-manifest');

// ── Navigation transaction tracking (max 20, diagnostic only) ─────────
// Not persisted, not shown to users, not written to storage or globalData.
var NAV_TRANSACTIONS = [];
var MAX_TRANSACTIONS = 20;

function recordTransaction(entry) {
  entry.timestamp = Date.now();
  try {
    var pages = getCurrentPages();
    var current = pages.length > 0 ? pages[pages.length - 1] : null;
    entry.route = current ? current.route : '';
    entry.stack = pages.map(function (p) { return p.route; });
  } catch (e) {
    entry.route = '';
    entry.stack = [];
  }
  NAV_TRANSACTIONS.push(entry);
  if (NAV_TRANSACTIONS.length > MAX_TRANSACTIONS) {
    NAV_TRANSACTIONS = NAV_TRANSACTIONS.slice(-MAX_TRANSACTIONS);
  }
  return entry;
}

function getLastTransaction() {
  return NAV_TRANSACTIONS.length > 0 ? NAV_TRANSACTIONS[NAV_TRANSACTIONS.length - 1] : null;
}

// ── helpers ───────────────────────────────────────────────────────────

function buildPlayerUrl(deckInfo, deckId, course) {
  var backPath = '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + encodeURIComponent(course);
  return deckInfo.playerRoute +
    '?deckId=' + encodeURIComponent(deckId) +
    '&backCourse=' + encodeURIComponent(course) +
    '&backPath=' + encodeURIComponent(backPath);
}

function getUuid4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════

Page({
  data: {
    course: '',
    courseLabel: '',
    courseDesc: '',
    decks: [],
    isLoading: true,
    loadError: '',
    isNavigating: false,
    lastNavigationDiagnostic: ''
  },

  onLoad: function (options) {
    var course = options.course || options.exam || 'itpass';
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';
    var courseDesc = course === 'sg' ? '情報セキュリティマネジメント' : 'IT パスポート試験';

    this.setData({
      course: course,
      courseLabel: courseLabel,
      courseDesc: courseDesc
    });
    this.loadDecks(course);
  },

  loadDecks: function (courseOrEvent) {
    var course = typeof courseOrEvent === 'string'
      ? courseOrEvent
      : ((courseOrEvent && courseOrEvent.currentTarget && courseOrEvent.currentTarget.dataset && courseOrEvent.currentTarget.dataset.course) || this.data.course);
    this.setData({ isLoading: true, loadError: '' });
    try {
      var decks = manifest.getDecksForCourse(course);
      if (!decks || decks.length === 0) {
        this.setData({ isLoading: false, loadError: '暂无可用牌组' });
        return;
      }
      this.setData({ decks: decks, isLoading: false, loadError: '' });
    } catch (error) {
      console.error('[flashcard-deck-select] loadDecks failed:', error);
      this.setData({ isLoading: false, loadError: '加载牌组列表失败：' + (error.message || '未知错误') });
    }
  },

  selectDeck: function (event) {
    if (this.data.isNavigating) return;

    var dataset = (event && event.currentTarget && event.currentTarget.dataset) || {};
    var course = this.data.course;
    var yearId = dataset.yearId;
    if (!course || !yearId) {
      wx.showToast({ title: '牌组参数缺失', icon: 'none' });
      return;
    }

    var deckInfo = manifest.getDeckInfo(course, yearId);
    if (!deckInfo || !deckInfo.playerRoute || !deckInfo.packageName) {
      console.error('[flashcard-deck-select] manifest lookup failed:', { course: course, yearId: yearId, deckInfo: deckInfo });
      wx.showToast({ title: '找不到牌组入口', icon: 'none' });
      return;
    }

    var deckId = course + '/' + yearId;
    var playerUrl = buildPlayerUrl(deckInfo, deckId, course);
    var txnId = getUuid4();

    // Phase 1: validate
    var txn = recordTransaction({
      transactionId: txnId,
      deckId: deckId,
      packageName: deckInfo.packageName,
      playerPath: deckInfo.playerRoute,
      phase: 'validating'
    });

    this.setData({
      isNavigating: true,
      lastNavigationDiagnostic: txnId + ' | validating | deck=' + deckId + ' pkg=' + deckInfo.packageName
    });
    wx.showLoading({ title: '加载牌组…', mask: true });

    var self = this;

    function finishPhase(phase, extra) {
      txn.phase = phase;
      if (extra) Object.assign(txn, extra);
    }

    function failNavigation(reason, errorObj) {
      finishPhase('failed', {
        errorCode: errorObj ? (errorObj.errCode || errorObj.errMsg || '') : '',
        errorMessage: errorObj ? (errorObj.errMsg || errorObj.message || reason) : reason
      });
      wx.hideLoading();
      self.setData({
        isNavigating: false,
        lastNavigationDiagnostic: txnId + ' | failed | ' + reason
      });
      if (errorObj && errorObj.errMsg) {
        console.error('[flashcard-deck-select] navigation failed:', { txnId: txnId, reason: reason, error: errorObj });
      }
      wx.showToast({ title: '闪卡启动失败，请重试', icon: 'none' });
    }

    function navigateToPlayer(isRetry) {
      txn.phase = 'player_navigating';
      self.setData({
        lastNavigationDiagnostic: txnId + ' | ' + (isRetry ? 'retry_navigate' : 'navigate') + ' | deck=' + deckId
      });
      wx.navigateTo({
        url: playerUrl,
        success: function () {
          txn.phase = 'player_navigating_complete';
          self.setData({
            lastNavigationDiagnostic: txnId + ' | navigate success | deck=' + deckId
          });
          wx.hideLoading();
          // isNavigating stays true until player reports back via onLoad receipt.
          // The player page will set a receipt on this page's data via
          // pages stack inspection.
        },
        fail: function (error) {
          var errMsg = error && error.errMsg ? error.errMsg : 'unknown';
          txn.navigateToResult = errMsg;

          // ── One formal retry for navigateTo timeout ─────────────
          if (!isRetry && (
            String(errMsg).indexOf('timeout') >= 0 ||
            String(errMsg).indexOf('fail') >= 0
          )) {
            console.warn('[flashcard-deck-select] navigateTo failed, attempting single retry:', errMsg);
            txn.phase = 'player_navigating_retry';
            self.setData({
              lastNavigationDiagnostic: txnId + ' | retry after navigate fail | ' + errMsg
            });
            wx.nextTick(function () {
              navigateToPlayer(true);
            });
            return;
          }

          failNavigation('navigateTo: ' + errMsg, error);
        }
      });
    }

    // ── loadSubPackage with timeout guard ─────────────────────────
    // In DevTools/automation environments, wx.loadSubPackage may exist
    // as a callable but never invoke its callback (neither success nor
    // fail).  We add a timeout guard: if the callback hasn't fired
    // within LOAD_TIMEOUT_MS, we proceed with direct navigation.
    var LOAD_TIMEOUT_MS = 8000;

    function _invokeSubPackageAndNavigate() {
      txn.phase = 'subpackage_loading';
      self.setData({
        lastNavigationDiagnostic: txnId + ' | subpackage_loading | pkg=' + deckInfo.packageName
      });

      var callbackCalled = false;

      var timeoutHandle = setTimeout(function () {
        if (callbackCalled) return;
        callbackCalled = true;
        txn.loadSubPackageResult = 'timeout(' + LOAD_TIMEOUT_MS + 'ms)';
        txn.phase = 'subpackage_timeout';
        self.setData({
          lastNavigationDiagnostic: txnId + ' | subpackage timeout | direct route'
        });
        console.warn('[flashcard-deck-select] loadSubPackage timed out after ' + LOAD_TIMEOUT_MS + 'ms for deck=' + deckId + ', proceeding with direct navigation');
        navigateToPlayer(false);
      }, LOAD_TIMEOUT_MS);

      wx.loadSubPackage({
        name: deckInfo.packageName,
        success: function () {
          if (callbackCalled) return;
          callbackCalled = true;
          clearTimeout(timeoutHandle);
          txn.loadSubPackageResult = 'success';
          txn.phase = 'subpackage_loaded';
          self.setData({
            lastNavigationDiagnostic: txnId + ' | subpackage loaded | pkg=' + deckInfo.packageName
          });
          wx.nextTick(function () {
            navigateToPlayer(false);
          });
        },
        fail: function (error) {
          if (callbackCalled) return;
          callbackCalled = true;
          clearTimeout(timeoutHandle);
          var errMsg = error && error.errMsg ? error.errMsg : 'unknown';
          txn.loadSubPackageResult = 'fail: ' + errMsg;
          console.error('[flashcard-deck-select] loadSubPackage failed:', errMsg);
          // Subpackage failed — try direct navigation as fallback
          self.setData({
            lastNavigationDiagnostic: txnId + ' | subpackage fail, direct route | ' + errMsg
          });
          navigateToPlayer(false);
        }
      });
    }

    // Determine strategy: loadSubPackage API availability
    if (typeof wx.loadSubPackage !== 'function') {
      txn.loadSubPackageResult = 'api_unavailable';
      txn.phase = 'subpackage_skipped';
      self.setData({
        lastNavigationDiagnostic: txnId + ' | subpackage api unavailable; direct route | deck=' + deckId
      });
      navigateToPlayer(false);
      return;
    }

    _invokeSubPackageAndNavigate();
  },

  /**
   * Called by the player page via pages stack to report that it loaded.
   * player.js in each subpackage should call:
   *   var pages = getCurrentPages();
   *   var prev = pages[pages.length - 2];
   *   if (prev && prev.onPlayerLoaded) prev.onPlayerLoaded({...});
   */
  onPlayerLoaded: function (receipt) {
    if (!receipt) return;
    var lastTxn = getLastTransaction();
    if (lastTxn && lastTxn.phase !== 'player_entered' && lastTxn.phase !== 'failed') {
      lastTxn.phase = 'player_entered';
      lastTxn.playerOnLoadReceipt = {
        deckId: receipt.deckId || '',
        transactionId: receipt.transactionId || lastTxn.transactionId,
        playerPath: receipt.playerPath || '',
        localManifestFound: !!receipt.localManifestFound,
        actualCount: Number(receipt.actualCount || 0),
        expectedCount: Number(receipt.expectedCount || 0),
        route: receipt.route || ''
      };
      this.setData({
        isNavigating: false,
        lastNavigationDiagnostic: lastTxn.transactionId + ' | player_entered | deck=' + receipt.deckId
      });
    }
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
