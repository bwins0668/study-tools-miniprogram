// utils/navigation.js
// Lightweight stateless navigation adapter for the 5-tab course center.
// No storage reads/writes. No business logic. No G4 WIP dependencies.

var TAB = {
  COURSE:   '/pages/home/home',
  PRACTICE: '/pages/practice/practice',
  REVIEW:   '/pages/review/review',
  GLOSSARY: '/pages/glossary/glossary',
  PROFILE:  '/pages/profile/profile'
};

// Legacy non-tab pages (still registered, navigated via navigateTo)
var LEGACY = {
  FLASHCARDS:       '/pages/flashcards/flashcards',
  MISTAKES:         '/pages/mistakes/mistakes',
  MISTAKES_FULL:    '/packages/quiz/pages/mistakes/mistakes',
  EXAM_MENU_ITPASS: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass',
  EXAM_MENU_SG:     '/packages/quiz/pages/exam-menu/exam-menu?exam=sg',
  QUIZ_ITPASS:      '/packages/quiz/pages/quiz/quiz?exam=itpass&sourceType=lesson_quiz',
  TERM_SEARCH:      '/packages/glossary/pages/term-search/term-search',
  FAVORITE_REVIEW:  '/packages/glossary/pages/favorite-review/favorite-review',
  ANKI_PLAYER:      '/packages/glossary/pages/anki-player/anki-player?from=home',
  ANALYSIS_DETAIL:  '/packages/quiz/pages/analysis-detail/analysis-detail'
};

/**
 * Navigate to a tab page via switchTab.
 * @param {string} url - absolute page path (e.g. '/pages/home/home')
 */
function switchTabSafe(url) {
  wx.switchTab({
    url: url,
    fail: function (err) {
      console.error('[nav] switchTab failed:', url, err);
      wx.showToast({ title: '页面切换失败，请重试', icon: 'none' });
    }
  });
}

/**
 * Navigate to a non-tab page via navigateTo.
 * @param {string} url - absolute page path with optional query
 */
function navigateToSafe(url) {
  wx.navigateTo({
    url: url,
    fail: function (err) {
      console.error('[nav] navigateTo failed:', url, err);
      wx.showToast({ title: '页面暂时无法打开', icon: 'none' });
    }
  });
}

// ---- Public API ----

function goCourseTab()     { switchTabSafe(TAB.COURSE); }
function goPracticeTab()   { switchTabSafe(TAB.PRACTICE); }
function goReviewTab()     { switchTabSafe(TAB.REVIEW); }
function goGlossaryTab()   { switchTabSafe(TAB.GLOSSARY); }
function goProfileTab()    { switchTabSafe(TAB.PROFILE); }
function goFlashcards()    { navigateToSafe(LEGACY.FLASHCARDS); }
function goMistakes()      { navigateToSafe(LEGACY.MISTAKES_FULL); }
function goItPassport()    { navigateToSafe(LEGACY.EXAM_MENU_ITPASS); }
function goSG()            { navigateToSafe(LEGACY.EXAM_MENU_SG); }
function goQuickPractice() { navigateToSafe(LEGACY.QUIZ_ITPASS); }
function goTermSearch()    { navigateToSafe(LEGACY.TERM_SEARCH); }
function goFavoriteReview(){ navigateToSafe(LEGACY.FAVORITE_REVIEW); }
function goAnkiPlayer()    { navigateToSafe(LEGACY.ANKI_PLAYER); }
function goAnalysisDetail(){ navigateToSafe(LEGACY.ANALYSIS_DETAIL); }

function continueLastQuiz(exam, sourceType) {
  var url = '/packages/quiz/pages/quiz/quiz?exam=' + (exam || 'itpass') + '&sourceType=' + (sourceType || 'lesson_quiz');
  navigateToSafe(url);
}

module.exports = {
  TAB: TAB,
  LEGACY: LEGACY,
  switchTabSafe: switchTabSafe,
  navigateToSafe: navigateToSafe,
  goCourseTab: goCourseTab,
  goPracticeTab: goPracticeTab,
  goReviewTab: goReviewTab,
  goGlossaryTab: goGlossaryTab,
  goProfileTab: goProfileTab,
  goFlashcards: goFlashcards,
  goMistakes: goMistakes,
  goItPassport: goItPassport,
  goSG: goSG,
  goQuickPractice: goQuickPractice,
  goTermSearch: goTermSearch,
  goFavoriteReview: goFavoriteReview,
  goAnkiPlayer: goAnkiPlayer,
  goAnalysisDetail: goAnalysisDetail,
  continueLastQuiz: continueLastQuiz
};
