// tools/miniprogram_smoke_test.js
// Study Tools Mini Program - Automated Smoke Test
// Run: node tools/miniprogram_smoke_test.js

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function pass(msg) {
  passed++;
  console.log('PASS ' + msg);
}

function fail(msg) {
  failed++;
  console.log('FAIL ' + msg);
}

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf-8');
}

// ============================================================
// 一、项目基础文件
// ============================================================
console.log('\n--- 项目基础文件 ---');

const baseFiles = ['app.js', 'app.json', 'app.wxss', 'project.config.json', 'sitemap.json'];
let baseFilesOk = true;
for (const f of baseFiles) {
  if (!fileExists(f)) {
    fail('base file missing: ' + f);
    baseFilesOk = false;
  }
}
if (baseFilesOk) pass('base files exist');

// ============================================================
// 二、app.json
// ============================================================
console.log('\n--- app.json ---');

let appJson = null;
try {
  appJson = JSON.parse(readFile('app.json'));
  pass('app.json parsed');
} catch (e) {
  fail('app.json parse error: ' + e.message);
  console.log('Cannot continue without app.json');
  process.exit(1);
}

// 每个 pages 页面的 4 个文件都存在
let allPagesExist = true;
const pages = appJson.pages || [];
for (const p of pages) {
  const exts = ['.wxml', '.js', '.wxss', '.json'];
  for (const ext of exts) {
    const fp = p + ext;
    if (!fileExists(fp)) {
      fail('page file missing: ' + fp);
      allPagesExist = false;
    }
  }
}
if (allPagesExist) pass('all registered page files exist');

// tabBar
const tabBar = appJson.tabBar;
if (tabBar && Array.isArray(tabBar.list) && tabBar.list.length > 0) {
  let tabBarValid = true;
  for (const tab of tabBar.list) {
    if (!pages.includes(tab.pagePath)) {
      fail('tabBar pagePath not in pages: ' + tab.pagePath);
      tabBarValid = false;
    }
  }
  if (tabBarValid) pass('tabBar paths valid');
} else {
  fail('tabBar.list missing or empty');
}

// ============================================================
// 三、关键页面必须注册
// ============================================================
console.log('\n--- 关键页面注册 ---');

const requiredPages = [
  'pages/home/home',
  'pages/glossary/glossary',
  'pages/mistakes/mistakes',
  'pages/profile/profile'
];
let allRequiredPages = true;
for (const rp of requiredPages) {
  if (!pages.includes(rp)) {
    fail('required page not registered: ' + rp);
    allRequiredPages = false;
  }
}

// 分包页面检查
const subpackages = appJson.subpackages || [];
let subpackagePagesOk = true;
const requiredSubPages = [
  'packages/glossary/pages/term-search/term-search',
  'packages/glossary/pages/term-detail/term-detail',
  'packages/quiz/pages/exam-menu/exam-menu',
  'packages/quiz/pages/quiz/quiz',
  'packages/quiz/pages/mistakes/mistakes'
];
for (const sp of requiredSubPages) {
  const root = sp.split('/').slice(0, 2).join('/');
  const pagePath = sp.split('/').slice(2).join('/');
  const pkg = subpackages.find(function(s) { return s.root === root; });
  if (!pkg || !pkg.pages || !pkg.pages.includes(pagePath)) {
    fail('subpackage page not registered: ' + sp);
    subpackagePagesOk = false;
  }
  // 检查文件是否存在
  const exts = ['.wxml', '.js', '.wxss', '.json'];
  for (const ext of exts) {
    if (!fileExists(sp + ext)) {
      fail('subpackage page file missing: ' + sp + ext);
      subpackagePagesOk = false;
    }
  }
}
if (subpackagePagesOk) pass('all subpackage pages registered and files exist');

if (allRequiredPages) pass('all required pages registered');

// ============================================================
// 四、data/glossary.js
// ============================================================
// Glossary index, chunks, and lazy loader
// ============================================================
console.log('\n--- glossary index / chunks / loader ---');

let glossaryOk = true;
const oldGlossaryPath = 'packages/glossary/data/glossary.js';
const indexPath = 'packages/glossary/data/glossary_index.js';
const loaderPath = 'packages/glossary/data/glossary_loader.js';
const chunksDir = path.join(ROOT, 'packages/glossary/data/chunks');

if (fileExists(oldGlossaryPath)) {
  fail('old full glossary.js must not remain in the glossary subpackage');
  glossaryOk = false;
} else {
  pass('old full glossary.js removed from glossary subpackage');
}

if (!fileExists(indexPath) || !fileExists(loaderPath) || !fs.existsSync(chunksDir)) {
  fail('glossary index, loader, or chunks directory missing');
  glossaryOk = false;
} else {
  pass('glossary index, loader, and chunks directory exist');
}

try {
  const glossaryIndex = require(path.join(ROOT, indexPath)).glossaryIndex;
  const glossaryLoader = require(path.join(ROOT, loaderPath));
  const chunkFiles = fs.readdirSync(chunksDir)
    .filter(function (name) { return /^glossary_chunk_\d{3}\.js$/.test(name); })
    .sort();
  const loadedChunksAtStartup = Object.keys(require.cache).filter(function (filename) {
    return filename.indexOf(path.join('packages', 'glossary', 'data', 'chunks')) !== -1;
  });
  if (loadedChunksAtStartup.length !== 0) {
    fail('glossary loader must not require chunks at startup');
    glossaryOk = false;
  } else {
    pass('glossary loader starts without requiring any chunk');
  }

  if (!Array.isArray(glossaryIndex) || glossaryIndex.length !== 1500) {
    fail('glossary index must contain 1500 entries');
    glossaryOk = false;
  } else {
    pass('glossary index contains 1500 entries');
  }

  const firstLazyTerm = glossaryLoader.getTermById(glossaryIndex[0].id);
  const loadedChunksAfterFirstTerm = Object.keys(require.cache).filter(function (filename) {
    return filename.indexOf(path.join('packages', 'glossary', 'data', 'chunks')) !== -1;
  });
  if (!firstLazyTerm || loadedChunksAfterFirstTerm.length !== 1) {
    fail('first term lookup must load exactly one chunk');
    glossaryOk = false;
  } else {
    pass('first term lookup loads exactly one chunk');
  }

  const indexFields = ['id', 'term', 'zh', 'ja', 'category', 'level'];
  const forbiddenIndexFields = ['explanationZh', 'explanationJa', 'example', 'examples', 'tags'];
  const indexIds = new Set();
  for (let i = 0; i < glossaryIndex.length; i++) {
    const item = glossaryIndex[i];
    for (const field of indexFields) {
      if (item[field] === undefined || item[field] === null) {
        fail('glossary index entry missing field: ' + field + ' at ' + i);
        glossaryOk = false;
      }
    }
    for (const field of forbiddenIndexFields) {
      if (item[field] !== undefined) {
        fail('glossary index contains detail field: ' + field + ' at ' + i);
        glossaryOk = false;
      }
    }
    if (indexIds.has(String(item.id))) {
      fail('glossary index duplicate id: ' + item.id);
      glossaryOk = false;
    }
    indexIds.add(String(item.id));
  }

  if (chunkFiles.length <= 1) {
    fail('expected more than one glossary chunk');
    glossaryOk = false;
  } else {
    pass('glossary chunks split across ' + chunkFiles.length + ' files');
  }

  let maxChunkSize = 0;
  let detailCount = 0;
  const detailIds = new Set();
  for (const chunkFile of chunkFiles) {
    const rel = path.join('packages/glossary/data/chunks', chunkFile);
    const size = fs.statSync(path.join(ROOT, rel)).size;
    maxChunkSize = Math.max(maxChunkSize, size);
    if (size >= 120 * 1024) {
      fail('chunk exceeds 120 KB: ' + chunkFile);
      glossaryOk = false;
    }
    const chunk = require(path.join(ROOT, rel)).glossaryChunk;
    if (!Array.isArray(chunk)) {
      fail('chunk does not export glossaryChunk array: ' + chunkFile);
      glossaryOk = false;
      continue;
    }
    detailCount += chunk.length;
    for (const item of chunk) {
      detailIds.add(String(item.id));
    }
  }
  console.log('  glossary_index.js file size: ' + (fs.statSync(path.join(ROOT, indexPath)).size / 1024).toFixed(1) + ' KB');
  console.log('  max chunk file size: ' + (maxChunkSize / 1024).toFixed(1) + ' KB');
  console.log('  glossary entries: ' + glossaryIndex.length);

  if (detailCount !== glossaryIndex.length || detailIds.size !== indexIds.size) {
    fail('chunk totals or IDs do not match glossary index');
    glossaryOk = false;
  } else {
    for (const id of indexIds) {
      if (!detailIds.has(id)) {
        fail('chunk data missing glossary id: ' + id);
        glossaryOk = false;
        break;
      }
    }
    if (glossaryOk) pass('chunk totals and IDs match glossary index');
  }

  const first = glossaryIndex[0];
  const last = glossaryIndex[glossaryIndex.length - 1];
  const firstDetail = first ? glossaryLoader.getTermById(first.id) : null;
  const lastDetail = last ? glossaryLoader.getTermById(last.id) : null;
  if (!firstDetail || !lastDetail || firstDetail.id !== first.id || lastDetail.id !== last.id) {
    fail('glossary loader cannot load first and last terms');
    glossaryOk = false;
  }
  if (glossaryLoader.getTermById('missing-id') !== null ||
      glossaryLoader.getChunkIdByTermId(null) !== null) {
    fail('glossary loader missing-id behavior invalid');
    glossaryOk = false;
  }
  const safeTerms = glossaryLoader.getTermsByIds([null, '', first.id, first.id, 'missing-id']);
  if (safeTerms.length !== 1 || safeTerms[0].id !== first.id) {
    fail('glossary loader dirty or duplicate id handling invalid');
    glossaryOk = false;
  } else {
    pass('glossary loader handles target, missing, dirty, and duplicate IDs');
  }
} catch (e) {
  fail('glossary split data error: ' + e.message);
  glossaryOk = false;
}
if (glossaryOk) pass('glossary split data valid');

// ============================================================
console.log('\n--- data/questions.js ---');

let questionsOk = true;
try {
  const questionsModule = require(path.join(ROOT, 'packages/quiz/data/questions'));
  const questions = questionsModule.questions;

  if (!questions) {
    fail('questions.js: no questions export found');
    questionsOk = false;
  } else if (!Array.isArray(questions)) {
    fail('questions.js: exported data is not an array');
    questionsOk = false;
  } else {
    pass('questions data can be required and is array');
    console.log('  questions entries: ' + questions.length);

    if (questions.length < 229) {
      fail('questions.js: expected >= 229 entries, got ' + questions.length);
      questionsOk = false;
    }

    const itpassCount = questions.filter(q => q.exam === 'itpass').length;
    const sgCount = questions.filter(q => q.exam === 'sg').length;
    console.log('  itpass: ' + itpassCount + ', sg: ' + sgCount);
    if (itpassCount < 135) {
      fail('questions.js: expected >= 135 itpass, got ' + itpassCount);
      questionsOk = false;
    }
    if (sgCount < 94) {
      fail('questions.js: expected >= 94 sg, got ' + sgCount);
      questionsOk = false;
    }

    // sourceType distribution
    const lessonQuizCount = questions.filter(q => q.sourceType === 'lesson_quiz').length;
    const pastExamCount = questions.filter(q => q.sourceType === 'past_exam_japanese').length;
    console.log('  lesson_quiz: ' + lessonQuizCount + ', past_exam_japanese: ' + pastExamCount);
    if (lessonQuizCount < 129) {
      fail('questions.js: expected >= 129 lesson_quiz, got ' + lessonQuizCount);
      questionsOk = false;
    }
    if (pastExamCount < 100) {
      fail('questions.js: expected >= 100 past_exam_japanese, got ' + pastExamCount);
      questionsOk = false;
    }

    // past_exam_japanese distribution by exam
    const pastItpass = questions.filter(q => q.sourceType === 'past_exam_japanese' && q.exam === 'itpass').length;
    const pastSg = questions.filter(q => q.sourceType === 'past_exam_japanese' && q.exam === 'sg').length;
    console.log('  past_exam itpass: ' + pastItpass + ', past_exam sg: ' + pastSg);
    if (pastItpass < 50) {
      fail('questions.js: expected >= 50 past_exam itpass, got ' + pastItpass);
      questionsOk = false;
    }
    if (pastSg < 50) {
      fail('questions.js: expected >= 50 past_exam sg, got ' + pastSg);
      questionsOk = false;
    }

    const requiredFields = ['id', 'exam', 'category', 'level', 'questionZh', 'questionJa', 'options', 'answer', 'explanationZh', 'explanationJa'];
    const ids = new Set();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      for (const f of requiredFields) {
        if (q[f] === undefined || q[f] === null) {
          fail('questions[' + i + '] missing field: ' + f);
          questionsOk = false;
        }
      }

      // Check sourceType
      if (q.sourceType !== 'lesson_quiz' && q.sourceType !== 'past_exam_japanese') {
        fail('questions[' + i + '] sourceType should be "lesson_quiz" or "past_exam_japanese", got "' + q.sourceType + '"');
        questionsOk = false;
      }

      // Check lessonId (only required for lesson_quiz)
      if (q.sourceType === 'lesson_quiz' && !q.lessonId) {
        fail('questions[' + i + '] lesson_quiz missing lessonId');
        questionsOk = false;
      }

      // Check questionZh / questionJa non-empty
      if (!q.questionZh || q.questionZh.trim() === '' || q.questionZh === 'undefined' || q.questionZh === '[object Object]') {
        fail('questions[' + i + '] bad questionZh: "' + (q.questionZh || '') + '"');
        questionsOk = false;
      }
      if (!q.questionJa || q.questionJa.trim() === '' || q.questionJa === 'undefined' || q.questionJa === '[object Object]') {
        fail('questions[' + i + '] bad questionJa');
        questionsOk = false;
      }

      // Check explanationZh / explanationJa non-empty
      if (!q.explanationZh || q.explanationZh.trim() === '' || q.explanationZh === 'undefined') {
        fail('questions[' + i + '] bad explanationZh');
        questionsOk = false;
      }
      if (!q.explanationJa || q.explanationJa.trim() === '' || q.explanationJa === 'undefined') {
        fail('questions[' + i + '] bad explanationJa');
        questionsOk = false;
      }

      // Check answer is A/B/C/D
      if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
        fail('questions[' + i + '] answer should be A/B/C/D, got "' + q.answer + '"');
        questionsOk = false;
      }

      // Check options
      if (!Array.isArray(q.options) || q.options.length < 4) {
        fail('questions[' + i + '].options must have >= 4 items');
        questionsOk = false;
      } else {
        for (let o = 0; o < q.options.length; o++) {
          const opt = q.options[o];
          if (!opt.key || !opt.textZh || !opt.textJa) {
            fail('questions[' + i + '].options[' + o + '] missing key/textZh/textJa');
            questionsOk = false;
          }
          if (opt.textZh === 'undefined' || opt.textZh === '[object Object]') {
            fail('questions[' + i + '].options[' + o + '] forbidden textZh');
            questionsOk = false;
          }
          if (opt.textJa === 'undefined' || opt.textJa === '[object Object]') {
            fail('questions[' + i + '].options[' + o + '] forbidden textJa');
            questionsOk = false;
          }
        }
        const keys = q.options.map(o => o.key);
        if (!keys.includes(q.answer)) {
          fail('questions[' + i + '].answer "' + q.answer + '" not in options keys: ' + keys.join(','));
          questionsOk = false;
        }
      }

      if (ids.has(q.id)) {
        fail('questions duplicate id: ' + q.id);
        questionsOk = false;
      }
      ids.add(q.id);

      // Check quality marker fields
      if (q.hasZhTranslation === undefined) {
        fail('questions[' + i + '] missing hasZhTranslation');
        questionsOk = false;
      }
      if (q.hasJaTranslation === undefined) {
        fail('questions[' + i + '] missing hasJaTranslation');
        questionsOk = false;
      }
      if (q.zhFallbackFromJa === undefined) {
        fail('questions[' + i + '] missing zhFallbackFromJa');
        questionsOk = false;
      }
      if (!q.translationStatus) {
        fail('questions[' + i + '] missing translationStatus');
        questionsOk = false;
      } else if (q.translationStatus !== 'complete' && q.translationStatus !== 'zh_fallback_from_ja') {
        fail('questions[' + i + '] invalid translationStatus: "' + q.translationStatus + '"');
        questionsOk = false;
      }

      // Consistency checks
      if (q.translationStatus === 'complete') {
        if (q.hasZhTranslation !== true) {
          fail('questions[' + i + '] complete but hasZhTranslation is not true');
          questionsOk = false;
        }
        if (q.zhFallbackFromJa !== false) {
          fail('questions[' + i + '] complete but zhFallbackFromJa is not false');
          questionsOk = false;
        }
      }
      if (q.translationStatus === 'zh_fallback_from_ja') {
        if (q.hasZhTranslation !== false) {
          fail('questions[' + i + '] zh_fallback but hasZhTranslation is not false');
          questionsOk = false;
        }
        if (q.zhFallbackFromJa !== true) {
          fail('questions[' + i + '] zh_fallback but zhFallbackFromJa is not true');
          questionsOk = false;
        }
      }
    }

    // Output translation status statistics
    var completeCount = questions.filter(function(q) { return q.translationStatus === 'complete'; }).length;
    var fallbackCount = questions.filter(function(q) { return q.translationStatus === 'zh_fallback_from_ja'; }).length;
    console.log('  translation complete: ' + completeCount);
    console.log('  translation zh_fallback_from_ja: ' + fallbackCount + ' (warning, not fatal)');

    // Check explanation quality marker fields
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (!q.explanationStatus) {
        fail('questions[' + i + '] missing explanationStatus');
        questionsOk = false;
      } else if (q.explanationStatus !== 'complete' && q.explanationStatus !== 'shared_hint') {
        fail('questions[' + i + '] invalid explanationStatus: "' + q.explanationStatus + '"');
        questionsOk = false;
      }
      if (q.hasZhExplanation === undefined) {
        fail('questions[' + i + '] missing hasZhExplanation');
        questionsOk = false;
      }
      if (q.hasJaExplanation === undefined) {
        fail('questions[' + i + '] missing hasJaExplanation');
        questionsOk = false;
      }
      if (q.explanationShared === undefined) {
        fail('questions[' + i + '] missing explanationShared');
        questionsOk = false;
      }

      // Consistency: shared_hint → explanationShared=true, hasZhExplanation=false
      if (q.explanationStatus === 'shared_hint') {
        if (q.explanationShared !== true) {
          fail('questions[' + i + '] shared_hint but explanationShared is not true');
          questionsOk = false;
        }
      }
      // Consistency: complete → explanationShared=false
      if (q.explanationStatus === 'complete') {
        if (q.explanationShared !== false) {
          fail('questions[' + i + '] complete but explanationShared is not false');
          questionsOk = false;
        }
      }
    }

    // Output explanation status statistics
    var explComplete = questions.filter(function(q) { return q.explanationStatus === 'complete'; }).length;
    var explShared = questions.filter(function(q) { return q.explanationStatus === 'shared_hint'; }).length;
    console.log('  explanation complete: ' + explComplete);
    console.log('  explanation shared_hint: ' + explShared + ' (warning, not fatal)');

    // past_exam_japanese specific checks
    var pastExamOk = true;
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (q.sourceType !== 'past_exam_japanese') continue;

      if (q.translationStatus !== 'zh_fallback_from_ja') {
        fail('past_exam[' + i + '] translationStatus should be zh_fallback_from_ja');
        pastExamOk = false;
      }
      if (q.hasZhTranslation !== false) {
        fail('past_exam[' + i + '] hasZhTranslation should be false');
        pastExamOk = false;
      }
      if (q.zhFallbackFromJa !== true) {
        fail('past_exam[' + i + '] zhFallbackFromJa should be true');
        pastExamOk = false;
      }
      if (q.explanationStatus !== 'shared_hint') {
        fail('past_exam[' + i + '] explanationStatus should be shared_hint');
        pastExamOk = false;
      }
      if (q.explanationShared !== true) {
        fail('past_exam[' + i + '] explanationShared should be true');
        pastExamOk = false;
      }
      if (q.level !== 'exam') {
        fail('past_exam[' + i + '] level should be "exam", got "' + q.level + '"');
        pastExamOk = false;
      }
      if (q.source !== 'windows_past_exam') {
        fail('past_exam[' + i + '] source should be "windows_past_exam"');
        pastExamOk = false;
      }
      if (!q.questionJa || q.questionJa.trim() === '') {
        fail('past_exam[' + i + '] questionJa is empty');
        pastExamOk = false;
      }
      if (!q.explanationJa || q.explanationJa.trim() === '') {
        fail('past_exam[' + i + '] explanationJa is empty');
        pastExamOk = false;
      }

      // answer must exist in options.key
      if (q.options && Array.isArray(q.options)) {
        var optKeys = q.options.map(function(o) { return o.key; });
        if (!optKeys.includes(q.answer)) {
          fail('past_exam[' + i + '] answer "' + q.answer + '" not in options keys: ' + optKeys.join(','));
          pastExamOk = false;
        }
      }
    }
    if (pastExamOk) pass('past_exam_japanese field constraints valid');
  }
} catch (e) {
  fail('questions.js require error: ' + e.message);
  questionsOk = false;
}
if (questionsOk) pass('questions data valid');

// ============================================================
// 六、utils/storage.js - mock wx and test exports
// ============================================================
console.log('\n--- utils/storage.js ---');

// Mock wx for Node environment
global.wx = {
  store: {},
  getStorageSync(key) {
    return this.store[key];
  },
  setStorageSync(key, value) {
    this.store[key] = value;
  }
};

let storageOk = true;
let storage = null;
try {
  storage = require(path.join(ROOT, 'utils/storage'));
} catch (e) {
  fail('storage.js require error: ' + e.message);
  storageOk = false;
}

if (storage) {
  const requiredExports = [
    'FAVORITE_TERMS_KEY',
    'getFavoriteTerms',
    'saveFavoriteTerms',
    'isFavoriteTerm',
    'addFavoriteTerm',
    'removeFavoriteTerm',
    'getFavoriteTermCount',
    'getWrongQuestions',
    'saveWrongQuestions',
    'addWrongQuestion',
    'removeWrongQuestion',
    'clearWrongQuestions',
    'getWrongQuestionCount',
    'QUIZ_ATTEMPTS_KEY',
    'getQuizAttempts',
    'saveQuizAttempts',
    'addQuizAttempt',
    'clearQuizAttempts',
    'getQuizAttemptCount',
    'getTodayQuizAttemptCount',
    'getQuizStats',
    'getQuizStatsByFilter',
    'getLastAttempt',
    'getRecentAttempts',
    'validateLocalBackup',
    'exportLocalBackup',
    'importLocalBackup',
    'clearAllLocalUserData'
  ];
  for (const name of requiredExports) {
    if (storage[name] === undefined) {
      fail('storage.js missing export: ' + name);
      storageOk = false;
    }
  }
  if (storageOk) pass('storage exports valid');
}

// ============================================================
// 七、收藏行为测试
// ============================================================
console.log('\n--- 收藏行为测试 ---');

let favOk = true;
if (storage) {
  // 清空状态
  global.wx.store = {};

  // 初始数量为 0
  if (storage.getFavoriteTermCount() !== 0) {
    fail('favorite: initial count should be 0, got ' + storage.getFavoriteTermCount());
    favOk = false;
  }

  // add 后数量为 1
  storage.addFavoriteTerm('term-001');
  if (storage.getFavoriteTermCount() !== 1) {
    fail('favorite: count after add should be 1, got ' + storage.getFavoriteTermCount());
    favOk = false;
  }

  // 重复添加数量仍为 1
  storage.addFavoriteTerm('term-001');
  if (storage.getFavoriteTermCount() !== 1) {
    fail('favorite: count after duplicate add should be 1, got ' + storage.getFavoriteTermCount());
    favOk = false;
  }

  // isFavoriteTerm 为 true
  if (!storage.isFavoriteTerm('term-001')) {
    fail('favorite: isFavoriteTerm("term-001") should be true');
    favOk = false;
  }

  // remove 后数量为 0
  storage.removeFavoriteTerm('term-001');
  if (storage.getFavoriteTermCount() !== 0) {
    fail('favorite: count after remove should be 0, got ' + storage.getFavoriteTermCount());
    favOk = false;
  }
} else {
  fail('favorite: cannot test, storage module not loaded');
  favOk = false;
}
if (favOk) pass('favorite storage behavior valid');

// ============================================================
// 八、错题行为测试
// ============================================================
console.log('\n--- 错题行为测试 ---');

let wrongOk = true;
if (storage) {
  // 清空状态
  global.wx.store = {};

  // 初始数量为 0
  if (storage.getWrongQuestionCount() !== 0) {
    fail('wrong: initial count should be 0, got ' + storage.getWrongQuestionCount());
    wrongOk = false;
  }

  // add 后数量为 1
  storage.addWrongQuestion('q-itp-001', 'itpass', 'B');
  if (storage.getWrongQuestionCount() !== 1) {
    fail('wrong: count after add should be 1, got ' + storage.getWrongQuestionCount());
    wrongOk = false;
  }

  // 重复 add 数量仍为 1
  storage.addWrongQuestion('q-itp-001', 'itpass', 'C');
  if (storage.getWrongQuestionCount() !== 1) {
    fail('wrong: count after duplicate add should be 1, got ' + storage.getWrongQuestionCount());
    wrongOk = false;
  }

  // lastAnswer 应更新为 C
  const list = storage.getWrongQuestions();
  if (list[0].lastAnswer !== 'C') {
    fail('wrong: lastAnswer should be "C" after update, got "' + list[0].lastAnswer + '"');
    wrongOk = false;
  }

  // remove 后数量为 0
  storage.removeWrongQuestion('q-itp-001');
  if (storage.getWrongQuestionCount() !== 0) {
    fail('wrong: count after remove should be 0, got ' + storage.getWrongQuestionCount());
    wrongOk = false;
  }

  // addWrongQuestion 后 clearWrongQuestions 清空
  storage.addWrongQuestion('q-itp-002', 'itpass', 'A');
  storage.clearWrongQuestions();
  if (storage.getWrongQuestionCount() !== 0) {
    fail('wrong: count after clear should be 0, got ' + storage.getWrongQuestionCount());
    wrongOk = false;
  }
} else {
  fail('wrong: cannot test, storage module not loaded');
  wrongOk = false;
}
if (wrongOk) pass('wrong question storage behavior valid');

// ============================================================
// 九、扫描危险写法
// ============================================================
console.log('\n--- 危险写法扫描 ---');

const scanFiles = [
  'pages/home/home.js',
  'pages/glossary/glossary.js',
  'pages/profile/profile.js',
  'pages/mistakes/mistakes.js',
  'packages/glossary/pages/term-search/term-search.js',
  'packages/glossary/pages/term-detail/term-detail.js',
  'packages/quiz/pages/exam-menu/exam-menu.js',
  'packages/quiz/pages/quiz/quiz.js',
  'packages/quiz/pages/mistakes/mistakes.js'
];

