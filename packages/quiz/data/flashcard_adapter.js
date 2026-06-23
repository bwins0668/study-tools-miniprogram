// packages/quiz/data/flashcard_adapter.js
// Unified flashcard data adapter: normalizes questions from all sources
// into a consistent bilingual flashcard format.
// v2: Adds content status detection and enrichment data loading.

var pastExamIndex = require('./past_exam_bank/index');
var enrichment = require('./flashcard-enrichment/index');

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
  // Check if text has Chinese characters but NOT Japanese kana
  var hasChinese = false;
  var hasKana = false;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0x4E00 && c <= 0x9FFF) hasChinese = true;
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) hasKana = true;
  }
  // Genuine Chinese: has Chinese chars, no kana, or very few kana
  if (hasChinese && !hasKana) return true;
  // Allow some kana if Chinese chars dominate
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

  // Override with enrichment data if present
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

// ---- Load all questions from a split subpackage ----
function loadSplitQuestions(packageKey) {
  var root = getPackageRoot(packageKey);
  if (!root) {
    console.warn('[flashcard_adapter] no root for packageKey:', packageKey);
    return [];
  }
  try {
    console.log('[flashcard_adapter] loading package:', packageKey, '->', root);
    var loader = require('../../' + root + '/data/loader');
    var questions = loader.getAllQuestions();
    console.log('[flashcard_adapter] loaded', questions.length, 'questions from', packageKey);
    return questions;
  } catch (e) {
    console.error('[flashcard_adapter] FAILED to load', packageKey, ':', e.message);
    console.error('[flashcard_adapter] stack:', e.stack);
    return [];
  }
}

function getPackageRoot(packageKey) {
  var mapping = {
    'itpass-1': 'quiz-itpass-1',
    'itpass-2': 'quiz-itpass-2',
    'itpass-3': 'quiz-itpass-3',
    'itpass-4': 'quiz-itpass-4',
    'itpass-5': 'quiz-itpass-5',
    'sg-1': 'quiz-sg-1',
    'sg-2': 'quiz-sg-2'
  };
  return mapping[packageKey] || '';
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

// ---- Public API ----

/**
 * Get all flashcard data for a given exam type.
 * Now loads enrichment data and detects content status.
 */
function getFlashcardDeck(exam) {
  console.log('[flashcard_adapter] getFlashcardDeck start, exam=' + exam);
  var years = pastExamIndex.getYears(exam);
  console.log('[flashcard_adapter] years:', years.length);
  var allRaw = [];
  var loadedPackages = {};

  for (var i = 0; i < years.length; i++) {
    var pkg = years[i].packageKey;
    if (!loadedPackages[pkg]) {
      loadedPackages[pkg] = loadSplitQuestions(pkg);
    }
    var pkgQuestions = loadedPackages[pkg];
    var yearId = years[i].yearId;
    for (var j = 0; j < pkgQuestions.length; j++) {
      if (pkgQuestions[j].yearId === yearId && pkgQuestions[j].exam === exam) {
        allRaw.push(pkgQuestions[j]);
      }
    }
  }
  console.log('[flashcard_adapter] allRaw:', allRaw.length);

  // Load all enrichment chunks for this course
  enrichment.loadAllChunksForCourse(exam);

  var normalized = [];
  var filtered = 0;
  for (var k = 0; k < allRaw.length; k++) {
    var card = normalizeQuestion(allRaw[k]);
    if (card) {
      // Try to apply enrichment
      var enrich = enrichment.getEnrichmentForCard(exam, card.sourceId);
      if (enrich) {
        card = applyEnrichment(card, enrich);
      }
      // Detect content status if not set by enrichment
      if (card.contentStatus === 'japanese_only') {
        card.contentStatus = detectContentStatus(card);
      }
      normalized.push(card);
    } else {
      filtered++;
    }
  }

  var deduped = dedupeCards(normalized);
  var dedupCount = normalized.length - deduped.length;

  var byYear = {};
  var categories = {};
  var contentStats = { japanese_only: 0, bilingual_partial: 0, bilingual_complete: 0 };
  for (var m = 0; m < deduped.length; m++) {
    var c = deduped[m];
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

  console.log('[flashcard_adapter] getFlashcardDeck done:', {
    exam: exam,
    total: allRaw.length,
    deduped: deduped.length,
    byYear: Object.keys(byYear).length
  });

  return {
    cards: deduped,
    stats: {
      total: allRaw.length,
      normalized: normalized.length,
      filtered: filtered,
      deduped: deduped.length,
      dedupCount: dedupCount,
      categories: categories,
      byYear: byYear,
      years: years,
      contentStatus: contentStats
    }
  };
}

function getFlashcardDeckByYear(exam, yearId) {
  var deck = getFlashcardDeck(exam);
  if (!yearId) return deck;
  deck.cards = deck.cards.filter(function (c) {
    return c.yearId === yearId;
  });
  deck.stats.deduped = deck.cards.length;
  return deck;
}

function getFlashcardDeckByCategory(exam, category) {
  var deck = getFlashcardDeck(exam);
  if (!category) return deck;
  deck.cards = deck.cards.filter(function (c) {
    return c.category === category;
  });
  deck.stats.deduped = deck.cards.length;
  return deck;
}

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

function initFlashcardProgress(exam, deckLabel) {
  var existing = getFlashcardProgress();
  if (existing) return existing;
  var progress = {
    exam: exam || 'itpass',
    examTitle: exam === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡',
    deckLabel: deckLabel || '年度模拟',
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
  getFlashcardDeck: getFlashcardDeck,
  getFlashcardDeckByYear: getFlashcardDeckByYear,
  getFlashcardDeckByCategory: getFlashcardDeckByCategory,
  getFlashcardProgress: getFlashcardProgress,
  saveFlashcardProgress: saveFlashcardProgress,
  initFlashcardProgress: initFlashcardProgress,
  FLASHCARD_STATUS_KEY: FLASHCARD_STATUS_KEY,
  detectContentStatus: detectContentStatus,
  isGenuineChinese: isGenuineChinese
};
