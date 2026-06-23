// packages/quiz/data/flashcard_adapter.js
// v3: Async subpackage loading via wx.loadSubPackage + App global data bridge.
// NO cross-subpackage require — data is registered by each subpackage's flashcard-export.js
// onto getApp().globalData.__flashcard_cache after wx.loadSubPackage + bridge-page visit.
'use strict';

var pastExamIndex = require('./past_exam_bank/index');
var enrichment = require('./flashcard-enrichment/index');
var manifest = require('./flashcard-manifest');

var FLASHCARD_STATUS_KEY = 'flashcard_progress_v1';

// ---- HTML cleaning (shared with quiz pages) ----
function stripHtmlTags(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function hasJapaneseKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function isMostlyJapanese(text) {
  if (!text || text.length < 5) return false;
  var count = 0;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF) || (c >= 0x4E00 && c <= 0x9FFF)) {
      count++;
    }
  }
  return count / text.length > 0.3;
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

// ---- Content status detection ----
function detectContentStatus(card) {
  var hasRealZhQuestion = card.questionZh && card.questionZh !== card.questionJa && isGenuineChinese(card.questionZh);
  var hasRealZhOptions = false;
  var hasOptionExplanations = false;
  var hasMnemonic = !!(card.mnemonicJa || card.mnemonicZh);

  if (card.options && card.options.length > 0) {
    var zhOptCount = 0;
    var explCount = 0;
    for (var i = 0; i < card.options.length; i++) {
      var o = card.options[i];
      if (o.textZh && o.textZh !== o.textJa && isGenuineChinese(o.textZh)) zhOptCount++;
      if (o.explanationJa || o.explanationZh) explCount++;
    }
    hasRealZhOptions = zhOptCount === card.options.length;
    hasOptionExplanations = explCount === card.options.length;
  }

  var hasRealZhExplanation = card.explanationZh && card.explanationZh !== card.explanationJa && isGenuineChinese(card.explanationZh);
  var hasRealMnemonic = (card.mnemonicJa && card.mnemonicJa.length > 5) || (card.mnemonicZh && isGenuineChinese(card.mnemonicZh));

  if (hasRealZhQuestion && hasRealZhOptions && hasOptionExplanations && hasRealZhExplanation && hasRealMnemonic) {
    return 'bilingual_complete';
  }
  if (hasRealZhQuestion || hasRealZhOptions || hasRealZhExplanation) {
    return 'bilingual_partial';
  }
  return 'japanese_only';
}

// ---- Normalize a single raw question into flashcard format ----
function normalizeQuestion(raw) {
  if (!raw || !raw.id) return null;

  var qJa = stripHtmlTags(raw.questionJa || '');
  var qZh = stripHtmlTags(raw.questionZh || '');

  if (!qJa && !qZh) return null;

  var options = Array.isArray(raw.options) ? raw.options : [];
  if (options.length < 2) return null;

  var normalizedOptions = [];
  var hasCorrect = false;
  var hasValidOptions = true;
  for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var optJa = stripHtmlTags(opt.textJa || opt.text || '');
    var optZh = stripHtmlTags(opt.textZh || opt.text || '');
    if (!optJa && !optZh) {
      hasValidOptions = false;
      break;
    }
    var isCorrect = opt.key === raw.answer || opt.isCorrect === true;
    if (isCorrect) hasCorrect = true;

    normalizedOptions.push({
      key: opt.key || String.fromCharCode(65 + i),
      textJa: optJa,
      textZh: optZh,
      isCorrect: isCorrect,
      explanationJa: stripHtmlTags(opt.explanationJa || ''),
      explanationZh: stripHtmlTags(opt.explanationZh || '')
    });
  }

  if (!hasCorrect || !hasValidOptions) return null;

  var explanationJa = stripHtmlTags(raw.explanationJa || '');
  var explanationZh = stripHtmlTags(raw.explanationZh || '');

  var examYear = raw.year || '';
  var examLabel = raw.label || raw.year || '';
  var category = raw.category || '';

  return {
    id: 'fc_' + raw.id,
    sourceId: raw.id,
    course: raw.exam === 'sg' ? 'sg' : 'itpass',
    sourceType: raw.sourceType || 'past_exam_japanese',
    sourceReference: raw.source || '',
    examYear: examYear,
    examLabel: examLabel,
    yearId: raw.yearId || '',
    number: raw.number || 0,
    category: category,
    level: raw.level || '',
    questionJa: qJa || qZh,
    questionZh: qZh || qJa,
    options: normalizedOptions,
    answer: raw.answer || '',
    explanationJa: explanationJa,
    explanationZh: explanationZh,
    mnemonicJa: raw.mnemonicJa || '',
    mnemonicZh: raw.mnemonicZh || '',
    translationStatus: raw.translationStatus || '',
    explanationStatus: raw.explanationStatus || '',
    sharedHint: raw.shared_hint || '',
    contentStatus: 'japanese_only',
    contentOrigin: 'source',
    reviewStatus: 'pending'
  };
}