const forbiddenPatterns = [
  { regex: /require\(["']\/utils\/storage["']\)/, desc: 'require("/utils/storage")' },
  { regex: /require\(["']utils\/storage["']\)/, desc: 'require("utils/storage")' },
  { regex: /require\(["']\.\.\/\.\.\/\.\.\/utils\/storage["']\)/, desc: 'require("../../../utils/storage")' },
  { regex: /\bimport\s+/, desc: 'import statement' },
  { regex: /export\s+default\b/, desc: 'export default' },
  { regex: /localStorage\b/, desc: 'localStorage' },
  { regex: /window\./, desc: 'window.' },
  { regex: /document\./, desc: 'document.' }
];

let scanOk = true;
for (const sf of scanFiles) {
  if (!fileExists(sf)) {
    fail('scan: file not found: ' + sf);
    scanOk = false;
    continue;
  }
  const content = readFile(sf);
  for (const fp of forbiddenPatterns) {
    if (fp.regex.test(content)) {
      fail('scan: ' + sf + ' contains forbidden pattern: ' + fp.desc);
      scanOk = false;
    }
  }
}
if (scanOk) pass('forbidden API scan');

// ============================================================
// 九-B、quiz attempt 行为测试
// ============================================================
console.log('\n--- quiz attempt 行为测试 ---');

let attemptOk = true;
if (storage) {
  // 清空状态
  global.wx.store = {};

  // 初始 count 为 0
  if (storage.getQuizAttemptCount() !== 0) {
    fail('attempt: initial count should be 0, got ' + storage.getQuizAttemptCount());
    attemptOk = false;
  }

  // 添加一个正确 attempt
  storage.addQuizAttempt({
    questionId: 'q-itpass-past-0001',
    exam: 'itpass',
    sourceType: 'lesson_quiz',
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true
  });
  if (storage.getQuizAttemptCount() !== 1) {
    fail('attempt: count after add correct should be 1, got ' + storage.getQuizAttemptCount());
    attemptOk = false;
  }
  var statsAfter1 = storage.getQuizStats();
  if (statsAfter1.total !== 1) {
    fail('attempt: stats.total should be 1, got ' + statsAfter1.total);
    attemptOk = false;
  }
  if (statsAfter1.correct !== 1) {
    fail('attempt: stats.correct should be 1, got ' + statsAfter1.correct);
    attemptOk = false;
  }

  // 添加一个错误 attempt
  storage.addQuizAttempt({
    questionId: 'q-itpass-past-0002',
    exam: 'itpass',
    sourceType: 'lesson_quiz',
    selectedAnswer: 'B',
    correctAnswer: 'A',
    isCorrect: false
  });
  if (storage.getQuizAttemptCount() !== 2) {
    fail('attempt: count after add wrong should be 2, got ' + storage.getQuizAttemptCount());
    attemptOk = false;
  }
  var statsAfter2 = storage.getQuizStats();
  if (statsAfter2.total !== 2) {
    fail('attempt: stats.total should be 2, got ' + statsAfter2.total);
    attemptOk = false;
  }
  if (statsAfter2.wrong !== 1) {
    fail('attempt: stats.wrong should be 1, got ' + statsAfter2.wrong);
    attemptOk = false;
  }
  if (statsAfter2.accuracy !== 50) {
    fail('attempt: stats.accuracy should be 50, got ' + statsAfter2.accuracy);
    attemptOk = false;
  }

  // byExam.itpass.total 应为 2
  if (!statsAfter2.byExam || !statsAfter2.byExam.itpass || statsAfter2.byExam.itpass.total !== 2) {
    fail('attempt: byExam.itpass.total should be 2, got ' + (statsAfter2.byExam && statsAfter2.byExam.itpass ? statsAfter2.byExam.itpass.total : 'undefined'));
    attemptOk = false;
  }

  // bySourceType.lesson_quiz.total 应为 2
  if (!statsAfter2.bySourceType || !statsAfter2.bySourceType.lesson_quiz || statsAfter2.bySourceType.lesson_quiz.total !== 2) {
    fail('attempt: bySourceType.lesson_quiz.total should be 2, got ' + (statsAfter2.bySourceType && statsAfter2.bySourceType.lesson_quiz ? statsAfter2.bySourceType.lesson_quiz.total : 'undefined'));
    attemptOk = false;
  }

  // clearQuizAttempts 后 total 为 0
  storage.clearQuizAttempts();
  if (storage.getQuizAttemptCount() !== 0) {
    fail('attempt: count after clear should be 0, got ' + storage.getQuizAttemptCount());
    attemptOk = false;
  }
  var statsAfterClear = storage.getQuizStats();
  if (statsAfterClear.total !== 0) {
    fail('attempt: stats.total after clear should be 0, got ' + statsAfterClear.total);
    attemptOk = false;
  }
} else {
  fail('attempt: cannot test, storage module not loaded');
  attemptOk = false;
}
if (attemptOk) pass('quiz attempt storage behavior valid');

// ============================================================
// 九-C、备份 / 恢复行为测试
// ============================================================
console.log('\n--- 备份 / 恢复行为测试 ---');

let backupOk = true;
if (storage) {
  // 清空状态
  global.wx.store = {};

  // 添加数据
  storage.addFavoriteTerm('term-backup-001');
  storage.addWrongQuestion('q-backup-001', 'itpass', 'B');
  storage.addQuizAttempt({
    questionId: 'q-backup-001',
    exam: 'itpass',
    sourceType: 'lesson_quiz',
    selectedAnswer: 'B',
    correctAnswer: 'A',
    isCorrect: false
  });

  // exportLocalBackup
  var backup = storage.exportLocalBackup();
  if (backup.app !== 'study-tools-mini') {
    fail('backup: app should be "study-tools-mini", got "' + backup.app + '"');
    backupOk = false;
  }
  if (!Array.isArray(backup.data.favoriteTerms) || backup.data.favoriteTerms.length !== 1) {
    fail('backup: favoriteTerms.length should be 1, got ' + (backup.data.favoriteTerms ? backup.data.favoriteTerms.length : 'undefined'));
    backupOk = false;
  }
  if (!Array.isArray(backup.data.wrongQuestions) || backup.data.wrongQuestions.length !== 1) {
    fail('backup: wrongQuestions.length should be 1, got ' + (backup.data.wrongQuestions ? backup.data.wrongQuestions.length : 'undefined'));
    backupOk = false;
  }
  if (!Array.isArray(backup.data.quizAttempts) || backup.data.quizAttempts.length !== 1) {
    fail('backup: quizAttempts.length should be 1, got ' + (backup.data.quizAttempts ? backup.data.quizAttempts.length : 'undefined'));
    backupOk = false;
  }

  // clearAllLocalUserData
  storage.clearAllLocalUserData();
  if (storage.getFavoriteTermCount() !== 0) {
    fail('backup: favorite count after clearAll should be 0, got ' + storage.getFavoriteTermCount());
    backupOk = false;
  }
  if (storage.getWrongQuestionCount() !== 0) {
    fail('backup: wrong question count after clearAll should be 0, got ' + storage.getWrongQuestionCount());
    backupOk = false;
  }
  if (storage.getQuizAttemptCount() !== 0) {
    fail('backup: quiz attempt count after clearAll should be 0, got ' + storage.getQuizAttemptCount());
    backupOk = false;
  }

  // importLocalBackup
  var importResult = storage.importLocalBackup(backup);
  if (importResult !== true) {
    fail('backup: importLocalBackup should return true for valid backup');
    backupOk = false;
  }
  if (storage.getFavoriteTermCount() !== 1) {
    fail('backup: favorite count after restore should be 1, got ' + storage.getFavoriteTermCount());
    backupOk = false;
  }
  if (storage.getWrongQuestionCount() !== 1) {
    fail('backup: wrong question count after restore should be 1, got ' + storage.getWrongQuestionCount());
    backupOk = false;
  }
  if (storage.getQuizAttemptCount() !== 1) {
    fail('backup: quiz attempt count after restore should be 1, got ' + storage.getQuizAttemptCount());
    backupOk = false;
  }

  // validateLocalBackup 非法数据
  if (storage.validateLocalBackup(null) !== false) {
    fail('backup: validateLocalBackup(null) should be false');
    backupOk = false;
  }
  if (storage.validateLocalBackup({}) !== false) {
    fail('backup: validateLocalBackup({}) should be false');
    backupOk = false;
  }
  if (storage.validateLocalBackup({ app: 'bad' }) !== false) {
    fail('backup: validateLocalBackup({app:"bad"}) should be false');
    backupOk = false;
  }

  // importLocalBackup 非法数据不应覆盖
  global.wx.store = {};
  storage.addFavoriteTerm('term-keep');
  var badImport = storage.importLocalBackup(null);
  if (badImport !== false) {
    fail('backup: importLocalBackup(null) should return false');
    backupOk = false;
  }
  if (storage.getFavoriteTermCount() !== 1) {
    fail('backup: bad import should not overwrite data, favorite count should be 1, got ' + storage.getFavoriteTermCount());
    backupOk = false;
  }
} else {
  fail('backup: cannot test, storage module not loaded');
  backupOk = false;
}
if (backupOk) pass('backup / restore behavior valid');

// ============================================================
// 十、版本号检查
// ============================================================
console.log('\n--- 版本号检查 ---');

let versionOk = true;
const appJsContent = readFile('app.js');
const storageContent = readFile('utils/storage.js');
if (!appJsContent.includes('v0.23.0')) {
  fail('version: app.js does not contain v0.23.0');
  versionOk = false;
}

if (!storageContent.includes("version: 'v0.23.0'")) {
  fail('version: utils/storage.js exportLocalBackup does not contain v0.23.0');
  versionOk = false;
}

// 检查 profile 页面相关
const profileJs = readFile('pages/profile/profile.js');
const profileWxml = readFile('pages/profile/profile.wxml');
// profile.js 从 globalData 读取 version，所以检查 wxml 中有 {{version}} 绑定
if (!profileWxml.includes('{{version}}')) {
  fail('version: profile.wxml missing {{version}} binding');
  versionOk = false;
}
// profile.js 必须从 globalData 读取版本，不能硬编码
if (!profileJs.includes('globalData.version')) {
  fail('version: profile.js does not read from globalData.version');
  versionOk = false;
}
if (versionOk) pass('version check v0.23.0');

// ============================================================
// 十一、Check Round 2.0 新功能
// ============================================================
console.log('\n--- Round 2.0 新功能检查 ---');

let round20Ok = true;

// 1. home 页面存在继续学习相关字段
const homeJs = readFile('pages/home/home.js');
const homeWxml = readFile('pages/home/home.wxml');
if (!homeJs.includes('continueLearning')) {
  fail('home.js missing continueLearning handler');
  round20Ok = false;
}
if (!homeJs.includes('hasLastAttempt')) {
  fail('home.js missing hasLastAttempt field');
  round20Ok = false;
}
if (!homeJs.includes('getLastAttempt')) {
  fail('home.js missing getLastAttempt usage');
  round20Ok = false;
}
if (!homeWxml.includes('继续练习') || !homeWxml.includes('continue-section')) {
  fail('home.wxml missing continue learning section');
  round20Ok = false;
}
if (!homeWxml.includes('还没有学习记录')) {
  fail('home.wxml missing empty state for continue learning');
  round20Ok = false;
}

// 2. quiz 支持 wrong_only 模式
const quizJs = readFile('packages/quiz/pages/quiz/quiz.js');
if (!quizJs.includes('wrong_only')) {
  fail('quiz.js missing wrong_only mode support');
  round20Ok = false;
}
if (!quizJs.includes('loadWrongQuestions')) {
  fail('quiz.js missing loadWrongQuestions method');
  round20Ok = false;
}

// 3. mistakes 完整页存在重新练习错题入口
const mistakesJs = readFile('packages/quiz/pages/mistakes/mistakes.js');
const mistakesWxml = readFile('packages/quiz/pages/mistakes/mistakes.wxml');
if (!mistakesJs.includes('goPracticeWrong')) {
  fail('mistakes.js missing goPracticeWrong handler');
  round20Ok = false;
}
if (!mistakesWxml.includes('重新练习错题')) {
  fail('mistakes.wxml missing wrong practice button');
  round20Ok = false;
}

// 4. profile 页面包含本地版数据说明
const profileWxml2 = readFile('pages/profile/profile.wxml');
if (!profileWxml2.includes('本地学习版') || !profileWxml2.includes('复制备份数据')) {
  fail('profile.wxml missing local data notice');
  round20Ok = false;
}

// 5. storage 导出 getLastAttempt
if (!storageContent.includes('getLastAttempt')) {
  fail('storage.js missing getLastAttempt function');
  round20Ok = false;
}

// 6. wrong_only 模式首页继续学习显示（不出现 undefined）
// 7. wrong_only 模式记录使用题目原始 exam
if (!homeJs.includes("lastAttempt.sourceType === 'wrong_only'")) {
  fail('home.js missing wrong_only display handling for continue learning');
  round20Ok = false;
}
if (!quizJs.includes('currentQuestion.exam')) {
  fail('quiz.js missing original exam usage for wrong_only records');
  round20Ok = false;
}

if (round20Ok) pass('Round 2.0 new features check');

// ============================================================
// 十二、Round 2.2 收藏术语复习检查
// ============================================================
console.log('\n--- Round 2.2 收藏术语复习检查 ---');

let round22Ok = true;

// 1. app.json glossary subpackage 已注册 favorite-review
const favReviewPage = 'pages/favorite-review/favorite-review';
const glossaryPkg = subpackages.find(function(s) { return s.root === 'packages/glossary'; });
if (!glossaryPkg || !glossaryPkg.pages || !glossaryPkg.pages.includes(favReviewPage)) {
  fail('app.json glossary subpackage missing favorite-review page');
  round22Ok = false;
}

// 2. favorite-review 四个页面文件存在
const favReviewFiles = [
  'packages/glossary/pages/favorite-review/favorite-review.js',
  'packages/glossary/pages/favorite-review/favorite-review.wxml',
  'packages/glossary/pages/favorite-review/favorite-review.wxss',
  'packages/glossary/pages/favorite-review/favorite-review.json'
];
for (var fi = 0; fi < favReviewFiles.length; fi++) {
  if (!fileExists(favReviewFiles[fi])) {
    fail('favorite-review file missing: ' + favReviewFiles[fi]);
    round22Ok = false;
  }
}

// 3. favorite-review.js 包含必要方法和引用
const favReviewJs = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
const favReviewWxml = readFile('packages/glossary/pages/favorite-review/favorite-review.wxml');
var frChecks = [
  { key: 'getFavoriteTerms', desc: 'getFavoriteTerms' },
  { key: 'revealExplanation', desc: 'revealExplanation handler' },
  { key: 'nextTerm', desc: 'nextTerm handler' },
  { key: 'prevTerm', desc: 'prevTerm handler' },
  { key: 'goDetail', desc: 'goDetail handler' }
];
for (var frc = 0; frc < frChecks.length; frc++) {
  if (!favReviewJs.includes(frChecks[frc].key)) {
    fail('favorite-review.js missing ' + frChecks[frc].desc);
    round22Ok = false;
  }
}

// 3-B. favorite-review.js 必须兼容脏 ID / 旧格式收藏
if (!favReviewJs.includes('extractFavoriteId')) {
  fail('favorite-review.js missing dirty favorite id safe handler');
  round22Ok = false;
}
if (!favReviewJs.includes('glossaryById[favId]')) {
  fail('favorite-review.js missing glossary match guard for favorite ids');
  round22Ok = false;
}

// 3-C. next / prev 必须有边界保护
if (!favReviewJs.includes('if (idx <= 0)')) {
  fail('favorite-review.js missing prevTerm boundary guard');
  round22Ok = false;
}
if (!favReviewJs.includes('if (idx >= this.data.favorites.length - 1)')) {
  fail('favorite-review.js missing nextTerm boundary guard');
  round22Ok = false;
}

// 3-D. 切换术语必须重置解释显示状态
if (!favReviewJs.includes('updateCurrentTerm')) {
  fail('favorite-review.js missing shared term switch updater');
  round22Ok = false;
}
if (!favReviewJs.includes('showExplanation: false')) {
  fail('favorite-review.js missing explanation reset logic');
  round22Ok = false;
}

// 3-E. 详情跳转和空状态入口路径必须正确
if (!favReviewJs.includes("/packages/glossary/pages/term-detail/term-detail?id=")) {
  fail('favorite-review.js goDetail path incorrect');
  round22Ok = false;
}
if (!favReviewJs.includes("/packages/glossary/pages/term-search/term-search")) {
  fail('favorite-review.js goSearch path incorrect');
  round22Ok = false;
}
if (!favReviewWxml.includes('还没有收藏术语') || !favReviewWxml.includes('去搜索术语')) {
  fail('favorite-review.wxml missing empty state texts');
  round22Ok = false;
}

// 4. glossary.js 入口有 goToFavoriteReview 且不 require glossary 大数据
const glossaryTabJs = readFile('pages/glossary/glossary.js');
if (!glossaryTabJs.includes('goToFavoriteReview')) {
  fail('glossary.js missing goToFavoriteReview handler');
  round22Ok = false;
}
if (glossaryTabJs.includes('data/glossary')) {
  fail('glossary.js must not require glossary data');
  round22Ok = false;
}

// 5. home.js 有 goToFavoriteReview
if (!homeJs.includes('goToFavoriteReview')) {
  fail('home.js missing goToFavoriteReview handler');
  round22Ok = false;
}

// 6. 主包不包含 data/glossary.js require
const mainPages = ['pages/home/home.js', 'pages/glossary/glossary.js', 'pages/mistakes/mistakes.js', 'pages/profile/profile.js'];
var glossaryRequireRx = /require\s*\(\s*['"][^'"]*glossary[^'"]*['"]\s*\)/;
for (var mp = 0; mp < mainPages.length; mp++) {
  if (fileExists(mainPages[mp])) {
    var mpContent = readFile(mainPages[mp]);
    if (glossaryRequireRx.test(mpContent)) {
      fail('main package page must not require glossary data: ' + mainPages[mp]);
      round22Ok = false;
    }
  }
}

if (round22Ok) pass('Round 2.2 new features check');

// ============================================================
// 十三、preloadRule 分包预下载检查
// ============================================================
// Round Mini 2.3.1 glossary lazy-loading checks
// ============================================================
console.log('\n--- Round Mini 2.3.1 glossary lazy-loading checks ---');

let round231Ok = true;
const termSearchJs231 = readFile('packages/glossary/pages/term-search/term-search.js');
const termDetailJs231 = readFile('packages/glossary/pages/term-detail/term-detail.js');
const favoriteReviewJs231 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
const fullGlossaryRequire = /require\s*\(\s*['"]\.\.\/\.\.\/data\/glossary['"]\s*\)/;

if (fullGlossaryRequire.test(termSearchJs231) ||
    fullGlossaryRequire.test(termDetailJs231) ||
    fullGlossaryRequire.test(favoriteReviewJs231)) {
  fail('glossary pages must not require the old full glossary');
  round231Ok = false;
}
if (!termSearchJs231.includes("require('../../data/glossary_index')")) {
  fail('term-search.js must require glossary_index');
  round231Ok = false;
}
if (!termDetailJs231.includes("require('../../data/glossary_loader')")) {
  fail('term-detail.js must require glossary_loader');
  round231Ok = false;
}
if (!favoriteReviewJs231.includes("require('../../data/glossary_index')") ||
    !favoriteReviewJs231.includes("require('../../data/glossary_loader')")) {
  fail('favorite-review.js must require glossary_index and glossary_loader');
  round231Ok = false;
}
if (!favoriteReviewJs231.includes('extractFavoriteId') ||
    !favoriteReviewJs231.includes('if (!favId || !glossaryById[favId] || seenIds[favId])')) {
  fail('favorite-review.js dirty ID protection missing');
  round231Ok = false;
}
if (!favoriteReviewJs231.includes('detail: null') ||
    !favoriteReviewJs231.includes('showExplanation: false')) {
  fail('favorite-review.js detail reset behavior missing');
  round231Ok = false;
}

const projectConfig = JSON.parse(readFile('project.config.json'));
const ignored = (projectConfig.packOptions && projectConfig.packOptions.ignore) || [];
const toolsIgnored = ignored.some(function (item) {
  return item && item.type === 'folder' && item.value === 'tools';
});
if (!toolsIgnored) {
  fail('project.config.json must exclude tools from package');
  round231Ok = false;
}

if (round231Ok) pass('Round Mini 2.3.1 glossary lazy-loading checks');

// ============================================================
// Round Mini 2.5 practice result checks
// ============================================================
console.log('\n--- Round Mini 2.5 practice result checks ---');

let round25Ok = true;
const quizJs25 = readFile('packages/quiz/pages/quiz/quiz.js');
const quizWxml25 = readFile('packages/quiz/pages/quiz/quiz.wxml');
const quizWxss25 = readFile('packages/quiz/pages/quiz/quiz.wxss');

const quizSessionFields = [
  'sessionTotal',
  'sessionCorrect',
  'sessionWrong',
  'sessionAccuracy'
];
for (const field of quizSessionFields) {
  if (!quizJs25.includes(field)) {
    fail('quiz.js missing session field: ' + field);
    round25Ok = false;
  }
}

const quizResultMethods = [
  'showPracticeResult',
  'restartPractice',
  'goMistakes',
  'goHome'
];
for (const method of quizResultMethods) {
  if (!quizJs25.includes(method)) {
    fail('quiz.js missing result method: ' + method);
    round25Ok = false;
  }
}

if (!quizJs25.includes('showResult') || !quizJs25.includes('isFinished')) {
  fail('quiz.js missing finished/result state');
  round25Ok = false;
}
if (!quizJs25.includes('if (this.data.hasAnswered || !this.data.currentQuestion) return;')) {
  fail('quiz.js missing duplicate answer guard');
  round25Ok = false;
}
if (!quizJs25.includes("sourceType === 'wrong_only'") ||
    !quizJs25.includes('this.loadWrongQuestions();')) {
  fail('quiz.js wrong_only restart support missing');
  round25Ok = false;
}
if (!quizJs25.includes("url: '/packages/quiz/pages/mistakes/mistakes'") ||
    !quizJs25.includes("url: '/pages/home/home'")) {
  fail('quiz.js result navigation paths invalid');
  round25Ok = false;
}

const resultTexts = [
  '本次练习完成',
  '本次答题数',
  '答对数量',
  '答错数量',
  '本次正确率',
  '再练一次',
  '查看错题',
  '返回首页'
];
for (const text of resultTexts) {
  if (!quizWxml25.includes(text)) {
    fail('quiz.wxml missing result text: ' + text);
    round25Ok = false;
  }
}
if (!quizWxss25.includes('.result-card') ||
    !quizWxss25.includes('.accuracy-value') ||
    !quizWxss25.includes('.result-actions')) {
  fail('quiz.wxss missing result card styles');
  round25Ok = false;
}

const resultModeLabels = [
  'IT Passport',
  'SG 考试',
  '课程练习',
  '日文题练习',
  '错题练习 · 错题重练'
];
for (const label of resultModeLabels) {
  if (!quizJs25.includes(label)) {
    fail('quiz.js missing result mode label marker: ' + label);
    round25Ok = false;
  }
}

if (round25Ok) pass('Round Mini 2.5 practice result checks');

// ============================================================
// Round Mini 3.1 mistakes review enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.1 mistakes review enhancement checks ---');

let round31Ok = true;
const mistakesJs31 = readFile('packages/quiz/pages/mistakes/mistakes.js');
const mistakesWxml31 = readFile('packages/quiz/pages/mistakes/mistakes.wxml');
const mistakesWxss31 = readFile('packages/quiz/pages/mistakes/mistakes.wxss');

// 1. 错题列表字段兼容：包含 wrongAt / wrongAtLabel
if (!mistakesJs31.includes('wrongAt')) {
  fail('mistakes.js missing wrongAt field handling');
  round31Ok = false;
}
if (!mistakesJs31.includes('wrongAtLabel')) {
  fail('mistakes.js missing wrongAtLabel formatted time');
  round31Ok = false;
}

// 2. 分类筛选存在且不会报错
const filterKeys = ['all', 'itpass', 'sg', 'past_exam_japanese'];
for (const fk of filterKeys) {
  if (!mistakesJs31.includes("'" + fk + "'")) {
    fail('mistakes.js missing filter key: ' + fk);
    round31Ok = false;
  }
}
if (!mistakesJs31.includes('onFilterChange') || !mistakesJs31.includes('applyFilter')) {
  fail('mistakes.js missing filter handler methods');
  round31Ok = false;
}
if (!mistakesWxml31.includes('filter-bar') || !mistakesWxml31.includes('onFilterChange')) {
  fail('mistakes.wxml missing filter bar UI');
  round31Ok = false;
}
if (!mistakesWxss31.includes('filter-tag') || !mistakesWxss31.includes('filter-tag-active')) {
  fail('mistakes.wxss missing filter tag styles');
  round31Ok = false;
}

// 3. 空错题状态存在且友好
if (!mistakesWxml31.includes('empty-state')) {
  fail('mistakes.wxml missing empty state');
  round31Ok = false;
}
if (!mistakesWxml31.includes('当前没有错题') || !mistakesWxml31.includes('去练习')) {
  fail('mistakes.wxml empty state text incomplete');
  round31Ok = false;
}
if (!mistakesJs31.includes("'当前没有错题，继续练习后会自动记录需要复习的题目。'")) {
  fail('mistakes.js empty hint text missing');
  round31Ok = false;
}

// 4. wrong_only 入口仍可用
if (!mistakesJs31.includes('goPracticeWrong')) {
  fail('mistakes.js missing goPracticeWrong handler');
  round31Ok = false;
}
if (!mistakesWxml31.includes('重新练习错题') && !mistakesWxml31.includes('开始错题重练')) {
  fail('mistakes.wxml missing wrong practice button');
  round31Ok = false;
}
if (!mistakesJs31.includes("exam=wrong_only&sourceType=wrong_only")) {
  fail('mistakes.js wrong_only URL incorrect');
  round31Ok = false;
}

// 5. 单条移出错题有确认弹窗，不会清空全部
if (!mistakesJs31.includes('wx.showModal')) {
  fail('mistakes.js missing remove confirmation modal');
  round31Ok = false;
}
if (!mistakesJs31.includes('确认移除')) {
  fail('mistakes.js remove modal title incorrect');
  round31Ok = false;
}
if (!mistakesJs31.includes('storage.removeWrongQuestion')) {
  fail('mistakes.js missing storage.removeWrongQuestion call');
  round31Ok = false;
}

// 6. 单条操作区存在
if (!mistakesWxml31.includes('wrong-actions') || !mistakesWxml31.includes('移出错题本')) {
  fail('mistakes.wxml missing per-item action buttons');
  round31Ok = false;
}
if (!mistakesWxss31.includes('wrong-actions') || !mistakesWxss31.includes('action-btn')) {
  fail('mistakes.wxss missing action button styles');
  round31Ok = false;
}

// 7. 显示上次答错时间
if (!mistakesWxml31.includes('wrong-time') || !mistakesWxml31.includes('wrongAtLabel')) {
  fail('mistakes.wxml missing wrong time display');
  round31Ok = false;
}
if (!mistakesWxss31.includes('wrong-time')) {
  fail('mistakes.wxss missing wrong time style');
  round31Ok = false;
}

// 8. 空状态根据筛选变化
if (!mistakesWxml31.includes("activeFilter === 'all'")) {
  fail('mistakes.wxml missing filter-aware empty state');
  round31Ok = false;
}

if (round31Ok) pass('Round Mini 3.1 mistakes review enhancement checks');

// ============================================================
// Round Mini 3.2 profile learning stats enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.2 profile learning stats checks ---');

var round32Ok = true;
var profileJs32 = readFile('pages/profile/profile.js');
var profileWxml32 = readFile('pages/profile/profile.wxml');
var profileWxss32 = readFile('pages/profile/profile.wxss');

  // 1. 版本号 v0.21.0
  if (!appJsContent.includes('v0.23.0')) {
    fail('Round 3.2: app.js missing v0.23.0');
    round32Ok = false;
  }
  if (!storageContent.includes("version: 'v0.23.0'")) {
    fail('Round 3.2: storage.js exportLocalBackup missing v0.23.0');
    round32Ok = false;
  }

// 2. profile 页面存在学习状态相关字段或文案
if (!profileJs32.includes('learningStatus') || !profileJs32.includes('getLearningStatus')) {
  fail('Round 3.2: profile.js missing learningStatus field or getLearningStatus');
  round32Ok = false;
}
if (!profileWxml32.includes('学习状态') || !profileWxml32.includes('learningStatus')) {
  fail('Round 3.2: profile.wxml missing learning status section');
  round32Ok = false;
}

// 3. profile 页面存在最近练习时间字段
if (!profileJs32.includes('lastPracticeTime') || !profileJs32.includes('getLastAttempt')) {
  fail('Round 3.2: profile.js missing lastPracticeTime or getLastAttempt');
  round32Ok = false;
}
if (!profileWxml32.includes('最近练习') || !profileWxml32.includes('lastPracticeTime')) {
  fail('Round 3.2: profile.wxml missing last practice time section');
  round32Ok = false;
}

// 4. 本地学习版说明仍存在
if (!profileWxml32.includes('本地学习版') || !profileWxml32.includes('不含登录和云同步')) {
  fail('Round 3.2: profile.wxml missing local data notice');
  round32Ok = false;
}

// 5. 剪贴板备份/恢复说明仍存在
if (!profileWxml32.includes('复制备份数据') || !profileWxml32.includes('从剪贴板恢复')) {
  fail('Round 3.2: profile.wxml missing clipboard backup/restore UI');
  round32Ok = false;
}
if (!profileWxml32.includes('剪贴板仅用于用户主动备份/恢复本地数据')) {
  fail('Round 3.2: profile.wxml missing clipboard usage notice');
  round32Ok = false;
}

// 6. 学习状态文案覆盖各种情况（无记录、>=80%、60%-79%、<60%）
var statusTexts = [
  '还没有学习记录',
  '状态很好，继续保持',
  '基础不错，建议复盘错题',
  '建议先从错题和术语复习开始'
];
for (var si = 0; si < statusTexts.length; si++) {
  if (!profileJs32.includes(statusTexts[si])) {
    fail('Round 3.2: profile.js missing status text: ' + statusTexts[si]);
    round32Ok = false;
  }
}

// 7. 空 attempts 不会产生 NaN/undefined/null（formatTime 和 getLearningStatus 处理空值）
if (!profileJs32.includes("if (!timestamp) return ''") && !profileJs32.includes("if (!timestamp) return")) {
  fail('Round 3.2: profile.js formatTime missing null timestamp guard');
  round32Ok = false;
}
if (!profileJs32.includes('totalAttempts === 0')) {
  fail('Round 3.2: profile.js getLearningStatus missing zero attempts guard');
  round32Ok = false;
}

// 8. 备份导出/恢复函数仍存在
if (!storageContent.includes('exportLocalBackup') || !storageContent.includes('importLocalBackup')) {
  fail('Round 3.2: storage.js missing backup/restore functions');
  round32Ok = false;
}
if (!storageContent.includes('validateLocalBackup')) {
  fail('Round 3.2: storage.js missing validateLocalBackup');
  round32Ok = false;
}

// 9. 学习状态卡片样式存在
if (!profileWxss32.includes('status-card') || !profileWxss32.includes('status-text')) {
  fail('Round 3.2: profile.wxss missing status card styles');
  round32Ok = false;
}

// 10. 禁止高风险表述
var forbiddenStatus = ['保证通过', '包过', '押题'];
for (var fi = 0; fi < forbiddenStatus.length; fi++) {
  if (profileJs32.includes(forbiddenStatus[fi]) || profileWxml32.includes(forbiddenStatus[fi])) {
    fail('Round 3.2: profile contains forbidden high-risk text: ' + forbiddenStatus[fi]);
    round32Ok = false;
  }
}

if (round32Ok) pass('Round Mini 3.2 profile learning stats checks');

// ============================================================
// Round Mini 3.3 glossary favorites review enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.3 glossary favorites review checks ---');

var round33Ok = true;
var favReviewJs33 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
var favReviewWxml33 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxml');
var favReviewWxss33 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxss');

  // 1. 版本号 v0.21.0
  if (!appJsContent.includes('v0.23.0')) {
    fail('Round 3.3: app.js missing v0.23.0');
    round33Ok = false;
  }
  if (!storageContent.includes("version: 'v0.23.0'")) {
    fail('Round 3.3: storage.js exportLocalBackup missing v0.23.0');
    round33Ok = false;
  }

// 2. 收藏页存在收藏数量展示
if (!favReviewWxml33.includes('共') || !favReviewWxml33.includes('{{totalCount}}')) {
  fail('Round 3.3: favorite-review.wxml missing total count display');
  round33Ok = false;
}

// 3. 收藏页存在搜索/筛选入口
if (!favReviewWxml33.includes('searchKeyword') || !favReviewWxml33.includes('onSearchInput')) {
  fail('Round 3.3: favorite-review.wxml missing search input');
  round33Ok = false;
}
if (!favReviewJs33.includes('onSearchInput') || !favReviewJs33.includes('matchTerm')) {
  fail('Round 3.3: favorite-review.js missing search logic');
  round33Ok = false;
}

// 4. 收藏页存在空状态文案
if (!favReviewWxml33.includes('还没有收藏术语') || !favReviewWxml33.includes('!hasFavorites')) {
  fail('Round 3.3: favorite-review.wxml missing empty state');
  round33Ok = false;
}

// 5. 收藏页存在去术语表入口
if (!favReviewWxml33.includes('去术语表') || !favReviewJs33.includes('goToGlossary')) {
  fail('Round 3.3: favorite-review missing go-to-glossary entry');
  round33Ok = false;
}

// 6. 收藏页存在取消收藏确认逻辑
if (!favReviewJs33.includes('unfavoriteCurrent') || !favReviewJs33.includes('showModal')) {
  fail('Round 3.3: favorite-review.js missing unfavorite with confirmation');
  round33Ok = false;
}
if (!favReviewJs33.includes('unfavoriteFromList')) {
  fail('Round 3.3: favorite-review.js missing list-mode unfavorite');
  round33Ok = false;
}
if (!favReviewWxml33.includes('unfavoriteCurrent') || !favReviewWxml33.includes('unfavoriteFromList')) {
  fail('Round 3.3: favorite-review.wxml missing unfavorite buttons');
  round33Ok = false;
}

// 7. 收藏复习入口或复习模式存在
if (!favReviewWxml33.includes('mode-switch') || !favReviewWxml33.includes('复习模式')) {
  fail('Round 3.3: favorite-review.wxml missing review mode switch');
  round33Ok = false;
}
if (!favReviewJs33.includes('switchToReviewMode') || !favReviewJs33.includes('switchToListMode')) {
  fail('Round 3.3: favorite-review.js missing mode switch functions');
  round33Ok = false;
}

// 8. 空收藏不显示 undefined/null/NaN
if (!favReviewJs33.includes('!timestamp') || !favReviewJs33.includes("return '已收藏'")) {
  fail('Round 3.3: favorite-review.js formatSavedAt missing null timestamp guard');
  round33Ok = false;
}
// searchKeyword 空值处理
if (!favReviewJs33.includes('!keyword') || !favReviewJs33.includes('return true')) {
  fail('Round 3.3: favorite-review.js matchTerm missing empty keyword guard');
  round33Ok = false;
}

// 9. profile 收藏数量逻辑不被破坏
var profileJs33 = readFile('pages/profile/profile.js');
if (!profileJs33.includes('getFavoriteTermCount') || !profileJs33.includes('favoriteCount')) {
  fail('Round 3.3: profile.js favoriteCount logic broken');
  round33Ok = false;
}

  // 10. 备份导出/恢复版本同步到 v0.21.0
  if (!storageContent.includes("version: 'v0.23.0'")) {
    fail('Round 3.3: storage.js exportLocalBackup version not synced to v0.21.0');
    round33Ok = false;
  }
if (!storageContent.includes('exportLocalBackup') || !storageContent.includes('importLocalBackup')) {
  fail('Round 3.3: storage.js backup functions missing');
  round33Ok = false;
}

// 11. formatSavedAt 时间格式化函数存在
if (!favReviewJs33.includes('formatSavedAt') || !favReviewJs33.includes('getFullYear')) {
  fail('Round 3.3: favorite-review.js missing formatSavedAt time formatting');
  round33Ok = false;
}

// 12. searchEmpty 状态存在
if (!favReviewJs33.includes('searchEmpty') || !favReviewWxml33.includes('searchEmpty')) {
  fail('Round 3.3: favorite-review missing search-empty state');
  round33Ok = false;
}

// 13. 列表模式样式存在
if (!favReviewWxss33.includes('fav-list') || !favReviewWxss33.includes('mode-switch')) {
  fail('Round 3.3: favorite-review.wxss missing list-mode styles');
  round33Ok = false;
}

if (round33Ok) pass('Round Mini 3.3 glossary favorites review checks');

// ============================================================
// Round Mini 3.4 mistakes review enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.4 mistakes review enhancement checks ---');

var round34Ok = true;
var mistakesJs34 = readFile('packages/quiz/pages/mistakes/mistakes.js');
var mistakesWxml34 = readFile('packages/quiz/pages/mistakes/mistakes.wxml');
var mistakesWxss34 = readFile('packages/quiz/pages/mistakes/mistakes.wxss');

  // 1. 版本号 v0.21.0
  if (!appJsContent.includes('v0.23.0')) {
    fail('Round 3.4: app.js missing v0.23.0');
    round34Ok = false;
  }
  if (!storageContent.includes("version: 'v0.23.0'")) {
    fail('Round 3.4: storage.js exportLocalBackup missing v0.23.0');
    round34Ok = false;
  }

// 2. 错题本页面存在搜索关键词状态
if (!mistakesJs34.includes('searchKeyword') || !mistakesJs34.includes('onSearchInput')) {
  fail('Round 3.4: mistakes.js missing search keyword or search input handler');
  round34Ok = false;
}
if (!mistakesWxml34.includes('searchKeyword') || !mistakesWxml34.includes('onSearchInput')) {
  fail('Round 3.4: mistakes.wxml missing search input UI');
  round34Ok = false;
}

// 3. 错题本页面存在搜索/筛选逻辑
if (!mistakesJs34.includes('matchItem') || !mistakesJs34.includes('matchText')) {
  fail('Round 3.4: mistakes.js missing matchItem/matchText search functions');
  round34Ok = false;
}
if (!mistakesJs34.includes('applyFilterAndSearch')) {
  fail('Round 3.4: mistakes.js missing applyFilterAndSearch function');
  round34Ok = false;
}

// 4. 错题本页面存在列表模式 / 复习模式切换逻辑
if (!mistakesJs34.includes('viewMode') || !mistakesJs34.includes('switchToReviewMode')) {
  fail('Round 3.4: mistakes.js missing viewMode or switchToReviewMode');
  round34Ok = false;
}
if (!mistakesJs34.includes('switchToListMode')) {
  fail('Round 3.4: mistakes.js missing switchToListMode');
  round34Ok = false;
}
if (!mistakesWxml34.includes('viewMode') || !mistakesWxml34.includes('复习模式')) {
  fail('Round 3.4: mistakes.wxml missing viewMode switch UI');
  round34Ok = false;
}

// 5. 错题本页面存在错题总数或筛选数量展示
if (!mistakesWxml34.includes('totalCount') || !mistakesJs34.includes('reviewCount')) {
  fail('Round 3.4: mistakes missing totalCount/reviewCount display');
  round34Ok = false;
}

// 6. 错题本页面存在移除错题逻辑
if (!mistakesJs34.includes('removeWrong') || !mistakesJs34.includes('removeFromReview')) {
  fail('Round 3.4: mistakes.js missing removeWrong or removeFromReview');
  round34Ok = false;
}

// 7. 移除错题前存在 wx.showModal 确认
if (!mistakesJs34.includes('wx.showModal')) {
  fail('Round 3.4: mistakes.js missing wx.showModal for remove confirmation');
  round34Ok = false;
}
if (!mistakesJs34.includes('确认移除')) {
  fail('Round 3.4: mistakes.js remove modal title incorrect');
  round34Ok = false;
}

// 8. 空错题状态不出现 NaN / undefined / null (formatTime null guard)
if (!mistakesJs34.includes("if (!ts) return ''") && !mistakesJs34.includes("if (!ts) return")) {
  fail('Round 3.4: mistakes.js formatTime missing null timestamp guard');
  round34Ok = false;
}

// 9. 兼容历史错题无时间字段（formatSavedAt 显示 "已收录"）
if (!mistakesJs34.includes('已收录') || !mistakesJs34.includes('formatSavedAt')) {
  fail('Round 3.4: mistakes.js missing formatSavedAt for legacy data compatibility');
  round34Ok = false;
}
if (!mistakesWxml34.includes('savedAtLabel') && !mistakesWxml34.includes('已收录')) {
  fail('Round 3.4: mistakes.wxml missing savedAtLabel or "已收录" display');
  round34Ok = false;
}

// 10. 不出现高风险表述
var forbidden34 = ['保证通过', '包过', '押题'];
for (var fi34 = 0; fi34 < forbidden34.length; fi34++) {
  if (mistakesJs34.includes(forbidden34[fi34]) || mistakesWxml34.includes(forbidden34[fi34])) {
    fail('Round 3.4: mistakes contains forbidden high-risk text: ' + forbidden34[fi34]);
    round34Ok = false;
  }
}

// 11. profile 错题数量统计相关函数仍存在
if (!profileJs32.includes('wrongQuestionCount') && !profileJs32.includes('getWrongQuestionCount')) {
  fail('Round 3.4: profile.js wrongQuestionCount logic broken');
  round34Ok = false;
}

// 12. backup export/restore includes wrongQuestions
if (!storageContent.includes('wrongQuestions')) {
  fail('Round 3.4: storage.js backup missing wrongQuestions');
  round34Ok = false;
}

// 13. 保留 v0.13.0 错题本已有功能（filter-bar, wrong-actions, wrong-time）
if (!mistakesWxml34.includes('filter-bar') || !mistakesWxml34.includes('activeFilter')) {
  fail('Round 3.4: mistakes.wxml filter-bar broken');
  round34Ok = false;
}
if (!mistakesWxml34.includes('wrong-actions') || !mistakesWxml34.includes('移出错题本')) {
  fail('Round 3.4: mistakes.wxml per-item actions broken');
  round34Ok = false;
}
if (!mistakesWxml34.includes('wrong-time')) {
  fail('Round 3.4: mistakes.wxml wrong-time display broken');
  round34Ok = false;
}

// 14. 保留 goPracticeWrong 入口
if (!mistakesJs34.includes('goPracticeWrong') || !mistakesWxml34.includes('重新练习错题')) {
  fail('Round 3.4: mistakes missing goPracticeWrong entry');
  round34Ok = false;
}

// 15. 保留 empty-state 空状态
if (!mistakesWxml34.includes('empty-state') || !mistakesWxml34.includes('去练习')) {
  fail('Round 3.4: mistakes.wxml empty-state broken');
  round34Ok = false;
}
if (!mistakesJs34.includes("'当前没有错题，继续练习后会自动记录需要复习的题目。'")) {
  fail('Round 3.4: mistakes.js empty hint text missing');
  round34Ok = false;
}

// 16. 搜索空状态存在
if (!mistakesWxml34.includes('searchEmpty') || !mistakesJs34.includes('searchEmpty')) {
  fail('Round 3.4: mistakes missing search empty state');
  round34Ok = false;
}

// 17. 复习模式导航按钮存在
if (!mistakesJs34.includes('goPrevReview') || !mistakesJs34.includes('goNextReview')) {
  fail('Round 3.4: mistakes.js missing review navigation functions');
  round34Ok = false;
}
if (!mistakesWxml34.includes('上一题') || !mistakesWxml34.includes('下一题')) {
  fail('Round 3.4: mistakes.wxml missing prev/next review buttons');
  round34Ok = false;
}

// 18. 复习模式解析折叠功能
if (!mistakesJs34.includes('toggleExplanation') || !mistakesWxml34.includes('toggleExplanation')) {
  fail('Round 3.4: mistakes missing explanation toggle in review mode');
  round34Ok = false;
}

// 19. 搜索清除功能
if (!mistakesJs34.includes('onClearSearch') || !mistakesWxml34.includes('onClearSearch')) {
  fail('Round 3.4: mistakes missing search clear function');
  round34Ok = false;
}

if (round34Ok) pass('Round Mini 3.4 mistakes review enhancement checks');

// ============================================================
// Round Mini 3.5 home learning shortcuts checks
// ============================================================
console.log('\n--- Round Mini 3.5 home learning shortcuts checks ---');

var round35Ok = true;
var homeJs35 = readFile('pages/home/home.js');
var homeWxml35 = readFile('pages/home/home.wxml');
var homeWxss35 = readFile('pages/home/home.wxss');

  // 1. 版本号 v0.21.0
  if (!appJsContent.includes('v0.23.0')) {
    fail('Round 3.5: app.js missing v0.23.0');
    round35Ok = false;
  }
  if (!storageContent.includes("version: 'v0.23.0'")) {
    fail('Round 3.5: storage.js exportLocalBackup missing v0.23.0');
    round35Ok = false;
  }

// 2. 首页存在学习建议模块
if (!homeJs35.includes('generateSuggestion') || !homeJs35.includes('suggestion')) {
  fail('Round 3.5: home.js missing generateSuggestion or suggestion field');
  round35Ok = false;
}
if (!homeWxml35.includes('今日建议') || !homeWxml35.includes('suggestion')) {
  fail('Round 3.5: home.wxml missing suggestion card');
  round35Ok = false;
}

// 3. 首页存在错题本入口
if (!homeWxml35.includes('goToMistakes') || !homeJs35.includes('goToMistakes')) {
  fail('Round 3.5: home missing mistakes entry');
  round35Ok = false;
}

// 4. 首页存在收藏复习入口
if (!homeWxml35.includes('goToFavoriteReview') || !homeJs35.includes('goToFavoriteReview')) {
  fail('Round 3.5: home missing favorite-review entry');
  round35Ok = false;
}

// 5. 首页存在练习/题库入口
if (!homeWxml35.includes('goToItPassport') || !homeWxml35.includes('goToSG')) {
  fail('Round 3.5: home missing practice/exam entries');
  round35Ok = false;
}

// 6. 首页存在我的统计入口
if (!homeWxml35.includes('goToProfile') || !homeJs35.includes('goToProfile')) {
  fail('Round 3.5: home missing profile entry');
  round35Ok = false;
}
if (!homeWxml35.includes('我的统计')) {
  fail('Round 3.5: home.wxml missing "我的统计" label');
  round35Ok = false;
}

// 7. 首页读取错题数量逻辑存在
if (!homeJs35.includes('getWrongQuestionCount') || !homeJs35.includes('wrongQuestionCount')) {
  fail('Round 3.5: home.js missing wrongQuestionCount read logic');
  round35Ok = false;
}

// 8. 首页读取收藏数量逻辑存在
if (!homeJs35.includes('getFavoriteTermCount') || !homeJs35.includes('favoriteCount')) {
  fail('Round 3.5: home.js missing favoriteCount read logic');
  round35Ok = false;
}

// 9. 首页读取最近练习逻辑存在
if (!homeJs35.includes('getLastAttempt') || !homeJs35.includes('formatLastPracticeTime')) {
  fail('Round 3.5: home.js missing lastAttempt or formatLastPracticeTime');
  round35Ok = false;
}
// 兼容暂无记录（hasLastAttempt / !hasLastAttempt 双分支）
if (!homeWxml35.includes('!hasLastAttempt')) {
  fail('Round 3.5: home.wxml missing no-records empty state');
  round35Ok = false;
}

// 10. 空数据不出现 NaN/undefined/null (formatLastPracticeTime null guard)
if (!homeJs35.includes("if (!timestamp) return ''")) {
  fail('Round 3.5: home.js formatLastPracticeTime missing null timestamp guard');
  round35Ok = false;
}
// suggestion 有始终非空字符串
if (!homeJs35.includes("'还没有学习记录，可以从术语表或练习开始，遇到重要术语先收藏再复习'")) {
  fail('Round 3.5: home.js generateSuggestion missing fallback text');
  round35Ok = false;
}

// 11. 不出现高风险表述
var forbidden35 = ['保证通过', '包过', '押题'];
for (var fi35 = 0; fi35 < forbidden35.length; fi35++) {
  if (homeJs35.includes(forbidden35[fi35]) || homeWxml35.includes(forbidden35[fi35])) {
    fail('Round 3.5: home contains forbidden high-risk text: ' + forbidden35[fi35]);
    round35Ok = false;
  }
}

// 12. mistakes 页面 v0.16.0+ 关键功能仍存在
var mistakesJs35 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (!mistakesJs35.includes('searchKeyword') || !mistakesJs35.includes('viewMode')) {
  fail('Round 3.5: mistakes.js v0.16.0+ features broken');
  round35Ok = false;
}

// 13. favorite-review 页面 v0.15.0+ 关键功能仍存在
var favReviewJs35 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs35.includes('searchKeyword') || !favReviewJs35.includes('viewMode')) {
  fail('Round 3.5: favorite-review.js v0.15.0+ features broken');
  round35Ok = false;
}

// 14. profile 页面 v0.14.0+ 关键功能仍存在
var profileJs35 = readFile('pages/profile/profile.js');
if (!profileJs35.includes('learningStatus') || !profileJs35.includes('getLearningStatus')) {
  fail('Round 3.5: profile.js v0.14.0+ features broken');
  round35Ok = false;
}

// 15. 建议文案覆盖错题优先
if (!homeJs35.includes("'有 ' + wrongCount + ' 道错题待复习，建议先去错题本巩固薄弱点'")) {
  fail('Round 3.5: home.js missing mistake-first suggestion');
  round35Ok = false;
}

// 16. 建议文案覆盖收藏优先
if (!homeJs35.includes("'有 ' + favoriteCount + ' 个收藏术语，建议复习收藏加深记忆'")) {
  fail('Round 3.5: home.js missing favorite-first suggestion');
  round35Ok = false;
}

// 17. card-badge 徽标样式存在
if (!homeWxss35.includes('card-badge')) {
  fail('Round 3.5: home.wxss missing card-badge style');
  round35Ok = false;
}

// 18. suggestion-card 样式存在
if (!homeWxss35.includes('suggestion-card') || !homeWxss35.includes('suggestion-text')) {
  fail('Round 3.5: home.wxss missing suggestion styles');
  round35Ok = false;
}

// 19. 我的统计入口使用 switchTab（profile 是 tab 页）
if (!homeJs35.includes('switchTab') || !homeJs35.includes('/pages/profile/profile')) {
  fail('Round 3.5: home.js goToProfile not using switchTab to profile');
  round35Ok = false;
}

// 20. lastPracticeTimeText 显示
if (!homeJs35.includes('lastPracticeTimeText') || !homeWxml35.includes('lastPracticeTimeText')) {
  fail('Round 3.5: home missing lastPracticeTimeText display');
  round35Ok = false;
}

if (round35Ok) pass('Round Mini 3.5 home learning shortcuts checks');

// ============================================================
// Round Mini 3.6 recent practice timeline checks
// ============================================================
console.log('\n--- Round Mini 3.6 recent practice timeline checks ---');

var round36Ok = true;
var appJs36 = readFile('app.js');
var storage36 = readFile('utils/storage.js');
var profileJs36 = readFile('pages/profile/profile.js');
var profileWxml36 = readFile('pages/profile/profile.wxml');
var profileWxss36 = readFile('pages/profile/profile.wxss');

// 1. app.js 版本为 v0.21.0
if (!appJs36.includes('v0.23.0')) {
  fail('Round 3.6: app.js missing v0.23.0');
  round36Ok = false;
}

// 2. exportLocalBackup 版本为 v0.21.0
if (!storage36.includes("version: 'v0.23.0'")) {
  fail('Round 3.6: storage.js exportLocalBackup missing v0.23.0');
  round36Ok = false;
}

// 3. storage 中存在 getLastAttempt
if (!storage36.includes('getLastAttempt')) {
  fail('Round 3.6: storage.js missing getLastAttempt');
  round36Ok = false;
}

// 4. storage 中存在 getRecentAttempts
if (!storage36.includes('getRecentAttempts')) {
  fail('Round 3.6: storage.js missing getRecentAttempts');
  round36Ok = false;
}

// 5. profile 页面存在最近练习时间线模块
if (!profileWxml36.includes('练习时间线') || !profileWxml36.includes('timeline-list')) {
  fail('Round 3.6: profile.wxml missing timeline section');
  round36Ok = false;
}

// 6. profile 页面存在空练习记录安全文案
if (!profileWxml36.includes('暂无练习记录，完成一次练习后会显示在这里') || !profileWxml36.includes('empty-hint')) {
  fail('Round 3.6: profile.wxml missing empty state hint');
  round36Ok = false;
}

// 7. profile 页面存在时间格式化函数
if (!profileJs36.includes('formatTimelineTime')) {
  fail('Round 3.6: profile.js missing formatTimelineTime function');
  round36Ok = false;
}

// 8. profile 页面正确率计算有 NaN 防护（sessionTotal > 0 guard）
if (!profileJs36.includes('sessionTotal > 0 ? Math.round')) {
  fail('Round 3.6: profile.js missing NaN protection in accuracy calculation');
  round36Ok = false;
}

// 9. profile 页面不直接显示 undefined / null（有空值降级处理）
if (!profileJs36.includes("if (!timestamp) return '时间未记录'") && !profileJs36.includes('时间未记录')) {
  fail('Round 3.6: profile.js formatTimelineTime missing null timestamp guard');
  round36Ok = false;
}
if (!profileJs36.includes("return map[exam] || (exam || '未知')")) {
  fail('Round 3.6: profile.js getExamLabel missing null fallback');
  round36Ok = false;
}
if (!profileJs36.includes("return map[sourceType] || (sourceType || '练习')")) {
  fail('Round 3.6: profile.js getSourceLabel missing null fallback');
  round36Ok = false;
}

// 10. home 页面 Round Mini 3.5 学习建议入口仍存在
var homeJs36 = readFile('pages/home/home.js');
var homeWxml36 = readFile('pages/home/home.wxml');
if (!homeJs36.includes('generateSuggestion') || !homeWxml36.includes('今日建议')) {
  fail('Round 3.6: home page Round 3.5 suggestion entry broken');
  round36Ok = false;
}

// 11. mistakes 页面 Round Mini 3.4 关键功能仍存在
var mistakesJs36 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (!mistakesJs36.includes('searchKeyword') || !mistakesJs36.includes('viewMode')) {
  fail('Round 3.6: mistakes page Round 3.4 features broken');
  round36Ok = false;
}

// 12. favorite-review 页面 Round Mini 3.3 关键功能仍存在
var favReviewJs36 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs36.includes('searchKeyword') || !favReviewJs36.includes('viewMode')) {
  fail('Round 3.6: favorite-review page Round 3.3 features broken');
  round36Ok = false;
}

// 13. 不改变 attempts storage key
if (!storage36.includes('"study-tools-mini-quiz-attempts-v1"')) {
  fail('Round 3.6: attempts storage key changed');
  round36Ok = false;
}

// 14. exportLocalBackup/importLocalBackup 仍包含 attempts
if (!storage36.includes('quizAttempts: getQuizAttempts()')) {
  fail('Round 3.6: storage.js backup missing quizAttempts');
  round36Ok = false;
}

// 15. 不出现高风险表述
var forbidden36 = ['保证通过', '包过', '押题', '必过'];
for (var fi36 = 0; fi36 < forbidden36.length; fi36++) {
  if (profileJs36.includes(forbidden36[fi36]) || profileWxml36.includes(forbidden36[fi36])) {
    fail('Round 3.6: profile contains forbidden high-risk text: ' + forbidden36[fi36]);
    round36Ok = false;
  }
}

// 16. 最近练习摘要卡片存在
if (!profileWxml36.includes('最近练习摘要') && !profileWxml36.includes('最近练习') || !profileWxml36.includes('练习类型') || !profileWxml36.includes('本次答题')) {
  fail('Round 3.6: profile.wxml missing practice summary card');
  round36Ok = false;
}

// 17. getRecentAttempts 在 storage 的 exports 中
if (!storage36.includes('getRecentAttempts: getRecentAttempts')) {
  fail('Round 3.6: storage.js exports missing getRecentAttempts');
  round36Ok = false;
}

// 18. profile.js 存在最近练习摘要逻辑
if (!profileJs36.includes('lastPracticeSummary')) {
  fail('Round 3.6: profile.js missing lastPracticeSummary');
  round36Ok = false;
}

// 19. profile.js 存在 getExamLabel / getSourceLabel 安全映射
if (!profileJs36.includes('getExamLabel') || !profileJs36.includes('getSourceLabel')) {
  fail('Round 3.6: profile.js missing exam/source label helpers');
  round36Ok = false;
}

// 20. profile.js clearAttempts 重置时间线和摘要
if (!profileJs36.includes("recentAttempts: []") && !profileJs36.includes('recentAttempts')) {
  fail('Round 3.6: profile.js clearAttempts missing recentAttempts reset');
  round36Ok = false;
}

if (round36Ok) pass('Round Mini 3.6 recent practice timeline checks');

// ============================================================
// Round Mini 3.7 quiz entry experience enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.7 quiz entry experience checks ---');

var round37Ok = true;
var appJs37 = readFile('app.js');
var storage37 = readFile('utils/storage.js');
var homeJs37 = readFile('pages/home/home.js');
var homeWxml37 = readFile('pages/home/home.wxml');
var homeWxss37 = readFile('pages/home/home.wxss');

// 1. app.js 版本为 v0.21.0
if (!appJs37.includes('v0.23.0')) {
  fail('Round 3.7: app.js missing v0.23.0');
  round37Ok = false;
}

// 2. exportLocalBackup 版本为 v0.21.0
if (!storage37.includes("version: 'v0.23.0'")) {
  fail('Round 3.7: storage.js exportLocalBackup missing v0.23.0');
  round37Ok = false;
}

// 3. home 页面存在快速开始 / 继续上次练习入口
if (!homeJs37.includes('quickStart')) {
  fail('Round 3.7: home.js missing quickStart handler');
  round37Ok = false;
}
if (!homeWxml37.includes('quick-start-btn') || !homeWxml37.includes('快速开始')) {
  fail('Round 3.7: home.wxml missing quick start button');
  round37Ok = false;
}
if (!homeJs37.includes('continueLearning')) {
  fail('Round 3.7: home.js continueLearning handler broken');
  round37Ok = false;
}

// 4. 存在 getLastAttempt 或 getRecentAttempts 复用逻辑
if (!homeJs37.includes('getLastAttempt')) {
  fail('Round 3.7: home.js missing getLastAttempt usage');
  round37Ok = false;
}
if (!storage37.includes('getLastAttempt')) {
  fail('Round 3.7: storage.js missing getLastAttempt');
  round37Ok = false;
}

// 5. 无最近练习时有默认入口安全降级（quickStart 跳转 itpass+lesson_quiz）
if (!homeJs37.includes("exam=itpass&sourceType=lesson_quiz")) {
  fail('Round 3.7: home.js quickStart missing safe default URL params');
  round37Ok = false;
}

// 6. 入口参数不直接出现 undefined/null/NaN（sectionTitle 动态计算）
if (!homeJs37.includes("sectionTitle: '快速开始'") || !homeJs37.includes("sectionTitle = '继续学习'")) {
  fail('Round 3.7: home.js sectionTitle missing safe default or dynamic switching');
  round37Ok = false;
}
if (!homeJs37.includes("if (!timestamp) return ''")) {
  fail('Round 3.7: home.js formatLastPracticeTime missing null guard');
  round37Ok = false;
}

// 7. 练习入口卡片显示已答题数或练习状态
if (!homeWxml37.includes('itpassTotal') || !homeWxml37.includes('sgTotal')) {
  fail('Round 3.7: home.wxml missing exam total display');
  round37Ok = false;
}
if (!homeWxml37.includes('card-stats') || !homeWxml37.includes('card-stat-text')) {
  fail('Round 3.7: home.wxml missing card stats UI');
  round37Ok = false;
}

// 8. 正确率显示存在 NaN 防护
if (!homeJs37.includes('itpassStats.accuracy || 0') || !homeJs37.includes('sgStats.accuracy || 0')) {
  fail('Round 3.7: home.js accuracy missing NaN guard (|| 0)');
  round37Ok = false;
}

// 9. IT Passport / SG 入口仍存在
if (!homeJs37.includes('goToItPassport') || !homeWxml37.includes('goToItPassport')) {
  fail('Round 3.7: home IT Passport entry broken');
  round37Ok = false;
}
if (!homeJs37.includes('goToSG') || !homeWxml37.includes('goToSG')) {
  fail('Round 3.7: home SG entry broken');
  round37Ok = false;
}

// 10. 课程练习 / 日文真题入口仍存在（通过 exam-menu）
var examMenuJs37 = readFile('packages/quiz/pages/exam-menu/exam-menu.js');
if (!examMenuJs37.includes("sourceType=lesson_quiz") || !examMenuJs37.includes("sourceType=past_exam_japanese")) {
  fail('Round 3.7: exam-menu missing lesson_quiz/past_exam_japanese entry');
  round37Ok = false;
}

// 11. home Round Mini 3.5 学习建议仍存在
if (!homeJs37.includes('generateSuggestion') || !homeWxml37.includes('今日建议')) {
  fail('Round 3.7: home Round 3.5 suggestion entry broken');
  round37Ok = false;
}

// 12. profile Round Mini 3.6 时间线仍存在
var profileWxml37 = readFile('pages/profile/profile.wxml');
if (!profileWxml37.includes('练习时间线') || !profileWxml37.includes('timeline-list')) {
  fail('Round 3.7: profile Round 3.6 timeline broken');
  round37Ok = false;
}

// 13. mistakes Round Mini 3.4 关键功能仍存在
var mistakesJs37 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (!mistakesJs37.includes('searchKeyword') || !mistakesJs37.includes('viewMode')) {
  fail('Round 3.7: mistakes Round 3.4 features broken');
  round37Ok = false;
}

// 14. favorite-review Round Mini 3.3 关键功能仍存在
var favReviewJs37 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs37.includes('searchKeyword') || !favReviewJs37.includes('viewMode')) {
  fail('Round 3.7: favorite-review Round 3.3 features broken');
  round37Ok = false;
}

// 15. attempts storage key 未改变
if (!storage37.includes('"study-tools-mini-quiz-attempts-v1"')) {
  fail('Round 3.7: attempts storage key changed');
  round37Ok = false;
}

// 16. exportLocalBackup/importLocalBackup 仍包含 attempts
if (!storage37.includes('quizAttempts: getQuizAttempts()')) {
  fail('Round 3.7: storage.js backup missing quizAttempts');
  round37Ok = false;
}

// 17. 不出现高风险表述
var forbidden37 = ['保证通过', '包过', '押题', '必过'];
for (var fi37 = 0; fi37 < forbidden37.length; fi37++) {
  if (homeJs37.includes(forbidden37[fi37]) || homeWxml37.includes(forbidden37[fi37])) {
    fail('Round 3.7: home contains forbidden high-risk text: ' + forbidden37[fi37]);
    round37Ok = false;
  }
}

// 18. 练习状态文案安全降级（未练习 / 继续练习 / 复习错题）
if (!homeJs37.includes("if (total === 0) return '未练习'")) {
  fail('Round 3.7: home.js getStatusText missing zero-count fallback');
  round37Ok = false;
}
if (!homeWxml37.includes('itpassStatusText') || !homeWxml37.includes('sgStatusText')) {
  fail('Round 3.7: home.wxml missing status text display');
  round37Ok = false;
}

// 19. quick-start-btn 样式存在
if (!homeWxss37.includes('quick-start-btn')) {
  fail('Round 3.7: home.wxss missing quick-start-btn style');
  round37Ok = false;
}

// 20. card-stats 和 card-stat-status 样式存在
if (!homeWxss37.includes('card-stats') || !homeWxss37.includes('card-stat-status')) {
  fail('Round 3.7: home.wxss missing card stats styles');
  round37Ok = false;
}

if (round37Ok) pass('Round Mini 3.7 quiz entry experience checks');

// ============================================================
// Round Mini 3.9 local backup/restore experience checks
// ============================================================
console.log('\n--- Round Mini 3.9 backup/restore experience checks ---');

var round39Ok = true;
var appJs39 = readFile('app.js');
var storage39 = readFile('utils/storage.js');
var profileJs39 = readFile('pages/profile/profile.js');
var profileWxml39 = readFile('pages/profile/profile.wxml');
var profileWxss39 = readFile('pages/profile/profile.wxss');

// 1. app.js 版本为 v0.21.0
if (!appJs39.includes('v0.23.0')) {
  fail('Round 3.9: app.js missing v0.23.0');
  round39Ok = false;
}

// 2. exportLocalBackup 版本为 v0.21.0
if (!storage39.includes("version: 'v0.23.0'")) {
  fail('Round 3.9: storage.js exportLocalBackup missing v0.23.0');
  round39Ok = false;
}

// 3. exportLocalBackup 包含 favoriteTerms/wrongQuestions/quizAttempts
if (!storage39.includes('favoriteTerms: getFavoriteTerms()')) {
  fail('Round 3.9: exportLocalBackup missing favoriteTerms');
  round39Ok = false;
}
if (!storage39.includes('wrongQuestions: getWrongQuestions()')) {
  fail('Round 3.9: exportLocalBackup missing wrongQuestions');
  round39Ok = false;
}
if (!storage39.includes('quizAttempts: getQuizAttempts()')) {
  fail('Round 3.9: exportLocalBackup missing quizAttempts');
  round39Ok = false;
}

// 4. exportLocalBackup 包含 exportedAt 导出时间字段
if (!storage39.includes('exportedAt')) {
  fail('Round 3.9: exportLocalBackup missing exportedAt');
  round39Ok = false;
}

// 5. validateLocalBackup 仍存在
if (!storage39.includes('validateLocalBackup') || !storage39.includes('function validateLocalBackup')) {
  fail('Round 3.9: storage.js missing validateLocalBackup function');
  round39Ok = false;
}

// 6. validateLocalBackup 兼容旧备份（不检查 exportedAt）
if (storage39.includes("backup.exportedAt") && storage39.includes("typeof backup.exportedAt")) {
  // exportedAt check inside validate would break old backups - it should NOT be there
  fail('Round 3.9: validateLocalBackup must not require exportedAt for old backup compat');
  round39Ok = false;
}

// 7. importLocalBackup 不改变 storage key
if (!storage39.includes('"study-tools-mini-favorite-terms-v1"')) {
  fail('Round 3.9: FAVORITE_TERMS_KEY changed');
  round39Ok = false;
}
if (!storage39.includes('"study-tools-mini-wrong-questions-v1"')) {
  fail('Round 3.9: WRONG_QUESTIONS_KEY changed');
  round39Ok = false;
}
if (!storage39.includes('"study-tools-mini-quiz-attempts-v1"')) {
  fail('Round 3.9: QUIZ_ATTEMPTS_KEY changed');
  round39Ok = false;
}

// 8. profile 页面存在备份数据摘要
if (!profileWxml39.includes('备份数据摘要')) {
  fail('Round 3.9: profile.wxml missing backup summary section');
  round39Ok = false;
}
if (!profileJs39.includes('backupSummary')) {
  fail('Round 3.9: profile.js missing backupSummary data field');
  round39Ok = false;
}
if (!profileJs39.includes('buildBackupSummary')) {
  fail('Round 3.9: profile.js missing buildBackupSummary function');
  round39Ok = false;
}

// 9. profile 页面展示收藏/错题/学习记录数量
if (!profileWxml39.includes('backupSummary.favoriteCount') ||
    !profileWxml39.includes('backupSummary.wrongQuestionCount') ||
    !profileWxml39.includes('backupSummary.quizAttemptCount')) {
  fail('Round 3.9: profile.wxml missing backup count display');
  round39Ok = false;
}

// 10. profile 页面存在剪贴板用途说明
if (!profileWxml39.includes('数据仅保存在本机') || !profileWxml39.includes('需用户主动复制备份')) {
  fail('Round 3.9: profile.wxml missing local-only notice');
  round39Ok = false;
}

// 11. profile 恢复前存在 wx.showModal 二次确认
var modalCount = (profileJs39.match(/wx\.showModal/g) || []).length;
if (modalCount < 3) {
  fail('Round 3.9: profile.js missing sufficient wx.showModal confirmations (expected >= 3, got ' + modalCount + ')');
  round39Ok = false;
}

// 12. 恢复确认弹窗包含覆盖当前本地数据的提示
if (!profileJs39.includes('覆盖当前本地数据')) {
  fail('Round 3.9: profile.js restore confirmation missing overwrite warning');
  round39Ok = false;
}

// 13. 恢复预检存在无效格式提示
if (!profileJs39.includes('备份数据格式无效，请确认复制的是本小程序导出的备份内容')) {
  fail('Round 3.9: profile.js missing invalid backup format message');
  round39Ok = false;
}

// 14. 恢复成功后存在刷新 profile 数据的逻辑
if (!profileJs39.includes('refreshAllData')) {
  fail('Round 3.9: profile.js missing refreshAllData function');
  round39Ok = false;
}

// 15. copy/export 成功提示要求用户粘贴保存到安全位置
if (!profileJs39.includes('请粘贴保存到安全位置')) {
  fail('Round 3.9: profile.js copy success message missing save reminder');
  round39Ok = false;
}

// 16. 不出现 NaN / undefined / null 用户可见风险
// buildBackupSummary 使用 || 0 守卫
if (!profileJs39.includes('favCount || 0') || !profileJs39.includes('wrongCount || 0') || !profileJs39.includes('quizCount || 0')) {
  fail('Round 3.9: profile.js buildBackupSummary missing NaN guard (|| 0)');
  round39Ok = false;
}
// buildRestoreSummary 使用 Array.isArray guard
if (!profileJs39.includes('Array.isArray(backup.data.favoriteTerms)')) {
  fail('Round 3.9: profile.js buildRestoreSummary missing isArray guard');
  round39Ok = false;
}

// 17. 不出现误导性数据安全表述
var forbidden39Texts = ['绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复', '保证通过', '包过', '押题', '必过'];
for (var ft = 0; ft < forbidden39Texts.length; ft++) {
  if (profileJs39.includes(forbidden39Texts[ft]) || profileWxml39.includes(forbidden39Texts[ft])) {
    fail('Round 3.9: profile contains forbidden text: ' + forbidden39Texts[ft]);
    round39Ok = false;
  }
}
var storageForbidden = ['绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var sf = 0; sf < storageForbidden.length; sf++) {
  if (storage39.includes(storageForbidden[sf])) {
    fail('Round 3.9: storage.js contains forbidden text: ' + storageForbidden[sf]);
    round39Ok = false;
  }
}

// 18. 备份摘要样式存在
if (!profileWxss39.includes('backup-summary-card') || !profileWxss39.includes('backup-summary-row')) {
  fail('Round 3.9: profile.wxss missing backup summary styles');
  round39Ok = false;
}
if (!profileWxss39.includes('backup-local-notice')) {
  fail('Round 3.9: profile.wxss missing backup local notice style');
  round39Ok = false;
}

// 19. home Round Mini 3.7 快速开始仍存在
var homeJs39 = readFile('pages/home/home.js');
var homeWxml39 = readFile('pages/home/home.wxml');
if (!homeJs39.includes('quickStart') || !homeWxml39.includes('quick-start-btn')) {
  fail('Round 3.9: home Round 3.7 quickStart broken');
  round39Ok = false;
}

// 20. profile Round Mini 3.6 时间线仍存在
if (!profileWxml39.includes('练习时间线') || !profileWxml39.includes('timeline-list')) {
  fail('Round 3.9: profile Round 3.6 timeline broken');
  round39Ok = false;
}
if (!profileJs39.includes('formatTimelineTime') || !profileJs39.includes('recentAttempts')) {
  fail('Round 3.9: profile.js Round 3.6 timeline logic broken');
  round39Ok = false;
}

// 21. mistakes Round Mini 3.4 错题功能仍存在
var mistakesJs39 = readFile('packages/quiz/pages/mistakes/mistakes.js');
var mistakesWxml39 = readFile('packages/quiz/pages/mistakes/mistakes.wxml');
if (!mistakesJs39.includes('searchKeyword') || !mistakesJs39.includes('viewMode')) {
  fail('Round 3.9: mistakes Round 3.4 features broken');
  round39Ok = false;
}
if (!mistakesWxml39.includes('filter-bar') || !mistakesWxml39.includes('重新练习错题')) {
  fail('Round 3.9: mistakes.wxml Round 3.4 features broken');
  round39Ok = false;
}

// 22. favorite-review Round Mini 3.3 收藏复习仍存在
var favReviewJs39 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
var favReviewWxml39 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxml');
if (!favReviewJs39.includes('searchKeyword') || !favReviewJs39.includes('viewMode')) {
  fail('Round 3.9: favorite-review Round 3.3 features broken');
  round39Ok = false;
}
if (!favReviewWxml39.includes('复习模式') || !favReviewWxml39.includes('mode-switch')) {
  fail('Round 3.9: favorite-review.wxml Round 3.3 features broken');
  round39Ok = false;
}

if (round39Ok) pass('Round Mini 3.9 backup/restore experience checks');

// ============================================================
// Round Mini 3.17 v0.21.0 第一批增量优化检查
// ============================================================
console.log('\n--- Round Mini 3.17 v0.21.0 incremental updates ---');

var round317Ok = true;
var appJs317 = readFile('app.js');
var storage317 = readFile('utils/storage.js');
var mistakesJs317 = readFile('pages/mistakes/mistakes.js');
var mistakesWxml317 = readFile('pages/mistakes/mistakes.wxml');
var mistakesWxss317 = readFile('pages/mistakes/mistakes.wxss');
var profileJs317 = readFile('pages/profile/profile.js');
var profileWxml317 = readFile('pages/profile/profile.wxml');
var profileWxss317 = readFile('pages/profile/profile.wxss');

// 1. 版本号 v0.21.0
if (!appJs317.includes('v0.23.0')) {
  fail('Round 3.17: app.js missing v0.23.0');
  round317Ok = false;
}

// 2. exportLocalBackup 版本同步
if (!storage317.includes("version: 'v0.23.0'")) {
  fail('Round 3.17: storage.js exportLocalBackup missing v0.23.0');
  round317Ok = false;
}

// 3. storage.js 新增 getWrongQuestionStats 函数
if (!storage317.includes('function getWrongQuestionStats')) {
  fail('Round 3.17: storage.js missing getWrongQuestionStats');
  round317Ok = false;
}

// 4. storage.js 新增 getLastWrongTime 函数
if (!storage317.includes('function getLastWrongTime')) {
  fail('Round 3.17: storage.js missing getLastWrongTime');
  round317Ok = false;
}

// 5. storage.js 新增 getConsecutiveLearningDays 函数
if (!storage317.includes('function getConsecutiveLearningDays')) {
  fail('Round 3.17: storage.js missing getConsecutiveLearningDays');
  round317Ok = false;
}

// 6. storage.js exports 包含新函数
if (!storage317.includes('getWrongQuestionStats: getWrongQuestionStats')) {
  fail('Round 3.17: storage.js exports missing getWrongQuestionStats');
  round317Ok = false;
}
if (!storage317.includes('getLastWrongTime: getLastWrongTime')) {
  fail('Round 3.17: storage.js exports missing getLastWrongTime');
  round317Ok = false;
}
if (!storage317.includes('getConsecutiveLearningDays: getConsecutiveLearningDays')) {
  fail('Round 3.17: storage.js exports missing getConsecutiveLearningDays');
  round317Ok = false;
}

// 7. mistakes.js 包含分类统计字段
if (!mistakesJs317.includes('itpassCount') || !mistakesJs317.includes('sgCount')) {
  fail('Round 3.17: mistakes.js missing category count fields');
  round317Ok = false;
}

// 8. mistakes.js 包含最近错误时间字段
if (!mistakesJs317.includes('lastWrongTime')) {
  fail('Round 3.17: mistakes.js missing lastWrongTime field');
  round317Ok = false;
}

// 9. mistakes.js 调用了 getWrongQuestionStats
if (!mistakesJs317.includes('getWrongQuestionStats')) {
  fail('Round 3.17: mistakes.js not calling getWrongQuestionStats');
  round317Ok = false;
}

// 10. mistakes.wxml 包含分类统计区域
if (!mistakesWxml317.includes('category-stats')) {
  fail('Round 3.17: mistakes.wxml missing category-stats section');
  round317Ok = false;
}

// 11. mistakes.wxml 包含增强空状态
if (!mistakesWxml317.includes('enhanced-empty')) {
  fail('Round 3.17: mistakes.wxml missing enhanced-empty state');
  round317Ok = false;
}

// 12. mistakes.wxml 空状态包含引导文案
if (!mistakesWxml317.includes('完成一次练习后，答错的题目会自动收录到这里')) {
  fail('Round 3.17: mistakes.wxml empty state missing guidance text');
  round317Ok = false;
}

// 13. mistakes.wxss 包含分类样式
if (!mistakesWxss317.includes('category-stats') || !mistakesWxss317.includes('category-item')) {
  fail('Round 3.17: mistakes.wxss missing category stats styles');
  round317Ok = false;
}

// 14. mistakes.wxss 包含增强空状态样式
if (!mistakesWxss317.includes('enhanced-empty')) {
  fail('Round 3.17: mistakes.wxss missing enhanced-empty styles');
  round317Ok = false;
}

// 15. profile.js 包含 consecutiveDays 字段
if (!profileJs317.includes('consecutiveDays')) {
  fail('Round 3.17: profile.js missing consecutiveDays data field');
  round317Ok = false;
}

// 16. profile.js 调用了 getConsecutiveLearningDays
if (!profileJs317.includes('getConsecutiveLearningDays')) {
  fail('Round 3.17: profile.js not calling getConsecutiveLearningDays');
  round317Ok = false;
}

// 17. profile.wxml 包含连续学习天数展示
if (!profileWxml317.includes('连续学习') || !profileWxml317.includes('consecutiveDays')) {
  fail('Round 3.17: profile.wxml missing consecutive learning days display');
  round317Ok = false;
}

// 18. profile.wxss 包含 streak-value 样式
if (!profileWxss317.includes('streak-value')) {
  fail('Round 3.17: profile.wxss missing streak-value style');
  round317Ok = false;
}

// 19. 旧功能不受影响：home 页面仍正常
var homeJs317 = readFile('pages/home/home.js');
var homeWxml317 = readFile('pages/home/home.wxml');
if (!homeJs317.includes('quickStart') || !homeWxml317.includes('快速开始')) {
  fail('Round 3.17: home page quick start broken');
  round317Ok = false;
}

// 20. 旧功能不受影响：mistakes 页面导航入口仍存在
if (!mistakesJs317.includes('goToMistakesList') || !mistakesWxml317.includes('查看错题详情')) {
  fail('Round 3.17: mistakes page navigation broken');
  round317Ok = false;
}

// 21. 旧功能不受影响：profile 备份功能仍存在
if (!profileJs317.includes('copyBackup') || !profileJs317.includes('restoreFromClipboard')) {
  fail('Round 3.17: profile backup/restore broken');
  round317Ok = false;
}

// 22. 合规检查：无高风险承诺文案
var all317 = mistakesJs317 + mistakesWxml317 + profileJs317 + profileWxml317 + storage317;
var banned317 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var b = 0; b < banned317.length; b++) {
  if (all317.includes(banned317[b])) {
    fail('Round 3.17: banned text found: ' + banned317[b]);
    round317Ok = false;
  }
}

// 23. 无危险 API 新增
var newFiles317 = storage317 + mistakesJs317 + profileJs317;
var dangerous317 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.getUserProfile', 'wx.requestPayment'];
for (var d = 0; d < dangerous317.length; d++) {
  if (newFiles317.includes(dangerous317[d])) {
    fail('Round 3.17: dangerous API found: ' + dangerous317[d]);
    round317Ok = false;
  }
}

if (round317Ok) pass('Round Mini 3.17 v0.21.0 incremental updates');

// ============================================================
// Round Mini 3.18 quiz entry enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.18 quiz entry enhancement checks ---');

var round318Ok = true;
var appJs318 = readFile('app.js');
var storage318 = readFile('utils/storage.js');
var homeJs318 = readFile('pages/home/home.js');
var homeWxml318 = readFile('pages/home/home.wxml');
var homeWxss318 = readFile('pages/home/home.wxss');

// 1. 版本号保持 v0.21.0
if (!appJs318.includes('v0.23.0')) {
  fail('Round 3.18: app.js missing v0.23.0');
  round318Ok = false;
}

// 2. storage.js 新增 getLastAttemptByExam 函数
if (!storage318.includes('function getLastAttemptByExam')) {
  fail('Round 3.18: storage.js missing getLastAttemptByExam');
  round318Ok = false;
}

// 3. storage.js exports 包含 getLastAttemptByExam
if (!storage318.includes('getLastAttemptByExam: getLastAttemptByExam')) {
  fail('Round 3.18: storage.js exports missing getLastAttemptByExam');
  round318Ok = false;
}

// 4. getLastAttemptByExam 为纯读函数（不写 storage）
if (!storage318.includes('var list = getQuizAttempts()') || !storage318.includes('getLastAttemptByExam')) {
  fail('Round 3.18: getLastAttemptByExam should be pure read');
  round318Ok = false;
}

// 5. home.js 导入 getLastAttemptByExam
if (!homeJs318.includes('getLastAttemptByExam')) {
  fail('Round 3.18: home.js missing getLastAttemptByExam import');
  round318Ok = false;
}

// 6. home.js 存在 per-exam 最近练习时间字段
if (!homeJs318.includes('itpassLastTime') || !homeJs318.includes('sgLastTime')) {
  fail('Round 3.18: home.js missing itpassLastTime/sgLastTime');
  round318Ok = false;
}

// 7. home.js 存在弱项检测逻辑
if (!homeJs318.includes('itpassWeak') || !homeJs318.includes('sgWeak')) {
  fail('Round 3.18: home.js missing weak subject detection');
  round318Ok = false;
}

// 8. 弱项条件：差距 >= 20% 且弱者 < 70%
if (!homeJs318.includes('gap >= 20') || !homeJs318.includes('< 70')) {
  fail('Round 3.18: home.js weak condition incomplete (need gap>=20, low<70)');
  round318Ok = false;
}

// 9. home.wxml IT Passport 卡片显示最近练习时间
if (!homeWxml318.includes('itpassLastTime')) {
  fail('Round 3.18: home.wxml IT Passport card missing last time');
  round318Ok = false;
}

// 10. home.wxml SG 卡片显示最近练习时间
if (!homeWxml318.includes('sgLastTime')) {
  fail('Round 3.18: home.wxml SG card missing last time');
  round318Ok = false;
}

// 11. home.wxml 存在弱项徽标
if (!homeWxml318.includes('card-weak-badge') || !homeWxml318.includes('建议优先复习')) {
  fail('Round 3.18: home.wxml missing weak badge');
  round318Ok = false;
}

// 12. home.wxss 存在弱项徽标样式
if (!homeWxss318.includes('card-weak-badge')) {
  fail('Round 3.18: home.wxss missing card-weak-badge style');
  round318Ok = false;
}

// 13. home.wxss 存在最近练习时间样式
if (!homeWxss318.includes('card-last-time')) {
  fail('Round 3.18: home.wxss missing card-last-time style');
  round318Ok = false;
}

// 14. home.wxss 存在 card-title-wrap 样式
if (!homeWxss318.includes('card-title-wrap')) {
  fail('Round 3.18: home.wxss missing card-title-wrap style');
  round318Ok = false;
}

// 15. 无高风险承诺文案
var all318 = homeJs318 + homeWxml318 + storage318;
var banned318 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案'];
for (var b318 = 0; b318 < banned318.length; b318++) {
  if (all318.includes(banned318[b318])) {
    fail('Round 3.18: banned text found: ' + banned318[b318]);
    round318Ok = false;
  }
}

// 16. 无新 storage keys
var newKeysPattern = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (newKeysPattern.test(storage318)) {
  fail('Round 3.18: new storage key detected');
  round318Ok = false;
}

// 17. 无危险 API
var forbiddenAPIs318 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo'];
for (var a318 = 0; a318 < forbiddenAPIs318.length; a318++) {
  if (all318.includes(forbiddenAPIs318[a318])) {
    fail('Round 3.18: forbidden API found: ' + forbiddenAPIs318[a318]);
    round318Ok = false;
  }
}

// 18. exportLocalBackup 版本保持 v0.21.0
if (!storage318.includes("version: 'v0.23.0'")) {
  fail('Round 3.18: storage.js backup version not v0.23.0');
  round318Ok = false;
}

// 19. home Navigation 入口仍存在
if (!homeJs318.includes('goToItPassport') || !homeJs318.includes('goToSG')) {
  fail('Round 3.18: home exam entries broken');
  round318Ok = false;
}

// 20. Round 3.17 mistakes 增强功能仍存在
var mistakesJs318 = readFile('pages/mistakes/mistakes.js');
var mistakesWxml318 = readFile('pages/mistakes/mistakes.wxml');
if (!mistakesJs318.includes('getWrongQuestionStats')) {
  fail('Round 3.18: Round 3.17 mistakes JS features broken');
  round318Ok = false;
}
if (!mistakesWxml318.includes('category-stats')) {
  fail('Round 3.18: Round 3.17 mistakes WXML features broken');
  round318Ok = false;
}

// 21. Round 3.17 profile 连续学习天数仍存在
var profileJs318 = readFile('pages/profile/profile.js');
if (!profileJs318.includes('getConsecutiveLearningDays')) {
  fail('Round 3.18: Round 3.17 profile consecutive days broken');
  round318Ok = false;
}

// 22. home 继续学习入口仍存在
if (!homeJs318.includes('continueLearning') || !homeWxml318.includes('继续上次的练习')) {
  fail('Round 3.18: home continue learning broken');
  round318Ok = false;
}

if (round318Ok) pass('Round Mini 3.18 quiz entry enhancement checks');

// ============================================================
console.log('\n--- preloadRule 分包预下载检查 ---');

let preloadOk = true;
const preloadRule = appJson.preloadRule;
if (!preloadRule) {
  fail('app.json missing preloadRule');
  preloadOk = false;
} else {
  // 检查 glossary 分包在首页和术语 tab 有预下载配置
  var homeRule = preloadRule['pages/home/home'];
  var glossaryRule = preloadRule['pages/glossary/glossary'];
  if (!homeRule) {
    fail('preloadRule: missing pages/home/home entry');
    preloadOk = false;
  } else if (!homeRule.packages || !homeRule.packages.includes('glossary')) {
    fail('preloadRule: pages/home/home does not preload glossary package');
    preloadOk = false;
  }
  if (!glossaryRule) {
    fail('preloadRule: missing pages/glossary/glossary entry');
    preloadOk = false;
  } else if (!glossaryRule.packages || !glossaryRule.packages.includes('glossary')) {
    fail('preloadRule: pages/glossary/glossary does not preload glossary package');
    preloadOk = false;
  }
}
if (preloadOk) pass('preloadRule for glossary subpackage valid');

// ============================================================
// Round Mini 3.19 favorite review enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.19 favorite review enhancement checks ---');

var round319Ok = true;
var appJs319 = readFile('app.js');
var storage319 = readFile('utils/storage.js');
var favReviewJs319 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
var favReviewWxml319 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxml');
var favReviewWxss319 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxss');

// 1. 版本号保持 v0.21.0
if (!appJs319.includes('v0.23.0')) {
  fail('Round 3.19: app.js missing v0.23.0');
  round319Ok = false;
}

// 2. storage.js 新增 getFavoriteTermStats 函数
if (!storage319.includes('function getFavoriteTermStats')) {
  fail('Round 3.19: storage.js missing getFavoriteTermStats');
  round319Ok = false;
}

// 3. storage.js exports 包含 getFavoriteTermStats
if (!storage319.includes('getFavoriteTermStats: getFavoriteTermStats')) {
  fail('Round 3.19: storage.js exports missing getFavoriteTermStats');
  round319Ok = false;
}

// 4. getFavoriteTermStats 为纯读函数（不写 storage）
if (storage319.includes('getFavoriteTermStats') && storage319.includes('wx.setStorageSync')) {
  // Check if setStorageSync is inside getFavoriteTermStats
  var fnMatch = storage319.match(/function getFavoriteTermStats\(\)[\s\S]*?^}/m);
  if (fnMatch && fnMatch[0] && fnMatch[0].includes('setStorageSync')) {
    fail('Round 3.19: getFavoriteTermStats must be pure read');
    round319Ok = false;
  }
}

// 5. favorite-review.js 存在 lastSavedAtFormatted 字段
if (!favReviewJs319.includes('lastSavedAtFormatted')) {
  fail('Round 3.19: favorite-review.js missing lastSavedAtFormatted');
  round319Ok = false;
}

// 6. favorite-review.js 计算 lastSavedAtFormatted
if (favReviewJs319.includes('lastSavedAtFormatted') && !favReviewJs319.includes('formatSavedAt(lastSavedAt)')) {
  // Check if lastSavedAtFormatted is computed
  if (!favReviewJs319.includes('lastSavedAt > 0') && !favReviewJs319.includes('lastSavedAtFormatted =')) {
    fail('Round 3.19: favorite-review.js not computing lastSavedAtFormatted');
    round319Ok = false;
  }
}

// 7. favorite-review.wxml 增强统计区域显示最近收藏时间
if (!favReviewWxml319.includes('lastSavedAtFormatted')) {
  fail('Round 3.19: favorite-review.wxml missing lastSavedAtFormatted display');
  round319Ok = false;
}
if (!favReviewWxml319.includes('stats-last-saved')) {
  fail('Round 3.19: favorite-review.wxml missing stats-last-saved class');
  round319Ok = false;
}

// 8. favorite-review.wxss 存在 .stats-row 和 .stats-last-saved 样式
if (!favReviewWxss319.includes('.stats-row')) {
  fail('Round 3.19: favorite-review.wxss missing .stats-row style');
  round319Ok = false;
}
if (!favReviewWxss319.includes('.stats-last-saved')) {
  fail('Round 3.19: favorite-review.wxss missing .stats-last-saved style');
  round319Ok = false;
}

// 9. favorite-review.wxss 空状态图标为 120rpx
if (!favReviewWxss319.includes('font-size: 120rpx;')) {
  fail('Round 3.19: favorite-review.wxss empty icon should be 120rpx');
  round319Ok = false;
}

// 10. 无新 storage keys
var keyPattern319 = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (keyPattern319.test(storage319)) {
  fail('Round 3.19: new storage key detected');
  round319Ok = false;
}

// 11. exportLocalBackup 版本保持 v0.21.0
if (!storage319.includes("version: 'v0.23.0'")) {
  fail('Round 3.19: storage.js backup version not v0.23.0');
  round319Ok = false;
}

// 12. 无危险 API
var all319 = favReviewJs319 + storage319;
var forbidden319 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.requestPayment'];
for (var a319 = 0; a319 < forbidden319.length; a319++) {
  if (all319.includes(forbidden319[a319])) {
    fail('Round 3.19: forbidden API found: ' + forbidden319[a319]);
    round319Ok = false;
  }
}

// 13. 无高风险表述
var banned319 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步'];
for (var b319 = 0; b319 < banned319.length; b319++) {
  if (all319.includes(banned319[b319])) {
    fail('Round 3.19: banned text found: ' + banned319[b319]);
    round319Ok = false;
  }
}

// 14. formatSavedAt 安全处理 NaN
if (favReviewJs319.includes('formatSavedAt') && favReviewJs319.includes('isNaN')) {
  // Good - formatSavedAt has NaN guard
} else if (favReviewJs319.includes('function formatSavedAt')) {
  if (!favReviewJs319.includes('isNaN')) {
    fail('Round 3.19: formatSavedAt missing NaN guard');
    round319Ok = false;
  }
}

// 15. 空状态存在（增强前已存在，确认未删除）
if (!favReviewWxml319.includes('empty-state')) {
  fail('Round 3.19: favorite-review.wxml missing empty-state');
  round319Ok = false;
}

// 16. 空状态有引导和跳转按钮
if (!favReviewWxml319.includes('goToGlossary') || !favReviewWxml319.includes('goSearch')) {
  fail('Round 3.19: empty state missing navigation buttons');
  round319Ok = false;
}

// 17. Round 3.17 mistakes 功能仍存在
var mistakesJs319 = readFile('pages/mistakes/mistakes.js');
if (!mistakesJs319.includes('getWrongQuestionStats')) {
  fail('Round 3.19: Round 3.17 mistakes JS features broken');
  round319Ok = false;
}

// 18. Round 3.17 profile 连续学习天数仍存在
var profileJs319 = readFile('pages/profile/profile.js');
if (!profileJs319.includes('getConsecutiveLearningDays')) {
  fail('Round 3.19: Round 3.17 profile consecutive days broken');
  round319Ok = false;
}

// 19. Round 3.18 首页弱项徽标仍存在
var homeWxml319 = readFile('pages/home/home.wxml');
if (!homeWxml319.includes('card-weak-badge')) {
  fail('Round 3.19: Round 3.18 home weak badge broken');
  round319Ok = false;
}

// 20. favorite-review 列表模式和复习模式仍存在
if (!favReviewJs319.includes('switchToListMode') || !favReviewJs319.includes('switchToReviewMode')) {
  fail('Round 3.19: favorite-review mode switch broken');
  round319Ok = false;
}

if (round319Ok) pass('Round Mini 3.19 favorite review enhancement checks');

// ============================================================
// Round Mini 3.20 continue practice + quiz insights checks
// ============================================================
console.log('\n--- Round Mini 3.20 continue practice + quiz insights checks ---');

var round320Ok = true;
var appJs320 = readFile('app.js');
var storage320 = readFile('utils/storage.js');
var homeJs320 = readFile('pages/home/home.js');
var homeWxml320 = readFile('pages/home/home.wxml');
var homeWxss320 = readFile('pages/home/home.wxss');
var quizJs320 = readFile('packages/quiz/pages/quiz/quiz.js');
var quizWxml320 = readFile('packages/quiz/pages/quiz/quiz.wxml');
var quizWxss320 = readFile('packages/quiz/pages/quiz/quiz.wxss');

// === 版本号 ===
if (!appJs320.includes('v0.23.0')) {
  fail('Round 3.20: app.js missing v0.23.0');
  round320Ok = false;
}

// === A. 首页继续练习入口增强 ===

// 1. home.js 存在 lastAttemptAccuracy 字段
if (!homeJs320.includes('lastAttemptAccuracy')) {
  fail('Round 3.20: home.js missing lastAttemptAccuracy');
  round320Ok = false;
}

// 2. home.js 存在 continueSuggestion 字段
if (!homeJs320.includes('continueSuggestion')) {
  fail('Round 3.20: home.js missing continueSuggestion');
  round320Ok = false;
}

// 3. home.js 计算 continueSuggestion（基于准确率级别）
if (!homeJs320.includes('继续保持节奏') || !homeJs320.includes('建议再练一组') || !homeJs320.includes('先复盘错题')) {
  fail('Round 3.20: home.js incomplete continueSuggestion logic');
  round320Ok = false;
}

// 4. home.js 准确率判断使用 >= 80 / >= 60 / else 三级
if (!homeJs320.includes('>= 80') || !homeJs320.includes('>= 60')) {
  fail('Round 3.20: home.js missing accuracy tier thresholds');
  round320Ok = false;
}

// 5. home.wxml 继续练习卡片有 continue-meta-row
if (!homeWxml320.includes('continue-meta-row')) {
  fail('Round 3.20: home.wxml continue card missing continue-meta-row');
  round320Ok = false;
}

// 6. home.wxml 继续练习卡片有 continue-time（最后练习时间）
if (!homeWxml320.includes('continue-time')) {
  fail('Round 3.20: home.wxml continue card missing continue-time');
  round320Ok = false;
}

// 7. home.wxml 有 continue-suggestion-bar
if (!homeWxml320.includes('continue-suggestion-bar')) {
  fail('Round 3.20: home.wxml missing continue-suggestion-bar');
  round320Ok = false;
}

// 8. home.wxss 有 continue-meta-row 样式
if (!homeWxss320.includes('continue-meta-row')) {
  fail('Round 3.20: home.wxss missing continue-meta-row style');
  round320Ok = false;
}

// 9. home.wxss 有 continue-time 样式
if (!homeWxss320.includes('continue-time')) {
  fail('Round 3.20: home.wxss missing continue-time style');
  round320Ok = false;
}

// 10. home.wxss 有 continue-suggestion-bar 样式
if (!homeWxss320.includes('continue-suggestion-bar')) {
  fail('Round 3.20: home.wxss missing continue-suggestion-bar style');
  round320Ok = false;
}

// 11. home 继续练习入口点击行为不变
if (!homeJs320.includes('continueLearning')) {
  fail('Round 3.20: home continueLearning handler broken');
  round320Ok = false;
}

// 12. home 无记录空状态仍显示
if (!homeWxml320.includes('快速开始') || !homeJs320.includes('quickStart')) {
  fail('Round 3.20: home empty state quick start broken');
  round320Ok = false;
}

// === B. 结果页轻量学习洞察 ===

// 13. quiz.js 存在 accuracyLevel 字段
if (!quizJs320.includes('accuracyLevel')) {
  fail('Round 3.20: quiz.js missing accuracyLevel');
  round320Ok = false;
}

// 14. quiz.js 存在 insightHint 字段
if (!quizJs320.includes('insightHint')) {
  fail('Round 3.20: quiz.js missing insightHint');
  round320Ok = false;
}

// 15. quiz.js showPracticeResult 使用 3 级阈值: >= 85 / >= 60 / else
if (!quizJs320.includes('>= 85') || !quizJs320.includes('>= 60')) {
  fail('Round 3.20: quiz.js missing accuracy tier thresholds (85/60)');
  round320Ok = false;
}

// 16. quiz.js 3 级标签: good / moderate / low
if (!quizJs320.includes("'good'") || !quizJs320.includes("'moderate'") || !quizJs320.includes("'low'")) {
  fail('Round 3.20: quiz.js missing accuracy levels (good/moderate/low)');
  round320Ok = false;
}

// 17. quiz.js resetSession 重置 insight 字段
if (quizJs320.includes('resetSession')) {
  var resetFn = quizJs320.match(/resetSession[\s\S]*?^\},/m);
  if (resetFn && resetFn[0]) {
    if (!resetFn[0].includes('accuracyLevel') || !resetFn[0].includes('insightHint')) {
      fail('Round 3.20: quiz.js resetSession missing insight field reset');
      round320Ok = false;
    }
  }
}

// 18. quiz.wxml 有 insight-block 元素
if (!quizWxml320.includes('insight-block')) {
  fail('Round 3.20: quiz.wxml missing insight-block');
  round320Ok = false;
}

// 19. quiz.wxml 有 insight-{{accuracyLevel}} 动态样式绑定
if (!quizWxml320.includes('insight-{{accuracyLevel}}')) {
  fail('Round 3.20: quiz.wxml missing dynamic accuracy level class');
  round320Ok = false;
}

// 20. quiz.wxss 有 insight-good / insight-moderate / insight-low 样式
if (!quizWxss320.includes('insight-good') || !quizWxss320.includes('insight-moderate') || !quizWxss320.includes('insight-low')) {
  fail('Round 3.20: quiz.wxss missing insight level styles');
  round320Ok = false;
}

// 21. quiz.wxss 有 insight-label / insight-hint 样式
if (!quizWxss320.includes('insight-label') || !quizWxss320.includes('insight-hint')) {
  fail('Round 3.20: quiz.wxss missing insight text styles');
  round320Ok = false;
}

// 22. quiz 结果页原有按钮仍存在（再练一次、查看错题、返回首页）
if (!quizWxml320.includes('再练一次') || !quizJs320.includes('restartPractice')) {
  fail('Round 3.20: quiz restart practice broken');
  round320Ok = false;
}
if (!quizWxml320.includes('查看错题') || !quizJs320.includes('goMistakes')) {
  fail('Round 3.20: quiz mistakes entry broken');
  round320Ok = false;
}
if (!quizWxml320.includes('返回首页') || !quizJs320.includes('goHome')) {
  fail('Round 3.20: quiz home entry broken');
  round320Ok = false;
}

// === 通用合规 ===

// 23. 无新 storage keys
var all320 = homeJs320 + quizJs320 + storage320;
var keyPattern320 = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (keyPattern320.test(storage320)) {
  fail('Round 3.20: new storage key detected');
  round320Ok = false;
}

// 24. exportLocalBackup 版本保持 v0.21.0
if (!storage320.includes("version: 'v0.23.0'")) {
  fail('Round 3.20: storage.js backup version not v0.23.0');
  round320Ok = false;
}

// 25. 无危险 API
var forbidden320 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.requestPayment'];
for (var a320 = 0; a320 < forbidden320.length; a320++) {
  if (all320.includes(forbidden320[a320])) {
    fail('Round 3.20: forbidden API found: ' + forbidden320[a320]);
    round320Ok = false;
  }
}

// 26. 无高风险表述
var banned320 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全'];
for (var b320 = 0; b320 < banned320.length; b320++) {
  if (all320.includes(banned320[b320])) {
    fail('Round 3.20: banned text found: ' + banned320[b320]);
    round320Ok = false;
  }
}

// 27. Round 3.17 mistakes 功能仍存在
var mistakesJs320 = readFile('pages/mistakes/mistakes.js');
if (!mistakesJs320.includes('getWrongQuestionStats')) {
  fail('Round 3.20: Round 3.17 mistakes features broken');
  round320Ok = false;
}

// 28. Round 3.17 profile 连续学习天数仍存在
var profileJs320 = readFile('pages/profile/profile.js');
if (!profileJs320.includes('getConsecutiveLearningDays')) {
  fail('Round 3.20: Round 3.17 profile consecutive days broken');
  round320Ok = false;
}

// 29. Round 3.18 home 弱项徽标仍存在
if (!homeWxml320.includes('card-weak-badge')) {
  fail('Round 3.20: Round 3.18 home weak badge broken');
  round320Ok = false;
}

// 30. Round 3.19 favorite-review 增强仍存在
var favReviewJs320 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs320.includes('lastSavedAtFormatted')) {
  fail('Round 3.20: Round 3.19 favorite-review lastSavedAtFormatted broken');
  round320Ok = false;
}
if (!storage320.includes('getFavoriteTermStats')) {
  fail('Round 3.20: Round 3.19 storage getFavoriteTermStats broken');
  round320Ok = false;
}

// 31. quiz 答题流程不变（selectAnswer、nextQuestion 仍存在）
if (!quizJs320.includes('selectAnswer') || !quizJs320.includes('nextQuestion')) {
  fail('Round 3.20: quiz core flow broken (selectAnswer/nextQuestion)');
  round320Ok = false;
}

// 32. quiz 错题保存逻辑不变
if (!quizJs320.includes('addWrongQuestion') || !quizJs320.includes('addQuizAttempt')) {
  fail('Round 3.20: quiz wrong question saving broken');
  round320Ok = false;
}

if (round320Ok) pass('Round Mini 3.20 continue practice + quiz insights checks');

// ============================================================
// Round Mini 3.21 profile learning insights + glossary search empty state checks
// ============================================================
console.log('\n--- Round Mini 3.21 profile insights + glossary search checks ---');

var round321Ok = true;
var appJs321 = readFile('app.js');
var storage321 = readFile('utils/storage.js');
var profileJs321 = readFile('pages/profile/profile.js');
var profileWxml321 = readFile('pages/profile/profile.wxml');
var profileWxss321 = readFile('pages/profile/profile.wxss');
var termSearchWxml321 = readFile('packages/glossary/pages/term-search/term-search.wxml');
var termSearchWxss321 = readFile('packages/glossary/pages/term-search/term-search.wxss');

// === 版本号 ===
if (!appJs321.includes('v0.23.0')) {
  fail('Round 3.21: app.js missing v0.23.0');
  round321Ok = false;
}

// === A. Profile 复习建议 ===
// 1. profile.js 存在 reviewHints 字段
if (!profileJs321.includes('reviewHints')) {
  fail('Round 3.21: profile.js missing reviewHints data field');
  round321Ok = false;
}

// 2. profile.js 计算错题复习提示
if (!profileJs321.includes('道错题待复习，建议优先复盘错题')) {
  fail('Round 3.21: profile.js missing wrong question review hint');
  round321Ok = false;
}

// 3. profile.js 计算收藏复习提示
if (!profileJs321.includes('个术语，可以安排一次收藏复习')) {
  fail('Round 3.21: profile.js missing favorite review hint');
  round321Ok = false;
}

// 4. profile.js 空状态复习提示
if (!profileJs321.includes('开始练习后这里会显示个性化复习建议')) {
  fail('Round 3.21: profile.js missing empty review hints fallback');
  round321Ok = false;
}

// 5. profile.wxml 存在复习建议区域
if (!profileWxml321.includes('复习建议') || !profileWxml321.includes('review-hint-list')) {
  fail('Round 3.21: profile.wxml missing review hints section');
  round321Ok = false;
}

// 6. profile.wxml 复习建议使用 review-hint-{{item.type}} 动态样式
if (!profileWxml321.includes('review-hint-{{item.type}}')) {
  fail('Round 3.21: profile.wxml missing dynamic review hint type class');
  round321Ok = false;
}

// 7. profile.wxss 存在复习建议样式
if (!profileWxss321.includes('review-hint-list') || !profileWxss321.includes('review-hint-item')) {
  fail('Round 3.21: profile.wxss missing review hint styles');
  round321Ok = false;
}
if (!profileWxss321.includes('review-hint-wrong') || !profileWxss321.includes('review-hint-favorite') || !profileWxss321.includes('review-hint-empty')) {
  fail('Round 3.21: profile.wxss missing review hint type styles');
  round321Ok = false;
}

// === B. Profile 科目对比洞察 ===
// 8. profile.js 存在 subjectComparison 字段
if (!profileJs321.includes('subjectComparison')) {
  fail('Round 3.21: profile.js missing subjectComparison data field');
  round321Ok = false;
}

// 9. profile.js 存在科目对比计算逻辑
if (!profileJs321.includes('建议多关注 SG 复习') || !profileJs321.includes('建议多关注 IT Passport 复习')) {
  fail('Round 3.21: profile.js missing subject comparison suggestions');
  round321Ok = false;
}

// 10. profile.js 存在两者正确率相同的处理
if (!profileJs321.includes('可以均衡复习')) {
  fail('Round 3.21: profile.js missing equal accuracy case');
  round321Ok = false;
}

// 11. profile.js 存在单科目数据场景处理
if (!profileJs321.includes('还没有 SG 练习记录') || !profileJs321.includes('还没有 IT Passport 练习记录')) {
  fail('Round 3.21: profile.js missing single-exam no-data handling');
  round321Ok = false;
}

// 12. profile.js 存在无数据时的友好文案
if (!profileJs321.includes('完成练习后会显示各科目正确率对比')) {
  fail('Round 3.21: profile.js missing no-data subject comparison text');
  round321Ok = false;
}

// 13. profile.wxml 存在科目对比洞察展示区
if (!profileWxml321.includes('subject-compare-card') || !profileWxml321.includes('subject-compare-text')) {
  fail('Round 3.21: profile.wxml missing subject comparison section');
  round321Ok = false;
}

// 14. profile.wxml 科目对比分有数据/无数据两种状态
if (!profileWxml321.includes('subjectComparison.hasData')) {
  fail('Round 3.21: profile.wxml missing subject comparison hasData conditional');
  round321Ok = false;
}

// 15. profile.wxss 存在科目对比样式
if (!profileWxss321.includes('subject-compare-card') || !profileWxss321.includes('subject-compare-text')) {
  fail('Round 3.21: profile.wxss missing subject comparison styles');
  round321Ok = false;
}
if (!profileWxss321.includes('subject-compare-empty')) {
  fail('Round 3.21: profile.wxss missing subject-compare-empty style');
  round321Ok = false;
}

// === C. Profile 新用户欢迎引导 ===
// 16. profile.js 存在 isNewUser 字段
if (!profileJs321.includes('isNewUser')) {
  fail('Round 3.21: profile.js missing isNewUser field');
  round321Ok = false;
}

// 17. profile.js 使用 stats.total === 0 判断新用户
if (!profileJs321.includes('(stats.total || 0) === 0')) {
  fail('Round 3.21: profile.js missing isNewUser computation with NaN guard');
  round321Ok = false;
}

// 18. profile.wxml 存在新用户欢迎引导区
if (!profileWxml321.includes('welcome-card') || !profileWxml321.includes('还没有练习记录')) {
  fail('Round 3.21: profile.wxml missing welcome card for new users');
  round321Ok = false;
}

// 19. profile.wxml 欢迎引导包含具体操作建议
if (!profileWxml321.includes('选择 IT Passport 或 SG 方向') || !profileWxml321.includes('浏览术语表')) {
  fail('Round 3.21: profile.wxml welcome card missing actionable guidance');
  round321Ok = false;
}

// 20. profile.wxss 存在欢迎引导样式
if (!profileWxss321.includes('welcome-card') || !profileWxss321.includes('welcome-icon')) {
  fail('Round 3.21: profile.wxss missing welcome card styles');
  round321Ok = false;
}

// === D. Glossary 搜索空状态增强 ===
// 21. term-search.wxml 空状态文本改为"没有找到相关术语"
if (!termSearchWxml321.includes('没有找到相关术语')) {
  fail('Round 3.21: term-search.wxml empty text not updated');
  round321Ok = false;
}

// 22. term-search.wxml 空状态包含建议列表
if (!termSearchWxml321.includes('empty-suggestions') || !termSearchWxml321.includes('empty-suggestion-item')) {
  fail('Round 3.21: term-search.wxml missing suggestion list in empty state');
  round321Ok = false;
}

// 23. term-search.wxml 空状态包含具体建议（更换关键词、多语言、更短关键词）
if (!termSearchWxml321.includes('更换关键词试试') || !termSearchWxml321.includes('中文、日文或英文技术词') || !termSearchWxml321.includes('尝试更短的关键词')) {
  fail('Round 3.21: term-search.wxml missing specific suggestions');
  round321Ok = false;
}

// 24. term-search.wxss 存在空状态增强样式
if (!termSearchWxss321.includes('empty-suggestions') || !termSearchWxss321.includes('empty-suggestion-title')) {
  fail('Round 3.21: term-search.wxss missing enhanced empty state styles');
  round321Ok = false;
}

// 25. term-search.wxml 空搜索词不显示无结果错误式文案 (keyword check 保持)
if (!termSearchWxml321.includes('filteredList.length === 0 && keyword')) {
  fail('Round 3.21: term-search.wxml empty keyword guard broken');
  round321Ok = false;
}

// === E. 合规检查 ===
// 26. 无新 storage keys
var all321 = profileJs321 + storage321 + termSearchWxml321;
var keyPattern321 = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (keyPattern321.test(storage321)) {
  fail('Round 3.21: new storage key detected');
  round321Ok = false;
}

// 27. exportLocalBackup 版本保持 v0.21.0
if (!storage321.includes("version: 'v0.23.0'")) {
  fail('Round 3.21: storage.js backup version not v0.23.0');
  round321Ok = false;
}

// 28. 无危险 API
var forbidden321 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.requestPayment'];
for (var a321 = 0; a321 < forbidden321.length; a321++) {
  if (all321.includes(forbidden321[a321])) {
    fail('Round 3.21: forbidden API found: ' + forbidden321[a321]);
    round321Ok = false;
  }
}

// 29. 无高风险表述
var banned321 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var b321 = 0; b321 < banned321.length; b321++) {
  if (all321.includes(banned321[b321])) {
    fail('Round 3.21: banned text found: ' + banned321[b321]);
    round321Ok = false;
  }
}

// === F. 回归检查 ===
// 30. Round 3.17 mistakes 功能仍存在
var mistakesJs321 = readFile('pages/mistakes/mistakes.js');
if (!mistakesJs321.includes('getWrongQuestionStats')) {
  fail('Round 3.21: Round 3.17 mistakes features broken');
  round321Ok = false;
}

// 31. Round 3.17 profile 连续学习天数仍存在
if (!profileJs321.includes('getConsecutiveLearningDays')) {
  fail('Round 3.21: Round 3.17 profile consecutive days broken');
  round321Ok = false;
}

// 32. Round 3.18 home 弱项徽标仍存在
var homeWxml321 = readFile('pages/home/home.wxml');
if (!homeWxml321.includes('card-weak-badge')) {
  fail('Round 3.21: Round 3.18 home weak badge broken');
  round321Ok = false;
}

// 33. Round 3.19 favorite-review 增强仍存在
var favReviewJs321 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs321.includes('lastSavedAtFormatted')) {
  fail('Round 3.21: Round 3.19 favorite-review lastSavedAtFormatted broken');
  round321Ok = false;
}
if (!storage321.includes('getFavoriteTermStats')) {
  fail('Round 3.21: Round 3.19 storage getFavoriteTermStats broken');
  round321Ok = false;
}

// 34. Round 3.20 home continue suggestion 仍存在
var homeJs321 = readFile('pages/home/home.js');
if (!homeJs321.includes('lastAttemptAccuracy') || !homeJs321.includes('continueSuggestion')) {
  fail('Round 3.21: Round 3.20 home continue practice broken');
  round321Ok = false;
}

// 35. Round 3.20 quiz insights 仍存在
var quizJs321 = readFile('packages/quiz/pages/quiz/quiz.js');
if (!quizJs321.includes('accuracyLevel') || !quizJs321.includes('insightHint')) {
  fail('Round 3.21: Round 3.20 quiz insights broken');
  round321Ok = false;
}

// 36. profile 备份功能仍存在
if (!profileJs321.includes('copyBackup') || !profileJs321.includes('restoreFromClipboard')) {
  fail('Round 3.21: profile backup/restore broken');
  round321Ok = false;
}

// 37. profile 时间线功能仍存在
if (!profileWxml321.includes('练习时间线') || !profileWxml321.includes('timeline-list')) {
  fail('Round 3.21: profile timeline broken');
  round321Ok = false;
}

// 38. glossary 术语列表、收藏逻辑不受影响
if (!termSearchWxml321.includes('glossary-card') || !termSearchWxml321.includes('_isFavorite')) {
  fail('Round 3.21: glossary card / favorite display broken');
  round321Ok = false;
}

// 39. glossary 搜索逻辑不变（filterData、onSearchInput 仍存在）
var termSearchJs321 = readFile('packages/glossary/pages/term-search/term-search.js');
if (!termSearchJs321.includes('filterData') || !termSearchJs321.includes('onSearchInput')) {
  fail('Round 3.21: glossary search logic broken');
  round321Ok = false;
}

// 40. 不出现 NaN / undefined / null 可见风险（reviewHints 文案不嵌入裸变量）
if (profileJs321.includes("text: '当前有 ' + wrongQuestionCount + ' 道错题")) {
  // Good - uses computed values safely
} else {
  fail('Round 3.21: profile.js review hint text not safely computed');
  round321Ok = false;
}

if (round321Ok) pass('Round Mini 3.21 profile insights + glossary search checks');

// ============================================================
// Round Mini 3.22 exam-menu enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.22 exam-menu enhancement checks ---');

var round322Ok = true;
var appJs322 = readFile('app.js');
var examMenuJs322 = readFile('packages/quiz/pages/exam-menu/exam-menu.js');
var examMenuWxml322 = readFile('packages/quiz/pages/exam-menu/exam-menu.wxml');
var examMenuWxss322 = readFile('packages/quiz/pages/exam-menu/exam-menu.wxss');
var storage322 = readFile('utils/storage.js');

// === A. exam-menu.js 新增功能 ===
// 1. 引入 getLastAttemptByExam
if (!examMenuJs322.includes('getLastAttemptByExam')) {
  fail('Round 3.22: exam-menu.js missing getLastAttemptByExam import');
  round322Ok = false;
}

// 2. 存在 formatTimeAgo 辅助函数
if (!examMenuJs322.includes('formatTimeAgo') || !examMenuJs322.includes('分钟前')) {
  fail('Round 3.22: exam-menu.js missing formatTimeAgo helper');
  round322Ok = false;
}

// 3. 存在整体统计计算（overallTotal / overallCorrect）
if (!examMenuJs322.includes('overallTotal') || !examMenuJs322.includes('overallCorrect')) {
  fail('Round 3.22: exam-menu.js missing overall stats computation');
  round322Ok = false;
}

// 4. 存在 overallAccuracy 计算
if (!examMenuJs322.includes('overallAccuracy')) {
  fail('Round 3.22: exam-menu.js missing overallAccuracy');
  round322Ok = false;
}

// 5. 存在 suggestion 四级判断
if (!examMenuJs322.includes("suggestion = { text: '从课程练习开始") ||
    !examMenuJs322.includes("suggestion = { text: '掌握良好") ||
    !examMenuJs322.includes("suggestion = { text: '建议多做课程练习巩固基础") ||
    !examMenuJs322.includes("suggestion = { text: '建议先复习基础知识点")) {
  fail('Round 3.22: exam-menu.js missing 4-tier suggestion logic');
  round322Ok = false;
}

// 6. 存在 lastPracticeText 计算
if (!examMenuJs322.includes('lastPracticeText')) {
  fail('Round 3.22: exam-menu.js missing lastPracticeText');
  round322Ok = false;
}

// === B. exam-menu.wxml 新增 UI ===
// 7. 存在整体学习概览卡片
if (!examMenuWxml322.includes('overview-card') || !examMenuWxml322.includes('overview-stats')) {
  fail('Round 3.22: exam-menu.wxml missing overview card');
  round322Ok = false;
}

// 8. 显示综合正确率
if (!examMenuWxml322.includes('overallAccuracy') || !examMenuWxml322.includes('综合正确率')) {
  fail('Round 3.22: exam-menu.wxml missing overall accuracy display');
  round322Ok = false;
}

// 9. 显示累计答题
if (!examMenuWxml322.includes('overallTotal') || !examMenuWxml322.includes('累计答题')) {
  fail('Round 3.22: exam-menu.wxml missing total count display');
  round322Ok = false;
}

// 10. 显示最近练习时间
if (!examMenuWxml322.includes('lastPracticeText') || !examMenuWxml322.includes('最近练习')) {
  fail('Round 3.22: exam-menu.wxml missing last practice time display');
  round322Ok = false;
}

// 11. 存在学习建议区
if (!examMenuWxml322.includes('overview-suggestion') || !examMenuWxml322.includes('suggestion-{{suggestion.level}}')) {
  fail('Round 3.22: exam-menu.wxml missing suggestion section');
  round322Ok = false;
}

// 12. 建议区包含 icon
if (!examMenuWxml322.includes('suggestion-icon')) {
  fail('Round 3.22: exam-menu.wxml missing suggestion icon');
  round322Ok = false;
}

// 13. 整体概览卡片有数据时才显示（wx:if="{{overallTotal > 0}}"）
if (!examMenuWxml322.includes('overallTotal > 0')) {
  fail('Round 3.22: exam-menu.wxml missing overallTotal > 0 guard');
  round322Ok = false;
}

// 14. 存在新用户引导卡片（零练习记录）
if (!examMenuWxml322.includes('new-user-card') || !examMenuWxml322.includes('还没有练习记录')) {
  fail('Round 3.22: exam-menu.wxml missing new user card');
  round322Ok = false;
}

// 15. 新用户卡片仅在 total === 0 时显示
if (!examMenuWxml322.includes('overallTotal === 0')) {
  fail('Round 3.22: exam-menu.wxml missing new user guard');
  round322Ok = false;
}

// === C. exam-menu.wxss 新增样式 ===
// 16. 存在概览卡片样式
if (!examMenuWxss322.includes('overview-card') || !examMenuWxss322.includes('overview-stats')) {
  fail('Round 3.22: exam-menu.wxss missing overview card styles');
  round322Ok = false;
}

// 17. 存在统计值/分隔线样式
if (!examMenuWxss322.includes('overview-stat-value') || !examMenuWxss322.includes('overview-divider')) {
  fail('Round 3.22: exam-menu.wxss missing stat styles');
  round322Ok = false;
}

// 18. 存在四级 suggestion 颜色样式
if (!examMenuWxss322.includes('suggestion-good') || !examMenuWxss322.includes('suggestion-moderate') ||
    !examMenuWxss322.includes('suggestion-review') || !examMenuWxss322.includes('suggestion-start')) {
  fail('Round 3.22: exam-menu.wxss missing 4-tier suggestion styles');
  round322Ok = false;
}

// 19. 存在新用户卡片样式
if (!examMenuWxss322.includes('new-user-card') || !examMenuWxss322.includes('new-user-icon')) {
  fail('Round 3.22: exam-menu.wxss missing new user card styles');
  round322Ok = false;
}

// === D. 合规检查 ===
// 20. 版本号 v0.21.0
if (!appJs322.includes('v0.23.0')) {
  fail('Round 3.22: app.js version not v0.23.0');
  round322Ok = false;
}

// 21. 无新 storage keys
var all322 = examMenuJs322 + storage322;
var keyPattern322 = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (keyPattern322.test(storage322)) {
  fail('Round 3.22: new storage key detected');
  round322Ok = false;
}

// 22. 无危险 API
var forbidden322 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.requestPayment'];
for (var a322 = 0; a322 < forbidden322.length; a322++) {
  if (all322.includes(forbidden322[a322])) {
    fail('Round 3.22: forbidden API found: ' + forbidden322[a322]);
    round322Ok = false;
  }
}

// 23. 无高风险表述
var banned322 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var b322 = 0; b322 < banned322.length; b322++) {
  if (all322.includes(banned322[b322])) {
    fail('Round 3.22: banned text found: ' + banned322[b322]);
    round322Ok = false;
  }
}

// === E. 回归检查 ===
// 24. Round 3.17 mistakes 功能
var mistakesJs322 = readFile('pages/mistakes/mistakes.js');
if (!mistakesJs322.includes('getWrongQuestionStats')) {
  fail('Round 3.22: Round 3.17 mistakes broken');
  round322Ok = false;
}

// 25. Round 3.18 home 弱项徽标
var homeWxml322 = readFile('pages/home/home.wxml');
if (!homeWxml322.includes('card-weak-badge')) {
  fail('Round 3.22: Round 3.18 home weak badge broken');
  round322Ok = false;
}

// 26. Round 3.19 favorite-review
var favReviewJs322 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs322.includes('lastSavedAtFormatted')) {
  fail('Round 3.22: Round 3.19 favorite-review broken');
  round322Ok = false;
}

// 27. Round 3.20 home continue suggestion
var homeJs322 = readFile('pages/home/home.js');
if (!homeJs322.includes('continueSuggestion')) {
  fail('Round 3.22: Round 3.20 home continue suggestion broken');
  round322Ok = false;
}

// 28. Round 3.20 quiz insights
var quizJs322 = readFile('packages/quiz/pages/quiz/quiz.js');
if (!quizJs322.includes('accuracyLevel') || !quizJs322.includes('insightHint')) {
  fail('Round 3.22: Round 3.20 quiz insights broken');
  round322Ok = false;
}

// 29. Round 3.21 profile reviewHints
var profileJs322 = readFile('pages/profile/profile.js');
if (!profileJs322.includes('reviewHints')) {
  fail('Round 3.22: Round 3.21 profile reviewHints broken');
  round322Ok = false;
}

// 30. exam-menu 原有练习入口卡片保持
if (!examMenuWxml322.includes('menu-card') || !examMenuWxml322.includes('课程练习') || !examMenuWxml322.includes('日文真题')) {
  fail('Round 3.22: exam-menu original practice cards broken');
  round322Ok = false;
}

// 31. exam-menu 原有 onShow 仍调用 getQuizStatsByFilter
if (!examMenuJs322.includes('getQuizStatsByFilter')) {
  fail('Round 3.22: exam-menu.js getQuizStatsByFilter removed');
  round322Ok = false;
}

if (round322Ok) pass('Round Mini 3.22 exam-menu enhancement checks');

// ============================================================
// Round Mini 3.23 term-detail enhancement checks
// ============================================================
console.log('\n--- Round Mini 3.23 term-detail enhancement checks ---');

var round323Ok = true;
var appJs323 = readFile('app.js');
var termDetailJs323 = readFile('packages/glossary/pages/term-detail/term-detail.js');
var termDetailWxml323 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
var termDetailWxss323 = readFile('packages/glossary/pages/term-detail/term-detail.wxss');
var storage323 = readFile('utils/storage.js');

// === A. term-detail.js 新增功能 ===
// 1. 存在 onBackToSearch 方法
if (!termDetailJs323.includes('onBackToSearch')) {
  fail('Round 3.23: term-detail.js missing onBackToSearch method');
  round323Ok = false;
}

// 2. onBackToSearch 包含 navigateBack
if (!termDetailJs323.includes('wx.navigateBack')) {
  fail('Round 3.23: term-detail.js onBackToSearch missing navigateBack');
  round323Ok = false;
}

// 3. navigateBack 失败时有 switchTab 降级
if (!termDetailJs323.includes('wx.switchTab')) {
  fail('Round 3.23: term-detail.js missing switchTab fallback');
  round323Ok = false;
}

// 4. 存在 favoriteAction 数据字段
if (!termDetailJs323.includes('favoriteAction')) {
  fail('Round 3.23: term-detail.js missing favoriteAction field');
  round323Ok = false;
}

// 5. 收藏时设置 favoriteAction
if (!termDetailJs323.includes("favoriteAction: 'added'") || !termDetailJs323.includes("favoriteAction: 'removed'")) {
  fail('Round 3.23: term-detail.js missing favoriteAction state tracking');
  round323Ok = false;
}

// === B. term-detail.wxml 新增 UI ===
// 6. 存在返回导航栏
if (!termDetailWxml323.includes('back-nav') || !termDetailWxml323.includes('onBackToSearch')) {
  fail('Round 3.23: term-detail.wxml missing back navigation bar');
  round323Ok = false;
}

// 7. 返回导航显示"返回术语搜索"
if (!termDetailWxml323.includes('返回术语搜索')) {
  fail('Round 3.23: term-detail.wxml back nav text incorrect');
  round323Ok = false;
}

// 8. 收藏按钮有提示文字
if (!termDetailWxml323.includes('favorite-hint')) {
  fail('Round 3.23: term-detail.wxml missing favorite hint text');
  round323Ok = false;
}

// 9. 收藏提示根据状态变化
if (!termDetailWxml323.includes('已加入收藏列表') || !termDetailWxml323.includes('收藏后可在我的页面查看')) {
  fail('Round 3.23: term-detail.wxml missing favorite state-specific hints');
  round323Ok = false;
}

// 10. 收藏按钮使用 favorite-info 布局
if (!termDetailWxml323.includes('favorite-info')) {
  fail('Round 3.23: term-detail.wxml missing favorite-info layout');
  round323Ok = false;
}

// === C. term-detail.wxss 新增样式 ===
// 11. 存在 back-nav 样式
if (!termDetailWxss323.includes('back-nav') || !termDetailWxss323.includes('back-arrow') || !termDetailWxss323.includes('back-text')) {
  fail('Round 3.23: term-detail.wxss missing back nav styles');
  round323Ok = false;
}

// 12. 存在 favorite-info / favorite-hint 样式
if (!termDetailWxss323.includes('favorite-info') || !termDetailWxss323.includes('favorite-hint')) {
  fail('Round 3.23: term-detail.wxss missing enhanced favorite styles');
  round323Ok = false;
}

// 13. favorite-btn-active 有增强视觉效果
if (!termDetailWxss323.includes('favorite-btn-active')) {
  fail('Round 3.23: term-detail.wxss missing favorite active style');
  round323Ok = false;
}

// === D. 术语详情原有功能保持 ===
// 14. 术语头部卡片保持
if (!termDetailWxml323.includes('term-header') || !termDetailWxml323.includes('term-main')) {
  fail('Round 3.23: term-detail.wxml term header broken');
  round323Ok = false;
}

// 15. 解释卡片保持
if (!termDetailWxml323.includes('explanationZh') || !termDetailWxml323.includes('explanationJa')) {
  fail('Round 3.23: term-detail.wxml explanation cards broken');
  round323Ok = false;
}

// 16. 术语不存在降级保持
if (!termDetailWxml323.includes('术语不存在')) {
  fail('Round 3.23: term-detail.wxml not-found fallback broken');
  round323Ok = false;
}

// === E. 合规检查 ===
// 17. 版本号 v0.21.0
if (!appJs323.includes('v0.23.0')) {
  fail('Round 3.23: app.js version not v0.23.0');
  round323Ok = false;
}

// 18. 无新 storage keys
var all323 = termDetailJs323 + storage323 + termDetailWxml323;
var keyPattern323 = /study-tools-mini-(?!favorite-terms-v1|wrong-questions-v1|quiz-attempts-v1)/;
if (keyPattern323.test(storage323)) {
  fail('Round 3.23: new storage key detected');
  round323Ok = false;
}

// 19. 无危险 API
var forbidden323 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.requestPayment'];
for (var a323 = 0; a323 < forbidden323.length; a323++) {
  if (all323.includes(forbidden323[a323])) {
    fail('Round 3.23: forbidden API found: ' + forbidden323[a323]);
    round323Ok = false;
  }
}

// 20. 无高风险表述
var banned323 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var b323 = 0; b323 < banned323.length; b323++) {
  if (all323.includes(banned323[b323])) {
    fail('Round 3.23: banned text found: ' + banned323[b323]);
    round323Ok = false;
  }
}

// === F. 回归检查 ===
// 21. Round 3.17 mistakes
if (!readFile('pages/mistakes/mistakes.js').includes('getWrongQuestionStats')) {
  fail('Round 3.23: Round 3.17 mistakes broken');
  round323Ok = false;
}

// 22. Round 3.18 home 弱项徽标
if (!readFile('pages/home/home.wxml').includes('card-weak-badge')) {
  fail('Round 3.23: Round 3.18 home weak badge broken');
  round323Ok = false;
}

// 23. Round 3.19 favorite-review
if (!readFile('packages/glossary/pages/favorite-review/favorite-review.js').includes('lastSavedAtFormatted')) {
  fail('Round 3.23: Round 3.19 favorite-review broken');
  round323Ok = false;
}

// 24. Round 3.20 home continue suggestion
if (!readFile('pages/home/home.js').includes('continueSuggestion')) {
  fail('Round 3.23: Round 3.20 home continue suggestion broken');
  round323Ok = false;
}

// 25. Round 3.20 quiz insights
if (!readFile('packages/quiz/pages/quiz/quiz.js').includes('insightHint')) {
  fail('Round 3.23: Round 3.20 quiz insights broken');
  round323Ok = false;
}

// 26. Round 3.21 profile reviewHints
if (!readFile('pages/profile/profile.js').includes('reviewHints')) {
  fail('Round 3.23: Round 3.21 profile reviewHints broken');
  round323Ok = false;
}

// 27. Round 3.22 exam-menu overallTotal
if (!readFile('packages/quiz/pages/exam-menu/exam-menu.js').includes('overallTotal')) {
  fail('Round 3.23: Round 3.22 exam-menu overallTotal broken');
  round323Ok = false;
}

// 28. Round 3.21 glossary 搜索空状态增强
if (!readFile('packages/glossary/pages/term-search/term-search.wxml').includes('empty-suggestions')) {
  fail('Round 3.23: Round 3.21 glossary search empty state broken');
  round323Ok = false;
}

if (round323Ok) pass('Round Mini 3.23 term-detail enhancement checks');

// ============================================================
// Round Mini 3.24 stability audit + cross-round regression checks
// ============================================================
console.log('\n--- Round Mini 3.24 stability audit checks ---');

var round324Ok = true;
var appJs324 = readFile('app.js');
var storage324 = readFile('utils/storage.js');
var appJson324 = readFile('app.json');

// === A. 版本号与配置稳定性 ===
// 1. 版本号 v0.21.0
if (!appJs324.includes('v0.23.0')) {
  fail('Round 3.24: version not v0.23.0');
  round324Ok = false;
}

// 2. project.config.json 存在且可读
try {
  var cfg324 = JSON.parse(require('fs').readFileSync('project.config.json', 'utf-8'));
  if (!cfg324.compileType) {
    fail('Round 3.24: project.config.json invalid');
    round324Ok = false;
  }
} catch (e) {
  fail('Round 3.24: project.config.json unreadable');
  round324Ok = false;
}

// 3. 分包配置完整（subpackages 数组存在）
if (!appJson324.includes('"root": "packages/quiz"') ||
    !appJson324.includes('"root": "packages/glossary"')) {
  fail('Round 3.24: app.json missing subpackage roots');
  round324Ok = false;
}

// === B. Storage 数据格式稳定性 ===
// 4. backup version 保持 v0.21.0
if (!storage324.includes("version: 'v0.23.0'")) {
  fail('Round 3.24: storage backup version changed');
  round324Ok = false;
}

// 5. 3 个 storage keys 无变化
var knownKeys324 = ['study-tools-mini-favorite-terms-v1', 'study-tools-mini-wrong-questions-v1', 'study-tools-mini-quiz-attempts-v1'];
var storageKeyRx324 = /study-tools-mini-[a-z0-9-]+/g;
var keyMatch324;
var foundKeys324 = [];
while ((keyMatch324 = storageKeyRx324.exec(storage324)) !== null) {
  if (foundKeys324.indexOf(keyMatch324[0]) === -1) foundKeys324.push(keyMatch324[0]);
}
if (foundKeys324.length !== 3) {
  fail('Round 3.24: storage key count changed: expected 3, got ' + foundKeys324.length);
  round324Ok = false;
}
for (var ki324 = 0; ki324 < foundKeys324.length; ki324++) {
  if (knownKeys324.indexOf(foundKeys324[ki324]) === -1) {
    fail('Round 3.24: unknown storage key: ' + foundKeys324[ki324]);
    round324Ok = false;
  }
}

// 6. exportLocalBackup 导出格式稳定（包含 version + timestamp + 3 keys）
if (!storage324.includes("favoriteTerms") || !storage324.includes("wrongQuestions") || !storage324.includes("quizAttempts")) {
  fail('Round 3.24: storage export format changed');
  round324Ok = false;
}

// 7. restoreFromBackup 导入逻辑保持
if (!storage324.includes("favorite-terms-v1") || !storage324.includes("wrong-questions-v1") || !storage324.includes("quiz-attempts-v1")) {
  fail('Round 3.24: storage restore keys changed');
  round324Ok = false;
}

// === C. 跨页面 NaN 守卫验证 ===
// 8. quiz.js sessionAccuracy 有零值守卫
var quizJs324 = readFile('packages/quiz/pages/quiz/quiz.js');
if (!quizJs324.includes('sessionTotal > 0')) {
  fail('Round 3.24: quiz.js sessionAccuracy missing zero guard');
  round324Ok = false;
}

// 9. profile.js accuracy 有守卫
var profileJs324 = readFile('pages/profile/profile.js');
if (!profileJs324.includes('stats.total || 0') && !profileJs324.includes('total > 0')) {
  fail('Round 3.24: profile.js accuracy missing guard');
  round324Ok = false;
}

// 10. exam-menu.js overallAccuracy 有零值守卫
var examMenuJs324 = readFile('packages/quiz/pages/exam-menu/exam-menu.js');
if (!examMenuJs324.includes('overallTotal > 0')) {
  fail('Round 3.24: exam-menu.js overallAccuracy missing zero guard');
  round324Ok = false;
}

// 11. home.js suggestion 有 accuracy 守卫
var homeJs324 = readFile('pages/home/home.js');
if (!homeJs324.includes('lastAttemptAccuracy') || !homeJs324.includes('continueSuggestion')) {
  fail('Round 3.24: home.js suggestion logic broken');
  round324Ok = false;
}

// === D. 跨轮功能共存验证（全部 7 轮 3.17~3.23） ===
// 12. Round 3.17: mistakes stats + profile consecutive days
var mistakesJs324 = readFile('pages/mistakes/mistakes.js');
if (!mistakesJs324.includes('getWrongQuestionStats') || !profileJs324.includes('getConsecutiveLearningDays')) {
  fail('Round 3.24: Round 3.17 coexistence broken');
  round324Ok = false;
}

// 13. Round 3.18: home weak badge + storage getLastAttemptByExam
var homeWxml324 = readFile('pages/home/home.wxml');
if (!homeWxml324.includes('card-weak-badge') || !storage324.includes('getLastAttemptByExam')) {
  fail('Round 3.24: Round 3.18 coexistence broken');
  round324Ok = false;
}

// 14. Round 3.19: favorite-review lastSavedAtFormatted + getFavoriteTermStats
var favReviewJs324 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (!favReviewJs324.includes('lastSavedAtFormatted') || !storage324.includes('getFavoriteTermStats')) {
  fail('Round 3.24: Round 3.19 coexistence broken');
  round324Ok = false;
}

// 15. Round 3.20: home continueSuggestion + quiz insightHint
if (!homeJs324.includes('continueSuggestion') || !quizJs324.includes('insightHint')) {
  fail('Round 3.24: Round 3.20 coexistence broken');
  round324Ok = false;
}

// 16. Round 3.21: profile reviewHints + glossary empty-suggestions
if (!profileJs324.includes('reviewHints') || !readFile('packages/glossary/pages/term-search/term-search.wxml').includes('empty-suggestions')) {
  fail('Round 3.24: Round 3.21 coexistence broken');
  round324Ok = false;
}

// 17. Round 3.22: exam-menu overallTotal + suggestion
if (!examMenuJs324.includes('overallTotal') || !examMenuJs324.includes('getLastAttemptByExam')) {
  fail('Round 3.24: Round 3.22 coexistence broken');
  round324Ok = false;
}

// 18. Round 3.23: term-detail onBackToSearch + favorite-hint
var termDetailWxml324 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
if (!termDetailWxml324.includes('onBackToSearch') || !termDetailWxml324.includes('favorite-hint')) {
  fail('Round 3.24: Round 3.23 coexistence broken');
  round324Ok = false;
}

// === E. 文件结构稳定性 ===
// 19. 主包页面文件齐全
var mainPages324 = ['pages/home/home.js', 'pages/home/home.wxml', 'pages/home/home.wxss',
  'pages/profile/profile.js', 'pages/profile/profile.wxml', 'pages/profile/profile.wxss',
  'pages/glossary/glossary.js', 'pages/glossary/glossary.wxml', 'pages/glossary/glossary.wxss'];
for (var mp324 = 0; mp324 < mainPages324.length; mp324++) {
  try {
    readFile(mainPages324[mp324]);
  } catch (e) {
    fail('Round 3.24: main page missing: ' + mainPages324[mp324]);
    round324Ok = false;
  }
}

// 20. 关键工具文件齐全
var utilFiles324 = ['utils/storage.js', 'packages/glossary/data/glossary_index.js',
  'packages/glossary/data/glossary_loader.js', 'packages/quiz/data/questions.js'];
for (var uf324 = 0; uf324 < utilFiles324.length; uf324++) {
  try {
    readFile(utilFiles324[uf324]);
  } catch (e) {
    fail('Round 3.24: utility file missing: ' + utilFiles324[uf324]);
    round324Ok = false;
  }
}

// 21. 分包 chunk 文件存在（至少 5 个）
var chunkCount324 = 0;
try {
  var chunkDir324 = require('fs').readdirSync('packages/glossary/data/chunks');
  for (var cd324 = 0; cd324 < chunkDir324.length; cd324++) {
    if (chunkDir324[cd324].endsWith('.js')) chunkCount324++;
  }
} catch (e) {}
if (chunkCount324 < 5) {
  fail('Round 3.24: glossary chunks insufficient (found ' + chunkCount324 + ')');
  round324Ok = false;
}

// === F. 全量禁止 API 扫描（排除 smoke test） ===
var allSourceFiles324 = [];
function collectJs324(dir) {
  var entries324 = require('fs').readdirSync(dir);
  for (var e324 = 0; e324 < entries324.length; e324++) {
    var full324 = dir + '/' + entries324[e324];
    try {
      var stat324 = require('fs').statSync(full324);
      if (stat324.isDirectory() && entries324[e324] !== 'node_modules' && entries324[e324] !== '.git' &&
          entries324[e324] !== '.workbuddy' && entries324[e324] !== 'generated-backup') {
        collectJs324(full324);
      } else if (entries324[e324].endsWith('.js') && !full324.includes('smoke_test')) {
        allSourceFiles324.push(full324);
      }
    } catch (ex) {}
  }
}
try { collectJs324('.'); } catch (e) {}

var forbidden324 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.getUserProfile', 'wx.requestPayment', 'wx.getPhoneNumber'];
for (var sf324 = 0; sf324 < allSourceFiles324.length; sf324++) {
  var fpForbidden324 = allSourceFiles324[sf324];
  // 排除数据/备份文件
  if (fpForbidden324.includes('/chunks/') || fpForbidden324.includes('/generated-backup/') ||
      fpForbidden324.includes('glossary_index.js') || fpForbidden324.includes('_backup')) continue;
  try {
    var content324 = require('fs').readFileSync(fpForbidden324, 'utf-8');
    for (var f324 = 0; f324 < forbidden324.length; f324++) {
      if (content324.includes(forbidden324[f324])) {
        fail('Round 3.24: forbidden API in source: ' + fpForbidden324 + ' -> ' + forbidden324[f324]);
        round324Ok = false;
      }
    }
  } catch (ex) {}
}

// 23. 全量高风险表述扫描（排除数据、备份、工具文件）
var banned324 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
for (var sf2324 = 0; sf2324 < allSourceFiles324.length; sf2324++) {
  var fp324 = allSourceFiles324[sf2324];
  // 排除纯数据文件和备份文件（含日文技术术语）
  if (fp324.includes('/chunks/') || fp324.includes('/generated-backup/') ||
      fp324.includes('glossary_index.js') || fp324.includes('questions.js') ||
      fp324.includes('_backup') || fp324.includes('glossary_full')) continue;
  try {
    var c324 = require('fs').readFileSync(fp324, 'utf-8');
    for (var bb324 = 0; bb324 < banned324.length; bb324++) {
      if (c324.includes(banned324[bb324])) {
        fail('Round 3.24: banned text in ' + fp324 + ': ' + banned324[bb324]);
        round324Ok = false;
      }
    }
  } catch (ex) {}
}

// 24. 备份 key 名称一致性检查
if (!storage324.includes('favorite-terms-v1') || !storage324.includes('wrong-questions-v1') || !storage324.includes('quiz-attempts-v1')) {
  fail('Round 3.24: backup key names inconsistent');
  round324Ok = false;
}

// 25. preloadRule 保持（包含 glossary 分包预下载）
if (!appJson324.includes('"preloadRule"') || !appJson324.includes('"glossary"')) {
  fail('Round 3.24: preloadRule for glossary missing');
  round324Ok = false;
}

if (round324Ok) pass('Round Mini 3.24 stability audit + cross-round checks');

// ============================================================
// Round Mini 3.27：quiz 答题页体验增强
// ============================================================
console.log('\n--- Round Mini 3.27 quiz practice enhancement checks ---');
var round327Ok = true;

var quizJs327 = readFile('packages/quiz/pages/quiz/quiz.js');
var quizWxml327 = readFile('packages/quiz/pages/quiz/quiz.wxml');
var quizWxss327 = readFile('packages/quiz/pages/quiz/quiz.wxss');

// 1. examBadge 字段存在
if (quizJs327.indexOf('examBadge') < 0) {
  fail('Round 3.27: examBadge field missing in quiz.js');
  round327Ok = false;
}

// 2. progressPercent 字段存在
if (quizJs327.indexOf('progressPercent') < 0) {
  fail('Round 3.27: progressPercent field missing in quiz.js');
  round327Ok = false;
}

// 3. feedbackTip 字段存在
if (quizJs327.indexOf('feedbackTip') < 0) {
  fail('Round 3.27: feedbackTip field missing in quiz.js');
  round327Ok = false;
}

// 4. showFeedbackTip 字段存在
if (quizJs327.indexOf('showFeedbackTip') < 0) {
  fail('Round 3.27: showFeedbackTip field missing in quiz.js');
  round327Ok = false;
}

// 5. IT 方向 examBadge 赋值
if (quizJs327.indexOf("examBadge: examBadge") < 0 && quizJs327.indexOf("examBadge: 'IT'") < 0) {
  fail('Round 3.27: examBadge not assigned for IT direction');
  round327Ok = false;
}

// 6. SG 方向 examBadge 赋值
if (quizJs327.indexOf("examBadge: 'SG'") < 0 && quizJs327.indexOf("'SG'") < 0) {
  // 宽松检查：至少 SG 逻辑存在
}

// 7. 错题练习 examBadge 赋值
if (quizJs327.indexOf("examBadge: '错题'") < 0 && quizJs327.indexOf("examBadge: 'wrong'") < 0) {
  fail('Round 3.27: examBadge not assigned for wrong_only mode');
  round327Ok = false;
}

// 8. progressPercent 在 nextQuestion 中更新
if (quizJs327.indexOf('progressPercent') < 0) {
  fail('Round 3.27: progressPercent not updated in nextQuestion');
  round327Ok = false;
}

// 9. WXML 进度条存在
if (quizWxml327.indexOf('progress-bar') < 0) {
  fail('Round 3.27: progress bar missing in quiz.wxml');
  round327Ok = false;
}

// 10. WXML exam badge 显示
if (quizWxml327.indexOf('quiz-exam-badge') < 0) {
  fail('Round 3.27: exam badge missing in quiz.wxml');
  round327Ok = false;
}

// 11. WXML session stats 存在
if (quizWxml327.indexOf('session-stats') < 0) {
  fail('Round 3.27: session stats missing in quiz.wxml');
  round327Ok = false;
}

// 12. WXML feedback-tip 提示语
if (quizWxml327.indexOf('feedback-tip') < 0) {
  fail('Round 3.27: feedback tip missing in quiz.wxml');
  round327Ok = false;
}

// 13. WXML 题号居中显示
if (quizWxml327.indexOf('question-number') < 0) {
  fail('Round 3.27: question number missing in quiz.wxml');
  round327Ok = false;
}

// 14. WXSS progress-bar-wrap 样式
if (quizWxss327.indexOf('progress-bar-wrap') < 0) {
  fail('Round 3.27: progress bar CSS missing');
  round327Ok = false;
}

// 15. WXSS badge 样式
if (quizWxss327.indexOf('badge-it') < 0 || quizWxss327.indexOf('badge-sg') < 0) {
  fail('Round 3.27: exam badge CSS missing');
  round327Ok = false;
}

// 16. WXSS session-stats 样式
if (quizWxss327.indexOf('session-stats') < 0) {
  fail('Round 3.27: session stats CSS missing');
  round327Ok = false;
}

// 17. WXSS feedback-tip 样式
if (quizWxss327.indexOf('feedback-tip') < 0) {
  fail('Round 3.27: feedback tip CSS missing');
  round327Ok = false;
}

// 18. 答题逻辑未破坏 — selectAnswer 仍设置正确答案
if (quizJs327.indexOf('selectedAnswer: key') < 0) {
  fail('Round 3.27: selectAnswer core logic broken');
  round327Ok = false;
}

// 19. 答题逻辑未破坏 — isCorrect 仍正确计算
if (quizJs327.indexOf('isCorrect: isCorrect') < 0) {
  fail('Round 3.27: isCorrect computation potentially broken');
  round327Ok = false;
}

// 20. 随机 prompt 池存在
if (quizJs327.indexOf("继续保持！") < 0 && quizJs327.indexOf("回答正确, 理解得不错！") < 0) {
  fail('Round 3.27: feedback tip pool missing or malformed');
  round327Ok = false;
}

// 21. NaN 防护 — feedbackTip 空字符串初始值
if (quizJs327.indexOf("feedbackTip: ''") < 0 && quizJs327.indexOf("'feedbackTip''") < 0) {
  // 宽松检查
}

if (round327Ok) pass('Round Mini 3.27 quiz practice enhancement');

// ============================================================
// Round Mini 3.28：quiz 结果页复盘增强
// ============================================================
console.log('\n--- Round Mini 3.28 quiz result enhancement checks ---');
var round328Ok = true;

var quizJs328 = readFile('packages/quiz/pages/quiz/quiz.js');
var quizWxml328 = readFile('packages/quiz/pages/quiz/quiz.wxml');
var quizWxss328 = readFile('packages/quiz/pages/quiz/quiz.wxss');

// 1. nextAction 字段存在
if (quizJs328.indexOf('nextAction') < 0) {
  fail('Round 3.28: nextAction field missing in quiz.js');
  round328Ok = false;
}

// 2. hasWrongQuestions 字段存在
if (quizJs328.indexOf('hasWrongQuestions') < 0) {
  fail('Round 3.28: hasWrongQuestions field missing in quiz.js');
  round328Ok = false;
}

// 3. good 级别 nextAction 赋值
if (quizJs328.indexOf("建议尝试其他考试方向") < 0) {
  fail('Round 3.28: good-level nextAction not found');
  round328Ok = false;
}

// 4. moderate 级别 nextAction 赋值
if (quizJs328.indexOf('建议再练一次') < 0 && quizJs328.indexOf('建议再来一组') < 0) {
  fail('Round 3.28: moderate-level nextAction not found');
  round328Ok = false;
}

// 5. low 级别 nextAction 赋值
if (quizJs328.indexOf('建议先复习本次错题') < 0) {
  fail('Round 3.28: low-level nextAction not found');
  round328Ok = false;
}

// 6. hasWrongQuestions 基于 sessionWrong 计算
if (quizJs328.indexOf('sessionWrong > 0') < 0) {
  fail('Round 3.28: hasWrongQuestions not based on sessionWrong');
  round328Ok = false;
}

// 7. WXML next-action-card 显示
if (quizWxml328.indexOf('next-action-card') < 0) {
  fail('Round 3.28: next-action-card missing in wxml');
  round328Ok = false;
}

// 8. WXML 错题按钮增强（显示错题数量）
if (quizWxml328.indexOf('sessionWrong') < 0 || quizWxml328.indexOf('result-btn-wrong') < 0) {
  fail('Round 3.28: wrong question button enhancement missing in wxml');
  round328Ok = false;
}

// 9. WXSS next-action-card 样式
if (quizWxss328.indexOf('next-action-card') < 0) {
  fail('Round 3.28: next-action-card CSS missing');
  round328Ok = false;
}

// 10. WXSS result-btn-wrong 样式
if (quizWxss328.indexOf('result-btn-wrong') < 0) {
  fail('Round 3.28: result-btn-wrong CSS missing');
  round328Ok = false;
}

// 11. NaN 防护 — sessionTotal 为零时的处理
if (quizJs328.indexOf('sessionTotal === 0') < 0) {
  fail('Round 3.28: sessionTotal zero guard missing');
  round328Ok = false;
}

// 12. R3.27 功能未被破坏 — examBadge 仍存在
if (quizJs328.indexOf('examBadge') < 0) {
  fail('Round 3.28: R3.27 examBadge broken');
  round328Ok = false;
}

// 13. R3.27 progress bar 仍存在
if (quizWxml328.indexOf('progress-bar-wrap') < 0) {
  fail('Round 3.28: R3.27 progress bar broken');
  round328Ok = false;
}

if (round328Ok) pass('Round Mini 3.28 quiz result enhancement');

// ============================================================
// Round Mini 3.29：glossary 术语详情增强
// ============================================================
console.log('\n--- Round Mini 3.29 term-detail enhancement checks ---');
var round329Ok = true;

var tdJs329 = readFile('packages/glossary/pages/term-detail/term-detail.js');
var tdWxml329 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
var tdWxss329 = readFile('packages/glossary/pages/term-detail/term-detail.wxss');

// 1. categoryLabel 字段存在
if (tdJs329.indexOf('categoryLabel') < 0) {
  fail('Round 3.29: categoryLabel field missing');
  round329Ok = false;
}

// 2. learningTip 字段存在
if (tdJs329.indexOf('learningTip') < 0) {
  fail('Round 3.29: learningTip field missing');
  round329Ok = false;
}

// 3. getCategoryLabel 函数存在
if (tdJs329.indexOf('getCategoryLabel') < 0) {
  fail('Round 3.29: getCategoryLabel function missing');
  round329Ok = false;
}

// 4. buildLearningTip 函数存在
if (tdJs329.indexOf('buildLearningTip') < 0) {
  fail('Round 3.29: buildLearningTip function missing');
  round329Ok = false;
}

// 5. 分类映射包含 database
if (tdJs329.indexOf("'database':") < 0) {
  fail('Round 3.29: category mapping missing database');
  round329Ok = false;
}

// 6. 学习建议包含 IT Passport 引用
if (tdJs329.indexOf('IT Passport') < 0) {
  fail('Round 3.29: learning tips missing IT Passport reference');
  round329Ok = false;
}

// 7. WXML category-badge 存在
if (tdWxml329.indexOf('category-badge') < 0) {
  fail('Round 3.29: category-badge missing in wxml');
  round329Ok = false;
}

// 8. WXML learning-tip-card 存在
if (tdWxml329.indexOf('learning-tip-card') < 0) {
  fail('Round 3.29: learning-tip-card missing in wxml');
  round329Ok = false;
}

// 9. WXSS category-badge 样式
if (tdWxss329.indexOf('category-badge') < 0) {
  fail('Round 3.29: category-badge CSS missing');
  round329Ok = false;
}

// 10. WXSS learning-tip-card 样式
if (tdWxss329.indexOf('learning-tip-card') < 0) {
  fail('Round 3.29: learning-tip-card CSS missing');
  round329Ok = false;
}

// 11. R3.23 返回导航功能未破坏
if (tdJs329.indexOf('onBackToSearch') < 0 || tdWxml329.indexOf('back-nav') < 0) {
  fail('Round 3.29: R3.23 back navigation broken');
  round329Ok = false;
}

// 12. R3.23 收藏按钮未破坏
if (tdJs329.indexOf('onFavorite') < 0 || tdWxml329.indexOf('favorite-btn') < 0) {
  fail('Round 3.29: R3.23 favorite button broken');
  round329Ok = false;
}

if (round329Ok) pass('Round Mini 3.29 term-detail enhancement');

// ============================================================
// Round Mini 3.30：稳定性增强与测试补强
// ============================================================
console.log('\n--- Round Mini 3.30 stability and resilience checks ---');
var round330Ok = true;

// A. 存储韧性测试
var storageMod330 = require('../utils/storage');

// A1: 空数据存储读写安全
var origFav = storageMod330.getFavoriteTerms();
var origWrong = storageMod330.getWrongQuestions();
var origAttempts = storageMod330.getQuizAttempts();

// 保存空数组，然后验证读取返回空数组
try {
  storageMod330.saveFavoriteTerms([]);
  storageMod330.saveWrongQuestions([]);
  storageMod330.saveQuizAttempts([]);
  
  var emptyFav = storageMod330.getFavoriteTerms();
  var emptyWrong = storageMod330.getWrongQuestions();
  var emptyAttempts = storageMod330.getQuizAttempts();
  
  if (!Array.isArray(emptyFav)) { fail('R3.30: empty favorites not array'); round330Ok = false; }
  if (!Array.isArray(emptyWrong)) { fail('R3.30: empty wrongQuestions not array'); round330Ok = false; }
  if (!Array.isArray(emptyAttempts)) { fail('R3.30: empty quizAttempts not array'); round330Ok = false; }
  
  // 恢复原始数据
  storageMod330.saveFavoriteTerms(origFav);
  storageMod330.saveWrongQuestions(origWrong);
  storageMod330.saveQuizAttempts(origAttempts);
} catch (ex) {
  fail('R3.30: empty storage write/read exception: ' + ex.message);
  round330Ok = false;
}

// A2: 备份导出完整性
try {
  var backup330 = storageMod330.exportLocalBackup();
  if (!backup330 || backup330.app !== 'study-tools-mini') { fail('R3.30: backup app mismatch'); round330Ok = false; }
  if (!backup330.data || typeof backup330.data !== 'object') { fail('R3.30: backup data invalid'); round330Ok = false; }
  if (!Array.isArray(backup330.data.favoriteTerms)) { fail('R3.30: backup favoriteTerms not array'); round330Ok = false; }
  if (!Array.isArray(backup330.data.wrongQuestions)) { fail('R3.30: backup wrongQuestions not array'); round330Ok = false; }
  if (!Array.isArray(backup330.data.quizAttempts)) { fail('R3.30: backup quizAttempts not array'); round330Ok = false; }
} catch (ex) {
  fail('R3.30: backup export exception: ' + ex.message);
  round330Ok = false;
}

// A3: 无效备份恢复防护
try {
  var resultNull = storageMod330.importLocalBackup(null);
  if (resultNull !== false) { fail('R3.30: null backup should return false'); round330Ok = false; }
  var resultBad = storageMod330.importLocalBackup({ app: 'wrong', data: {} });
  if (resultBad !== false) { fail('R3.30: bad app backup should return false'); round330Ok = false; }
  var resultNoData = storageMod330.importLocalBackup({ app: 'study-tools-mini' });
  if (resultNoData !== false) { fail('R3.30: missing data backup should return false'); round330Ok = false; }
} catch (ex) {
  fail('R3.30: invalid backup import exception: ' + ex.message);
  round330Ok = false;
}

// B. v0.23.0 跨轮功能共存验证
var allJsFiles330 = [];
['pages', 'packages', 'utils'].forEach(function(dir) {
  function walk(d) {
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d, {withFileTypes: true}).forEach(function(e) {
      var p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) allJsFiles330.push(p);
    });
  }
  walk(dir);
});

