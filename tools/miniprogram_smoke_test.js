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
if (!appJsContent.includes('v0.12.0')) {
  fail('version: app.js does not contain v0.12.0');
  versionOk = false;
}

if (!storageContent.includes("version: 'v0.12.0'")) {
  fail('version: utils/storage.js exportLocalBackup does not contain v0.12.0');
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
if (versionOk) pass('version check v0.12.0');

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
// 汇总
// ============================================================
console.log('\n========================================');
console.log('Study Tools Mini Smoke Test');
console.log('========================================');
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
