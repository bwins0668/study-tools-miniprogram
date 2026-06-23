// packages/quiz/data/flashcard_adapter.js
// Unified flashcard data adapter: normalizes questions from all sources
// into a consistent bilingual flashcard format.

var pastExamIndex = require('./past_exam_bank/index');

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

function autoDetectLang(text) {
  if (!text) return 'zh';
  if (hasJapaneseKana(text) || isMostlyJapanese(text)) return 'ja';
  return 'zh';
}

// ---- Normalize a single raw question into flashcard format ----
function normalizeQuestion(raw, fallbackLang) {
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
    sharedHint: raw.shared_hint || ''
  };
}

// ---- Load all questions from a split subpackage ----
function loadSplitQuestions(packageKey) {
  var root = getPackageRoot(packageKey);
  if (!root) return [];
  try {
    var loader = require('../../' + root + '/data/loader');
    return loader.getAllQuestions();
  } catch (e) {
    console.warn('[flashcard_adapter] failed to load', packageKey, e.message);
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
 * @param {string} exam - 'itpass' or 'sg'
 * @returns {Object} { cards: [...], stats: { total, filtered, categories, byYear } }
 */
function getFlashcardDeck(exam) {
  var years = pastExamIndex.getYears(exam);
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

  var normalized = [];
  var filtered = 0;
  var filterReasons = {};
  for (var k = 0; k < allRaw.length; k++) {
    var card = normalizeQuestion(allRaw[k]);
    if (card) {
      normalized.push(card);
    } else {
      filtered++;
    }
  }

  var deduped = dedupeCards(normalized);
  var dedupCount = normalized.length - deduped.length;

  var byYear = {};
  var categories = {};
  for (var m = 0; m < deduped.length; m++) {
    var c = deduped[m];
    var yk = c.examYear || c.yearId || 'unknown';
    if (!byYear[yk]) byYear[yk] = 0;
    byYear[yk]++;
    if (c.category) {
      if (!categories[c.category]) categories[c.category] = 0;
      categories[c.category]++;
    }
  }

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
      years: years
    }
  };
}

/**
 * Get flashcard deck filtered by yearId.
 */
function getFlashcardDeckByYear(exam, yearId) {
  var deck = getFlashcardDeck(exam);
  if (!yearId) return deck;
  deck.cards = deck.cards.filter(function (c) {
    return c.yearId === yearId;
  });
  deck.stats.deduped = deck.cards.length;
  return deck;
}

/**
 * Get flashcard deck filtered by category.
 */
function getFlashcardDeckByCategory(exam, category) {
  var deck = getFlashcardDeck(exam);
  if (!category) return deck;
  deck.cards = deck.cards.filter(function (c) {
    return c.category === category;
  });
  deck.stats.deduped = deck.cards.length;
  return deck;
}

/**
 * Get flashcard progress.
 */
function getFlashcardProgress() {
  try {
    var raw = wx.getStorageSync(FLASHCARD_STATUS_KEY);
    if (raw && typeof raw === 'object') return raw;
  } catch (e) {}
  return null;
}

/**
 * Save flashcard progress.
 */
function saveFlashcardProgress(progress) {
  try {
    wx.setStorageSync(FLASHCARD_STATUS_KEY, progress);
  } catch (e) {
    console.warn('[flashcard_adapter] save progress failed', e);
  }
}

/**
 * Initialize default progress if none exists.
 */
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
  FLASHCARD_STATUS_KEY: FLASHCARD_STATUS_KEY
};