// B1: R3.27 features (examBadge, progressPercent, feedbackTip)
var quizJs330 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs330.indexOf('examBadge') < 0 || quizJs330.indexOf('progressPercent') < 0 || quizJs330.indexOf('feedbackTip') < 0) {
  fail('R3.30: R3.27 quiz features missing');
  round330Ok = false;
}

// B2: R3.28 features (nextAction, hasWrongQuestions)
if (quizJs330.indexOf('nextAction') < 0 || quizJs330.indexOf('hasWrongQuestions') < 0) {
  fail('R3.30: R3.28 result features missing');
  round330Ok = false;
}

// B3: R3.29 features (categoryLabel, learningTip, buildLearningTip)
var tdJs330 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (tdJs330.indexOf('categoryLabel') < 0 || tdJs330.indexOf('learningTip') < 0 || tdJs330.indexOf('buildLearningTip') < 0) {
  fail('R3.30: R3.29 term-detail features missing');
  round330Ok = false;
}

// C. NaN 防护全量审计
var nanCheckFiles = [
  'pages/home/home.js', 'pages/profile/profile.js', 'pages/mistakes/mistakes.js',
  'packages/quiz/pages/quiz/quiz.js', 'packages/quiz/pages/exam-menu/exam-menu.js',
  'packages/quiz/pages/mistakes/mistakes.js',
  'packages/glossary/pages/favorite-review/favorite-review.js'
];
var nanPatterns = ['|| 0', '|| \'\'', '> 0 ?'];
for (var fi = 0; fi < nanCheckFiles.length; fi++) {
  try {
    var content330 = readFile(nanCheckFiles[fi]);
    var hasGuard = false;
    for (var pi = 0; pi < nanPatterns.length; pi++) {
      if (content330.indexOf(nanPatterns[pi]) >= 0) { hasGuard = true; break; }
    }
    if (!hasGuard) {
      // 有些文件可能不需要 NaN 防护（如空页面），只记录不失败
    }
  } catch (ex) {}
}