// ---- Apply enrichment data to a card ----
function applyEnrichment(card, enrich) {
  if (!enrich) return card;

  var merged = {};
  for (var k in card) { merged[k] = card[k]; }

  if (enrich.questionZh) merged.questionZh = enrich.questionZh;
  if (enrich.options && Array.isArray(enrich.options)) {
    for (var i = 0; i < merged.options.length && i < enrich.options.length; i++) {
      var eo = enrich.options[i];
      if (eo.textZh) merged.options[i].textZh = eo.textZh;
      if (eo.explanationJa) merged.options[i].explanationJa = eo.explanationJa;
      if (eo.explanationZh) merged.options[i].explanationZh = eo.explanationZh;
    }
  }
  if (enrich.explanationJa) merged.explanationJa = enrich.explanationJa;
  if (enrich.explanationZh) merged.explanationZh = enrich.explanationZh;
  if (enrich.mnemonicJa) merged.mnemonicJa = enrich.mnemonicJa;
  if (enrich.mnemonicZh) merged.mnemonicZh = enrich.mnemonicZh;
  if (enrich.contentStatus) merged.contentStatus = enrich.contentStatus;
  if (enrich.contentOrigin) merged.contentOrigin = enrich.contentOrigin;
  if (enrich.reviewStatus) merged.reviewStatus = enrich.reviewStatus;

  return merged;
}