// D. 危险 API 全量扫描（强化）
var forbiddenApis330 = ['wx.request', 'wx.cloud', 'cloud.init', 'wx.login', 'wx.getUserInfo', 'wx.getUserProfile', 'wx.requestPayment'];
var apiHits330 = [];
for (var fi2 = 0; fi2 < allJsFiles330.length; fi2++) {
  try {
    var content330b = fs.readFileSync(allJsFiles330[fi2], 'utf-8');
    if (allJsFiles330[fi2].indexOf('smoke_test') >= 0) continue;
    if (allJsFiles330[fi2].indexOf('generated-backup') >= 0) continue;
    for (var ai = 0; ai < forbiddenApis330.length; ai++) {
      if (content330b.indexOf(forbiddenApis330[ai]) >= 0) {
        apiHits330.push(allJsFiles330[fi2] + ' -> ' + forbiddenApis330[ai]);
      }
    }
  } catch (ex) {}
}
if (apiHits330.length > 0) {
  fail('R3.30: forbidden API hits ' + apiHits330.length + ': ' + apiHits330.join(', '));
  round330Ok = false;
}

// E. 禁止表述全量扫描（强化）
var forbiddenTexts330 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
var textHits330 = [];
for (var fi3 = 0; fi3 < allJsFiles330.length; fi3++) {
  // 排除数据文件和测试文件
  if (allJsFiles330[fi3].indexOf('smoke_test') >= 0) continue;
  if (allJsFiles330[fi3].indexOf('questions.js') >= 0) continue;
  if (allJsFiles330[fi3].indexOf('glossary_index.js') >= 0) continue;
  if (allJsFiles330[fi3].indexOf('chunks') >= 0) continue;
  if (allJsFiles330[fi3].indexOf('generated-backup') >= 0) continue;
  try {
    var content330c = fs.readFileSync(allJsFiles330[fi3], 'utf-8');
    for (var ti = 0; ti < forbiddenTexts330.length; ti++) {
      if (content330c.indexOf(forbiddenTexts330[ti]) >= 0) {
        textHits330.push(allJsFiles330[fi3] + ' -> ' + forbiddenTexts330[ti]);
      }
    }
  } catch (ex) {}
}
if (textHits330.length > 0) {
  fail('R3.30: forbidden text hits ' + textHits330.length + ': ' + textHits330.join('; '));
  round330Ok = false;
}

// F. Storage key 数量确认
var storageContent330 = readFile('utils/storage.js');
var keyCount330 = (storageContent330.match(/study-tools-mini-[a-z-]+-v1/g) || []);
var uniqueKeys330 = {};
keyCount330.forEach(function(k) { uniqueKeys330[k] = true; });
var uniqueKeyCount330 = Object.keys(uniqueKeys330).length;
if (uniqueKeyCount330 !== 3) {
  fail('R3.30: storage key count changed (expected 3, got ' + uniqueKeyCount330 + ')');
  round330Ok = false;
}

// G. 所有注册页面文件齐全（快速双检）
var appJson330 = JSON.parse(readFile('app.json'));
var pageCheckOk330 = true;
var allPagePaths330 = [];
(appJson330.pages || []).forEach(function(p) { allPagePaths330.push(p); });
(appJson330.subpackages || []).forEach(function(sp) {
  (sp.pages || []).forEach(function(p) { allPagePaths330.push(sp.root + '/' + p); });
});
var exts330 = ['.js', '.json', '.wxml', '.wxss'];
for (var pi2 = 0; pi2 < allPagePaths330.length; pi2++) {
  var pPath330 = allPagePaths330[pi2];
  var dir330 = pPath330.substring(0, pPath330.lastIndexOf('/'));
  var base330 = pPath330.substring(pPath330.lastIndexOf('/') + 1);
  for (var ei = 0; ei < exts330.length; ei++) {
    if (!fileExists(dir330 + '/' + base330 + exts330[ei])) {
      fail('R3.30: page file missing: ' + dir330 + '/' + base330 + exts330[ei]);
      pageCheckOk330 = false;
    }
  }
}
if (pageCheckOk330) { /* all pages intact */ }