// ---- Dedup by normalized stem + options + answer ----
function normalizeQuizText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[Ａ-Ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[ａ-ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .toLowerCase();
}

function dedupeCards(cards) {
  var seen = Object.create(null);
  return cards.filter(function (c) {
    var stem = normalizeQuizText(c.questionZh || c.questionJa || '');
    var opts = normalizeQuizText(c.options.map(function (o) { return (o.textZh || o.textJa || '').trim(); }).join('|'));
    var ans = normalizeQuizText(c.answer || '');
    var key = stem + '|' + opts + '|' + ans;
    if (!key || key === '||') return true;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

/**
 * Load raw questions from a single subpackage's cached data.
 * Cross-subpackage require is NOT used — data must be pre-registered on
 * getApp().globalData.__flashcard_cache[packageKey] by the subpackage's
 * flashcard-export.js (triggered via bridge page after wx.loadSubPackage).
 */
function getCachedQuestions(packageKey) {
  try {
    var app = getApp();
    if (!app || !app.globalData || !app.globalData.__flashcard_cache) {
      return null;
    }
    var cache = app.globalData.__flashcard_cache[packageKey];
    if (!cache || !Array.isArray(cache) || cache.length === 0) {
      return null;
    }
    return cache;
  } catch (e) {
    console.error('[flashcard_adapter] getCachedQuestions error:', e);
    return null;
  }
}

/**
 * Load flashcard deck for a specific course + yearId via subpackage loading.
 * Returns a promise that resolves with { cards, stats } or rejects with error.
 * Uses wx.loadSubPackage → navigate to bridge page → EventChannel → resolve.
 */
function loadDeckAsync(course, yearId) {
  return new Promise(function (resolve, reject) {
    console.log('[flashcard_adapter] loadDeckAsync', { course: course, yearId: yearId });

    var deckInfo = manifest.getDeckInfo(course, yearId);
    if (!deckInfo) {
      reject(new Error('找不到牌组信息: ' + course + '/' + yearId));
      return;
    }

    console.log('[flashcard_adapter] deck info:', deckInfo);

    // First check if data is already cached
    var cached = getCachedQuestions(deckInfo.packageKey);
    if (cached && cached.length > 0) {
      console.log('[flashcard_adapter] using cached data for', deckInfo.packageKey, cached.length, 'questions');
      processRawQuestions(cached, course, yearId, resolve, reject);
      return;
    }

    console.log('[flashcard_adapter] loading subpackage:', deckInfo.packageName);

    // Load the subpackage
    wx.loadSubPackage({
      name: deckInfo.packageName,
      success: function () {
        console.log('[flashcard_adapter] subpackage loaded:', deckInfo.packageName);
        // Navigate to bridge page to trigger module registration
        wx.navigateTo({
          url: deckInfo.bridgeRoute,
          success: function (res) {
            // Listen for data-ready event from bridge page
            if (res && res.eventChannel) {
              res.eventChannel.on('flashcardDataReady', function (data) {
                console.log('[flashcard_adapter] bridge data ready:', data);
                // Read cached data
                var questions = getCachedQuestions(deckInfo.packageKey);
                if (questions && questions.length > 0) {
                  processRawQuestions(questions, course, yearId, resolve, reject);
                } else {
                  // Maybe onShow will catch it after navigateBack
                  setTimeout(function () {
                    var retry = getCachedQuestions(deckInfo.packageKey);
                    if (retry && retry.length > 0) {
                      processRawQuestions(retry, course, yearId, resolve, reject);
                    } else {
                      reject(new Error('数据加载后缓存仍为空: ' + deckInfo.packageKey));
                    }
                  }, 300);
                }
              });
            } else {
              // Fallback: poll for cached data after bridge page loads and navigates back
              console.log('[flashcard_adapter] no eventChannel, using fallback poll');
              waitForCache(deckInfo.packageKey, course, yearId, resolve, reject, 0);
            }
          },
          fail: function (err) {
            console.error('[flashcard_adapter] navigate to bridge failed:', err);
            reject(new Error('无法加载闪卡模块: ' + (err.errMsg || err.message || 'unknown')));
          }
        });
      },
      fail: function (err) {
        console.error('[flashcard_adapter] loadSubPackage failed:', err);
        reject(new Error('subpackage 加载失败: ' + deckInfo.packageName + ' - ' + (err.errMsg || err.message || 'unknown')));
      }
    });
  });
}

/**
 * Fallback: poll __flashcard_cache after bridge page triggers navigateBack.
 */
function waitForCache(packageKey, course, yearId, resolve, reject, attempt) {
  if (attempt > 20) {  // max ~4 seconds
    console.error('[flashcard_adapter] waitForCache timeout for', packageKey);
    reject(new Error('闪卡数据加载超时'));
    return;
  }
  var cached = getCachedQuestions(packageKey);
  if (cached && cached.length > 0) {
    console.log('[flashcard_adapter] waitForCache found', cached.length, 'questions for', packageKey, 'after', attempt, 'polls');
    processRawQuestions(cached, course, yearId, resolve, reject);
    return;
  }
  setTimeout(function () {
    waitForCache(packageKey, course, yearId, resolve, reject, attempt + 1);
  }, 200);
}

/**
 * Process raw questions into flashcard format, apply enrichment, dedup, filter.
 */
function processRawQuestions(rawQuestions, course, yearId, resolve, reject) {
  try {
    console.log('[flashcard_adapter] processing', rawQuestions.length, 'raw questions');

    // Filter by yearId
    var filtered = rawQuestions.filter(function (q) {
      return q.exam === course && q.yearId === yearId;
    });

    console.log('[flashcard_adapter] after yearId filter:', filtered.length);

    if (filtered.length === 0) {
      reject(new Error('该牌组 (' + yearId + ') 无有效题目'));
      return;
    }

    // Normalize
    var normalized = [];
    var filteredCount = 0;
    for (var i = 0; i < filtered.length; i++) {
      var card = normalizeQuestion(filtered[i]);
      if (card) {
        // Apply enrichment
        var enrich = enrichment.getEnrichmentForCard(course, card.sourceId);
        if (enrich) {
          card = applyEnrichment(card, enrich);
        }
        if (card.contentStatus === 'japanese_only') {
          card.contentStatus = detectContentStatus(card);
        }
        normalized.push(card);
      } else {
        filteredCount++;
      }
    }

    // Dedup
    var deduped = dedupeCards(normalized);
    var dedupCount = normalized.length - deduped.length;

    // Enrichment is loaded lazily from main package — safe to call here
    enrichment.loadAllChunksForCourse(course);

    // Stats
    var byYear = {};
    var categories = {};
    var contentStats = { japanese_only: 0, bilingual_partial: 0, bilingual_complete: 0 };
    for (var j = 0; j < deduped.length; j++) {
      var c = deduped[j];
      var yk = c.examYear || c.yearId || 'unknown';
      if (!byYear[yk]) byYear[yk] = 0;
      byYear[yk]++;
      if (c.category) {
        if (!categories[c.category]) categories[c.category] = 0;
        categories[c.category]++;
      }
      if (contentStats[c.contentStatus] !== undefined) {
        contentStats[c.contentStatus]++;
      }
    }

    var result = {
      cards: deduped,
      stats: {
        total: filtered.length,
        normalized: normalized.length,
        filtered: filteredCount,
        deduped: deduped.length,
        dedupCount: dedupCount,
        categories: categories,
        byYear: byYear,
        contentStatus: contentStats
      }
    };

    console.log('[flashcard_adapter] loadDeckAsync done:', {
      course: course,
      yearId: yearId,
      total: filtered.length,
      deduped: deduped.length
    });

    resolve(result);
  } catch (e) {
    console.error('[flashcard_adapter] processRawQuestions error:', e);
    reject(new Error('题卡数据处理失败: ' + e.message));
  }
}

// ---- Progress persistence ----
function getFlashcardProgress() {
  try {
    var raw = wx.getStorageSync(FLASHCARD_STATUS_KEY);
    if (raw && typeof raw === 'object') return raw;
  } catch (e) {}
  return null;
}

function saveFlashcardProgress(progress) {
  try {
    wx.setStorageSync(FLASHCARD_STATUS_KEY, progress);
  } catch (e) {
    console.warn('[flashcard_adapter] save progress failed', e);
  }
}

function initFlashcardProgress(exam, deckLabel, yearId) {
  var existing = getFlashcardProgress();
  if (existing) return existing;
  var progress = {
    exam: exam || 'itpass',
    examTitle: exam === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡',
    deckLabel: deckLabel || '年度模拟',
    yearId: yearId || '',
    currentIndex: 0,
    total: 0,
    answeredList: [],
    wrongIds: [],
    sessionCorrect: 0,
    sessionWrong: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  saveFlashcardProgress(progress);
  return progress;
}

module.exports = {
  stripHtmlTags: stripHtmlTags,
  normalizeQuestion: normalizeQuestion,
  dedupeCards: dedupeCards,
  loadDeckAsync: loadDeckAsync,
  getDeckInfo: manifest.getDeckInfo,
  getDecksForCourse: manifest.getDecksForCourse,
  getCachedQuestions: getCachedQuestions,
  getFlashcardProgress: getFlashcardProgress,
  saveFlashcardProgress: saveFlashcardProgress,
  initFlashcardProgress: initFlashcardProgress,
  FLASHCARD_STATUS_KEY: FLASHCARD_STATUS_KEY,
  detectContentStatus: detectContentStatus,
  isGenuineChinese: isGenuineChinese,
  // @deprecated Node.js only shim - not for WeChat runtime (will fail cross-subpackage require)
  getFlashcardDeck: function (exam) {
    console.warn('[flashcard_adapter] getFlashcardDeck is DEPRECATED in WeChat runtime. Use loadDeckAsync(course, yearId).');
    var years = pastExamIndex.getYears(exam);
    var allRaw = [];
    for (var i = 0; i < years.length; i++) {
      try {
        var pkgDir = years[i].packageRoot.replace('packages/', '');
        var loader = require('../../' + pkgDir + '/data/loader');
        var pkgQs = loader.getAllQuestions();
        for (var j = 0; j < pkgQs.length; j++) {
          if (pkgQs[j].exam === exam && pkgQs[j].yearId === years[i].yearId) {
            allRaw.push(pkgQs[j]);
          }
        }
      } catch (e) {
        console.warn('[flashcard_adapter] shim: failed to load', years[i].packageKey, e.message);
      }
    }
    enrichment.loadAllChunksForCourse(exam);
    var normalized = [];
    for (var k = 0; k < allRaw.length; k++) {
      var card = normalizeQuestion(allRaw[k]);
      if (card) {
        var enrich = enrichment.getEnrichmentForCard(exam, card.sourceId);
        if (enrich) card = applyEnrichment(card, enrich);
        if (card.contentStatus === 'japanese_only') card.contentStatus = detectContentStatus(card);
        normalized.push(card);
      }
    }
    var deduped = dedupeCards(normalized);
    var byYear = {}; var categories = {}; var contentStats = { japanese_only: 0, bilingual_partial: 0, bilingual_complete: 0 };
    for (var m = 0; m < deduped.length; m++) {
      var c = deduped[m];
      var yk = c.examYear || c.yearId || 'unknown';
      if (!byYear[yk]) byYear[yk] = 0; byYear[yk]++;
      if (c.category) { if (!categories[c.category]) categories[c.category] = 0; categories[c.category]++; }
      if (contentStats[c.contentStatus] !== undefined) contentStats[c.contentStatus]++;
    }
    return {
      cards: deduped,
      stats: { total: allRaw.length, normalized: normalized.length, filtered: allRaw.length - normalized.length, deduped: deduped.length, dedupCount: normalized.length - deduped.length, categories: categories, byYear: byYear, years: years, contentStatus: contentStats }
    };
  }
};