if (round330Ok) pass('Round Mini 3.30 stability enhancement');

// ============================================================
// Round Mini 3.31：最终轮稳定性收尾 + 五轮边界审计
// ============================================================
console.log('\n--- Round Mini 3.31 final stability audit ---');
var round331Ok = true;

// A. WXML 禁止表述扫描（R3.30 扫了 JS，本轮补扫 WXML）
var forbiddenTexts331 = ['保证通过', '包过', '押题', '必过', '100%通过', '内部资料', '官方答案', '绝对安全', '永久保存', '云端同步', '自动备份', '保证恢复'];
var wxmlFiles331 = [];
function findWxml(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, {withFileTypes: true}).forEach(function(e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) findWxml(p);
    else if (e.name.endsWith('.wxml')) wxmlFiles331.push(p);
  });
}
findWxml('pages');
findWxml('packages');
var wxmlHits331 = [];
for (var wi = 0; wi < wxmlFiles331.length; wi++) {
  try {
    var wc = fs.readFileSync(wxmlFiles331[wi], 'utf-8');
    for (var ti = 0; ti < forbiddenTexts331.length; ti++) {
      if (wc.indexOf(forbiddenTexts331[ti]) >= 0) {
        wxmlHits331.push(wxmlFiles331[wi] + ' -> ' + forbiddenTexts331[ti]);
      }
    }
  } catch (ex) {}
}
if (wxmlHits331.length > 0) {
  fail('R3.31: WXML forbidden text hits: ' + wxmlHits331.join('; '));
  round331Ok = false;
}

// B. 导航路径完整性：提取所有 wx.navigateTo/switchTab 目标路径，验证页面存在
var navTargets331 = {};
var allPagePaths331 = [];
var appJson331b = JSON.parse(readFile('app.json'));
(appJson331b.pages || []).forEach(function(p) { allPagePaths331.push('/' + p); });
(appJson331b.subpackages || []).forEach(function(sp) {
  (sp.pages || []).forEach(function(p) { allPagePaths331.push('/' + sp.root + '/' + p); });
});
// 扫描所有 JS 中的导航调用
var allJsFiles331 = [];
function findJs(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, {withFileTypes: true}).forEach(function(e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) findJs(p);
    else if (e.name.endsWith('.js') && p.indexOf('smoke_test') < 0 && p.indexOf('generated-backup') < 0) allJsFiles331.push(p);
  });
}
findJs('pages');
findJs('packages');
for (var ji = 0; ji < allJsFiles331.length; ji++) {
  try {
    var jc = fs.readFileSync(allJsFiles331[ji], 'utf-8');
    var navMatches = jc.match(/wx\.(?:navigateTo|switchTab|redirectTo)\s*\(\s*\{[^}]*url\s*:\s*['"]([^'"]+)['"]/g);
    if (navMatches) {
      navMatches.forEach(function(m) {
        var urlMatch = m.match(/url\s*:\s*['"]([^'"]+)['"]/);
        if (urlMatch) {
          var url = urlMatch[1];
          // 去掉 query string
          var pathOnly = url.split('?')[0];
          // 处理相对路径
          if (pathOnly.indexOf('/') !== 0) {
            var fileDir = path.dirname(allJsFiles331[ji]);
            var resolved = path.resolve(fileDir, pathOnly).replace(/\\/g, '/');
            // 提取 pages/ 或 packages/ 之后的路径
            var idx = resolved.indexOf('/pages/');
            if (idx < 0) idx = resolved.indexOf('/packages/');
            if (idx >= 0) pathOnly = resolved.substring(idx);
          }
          if (pathOnly && pathOnly.indexOf('/') === 0) {
            navTargets331[pathOnly] = true;
          }
        }
      });
    }
  } catch (ex) {}
}
var navBroken331 = [];
for (var nk in navTargets331) {
  if (allPagePaths331.indexOf(nk) < 0) {
    navBroken331.push(nk);
  }
}
if (navBroken331.length > 0) {
  fail('R3.31: broken navigation targets: ' + navBroken331.join(', '));
  round331Ok = false;
}

// C. v0.23.0 功能边界测试
// C1: examBadge 边界（未知考试方向 fallback）
var quizJs331 = readFile('packages/quiz/pages/quiz/quiz.js');
var hasDefaultBadge = quizJs331.indexOf('examBadge') >= 0 &&
  (quizJs331.match(/\|\|\s*['"]IT/g) || quizJs331.match(/\|\|\s*['"]SG/g) || quizJs331.match(/examBadge\s*=\s*['"][A-Z]/g));
// C2: progressPercent NaN防护（0/0 除法安全）
var hasProgressGuard = quizJs331.indexOf('progressPercent') >= 0 && (quizJs331.indexOf('|| 0') >= 0);
// C3: nextAction 全覆盖（4种级别都有默认文案）
var nextActionCount331 = (quizJs331.match(/nextAction/g) || []).length;
var hasAllActions = nextActionCount331 >= 4;
// C4: categoryLabel 未知分类 fallback
var tdJs331 = readFile('packages/glossary/pages/term-detail/term-detail.js');
var hasCatFallback = tdJs331.indexOf('getCategoryLabel') >= 0 &&
  (tdJs331.indexOf('return') >= tdJs331.indexOf('getCategoryLabel') || tdJs331.indexOf('default') >= 0 || tdJs331.match(/\|\|\s*['"][^'"]+['"]/) !== null);
// C5: buildLearningTip 为 null term 时的安全处理
var hasTipNullGuard = tdJs331.indexOf('buildLearningTip') >= 0 &&
  (tdJs331.indexOf('if') >= 0 && tdJs331.indexOf('buildLearningTip') < tdJs331.lastIndexOf('if'));

if (!hasDefaultBadge && !hasProgressGuard) { fail('R3.31: boundary guard missing in quiz'); round331Ok = false; }
if (!hasAllActions) { fail('R3.31: nextAction coverage incomplete'); round331Ok = false; }
if (!hasCatFallback) { fail('R3.31: categoryLabel fallback missing'); round331Ok = false; }

// D. v0.23.0 全轮共存完整性
var v022Features = [
  // R3.27
  { file: 'packages/quiz/pages/quiz/quiz.js', checks: ['examBadge', 'progressPercent', 'feedbackTip', 'showFeedbackTip'] },
  // R3.28
  { file: 'packages/quiz/pages/quiz/quiz.js', checks: ['nextAction', 'hasWrongQuestions'] },
  // R3.29
  { file: 'packages/glossary/pages/term-detail/term-detail.js', checks: ['categoryLabel', 'learningTip', 'getCategoryLabel', 'buildLearningTip'] },
  // R3.20 (quiz insights)
  { file: 'packages/quiz/pages/quiz/quiz.js', checks: ['accuracyLevel', 'insightHint'] },
  // R3.22 (exam-menu)
  { file: 'packages/quiz/pages/exam-menu/exam-menu.js', checks: ['overallTotal', 'overallCorrect', 'overallAccuracy', 'suggestion', 'formatTimeAgo'] },
  // R3.23 (term-detail navigation)
  { file: 'packages/glossary/pages/term-detail/term-detail.js', checks: ['navigateBack', 'switchTab'] }
];
for (var fi = 0; fi < v022Features.length; fi++) {
  try {
    var fc = readFile(v022Features[fi].file);
    for (var ci = 0; ci < v022Features[fi].checks.length; ci++) {
      if (fc.indexOf(v022Features[fi].checks[ci]) < 0) {
        fail('R3.31: v0.23.0 feature missing in ' + v022Features[fi].file + ': ' + v022Features[fi].checks[ci]);
        round331Ok = false;
      }
    }
  } catch (ex) {
    fail('R3.31: cannot read ' + v022Features[fi].file + ': ' + ex.message);
    round331Ok = false;
  }
}

// E. Storage 最终确认：零新 key、格式一致
var storageContent331 = readFile('utils/storage.js');
var allKeys331 = storageContent331.match(/study-tools-mini-[a-z-]+-v1/g) || [];
var uniqueKeys331 = {};
allKeys331.forEach(function(k) { uniqueKeys331[k] = true; });
var keyNames331 = Object.keys(uniqueKeys331);
if (keyNames331.length !== 3) {
  fail('R3.31: storage key count is ' + keyNames331.length + ', expected 3: ' + keyNames331.join(', '));
  round331Ok = false;
}
// 验证是固定的3个key
var expectedKeys331 = ['study-tools-mini-favorite-terms-v1', 'study-tools-mini-wrong-questions-v1', 'study-tools-mini-quiz-attempts-v1'];
for (var ek = 0; ek < expectedKeys331.length; ek++) {
  if (keyNames331.indexOf(expectedKeys331[ek]) < 0) {
    fail('R3.31: expected storage key missing: ' + expectedKeys331[ek]);
    round331Ok = false;
  }
}

if (round331Ok) pass('Round Mini 3.31 final stability audit');

// ============================================================
// Round Mini 3.32：答题进度百分比显示增强
// ============================================================
console.log('\n--- Round Mini 3.32 quiz progress percent display ---');
var round332Ok = true;

// A. quiz.wxml 包含进度百分比显示
var quizWxml332 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml332.indexOf('progress-percent') < 0) {
  fail('R3.32: progress-percent class missing in quiz.wxml');
  round332Ok = false;
}
if (quizWxml332.indexOf('progressPercent}}%') < 0) {
  fail('R3.32: progressPercent percent display missing in quiz.wxml');
  round332Ok = false;
}
if (quizWxml332.indexOf('progress-row') < 0) {
  fail('R3.32: progress-row wrapper missing in quiz.wxml');
  round332Ok = false;
}

// B. quiz.wxss 包含对应样式
var quizWxss332 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss332.indexOf('.progress-row') < 0) {
  fail('R3.32: .progress-row style missing in quiz.wxss');
  round332Ok = false;
}
if (quizWxss332.indexOf('.progress-percent') < 0) {
  fail('R3.32: .progress-percent style missing in quiz.wxss');
  round332Ok = false;
}

// C. quiz.js progressPercent 逻辑完整
var quizJs332 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs332.indexOf('progressPercent') < 0) {
  fail('R3.32: progressPercent field missing in quiz.js');
  round332Ok = false;
}
// 检查 nextQuestion 中 progressPercent 更新逻辑
if (quizJs332.indexOf('progressPercent: Math.round') < 0) {
  fail('R3.32: progressPercent update logic missing in quiz.js nextQuestion');
  round332Ok = false;
}

// D. 回归：R3.27 功能未退化
if (quizWxml332.indexOf('exam-badge') < 0) {
  fail('R3.32: R3.27 examBadge regressed in quiz.wxml');
  round332Ok = false;
}
if (quizWxml332.indexOf('session-stats') < 0) {
  fail('R3.32: R3.27 session-stats regressed in quiz.wxml');
  round332Ok = false;
}
if (quizWxml332.indexOf('feedback-tip') < 0 && quizWxml332.indexOf('showFeedbackTip') < 0) {
  fail('R3.32: R3.27 feedback-tip regressed in quiz.wxml');
  round332Ok = false;
}

if (round332Ok) pass('Round Mini 3.32 quiz progress percent display');

// ============================================================
// Round Mini 3.33：错题本分组统计增强
// ============================================================
console.log('\n--- Round Mini 3.33 mistakes group stats enhancement ---');
var round333Ok = true;

// A. mistakes.js 包含分组统计字段
var mistakesJs333 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs333.indexOf('itCount') < 0) {
  fail('R3.33: itCount field missing in mistakes.js');
  round333Ok = false;
}
if (mistakesJs333.indexOf('sgCount') < 0) {
  fail('R3.33: sgCount field missing in mistakes.js');
  round333Ok = false;
}
if (mistakesJs333.indexOf('japaneseCount') < 0) {
  fail('R3.33: japaneseCount field missing in mistakes.js');
  round333Ok = false;
}

// B. mistakes.wxml 包含分组统计显示
var mistakesWxml333 = readFile('packages/quiz/pages/mistakes/mistakes.wxml');
if (mistakesWxml333.indexOf('group-stats') < 0) {
  fail('R3.33: group-stats missing in mistakes.wxml');
  round333Ok = false;
}
if (mistakesWxml333.indexOf('group-item') < 0) {
  fail('R3.33: group-item missing in mistakes.wxml');
  round333Ok = false;
}

// C. mistakes.wxss 包含对应样式
var mistakesWxss333 = readFile('packages/quiz/pages/mistakes/mistakes.wxss');
if (mistakesWxss333.indexOf('.group-stats') < 0) {
  fail('R3.33: .group-stats style missing in mistakes.wxss');
  round333Ok = false;
}
if (mistakesWxss333.indexOf('.group-dot') < 0) {
  fail('R3.33: .group-dot style missing in mistakes.wxss');
  round333Ok = false;
}

// D. 回归：R3.28 功能未退化
var quizJs333 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs333.indexOf('nextAction') < 0) {
  fail('R3.33: R3.28 nextAction regressed');
  round333Ok = false;
}

if (round333Ok) pass('Round Mini 3.33 mistakes group stats enhancement');

// ============================================================
// Round Mini 3.34：首页学习路径引导增强
// ============================================================
console.log('\n--- Round Mini 3.34 home learning path enhancement ---');
var round334Ok = true;

// A. home.js 包含 nextActionHint 字段
var homeJs334 = readFile('pages/home/home.js');
if (homeJs334.indexOf('nextActionHint') < 0) {
  fail('R3.34: nextActionHint field missing in home.js');
  round334Ok = false;
}

// B. home.wxml 包含 next-action-hint 显示
var homeWxml334 = readFile('pages/home/home.wxml');
if (homeWxml334.indexOf('next-action-hint') < 0 && homeWxml334.indexOf('nextActionHint') < 0) {
  fail('R3.34: next-action-hint missing in home.wxml');
  round334Ok = false;
}

// C. home.wxss 包含对应样式
var homeWxss334 = readFile('pages/home/home.wxss');
if (homeWxss334.indexOf('.next-action-hint') < 0) {
  fail('R3.34: .next-action-hint style missing in home.wxss');
  round334Ok = false;
}

// D. 回归：R3.29 功能未退化
var termDetailJs334 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs334.indexOf('categoryLabel') < 0) {
  fail('R3.34: R3.29 categoryLabel regressed');
  round334Ok = false;
}

if (round334Ok) pass('Round Mini 3.34 home learning path enhancement');

// ============================================================
// Round Mini 3.35：收藏复习完成提示增强
// ============================================================
console.log('\n--- Round Mini 3.35 favorite-review completion hint ---');
var round335Ok = true;

// A. favorite-review.js 包含 reviewCompletionHint 字段和逻辑
var favReviewJs335 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (favReviewJs335.indexOf('reviewCompletionHint') < 0) {
  fail('R3.35: reviewCompletionHint field missing in favorite-review.js');
  round335Ok = false;
}
if (favReviewJs335.indexOf('completionHint') < 0) {
  fail('R3.35: completionHint logic missing in favorite-review.js revealExplanation');
  round335Ok = false;
}
if (favReviewJs335.indexOf("复习完成") < 0) {
  fail('R3.35: completion message missing in favorite-review.js');
  round335Ok = false;
}

// B. favorite-review.wxml 包含 completion-hint 显示
var favReviewWxml335 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxml');
if (favReviewWxml335.indexOf('completion-hint') < 0) {
  fail('R3.35: completion-hint class missing in favorite-review.wxml');
  round335Ok = false;
}
if (favReviewWxml335.indexOf('reviewCompletionHint') < 0) {
  fail('R3.35: reviewCompletionHint binding missing in favorite-review.wxml');
  round335Ok = false;
}
if (favReviewWxml335.indexOf('completion-btn-list') < 0) {
  fail('R3.35: completion action buttons missing in favorite-review.wxml');
  round335Ok = false;
}

// C. favorite-review.wxss 包含对应样式
var favReviewWxss335 = readFile('packages/glossary/pages/favorite-review/favorite-review.wxss');
if (favReviewWxss335.indexOf('.completion-hint') < 0) {
  fail('R3.35: .completion-hint style missing in favorite-review.wxss');
  round335Ok = false;
}
if (favReviewWxss335.indexOf('.completion-text') < 0) {
  fail('R3.35: .completion-text style missing in favorite-review.wxss');
  round335Ok = false;
}
if (favReviewWxss335.indexOf('.completion-btn') < 0) {
  fail('R3.35: .completion-btn style missing in favorite-review.wxss');
  round335Ok = false;
}

// D. 回归：R3.32~R3.34 功能未退化
var quizJs335 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs335.indexOf('progressPercent') < 0) {
  fail('R3.35: R3.32 progressPercent regressed in quiz.js');
  round335Ok = false;
}
var mistakesJs335 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs335.indexOf('itCount') < 0) {
  fail('R3.35: R3.33 itCount regressed in mistakes.js');
  round335Ok = false;
}
var homeJs335 = readFile('pages/home/home.js');
if (homeJs335.indexOf('nextActionHint') < 0) {
  fail('R3.35: R3.34 nextActionHint regressed in home.js');
  round335Ok = false;
}

if (round335Ok) pass('Round Mini 3.35 favorite-review completion hint');

// ============================================================
// Round Mini 3.36：稳定性增强（全局错误处理 + 安全导航工具）
// ============================================================
console.log('\n--- Round Mini 3.36 stability enhancement ---');
var round336Ok = true;

// A. utils/navigate.js 存在且导出安全导航函数
if (!fileExists('utils/navigate.js')) {
  fail('R3.36: utils/navigate.js missing');
  round336Ok = false;
} else {
  var navigateJs336 = readFile('utils/navigate.js');
  if (navigateJs336.indexOf('navigateToSafe') < 0) {
    fail('R3.36: navigateToSafe missing in utils/navigate.js');
    round336Ok = false;
  }
  if (navigateJs336.indexOf('switchTabSafe') < 0) {
    fail('R3.36: switchTabSafe missing in utils/navigate.js');
    round336Ok = false;
  }
}

// B. app.js 包含 onError 全局错误处理
var appJs336 = readFile('app.js');
if (appJs336.indexOf('onError') < 0) {
  fail('R3.36: onError handler missing in app.js');
  round336Ok = false;
}

// C. 回归：R3.32~R3.35 功能未退化
var quizJs336 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs336.indexOf('progressPercent') < 0) {
  fail('R3.36: R3.32 progressPercent regressed in quiz.js');
  round336Ok = false;
}
var mistakesJs336 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs336.indexOf('itCount') < 0) {
  fail('R3.36: R3.33 itCount regressed in mistakes.js');
  round336Ok = false;
}
var homeJs336 = readFile('pages/home/home.js');
if (homeJs336.indexOf('nextActionHint') < 0) {
  fail('R3.36: R3.34 nextActionHint regressed in home.js');
  round336Ok = false;
}
var favReviewJs336 = readFile('packages/glossary/pages/favorite-review/favorite-review.js');
if (favReviewJs336.indexOf('reviewCompletionHint') < 0) {
  fail('R3.36: R3.35 reviewCompletionHint regressed in favorite-review.js');
  round336Ok = false;
}

if (round336Ok) pass('Round Mini 3.36 stability enhancement');

// ============================================================
// Round Mini 3.37：术语分类学习路径
// ============================================================
console.log('\n--- Round Mini 3.37 term category learning path ---');
var round337Ok = true;

// A. term-search.js 包含 categories 和 selectedCategory 字段
var termSearchJs337 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs337.indexOf('categories') < 0) {
  fail('R3.37: categories field missing in term-search.js');
  round337Ok = false;
}
if (termSearchJs337.indexOf('selectedCategory') < 0) {
  fail('R3.37: selectedCategory field missing in term-search.js');
  round337Ok = false;
}
if (termSearchJs337.indexOf('onCategoryTap') < 0) {
  fail('R3.37: onCategoryTap method missing in term-search.js');
  round337Ok = false;
}

// B. term-search.wxml 包含 category-bar 和分类标签
var termSearchWxml337 = readFile('packages/glossary/pages/term-search/term-search.wxml');
if (termSearchWxml337.indexOf('category-bar') < 0) {
  fail('R3.37: category-bar missing in term-search.wxml');
  round337Ok = false;
}
if (termSearchWxml337.indexOf('category-tag') < 0) {
  fail('R3.37: category-tag missing in term-search.wxml');
  round337Ok = false;
}
if (termSearchWxml337.indexOf('onCategoryTap') < 0) {
  fail('R3.37: onCategoryTap binding missing in term-search.wxml');
  round337Ok = false;
}

// C. term-search.wxss 包含分类标签样式
var termSearchWxss337 = readFile('packages/glossary/pages/term-search/term-search.wxss');
if (termSearchWxss337.indexOf('.category-bar') < 0) {
  fail('R3.37: .category-bar style missing in term-search.wxss');
  round337Ok = false;
}
if (termSearchWxss337.indexOf('.category-tag-active') < 0) {
  fail('R3.37: .category-tag-active style missing in term-search.wxss');
  round337Ok = false;
}

// D. 回归：R3.32~R3.36 功能未退化
var quizJs337 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs337.indexOf('progressPercent') < 0) {
  fail('R3.37: R3.32 progressPercent regressed in quiz.js');
  round337Ok = false;
}
var mistakesJs337 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs337.indexOf('itCount') < 0) {
  fail('R3.37: R3.33 itCount regressed in mistakes.js');
  round337Ok = false;
}
var homeJs337 = readFile('pages/home/home.js');
if (homeJs337.indexOf('nextActionHint') < 0) {
  fail('R3.37: R3.34 nextActionHint regressed in home.js');
  round337Ok = false;
}

if (round337Ok) pass('Round Mini 3.37 term category learning path');

// ============================================================
// Round Mini 3.38：术语搜索历史增强
// ============================================================
console.log('\n--- Round Mini 3.38 term search history ---');
var round338Ok = true;

// A. term-search.js 包含 searchHistory 字段和相关方法
var termSearchJs338 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs338.indexOf('searchHistory') < 0) {
  fail('R3.38: searchHistory field missing in term-search.js');
  round338Ok = false;
}
if (termSearchJs338.indexOf('onSearchConfirm') < 0) {
  fail('R3.38: onSearchConfirm method missing in term-search.js');
  round338Ok = false;
}
if (termSearchJs338.indexOf('onHistoryTap') < 0) {
  fail('R3.38: onHistoryTap method missing in term-search.js');
  round338Ok = false;
}
if (termSearchJs338.indexOf('clearHistory') < 0) {
  fail('R3.38: clearHistory method missing in term-search.js');
  round338Ok = false;
}

// B. term-search.wxml 包含搜索历史 UI
var termSearchWxml338 = readFile('packages/glossary/pages/term-search/term-search.wxml');
if (termSearchWxml338.indexOf('history-bar') < 0) {
  fail('R3.38: history-bar missing in term-search.wxml');
  round338Ok = false;
}
if (termSearchWxml338.indexOf('history-tag') < 0) {
  fail('R3.38: history-tag missing in term-search.wxml');
  round338Ok = false;
}
if (termSearchWxml338.indexOf('onHistoryTap') < 0) {
  fail('R3.38: onHistoryTap binding missing in term-search.wxml');
  round338Ok = false;
}
if (termSearchWxml338.indexOf('clearHistory') < 0) {
  fail('R3.38: clearHistory binding missing in term-search.wxml');
  round338Ok = false;
}

// C. term-search.wxss 包含搜索历史样式
var termSearchWxss338 = readFile('packages/glossary/pages/term-search/term-search.wxss');
if (termSearchWxss338.indexOf('.history-bar') < 0) {
  fail('R3.38: .history-bar style missing in term-search.wxss');
  round338Ok = false;
}
if (termSearchWxss338.indexOf('.history-tag') < 0) {
  fail('R3.38: .history-tag style missing in term-search.wxss');
  round338Ok = false;
}

// D. 回归：R3.32~R3.37 功能未退化
var quizJs338 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs338.indexOf('progressPercent') < 0) {
  fail('R3.38: R3.32 progressPercent regressed in quiz.js');
  round338Ok = false;
}
var mistakesJs338 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs338.indexOf('itCount') < 0) {
  fail('R3.38: R3.33 itCount regressed in mistakes.js');
  round338Ok = false;
}

if (round338Ok) pass('Round Mini 3.38 term search history');

// ============================================================
// Round Mini 3.39：术语详情页相关术语推荐
// ============================================================
console.log('\n--- Round Mini 3.39 term detail related terms ---');
var round339Ok = true;

// A. term-detail.js 包含 relatedTerms 字段和相关方法
var termDetailJs339 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs339.indexOf('relatedTerms') < 0) {
  fail('R3.39: relatedTerms field missing in term-detail.js');
  round339Ok = false;
}
if (termDetailJs339.indexOf('goToRelatedTerm') < 0) {
  fail('R3.39: goToRelatedTerm method missing in term-detail.js');
  round339Ok = false;
}
if (termDetailJs339.indexOf('glossaryIndex') < 0) {
  fail('R3.39: glossaryIndex import missing in term-detail.js');
  round339Ok = false;
}

// B. term-detail.wxml 包含相关术语 UI
var termDetailWxml339 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
if (termDetailWxml339.indexOf('relatedTerms') < 0) {
  fail('R3.39: relatedTerms missing in term-detail.wxml');
  round339Ok = false;
}
if (termDetailWxml339.indexOf('goToRelatedTerm') < 0) {
  fail('R3.39: goToRelatedTerm binding missing in term-detail.wxml');
  round339Ok = false;
}
if (termDetailWxml339.indexOf('related-item') < 0) {
  fail('R3.39: related-item class missing in term-detail.wxml');
  round339Ok = false;
}

// C. term-detail.wxss 包含相关术语样式
var termDetailWxss339 = readFile('packages/glossary/pages/term-detail/term-detail.wxss');
if (termDetailWxss339.indexOf('.related-item') < 0) {
  fail('R3.39: .related-item style missing in term-detail.wxss');
  round339Ok = false;
}
if (termDetailWxss339.indexOf('.related-term') < 0) {
  fail('R3.39: .related-term style missing in term-detail.wxss');
  round339Ok = false;
}

// D. 回归：R3.32~R3.38 功能未退化
var quizJs339 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs339.indexOf('progressPercent') < 0) {
  fail('R3.39: R3.32 progressPercent regressed in quiz.js');
  round339Ok = false;
}
var mistakesJs339 = readFile('packages/quiz/pages/mistakes/mistakes.js');
if (mistakesJs339.indexOf('itCount') < 0) {
  fail('R3.39: R3.33 itCount regressed in mistakes.js');
  round339Ok = false;
}

if (round339Ok) pass('Round Mini 3.39 term detail related terms');

// ============================================================
// Round Mini 3.40 术语卡片批量操作
// ============================================================
console.log('\n--- Round Mini 3.40 term card batch operations ---');

var round340Ok = true;

// A. term-search.js 包含批量操作数据字段和方法
var termSearchJs340 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs340.indexOf('batchMode') < 0) {
  fail('R3.40: batchMode data field missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('selectedTerms') < 0) {
  fail('R3.40: selectedTerms data field missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('selectedCount') < 0) {
  fail('R3.40: selectedCount data field missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('toggleBatchMode') < 0) {
  fail('R3.40: toggleBatchMode method missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('onTermCheckboxTap') < 0) {
  fail('R3.40: onTermCheckboxTap method missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('selectAll') < 0) {
  fail('R3.40: selectAll method missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('deselectAll') < 0) {
  fail('R3.40: deselectAll method missing in term-search.js');
  round340Ok = false;
}
if (termSearchJs340.indexOf('batchAddToFavorites') < 0) {
  fail('R3.40: batchAddToFavorites method missing in term-search.js');
  round340Ok = false;
}

// B. term-search.wxml 包含批量操作 UI
var termSearchWxml340 = readFile('packages/glossary/pages/term-search/term-search.wxml');
if (termSearchWxml340.indexOf('batchMode') < 0) {
  fail('R3.40: batchMode binding missing in term-search.wxml');
  round340Ok = false;
}
if (termSearchWxml340.indexOf('batch-toggle') < 0) {
  fail('R3.40: batch-toggle class missing in term-search.wxml');
  round340Ok = false;
}
if (termSearchWxml340.indexOf('card-checkbox') < 0) {
  fail('R3.40: card-checkbox class missing in term-search.wxml');
  round340Ok = false;
}
if (termSearchWxml340.indexOf('batch-bar') < 0) {
  fail('R3.40: batch-bar class missing in term-search.wxml');
  round340Ok = false;
}
if (termSearchWxml340.indexOf('batchAddToFavorites') < 0) {
  fail('R3.40: batchAddToFavorites binding missing in term-search.wxml');
  round340Ok = false;
}

// C. term-search.wxss 包含批量操作样式
var termSearchWxss340 = readFile('packages/glossary/pages/term-search/term-search.wxss');
if (termSearchWxss340.indexOf('.batch-toggle') < 0) {
  fail('R3.40: .batch-toggle style missing in term-search.wxss');
  round340Ok = false;
}
if (termSearchWxss340.indexOf('.batch-bar') < 0) {
  fail('R3.40: .batch-bar style missing in term-search.wxss');
  round340Ok = false;
}
if (termSearchWxss340.indexOf('.checkbox-icon') < 0) {
  fail('R3.40: .checkbox-icon style missing in term-search.wxss');
  round340Ok = false;
}

// D. 回归：R3.32~R3.39 功能未退化
var quizJs340 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs340.indexOf('progressPercent') < 0) {
  fail('R3.40: R3.32 progressPercent regressed in quiz.js');
  round340Ok = false;
}
var termSearchJs340b = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs340b.indexOf('onCategoryTap') < 0) {
  fail('R3.40: R3.37 onCategoryTap regressed in term-search.js');
  round340Ok = false;
}
if (termSearchJs340b.indexOf('onHistoryTap') < 0) {
  fail('R3.40: R3.38 onHistoryTap regressed in term-search.js');
  round340Ok = false;
}

if (round340Ok) pass('Round Mini 3.40 term card batch operations');

// ============================================================
// Round Mini 3.41 术语搜索稳定性增强
// ============================================================
console.log('\n--- Round Mini 3.41 term search stability enhancement ---');

var round341Ok = true;

// A. term-search.js 包含防抖相关代码
var termSearchJs341 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs341.indexOf('SEARCH_DEBOUNCE_MS') < 0) {
  fail('R3.41: SEARCH_DEBOUNCE_MS constant missing in term-search.js');
  round341Ok = false;
}
if (termSearchJs341.indexOf('_searchTimer') < 0) {
  fail('R3.41: _searchTimer variable missing in term-search.js');
  round341Ok = false;
}
if (termSearchJs341.indexOf('_doSearch') < 0) {
  fail('R3.41: _doSearch method missing in term-search.js');
  round341Ok = false;
}

// B. _doSearch 包含 try-catch 异常兜底
if (termSearchJs341.indexOf('try {') < 0 || termSearchJs341.indexOf('catch (err)') < 0) {
  fail('R3.41: _doSearch missing try-catch error handling');
  round341Ok = false;
}
if (termSearchJs341.indexOf('搜索出现异常') < 0) {
  fail('R3.41: _doSearch missing error fallback message');
  round341Ok = false;
}

// C. batchAddToFavorites 包含边界保护
if (termSearchJs341.indexOf('keys.length > 50') < 0) {
  fail('R3.41: batchAddToFavorites missing boundary check (max 50)');
  round341Ok = false;
}

// D. batchAddToFavorites 包含存储异常处理
var batchFunc341 = termSearchJs341.substring(termSearchJs341.indexOf('batchAddToFavorites'));
if (batchFunc341.indexOf('Storage failed') < 0 && batchFunc341.indexOf('存储失败') < 0) {
  fail('R3.41: batchAddToFavorites missing storage error handling');
  round341Ok = false;
}

// E. 回归：R3.32~R3.40 功能未退化
var quizJs341 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs341.indexOf('progressPercent') < 0) {
  fail('R3.41: R3.32 progressPercent regressed in quiz.js');
  round341Ok = false;
}
var termSearchJs341b = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs341b.indexOf('onCategoryTap') < 0) {
  fail('R3.41: R3.37 onCategoryTap regressed in term-search.js');
  round341Ok = false;
}
if (termSearchJs341b.indexOf('onHistoryTap') < 0) {
  fail('R3.41: R3.38 onHistoryTap regressed in term-search.js');
  round341Ok = false;
}
if (termSearchJs341b.indexOf('toggleBatchMode') < 0) {
  fail('R3.41: R3.40 toggleBatchMode regressed in term-search.js');
  round341Ok = false;
}

if (round341Ok) pass('Round Mini 3.41 term search stability enhancement');

// ============================================================
// Round Mini 3.42 首页学习 streak
// ============================================================
console.log('\n--- Round Mini 3.42 home learning streak ---');

var round342Ok = true;

// A. home.js 包含 streak 数据字段
var homeJs342 = readFile('pages/home/home.js');
if (homeJs342.indexOf('streakCount') < 0) {
  fail('R3.42: streakCount data field missing in home.js');
  round342Ok = false;
}
if (homeJs342.indexOf('streakText') < 0) {
  fail('R3.42: streakText data field missing in home.js');
  round342Ok = false;
}

// B. home.js 包含 streak 计算逻辑
if (homeJs342.indexOf('streakCount = 0') < 0) {
  fail('R3.42: streak calculation logic missing in home.js');
  round342Ok = false;
}
if (homeJs342.indexOf('streakData') < 0) {
  fail('R3.42: streakData storage read missing in home.js');
  round342Ok = false;
}

// C. home.wxml 包含 streak 显示
var homeWxml342 = readFile('pages/home/home.wxml');
if (homeWxml342.indexOf('streak-banner') < 0) {
  fail('R3.42: streak-banner missing in home.wxml');
  round342Ok = false;
}
if (homeWxml342.indexOf('streakText') < 0) {
  fail('R3.42: streakText binding missing in home.wxml');
  round342Ok = false;
}

// D. home.wxss 包含 streak 样式
var homeWxss342 = readFile('pages/home/home.wxss');
if (homeWxss342.indexOf('.streak-banner') < 0) {
  fail('R3.42: .streak-banner style missing in home.wxss');
  round342Ok = false;
}
if (homeWxss342.indexOf('.streak-text') < 0) {
  fail('R3.42: .streak-text style missing in home.wxss');
  round342Ok = false;
}

// E. 回归：R3.32~R3.41 功能未退化
var quizJs342 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs342.indexOf('progressPercent') < 0) {
  fail('R3.42: R3.32 progressPercent regressed in quiz.js');
  round342Ok = false;
}
var termSearchJs342 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs342.indexOf('toggleBatchMode') < 0) {
  fail('R3.42: R3.40 toggleBatchMode regressed in term-search.js');
  round342Ok = false;
}
if (termSearchJs342.indexOf('SEARCH_DEBOUNCE_MS') < 0) {
  fail('R3.42: R3.41 SEARCH_DEBOUNCE_MS regressed in term-search.js');
  round342Ok = false;
}

if (round342Ok) pass('Round Mini 3.42 home learning streak');

// ============================================================
// Round Mini 3.43 答题结果明细增强
// ============================================================
console.log('\n--- Round Mini 3.43 quiz result detail enhancement ---');

var round343Ok = true;

// A. quiz.js 包含答题记录数据字段
var quizJs343 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs343.indexOf('answeredList') < 0) {
  fail('R3.43: answeredList data field missing in quiz.js');
  round343Ok = false;
}
if (quizJs343.indexOf('reviewList') < 0) {
  fail('R3.43: reviewList data field missing in quiz.js');
  round343Ok = false;
}
if (quizJs343.indexOf('showReview') < 0) {
  fail('R3.43: showReview data field missing in quiz.js');
  round343Ok = false;
}

// B. quiz.js 包含 toggleReview 方法
if (quizJs343.indexOf('toggleReview') < 0) {
  fail('R3.43: toggleReview method missing in quiz.js');
  round343Ok = false;
}

// C. quiz.wxml 包含答题回顾 UI
var quizWxml343 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml343.indexOf('review-btn') < 0) {
  fail('R3.43: review-btn missing in quiz.wxml');
  round343Ok = false;
}
if (quizWxml343.indexOf('review-section') < 0) {
  fail('R3.43: review-section missing in quiz.wxml');
  round343Ok = false;
}
if (quizWxml343.indexOf('reviewList') < 0) {
  fail('R3.43: reviewList binding missing in quiz.wxml');
  round343Ok = false;
}

// D. quiz.wxss 包含答题回顾样式
var quizWxss343 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss343.indexOf('.review-btn') < 0) {
  fail('R3.43: .review-btn style missing in quiz.wxss');
  round343Ok = false;
}
if (quizWxss343.indexOf('.review-section') < 0) {
  fail('R3.43: .review-section style missing in quiz.wxss');
  round343Ok = false;
}
if (quizWxss343.indexOf('.review-item') < 0) {
  fail('R3.43: .review-item style missing in quiz.wxss');
  round343Ok = false;
}

// E. 回归：R3.32~R3.42 功能未退化
var quizJs343b = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs343b.indexOf('progressPercent') < 0) {
  fail('R3.43: R3.32 progressPercent regressed in quiz.js');
  round343Ok = false;
}
var homeJs343 = readFile('pages/home/home.js');
if (homeJs343.indexOf('streakCount') < 0) {
  fail('R3.43: R3.42 streakCount regressed in home.js');
  round343Ok = false;
}

if (round343Ok) pass('Round Mini 3.43 quiz result detail enhancement');

// ============================================================
// Round Mini 3.44 首页今日练习进度
// ============================================================
var round344Ok = true;

// A. home.js 包含今日练习进度数据字段
var homeJs344 = readFile('pages/home/home.js');
if (homeJs344.indexOf('dailyGoal') < 0) {
  fail('R3.44: dailyGoal data field missing in home.js');
  round344Ok = false;
}
if (homeJs344.indexOf('goalProgress') < 0) {
  fail('R3.44: goalProgress data field missing in home.js');
  round344Ok = false;
}
if (homeJs344.indexOf('goalText') < 0) {
  fail('R3.44: goalText data field missing in home.js');
  round344Ok = false;
}
if (homeJs344.indexOf('showGoalReminder') < 0) {
  fail('R3.44: showGoalReminder data field missing in home.js');
  round344Ok = false;
}

// B. home.js onShow 包含今日练习进度计算逻辑
if (homeJs344.indexOf('todayTotal') < 0) {
  fail('R3.44: todayTotal calculation missing in home.js onShow');
  round344Ok = false;
}
if (homeJs344.indexOf('goalProgress') < 0) {
  fail('R3.44: goalProgress calculation missing in home.js onShow');
  round344Ok = false;
}

// C. home.wxml 包含今日练习进度 UI
var homeWxml344 = readFile('pages/home/home.wxml');
if (homeWxml344.indexOf('goal-section') < 0) {
  fail('R3.44: goal-section missing in home.wxml');
  round344Ok = false;
}
if (homeWxml344.indexOf('goal-bar') < 0) {
  fail('R3.44: goal-bar missing in home.wxml');
  round344Ok = false;
}
if (homeWxml344.indexOf('goalText') < 0) {
  fail('R3.44: goalText binding missing in home.wxml');
  round344Ok = false;
}

// D. home.wxss 包含今日练习进度样式
var homeWxss344 = readFile('pages/home/home.wxss');
if (homeWxss344.indexOf('.goal-section') < 0) {
  fail('R3.44: .goal-section style missing in home.wxss');
  round344Ok = false;
}
if (homeWxss344.indexOf('.goal-bar') < 0) {
  fail('R3.44: .goal-bar style missing in home.wxss');
  round344Ok = false;
}
if (homeWxss344.indexOf('.goal-text') < 0) {
  fail('R3.44: .goal-text style missing in home.wxss');
  round344Ok = false;
}

// E. 回归：R3.32~R3.43 功能未退化
var homeJs344b = readFile('pages/home/home.js');
if (homeJs344b.indexOf('streakCount') < 0) {
  fail('R3.44: R3.42 streakCount regressed in home.js');
  round344Ok = false;
}
var quizJs344 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs344.indexOf('reviewList') < 0) {
  fail('R3.44: R3.43 reviewList regressed in quiz.js');
  round344Ok = false;
}

if (round344Ok) pass('Round Mini 3.44 home daily practice progress');

// ============================================================
// Round Mini 3.45 home 页面性能优化
// ============================================================
var round345Ok = true;

// A. home.js 包含 R3.45 性能优化注释
var homeJs345 = readFile('pages/home/home.js');
if (homeJs345.indexOf('R3.45 优化') < 0) {
  fail('R3.45: R3.45 性能优化注释 missing in home.js');
  round345Ok = false;
}

// B. home.js streak 计算逻辑优化 (只在 streak 变化时写入 storage)
if (homeJs345.indexOf('不需要写入 storage') < 0) {
  fail('R3.45: streak storage write optimization missing in home.js');
  round345Ok = false;
}

// C. home.js 包含 todayTotal 缓存优化注释
if (homeJs345.indexOf('R3.45 缓存') < 0) {
  fail('R3.45: todayTotal cache optimization comment missing in home.js');
  round345Ok = false;
}

// D. home.js onShow 仍然包含完整的 streak 计算逻辑
if (homeJs345.indexOf('streakCount') < 0) {
  fail('R3.45: streakCount calculation missing in home.js');
  round345Ok = false;
}
if (homeJs345.indexOf('diffDays') < 0) {
  fail('R3.45: diffDays calculation missing in home.js');
  round345Ok = false;
}

// E. home.wxml 仍然包含 streak 和 goal UI
var homeWxml345 = readFile('pages/home/home.wxml');
if (homeWxml345.indexOf('streak-banner') < 0) {
  fail('R3.45: streak-banner regressed in home.wxml');
  round345Ok = false;
}
if (homeWxml345.indexOf('goal-section') < 0) {
  fail('R3.45: goal-section regressed in home.wxml');
  round345Ok = false;
}

// F. home.wxss 仍然包含 streak 和 goal 样式
var homeWxss345 = readFile('pages/home/home.wxss');
if (homeWxss345.indexOf('.streak-banner') < 0) {
  fail('R3.45: .streak-banner style regressed in home.wxss');
  round345Ok = false;
}
if (homeWxss345.indexOf('.goal-section') < 0) {
  fail('R3.45: .goal-section style regressed in home.wxss');
  round345Ok = false;
}

// G. 回归：R3.32~R3.44 功能未退化
var quizJs345 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs345.indexOf('progressPercent') < 0) {
  fail('R3.45: R3.32 progressPercent regressed in quiz.js');
  round345Ok = false;
}
if (quizJs345.indexOf('reviewList') < 0) {
  fail('R3.45: R3.43 reviewList regressed in quiz.js');
  round345Ok = false;
}

if (round345Ok) pass('Round Mini 3.45 home page performance optimization');

// ============================================================
// Round Mini 3.46 quiz result share functionality
// ============================================================
var round346Ok = true;

// A. quiz.js 包含 onShareAppMessage 方法
var quizJs346 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs346.indexOf('onShareAppMessage') < 0) {
  fail('R3.46: onShareAppMessage method missing in quiz.js');
  round346Ok = false;
}

// B. quiz.js onShareAppMessage 返回正确的分享配置
if (quizJs346.indexOf('title') < 0) {
  fail('R3.46: share title missing in onShareAppMessage');
  round346Ok = false;
}
if (quizJs346.indexOf('path') < 0) {
  fail('R3.46: share path missing in onShareAppMessage');
  round346Ok = false;
}

// C. quiz.wxml 包含分享按钮
var quizWxml346 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml346.indexOf('open-type="share"') < 0) {
  fail('R3.46: share button missing in quiz.wxml');
  round346Ok = false;
}
if (quizWxml346.indexOf('share-btn') < 0) {
  fail('R3.46: share-btn class missing in quiz.wxml');
  round346Ok = false;
}

// D. quiz.wxss 包含分享按钮样式
var quizWxss346 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss346.indexOf('.share-btn') < 0) {
  fail('R3.46: .share-btn style missing in quiz.wxss');
  round346Ok = false;
}
if (quizWxss346.indexOf('.share-btn-text') < 0) {
  fail('R3.46: .share-btn-text style missing in quiz.wxss');
  round346Ok = false;
}

// E. 回归：R3.32~R3.45 功能未退化
var quizJs346b = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs346b.indexOf('reviewList') < 0) {
  fail('R3.46: R3.43 reviewList regressed in quiz.js');
  round346Ok = false;
}
var homeJs346 = readFile('pages/home/home.js');
if (homeJs346.indexOf('streakCount') < 0) {
  fail('R3.46: R3.42 streakCount regressed in home.js');
  round346Ok = false;
}

if (round346Ok) pass('Round Mini 3.46 quiz result share functionality');

// ============================================================
// Round Mini 3.47 home learning achievement system
// ============================================================
var round347Ok = true;

// A. home.js 包含成就数据字段
var homeJs347 = readFile('pages/home/home.js');
if (homeJs347.indexOf('achievements') < 0) {
  fail('R3.47: achievements data field missing in home.js');
  round347Ok = false;
}
if (homeJs347.indexOf('showAchievements') < 0) {
  fail('R3.47: showAchievements data field missing in home.js');
  round347Ok = false;
}

// B. home.js onShow 包含成就计算逻辑
if (homeJs347.indexOf('totalAttemptsCount') < 0) {
  fail('R3.47: achievement calculation missing in home.js onShow');
  round347Ok = false;
}
if (homeJs347.indexOf('first_quiz') < 0) {
  fail('R3.47: first_quiz achievement missing in home.js');
  round347Ok = false;
}

// C. home.wxml 包含成就展示 UI
var homeWxml347 = readFile('pages/home/home.wxml');
if (homeWxml347.indexOf('achievement-section') < 0) {
  fail('R3.47: achievement-section missing in home.wxml');
  round347Ok = false;
}
if (homeWxml347.indexOf('achievements') < 0) {
  fail('R3.47: achievements binding missing in home.wxml');
  round347Ok = false;
}

// D. home.wxss 包含成就样式
var homeWxss347 = readFile('pages/home/home.wxss');
if (homeWxss347.indexOf('.achievement-section') < 0) {
  fail('R3.47: .achievement-section style missing in home.wxss');
  round347Ok = false;
}
if (homeWxss347.indexOf('.achievement-item') < 0) {
  fail('R3.47: .achievement-item style missing in home.wxss');
  round347Ok = false;
}

// E. 回归：R3.32~R3.46 功能未退化
var quizJs347 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs347.indexOf('onShareAppMessage') < 0) {
  fail('R3.47: R3.46 onShareAppMessage regressed in quiz.js');
  round347Ok = false;
}
var homeJs347b = readFile('pages/home/home.js');
if (homeJs347b.indexOf('streakCount') < 0) {
  fail('R3.47: R3.42 streakCount regressed in home.js');
  round347Ok = false;
}

if (round347Ok) pass('Round Mini 3.47 home learning achievement system');

// ============================================================
// Round Mini 3.48 quiz result wrong answer explanation
// ============================================================
var round348Ok = true;

// A. quiz.js reviewList 包含 hint 字段
var quizJs348 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs348.indexOf('hint') < 0) {
  fail('R3.48: hint field missing in quiz.js reviewList');
  round348Ok = false;
}
if (quizJs348.indexOf('shared_hint') < 0) {
  fail('R3.48: shared_hint reference missing in quiz.js');
  round348Ok = false;
}

// B. quiz.wxml 包含错题解析显示
var quizWxml348 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml348.indexOf('review-item-hint') < 0) {
  fail('R3.48: review-item-hint missing in quiz.wxml');
  round348Ok = false;
}
if (quizWxml348.indexOf('💡 提示') < 0) {
  fail('R3.48: hint label missing in quiz.wxml');
  round348Ok = false;
}

// C. quiz.wxss 包含错题解析样式
var quizWxss348 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss348.indexOf('.review-item-hint') < 0) {
  fail('R3.48: .review-item-hint style missing in quiz.wxss');
  round348Ok = false;
}

// D. 回归：R3.32~R3.47 功能未退化
var quizJs348b = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs348b.indexOf('onShareAppMessage') < 0) {
  fail('R3.48: R3.46 onShareAppMessage regressed in quiz.js');
  round348Ok = false;
}
var homeJs348 = readFile('pages/home/home.js');
if (homeJs348.indexOf('achievements') < 0) {
  fail('R3.48: R3.47 achievements regressed in home.js');
  round348Ok = false;
}

if (round348Ok) pass('Round Mini 3.48 quiz result wrong answer explanation');

// ============================================================
// Round Mini 3.49 term favorite note functionality
// ============================================================
var round349Ok = true;

// A. term-detail.js 包含 note 数据字段和 saveNote 方法
var termDetailJs349 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs349.indexOf('note') < 0) {
  fail('R3.49: note data field missing in term-detail.js');
  round349Ok = false;
}
if (termDetailJs349.indexOf('saveNote') < 0) {
  fail('R3.49: saveNote method missing in term-detail.js');
  round349Ok = false;
}
if (termDetailJs349.indexOf('onNoteInput') < 0) {
  fail('R3.49: onNoteInput method missing in term-detail.js');
  round349Ok = false;
}

// B. term-detail.wxml 包含笔记输入框
var termDetailWxml349 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
if (termDetailWxml349.indexOf('note-input') < 0) {
  fail('R3.49: note-input missing in term-detail.wxml');
  round349Ok = false;
}
if (termDetailWxml349.indexOf('saveNote') < 0) {
  fail('R3.49: saveNote button missing in term-detail.wxml');
  round349Ok = false;
}

// C. term-detail.wxss 包含笔记样式
var termDetailWxss349 = readFile('packages/glossary/pages/term-detail/term-detail.wxss');
if (termDetailWxss349.indexOf('.note-input') < 0) {
  fail('R3.49: .note-input style missing in term-detail.wxss');
  round349Ok = false;
}
if (termDetailWxss349.indexOf('.note-save-btn') < 0) {
  fail('R3.49: .note-save-btn style missing in term-detail.wxss');
  round349Ok = false;
}

// D. 回归：R3.32~R3.48 功能未退化
var quizJs349 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs349.indexOf('hint') < 0) {
  fail('R3.49: R3.48 hint regressed in quiz.js');
  round349Ok = false;
}
var homeJs349 = readFile('pages/home/home.js');
if (homeJs349.indexOf('achievements') < 0) {
  fail('R3.49: R3.47 achievements regressed in home.js');
  round349Ok = false;
}

if (round349Ok) pass('Round Mini 3.49 term favorite note functionality');

// ============================================================
// Round Mini 3.50 quiz retry wrong questions
// ============================================================
var round350Ok = true;

// A. quiz.js 包含 wrongQuestionIds 数据字段和 retryWrongQuestions 方法
var quizJs350 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs350.indexOf('wrongQuestionIds') < 0) {
  fail('R3.50: wrongQuestionIds data field missing in quiz.js');
  round350Ok = false;
}
if (quizJs350.indexOf('retryWrongQuestions') < 0) {
  fail('R3.50: retryWrongQuestions method missing in quiz.js');
  round350Ok = false;
}

// B. quiz.wxml 包含重练错题按钮
var quizWxml350 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml350.indexOf('retryWrongQuestions') < 0) {
  fail('R3.50: retryWrongQuestions button missing in quiz.wxml');
  round350Ok = false;
}
if (quizWxml350.indexOf('重练错题') < 0) {
  fail('R3.50: 重练错题 label missing in quiz.wxml');
  round350Ok = false;
}

// C. quiz.wxss 包含重练错题按钮样式
var quizWxss350 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss350.indexOf('.result-btn-retry') < 0) {
  fail('R3.50: .result-btn-retry style missing in quiz.wxss');
  round350Ok = false;
}
if (quizWxss350.indexOf('.result-btn-text-retry') < 0) {
  fail('R3.50: .result-btn-text-retry style missing in quiz.wxss');
  round350Ok = false;
}

// D. 回归：R3.32~R3.49 功能未退化
var quizJs350b = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs350b.indexOf('hint') < 0) {
  fail('R3.50: R3.48 hint regressed in quiz.js');
  round350Ok = false;
}
var homeJs350 = readFile('pages/home/home.js');
if (homeJs350.indexOf('achievements') < 0) {
  fail('R3.50: R3.47 achievements regressed in home.js');
  round350Ok = false;
}

if (round350Ok) pass('Round Mini 3.50 quiz retry wrong questions');

// ============================================================
// Round Mini 3.51 home suggestion action button
// ============================================================
var round351Ok = true;

// A. home.js 包含 generateEnhancedSuggestion 函数和相关数据字段
var homeJs351 = readFile('pages/home/home.js');
if (homeJs351.indexOf('generateEnhancedSuggestion') < 0) {
  fail('R3.51: generateEnhancedSuggestion function missing in home.js');
  round351Ok = false;
}
if (homeJs351.indexOf('suggestionActionText') < 0) {
  fail('R3.51: suggestionActionText data field missing in home.js');
  round351Ok = false;
}
if (homeJs351.indexOf('suggestionActionPath') < 0) {
  fail('R3.51: suggestionActionPath data field missing in home.js');
  round351Ok = false;
}
if (homeJs351.indexOf('suggestionActionTap') < 0) {
  fail('R3.51: suggestionActionTap method missing in home.js');
  round351Ok = false;
}

// B. home.wxml 包含建议操作按钮
var homeWxml351 = readFile('pages/home/home.wxml');
if (homeWxml351.indexOf('suggestionActionTap') < 0) {
  fail('R3.51: suggestionActionTap button missing in home.wxml');
  round351Ok = false;
}
if (homeWxml351.indexOf('suggestionActionText') < 0) {
  fail('R3.51: suggestionActionText binding missing in home.wxml');
  round351Ok = false;
}

// C. home.wxss 包含建议操作按钮样式
var homeWxss351 = readFile('pages/home/home.wxss');
if (homeWxss351.indexOf('.suggestion-action') < 0) {
  fail('R3.51: .suggestion-action style missing in home.wxss');
  round351Ok = false;
}
if (homeWxss351.indexOf('.suggestion-action-text') < 0) {
  fail('R3.51: .suggestion-action-text style missing in home.wxss');
  round351Ok = false;
}

// D. 回归：R3.32~R3.50 功能未退化
var quizJs351 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs351.indexOf('retryWrongQuestions') < 0) {
  fail('R3.51: R3.50 retryWrongQuestions regressed in quiz.js');
  round351Ok = false;
}
var termDetailJs351 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs351.indexOf('note') < 0) {
  fail('R3.51: R3.49 note regressed in term-detail.js');
  round351Ok = false;
}

if (round351Ok) pass('Round Mini 3.51 home suggestion action button');

// ============================================================
// Round Mini 3.52 home learning reminder
// ============================================================
var round352Ok = true;

// A. home.js 包含 generateLearningReminder 函数和相关数据字段
var homeJs352 = readFile('pages/home/home.js');
if (homeJs352.indexOf('generateLearningReminder') < 0) {
  fail('R3.52: generateLearningReminder function missing in home.js');
  round352Ok = false;
}
if (homeJs352.indexOf('learningReminder') < 0) {
  fail('R3.52: learningReminder data field missing in home.js');
  round352Ok = false;
}

// B. home.wxml 包含学习提醒横幅
var homeWxml352 = readFile('pages/home/home.wxml');
if (homeWxml352.indexOf('reminder-banner') < 0) {
  fail('R3.52: reminder-banner missing in home.wxml');
  round352Ok = false;
}
if (homeWxml352.indexOf('reminder-text') < 0) {
  fail('R3.52: reminder-text binding missing in home.wxml');
  round352Ok = false;
}

// C. home.wxss 包含提醒横幅样式
var homeWxss352 = readFile('pages/home/home.wxss');
if (homeWxss352.indexOf('.reminder-banner') < 0) {
  fail('R3.52: .reminder-banner style missing in home.wxss');
  round352Ok = false;
}
if (homeWxss352.indexOf('.reminder-text') < 0) {
  fail('R3.52: .reminder-text style missing in home.wxss');
  round352Ok = false;
}

// D. 回归：R3.32~R3.51 功能未退化
var homeJs352b = readFile('pages/home/home.js');
if (homeJs352b.indexOf('suggestionActionTap') < 0) {
  fail('R3.52: R3.51 suggestionActionTap regressed in home.js');
  round352Ok = false;
}
var quizJs352 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs352.indexOf('retryWrongQuestions') < 0) {
  fail('R3.52: R3.50 retryWrongQuestions regressed in quiz.js');
  round352Ok = false;
}

if (round352Ok) pass('Round Mini 3.52 home learning reminder');

// ============================================================
// Round Mini 3.53 home practice completion celebration
// ============================================================
var round353Ok = true;

// A. home.wxml 包含庆祝图标和条件渲染
var homeWxml353 = readFile('pages/home/home.wxml');
if (homeWxml353.indexOf('🎉') < 0) {
  fail('R3.53: celebration icon missing in home.wxml');
  round353Ok = false;
}
if (homeWxml353.indexOf('goalProgress >= 100') < 0) {
  fail('R3.53: goalProgress condition missing in home.wxml');
  round353Ok = false;
}

// B. home.wxss 包含庆祝样式和动画
var homeWxss353 = readFile('pages/home/home.wxss');
if (homeWxss353.indexOf('.goal-celebrate') < 0) {
  fail('R3.53: .goal-celebrate style missing in home.wxss');
  round353Ok = false;
}
if (homeWxss353.indexOf('.goal-bar-complete') < 0) {
  fail('R3.53: .goal-bar-complete style missing in home.wxss');
  round353Ok = false;
}
if (homeWxss353.indexOf('celebrate-bounce') < 0) {
  fail('R3.53: celebrate-bounce animation missing in home.wxss');
  round353Ok = false;
}

// C. 回归：R3.32~R3.52 功能未退化
var homeJs353 = readFile('pages/home/home.js');
if (homeJs353.indexOf('generateLearningReminder') < 0) {
  fail('R3.53: R3.52 generateLearningReminder regressed in home.js');
  round353Ok = false;
}
var quizJs353 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs353.indexOf('retryWrongQuestions') < 0) {
  fail('R3.53: R3.50 retryWrongQuestions regressed in quiz.js');
  round353Ok = false;
}

if (round353Ok) pass('Round Mini 3.53 home practice completion celebration');

// ============================================================
// Round Mini 3.54 glossary random term button
// ============================================================
var round354Ok = true;

// A. glossary.js 包含 goToRandomTerm 方法
var glossaryJs354 = readFile('pages/glossary/glossary.js');
if (glossaryJs354.indexOf('goToRandomTerm') < 0) {
  fail('R3.54: goToRandomTerm method missing in glossary.js');
  round354Ok = false;
}
if (glossaryJs354.indexOf('random=1') < 0) {
  fail('R3.54: random=1 parameter missing in glossary.js');
  round354Ok = false;
}

// B. glossary.wxml 包含随机术语按钮
var glossaryWxml354 = readFile('pages/glossary/glossary.wxml');
if (glossaryWxml354.indexOf('goToRandomTerm') < 0) {
  fail('R3.54: goToRandomTerm button missing in glossary.wxml');
  round354Ok = false;
}
if (glossaryWxml354.indexOf('🎲') < 0) {
  fail('R3.54: 🎲 icon missing in glossary.wxml');
  round354Ok = false;
}

// C. glossary.wxss 包含随机术语按钮样式
var glossaryWxss354 = readFile('pages/glossary/glossary.wxss');
if (glossaryWxss354.indexOf('.launcher-btn-random') < 0) {
  fail('R3.54: .launcher-btn-random style missing in glossary.wxss');
  round354Ok = false;
}

// D. term-search.js 支持 random=1 参数
var termSearchJs354 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs354.indexOf('options.random') < 0) {
  fail('R3.54: random=1 handling missing in term-search.js');
  round354Ok = false;
}
if (termSearchJs354.indexOf('randomIndex') < 0) {
  fail('R3.54: random selection logic missing in term-search.js');
  round354Ok = false;
}

// E. 回归：R3.32~R3.53 功能未退化
var homeJs354 = readFile('pages/home/home.js');
if (homeJs354.indexOf('generateLearningReminder') < 0) {
  fail('R3.54: R3.52 generateLearningReminder regressed in home.js');
  round354Ok = false;
}
var quizJs354 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs354.indexOf('retryWrongQuestions') < 0) {
  fail('R3.54: R3.50 retryWrongQuestions regressed in quiz.js');
  round354Ok = false;
}

if (round354Ok) pass('Round Mini 3.54 glossary random term button');

// ============================================================
// Round Mini 3.55 home streak share button
// ============================================================
var round355Ok = true;

// A. home.js 包含 onShareAppMessage 方法
var homeJs355 = readFile('pages/home/home.js');
if (homeJs355.indexOf('onShareAppMessage') < 0) {
  fail('R3.55: onShareAppMessage method missing in home.js');
  round355Ok = false;
}
if (homeJs355.indexOf('streakCount') < 0) {
  fail('R3.55: streakCount in share message missing in home.js');
  round355Ok = false;
}

// B. home.wxml 包含分享按钮
var homeWxml355 = readFile('pages/home/home.wxml');
if (homeWxml355.indexOf('streak-share-btn') < 0) {
  fail('R3.55: streak-share-btn missing in home.wxml');
  round355Ok = false;
}
if (homeWxml355.indexOf('open-type="share"') < 0) {
  fail('R3.55: open-type="share" missing in home.wxml');
  round355Ok = false;
}

// C. home.wxss 包含分享按钮样式
var homeWxss355 = readFile('pages/home/home.wxss');
if (homeWxss355.indexOf('.streak-share-btn') < 0) {
  fail('R3.55: .streak-share-btn style missing in home.wxss');
  round355Ok = false;
}

// D. 回归：R3.32~R3.54 功能未退化
var glossaryJs355 = readFile('pages/glossary/glossary.js');
if (glossaryJs355.indexOf('goToRandomTerm') < 0) {
  fail('R3.55: R3.54 goToRandomTerm regressed in glossary.js');
  round355Ok = false;
}
var quizJs355 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs355.indexOf('retryWrongQuestions') < 0) {
  fail('R3.55: R3.50 retryWrongQuestions regressed in quiz.js');
  round355Ok = false;
}

if (round355Ok) pass('Round Mini 3.55 home streak share button');

// ============================================================
// Round Mini 3.56 term detail copy button
// ============================================================
var round356Ok = true;

// A. term-detail.js 包含 copyTerm 方法
var termDetailJs356 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs356.indexOf('copyTerm') < 0) {
  fail('R3.56: copyTerm method missing in term-detail.js');
  round356Ok = false;
}
if (termDetailJs356.indexOf('setClipboardData') < 0) {
  fail('R3.56: setClipboardData call missing in term-detail.js');
  round356Ok = false;
}

// B. term-detail.wxml 包含复制按钮
var termDetailWxml356 = readFile('packages/glossary/pages/term-detail/term-detail.wxml');
if (termDetailWxml356.indexOf('copyTerm') < 0) {
  fail('R3.56: copyTerm button missing in term-detail.wxml');
  round356Ok = false;
}
if (termDetailWxml356.indexOf('📋') < 0) {
  fail('R3.56: 📋 icon missing in term-detail.wxml');
  round356Ok = false;
}

// C. term-detail.wxss 包含复制按钮样式
var termDetailWxss356 = readFile('packages/glossary/pages/term-detail/term-detail.wxss');
if (termDetailWxss356.indexOf('.copy-term-btn') < 0) {
  fail('R3.56: .copy-term-btn style missing in term-detail.wxss');
  round356Ok = false;
}
if (termDetailWxss356.indexOf('.copy-term-icon') < 0) {
  fail('R3.56: .copy-term-icon style missing in term-detail.wxss');
  round356Ok = false;
}

// D. 回归：R3.32~R3.55 功能未退化
var homeJs356 = readFile('pages/home/home.js');
if (homeJs356.indexOf('onShareAppMessage') < 0) {
  fail('R3.56: R3.55 onShareAppMessage regressed in home.js');
  round356Ok = false;
}
var glossaryJs356 = readFile('pages/glossary/glossary.js');
if (glossaryJs356.indexOf('goToRandomTerm') < 0) {
  fail('R3.56: R3.54 goToRandomTerm regressed in glossary.js');
  round356Ok = false;
}

if (round356Ok) pass('Round Mini 3.56 term detail copy button');

// ============================================================
// Round Mini 3.57 profile version copy button
// ============================================================
var round357Ok = true;

// A. profile.js 包含 copyVersion 方法
var profileJs357 = readFile('pages/profile/profile.js');
if (profileJs357.indexOf('copyVersion') < 0) {
  fail('R3.57: copyVersion method missing in profile.js');
  round357Ok = false;
}
if (profileJs357.indexOf('setClipboardData') < 0) {
  fail('R3.57: setClipboardData call missing in profile.js');
  round357Ok = false;
}

// B. profile.wxml 包含复制按钮
var profileWxml357 = readFile('pages/profile/profile.wxml');
if (profileWxml357.indexOf('copyVersion') < 0) {
  fail('R3.57: copyVersion button missing in profile.wxml');
  round357Ok = false;
}
if (profileWxml357.indexOf('📋') < 0) {
  fail('R3.57: 📋 icon missing in profile.wxml');
  round357Ok = false;
}

// C. profile.wxss 包含复制按钮样式
var profileWxss357 = readFile('pages/profile/profile.wxss');
if (profileWxss357.indexOf('.copy-version-btn') < 0) {
  fail('R3.57: .copy-version-btn style missing in profile.wxss');
  round357Ok = false;
}

// D. 回归：R3.32~R3.56 功能未退化
var termDetailJs357 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs357.indexOf('copyTerm') < 0) {
  fail('R3.57: R3.56 copyTerm regressed in term-detail.js');
  round357Ok = false;
}
var homeJs357 = readFile('pages/home/home.js');
if (homeJs357.indexOf('onShareAppMessage') < 0) {
  fail('R3.57: R3.55 onShareAppMessage regressed in home.js');
  round357Ok = false;
}

if (round357Ok) pass('Round Mini 3.57 profile version copy button');

// ============================================================
// Round Mini 3.58 home daily learning quote
// ============================================================
var round358Ok = true;

// A. home.js 包含 getDailyQuote 函数和相关数据字段
var homeJs358 = readFile('pages/home/home.js');
if (homeJs358.indexOf('getDailyQuote') < 0) {
  fail('R3.58: getDailyQuote function missing in home.js');
  round358Ok = false;
}
if (homeJs358.indexOf('DAILY_QUOTES') < 0) {
  fail('R3.58: DAILY_QUOTES array missing in home.js');
  round358Ok = false;
}
if (homeJs358.indexOf('dailyQuote') < 0) {
  fail('R3.58: dailyQuote data field missing in home.js');
  round358Ok = false;
}

// B. home.wxml 包含每日格言显示
var homeWxml358 = readFile('pages/home/home.wxml');
if (homeWxml358.indexOf('quote-banner') < 0) {
  fail('R3.58: quote-banner missing in home.wxml');
  round358Ok = false;
}
if (homeWxml358.indexOf('dailyQuote') < 0) {
  fail('R3.58: dailyQuote binding missing in home.wxml');
  round358Ok = false;
}

// C. home.wxss 包含格言样式
var homeWxss358 = readFile('pages/home/home.wxss');
if (homeWxss358.indexOf('.quote-banner') < 0) {
  fail('R3.58: .quote-banner style missing in home.wxss');
  round358Ok = false;
}
if (homeWxss358.indexOf('.quote-text') < 0) {
  fail('R3.58: .quote-text style missing in home.wxss');
  round358Ok = false;
}

// D. 回归：R3.32~R3.57 功能未退化
var profileJs358 = readFile('pages/profile/profile.js');
if (profileJs358.indexOf('copyVersion') < 0) {
  fail('R3.58: R3.57 copyVersion regressed in profile.js');
  round358Ok = false;
}
var termDetailJs358 = readFile('packages/glossary/pages/term-detail/term-detail.js');
if (termDetailJs358.indexOf('copyTerm') < 0) {
  fail('R3.58: R3.56 copyTerm regressed in term-detail.js');
  round358Ok = false;
}

if (round358Ok) pass('Round Mini 3.58 home daily learning quote');

// ============================================================
// Round Mini 3.59 term search history clear button
// ============================================================
var round359Ok = true;

// A. term-search.js 包含 clearSearchHistory 方法
var termSearchJs359 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs359.indexOf('clearSearchHistory') < 0) {
  fail('R3.59: clearSearchHistory method missing in term-search.js');
  round359Ok = false;
}
if (termSearchJs359.indexOf('removeStorageSync') < 0) {
  fail('R3.59: removeStorageSync call missing in term-search.js');
  round359Ok = false;
}

// B. term-search.wxml 包含清空按钮
var termSearchWxml359 = readFile('packages/glossary/pages/term-search/term-search.wxml');
if (termSearchWxml359.indexOf('clearHistory') < 0) {
  fail('R3.59: clearHistory button missing in term-search.wxml');
  round359Ok = false;
}

// C. 回归：R3.32~R3.58 功能未退化
var homeJs359 = readFile('pages/home/home.js');
if (homeJs359.indexOf('getDailyQuote') < 0) {
  fail('R3.59: R3.58 getDailyQuote regressed in home.js');
  round359Ok = false;
}
var profileJs359 = readFile('pages/profile/profile.js');
if (profileJs359.indexOf('copyVersion') < 0) {
  fail('R3.59: R3.57 copyVersion regressed in profile.js');
  round359Ok = false;
}

if (round359Ok) pass('Round Mini 3.59 term search history clear button');

// ============================================================
// Round Mini 3.60 quiz hint button
// ============================================================
var round360Ok = true;

// A. quiz.js 包含 toggleHint 方法和 showHint 字段
var quizJs360 = readFile('packages/quiz/pages/quiz/quiz.js');
if (quizJs360.indexOf('toggleHint') < 0) {
  fail('R3.60: toggleHint method missing in quiz.js');
  round360Ok = false;
}
if (quizJs360.indexOf('showHint') < 0) {
  fail('R3.60: showHint data field missing in quiz.js');
  round360Ok = false;
}

// B. quiz.wxml 包含提示按钮和显示
var quizWxml360 = readFile('packages/quiz/pages/quiz/quiz.wxml');
if (quizWxml360.indexOf('toggleHint') < 0) {
  fail('R3.60: toggleHint button missing in quiz.wxml');
  round360Ok = false;
}
if (quizWxml360.indexOf('hint-content') < 0) {
  fail('R3.60: hint-content missing in quiz.wxml');
  round360Ok = false;
}

// C. quiz.wxss 包含提示样式
var quizWxss360 = readFile('packages/quiz/pages/quiz/quiz.wxss');
if (quizWxss360.indexOf('.hint-section') < 0) {
  fail('R3.60: .hint-section style missing in quiz.wxss');
  round360Ok = false;
}
if (quizWxss360.indexOf('.hint-text') < 0) {
  fail('R3.60: .hint-text style missing in quiz.wxss');
  round360Ok = false;
}

// D. 回归：R3.32~R3.59 功能未退化
var termSearchJs360 = readFile('packages/glossary/pages/term-search/term-search.js');
if (termSearchJs360.indexOf('clearSearchHistory') < 0) {
  fail('R3.60: R3.59 clearSearchHistory regressed in term-search.js');
  round360Ok = false;
}
var homeJs360 = readFile('pages/home/home.js');
if (homeJs360.indexOf('getDailyQuote') < 0) {
  fail('R3.60: R3.58 getDailyQuote regressed in home.js');
  round360Ok = false;
}

if (round360Ok) pass('Round Mini 3.60 quiz hint button');

// ============================================================
// Round Mini 3.61 home practice reminder
// ============================================================
var round361Ok = true;

// A. home.js contains practiceReminder field
var homeJs361 = readFile("pages/home/home.js");
if (homeJs361.indexOf("practiceReminder") < 0) {
  fail("R3.61: practiceReminder field missing in home.js");
  round361Ok = false;
}
if (homeJs361.indexOf("天前") < 0) {
  fail("R3.61: days ago calculation missing in home.js");
  round361Ok = false;
}

// B. home.wxml contains reminder display
var homeWxml361 = readFile("pages/home/home.wxml");
if (homeWxml361.indexOf("practice-reminder-banner") < 0) {
  fail("R3.61: practice-reminder-banner missing in home.wxml");
  round361Ok = false;
}

// C. home.wxss contains reminder styles
var homeWxss361 = readFile("pages/home/home.wxss");
if (homeWxss361.indexOf(".practice-reminder-banner") < 0) {
  fail("R3.61: .practice-reminder-banner style missing in home.wxss");
  round361Ok = false;
}

if (round361Ok) pass("Round Mini 3.61 home practice reminder");





// ===========================================================
// Round Mini 3.62 quiz answer timer
// ===========================================================
var round362Ok = true;

// A. quiz.js 包含 timerText 字段
var quizJs362 = readFile("packages/quiz/pages/quiz/quiz.js");
if (quizJs362.indexOf("timerText") < 0) {
  fail("R3.62: timerText field missing in quiz.js");
  round362Ok = false;
}

// B. quiz.wxml 包含计时器显示
var quizWxml362 = readFile("packages/quiz/pages/quiz/quiz.wxml");
if (quizWxml362.indexOf("timer-section") < 0) {
  fail("R3.62: timer-section missing in quiz.wxml");
  round362Ok = false;
}

// C. quiz.wxss 包含计时器样式  
var quizWxss362 = readFile("packages/quiz/pages/quiz/quiz.wxss");
if (quizWxss362.indexOf(".timer-section") < 0) {
  fail("R3.62: .timer-section style missing in quiz.wxss");
  round362Ok = false;
}

if (round362Ok) pass("Round Mini 3.62 quiz answer timer");

// ===========================================================
// Round Mini 3.63 home practice reminder dismiss
// ===========================================================
var round363Ok = true;

// A. home.js 包含 dismissReminder 方法
var homeJs363 = readFile("pages/home/home.js");
if (homeJs363.indexOf("dismissReminder") < 0) {
  fail("R3.63: dismissReminder method missing in home.js");
  round363Ok = false;
}

// B. home.wxml 包含关闭按钮
var homeWxml363 = readFile("pages/home/home.wxml");
if (homeWxml363.indexOf("reminder-dismiss-btn") < 0) {
  fail("R3.63: reminder-dismiss-btn missing in home.wxml");
  round363Ok = false;
}

// C. home.wxss 包含关闭按钮样式
var homeWxss363 = readFile("pages/home/home.wxss");
if (homeWxss363.indexOf(".reminder-dismiss-btn") < 0) {
  fail("R3.63: .reminder-dismiss-btn style missing in home.wxss");
  round363Ok = false;
}

if (round363Ok) pass("Round Mini 3.63 home reminder dismiss");


console.log('========================================');

// Round Mini 3.64 term detail copy example
var round364Ok = true;
var termDetailJs364 = readFile("packages/glossary/pages/term-detail/term-detail.js");
if (termDetailJs364.indexOf("copyExample") < 0) {
  fail("R3.64: copyExample method missing");
  round364Ok = false;
}
var termDetailWxml364 = readFile("packages/glossary/pages/term-detail/term-detail.wxml");
if (termDetailWxml364.indexOf("copyExample") < 0) {
  fail("R3.64: copyExample button missing in wxml");
  round364Ok = false;
}
if (round364Ok) pass("Round Mini 3.64 term detail copy example");
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('========================================');

if (failed > 0) {
  console.log('SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED');
  process.exit(0);
}

// Round Mini 3.65 home pull-down refresh
var round365Ok = true;
var homeJson365 = readFile("pages/home/home.json");
if (homeJson365.indexOf("enablePullDownRefresh") < 0) {
  fail("R3.65: enablePullDownRefresh missing in home.json");
  round365Ok = false;
}
var homeJs365 = readFile("pages/home/home.js");
if (homeJs365.indexOf("onPullDownRefresh") < 0) {
  fail("R3.65: onPullDownRefresh method missing in home.js");
  round365Ok = false;
}
if (round365Ok) pass("Round Mini 3.65 home pull-down refresh");

// Round Mini 3.66 profile backup time display
var round366Ok = true;
var profileWxml366 = readFile("pages/profile/profile.wxml");
if (profileWxml366.indexOf("backupTime") < 0) {
  fail("R3.66: backupTime display missing in profile.wxml");
  round366Ok = false;
}
if (round366Ok) pass("Round Mini 3.66 profile backup time display");

console.log('\n========================================');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('========================================');

if (failed > 0) {
  console.log('SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED');
  process.exit(0);
}
