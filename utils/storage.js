// utils/storage.js
// 本地存储工具模块（收藏 + 错题本）

// ========== 收藏术语 ==========

const FAVORITE_TERMS_KEY = "study-tools-mini-favorite-terms-v1";

function getFavoriteTerms() {
  try {
    const list = wx.getStorageSync(FAVORITE_TERMS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getFavoriteTerms failed", error);
    return [];
  }
}

function saveFavoriteTerms(list) {
  try {
    wx.setStorageSync(FAVORITE_TERMS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveFavoriteTerms failed", error);
  }
}

function isFavoriteTerm(id) {
  return getFavoriteTerms().some((item) => item.id === id);
}

function addFavoriteTerm(id) {
  const list = getFavoriteTerms();
  if (!list.some((item) => item.id === id)) {
    list.push({
      id,
      savedAt: Date.now()
    });
    saveFavoriteTerms(list);
  }
  return getFavoriteTerms();
}

function removeFavoriteTerm(id) {
  const list = getFavoriteTerms().filter((item) => item.id !== id);
  saveFavoriteTerms(list);
  return list;
}

function getFavoriteTermCount() {
  return getFavoriteTerms().length;
}

// ========== 错题本 ==========

const WRONG_QUESTIONS_KEY = "study-tools-mini-wrong-questions-v1";

function getWrongQuestions() {
  try {
    const list = wx.getStorageSync(WRONG_QUESTIONS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getWrongQuestions failed", error);
    return [];
  }
}

function saveWrongQuestions(list) {
  try {
    wx.setStorageSync(WRONG_QUESTIONS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveWrongQuestions failed", error);
  }
}

function addWrongQuestion(questionId, exam, lastAnswer) {
  var list = getWrongQuestions();
  var now = Date.now();
  // 查找是否已存在
  var found = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === questionId) {
      list[i].wrongAt = now;
      list[i].lastAnswer = lastAnswer;
      found = true;
      break;
    }
  }
  // 不存在则新增
  if (!found) {
    list.push({
      id: questionId,
      exam: exam,
      wrongAt: now,
      lastAnswer: lastAnswer
    });
  }
  saveWrongQuestions(list);
  return list;
}

function removeWrongQuestion(questionId) {
  var list = getWrongQuestions().filter(function (item) {
    return item.id !== questionId;
  });
  saveWrongQuestions(list);
  return list;
}

function clearWrongQuestions() {
  saveWrongQuestions([]);
  return [];
}

function getWrongQuestionCount() {
  return getWrongQuestions().length;
}

// ========== 做题记录 ==========

var QUIZ_ATTEMPTS_KEY = "study-tools-mini-quiz-attempts-v1";

function getQuizAttempts() {
  try {
    var list = wx.getStorageSync(QUIZ_ATTEMPTS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getQuizAttempts failed", error);
    return [];
  }
}

function saveQuizAttempts(list) {
  try {
    wx.setStorageSync(QUIZ_ATTEMPTS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveQuizAttempts failed", error);
  }
}

function addQuizAttempt(payload) {
  var list = getQuizAttempts();
  var now = Date.now();
  list.push({
    id: "attempt-" + now + "-" + payload.questionId,
    questionId: payload.questionId,
    exam: payload.exam,
    sourceType: payload.sourceType,
    selectedAnswer: payload.selectedAnswer,
    correctAnswer: payload.correctAnswer,
    isCorrect: !!payload.isCorrect,
    answeredAt: now
  });
  saveQuizAttempts(list);
  return list;
}

function clearQuizAttempts() {
  saveQuizAttempts([]);
  return [];
}

function getQuizAttemptCount() {
  return getQuizAttempts().length;
}

function getTodayQuizAttemptCount() {
  var list = getQuizAttempts();
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  var count = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].answeredAt >= todayStart) {
      count++;
    }
  }
  return count;
}

function getQuizStats() {
  var list = getQuizAttempts();
  var total = list.length;
  var correct = 0;
  var todayTotal = 0;
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  var byExam = {
    itpass: { total: 0, correct: 0, wrong: 0, accuracy: 0 },
    sg: { total: 0, correct: 0, wrong: 0, accuracy: 0 }
  };
  var bySourceType = {
    lesson_quiz: { total: 0, correct: 0, wrong: 0, accuracy: 0 },
    past_exam_japanese: { total: 0, correct: 0, wrong: 0, accuracy: 0 }
  };

  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.isCorrect) correct++;

    if (a.answeredAt >= todayStart) todayTotal++;

    // by exam
    var examKey = a.exam;
    if (byExam[examKey]) {
      byExam[examKey].total++;
      if (a.isCorrect) byExam[examKey].correct++;
      else byExam[examKey].wrong++;
    }

    // by sourceType
    var srcKey = a.sourceType;
    if (bySourceType[srcKey]) {
      bySourceType[srcKey].total++;
      if (a.isCorrect) bySourceType[srcKey].correct++;
      else bySourceType[srcKey].wrong++;
    }
  }

  // calculate accuracy
  var accuracy = total > 0 ? Math.round(correct / total * 100) : 0;
  var examKeys = Object.keys(byExam);
  for (var e = 0; e < examKeys.length; e++) {
    var ek = byExam[examKeys[e]];
    ek.accuracy = ek.total > 0 ? Math.round(ek.correct / ek.total * 100) : 0;
  }
  var srcKeys = Object.keys(bySourceType);
  for (var s = 0; s < srcKeys.length; s++) {
    var sk = bySourceType[srcKeys[s]];
    sk.accuracy = sk.total > 0 ? Math.round(sk.correct / sk.total * 100) : 0;
  }

  return {
    total: total,
    correct: correct,
    wrong: total - correct,
    accuracy: accuracy,
    todayTotal: todayTotal,
    byExam: byExam,
    bySourceType: bySourceType
  };
}

/**
 * 按 exam + sourceType 获取统计
 */
function getLastAttempt() {
  var list = getQuizAttempts();
  if (list.length === 0) return null;
  var sorted = list.slice().sort(function (a, b) {
    return b.answeredAt - a.answeredAt;
  });
  return sorted[0];
}

function getQuizStatsByFilter(exam, sourceType) {
  var list = getQuizAttempts();
  var total = 0;
  var correct = 0;
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.exam === exam && a.sourceType === sourceType) {
      total++;
      if (a.isCorrect) correct++;
    }
  }
  return {
    total: total,
    correct: correct,
    wrong: total - correct,
    accuracy: total > 0 ? Math.round(correct / total * 100) : 0
  };
}

// ========== 本地数据备份 / 恢复 ==========

function validateLocalBackup(backup) {
  if (!backup || typeof backup !== 'object') return false;
  if (backup.app !== 'study-tools-mini') return false;
  if (!backup.data || typeof backup.data !== 'object') return false;
  if (!Array.isArray(backup.data.favoriteTerms)) return false;
  if (!Array.isArray(backup.data.wrongQuestions)) return false;
  if (!Array.isArray(backup.data.quizAttempts)) return false;
  return true;
}

function exportLocalBackup() {
  return {
    app: 'study-tools-mini',
    version: 'v0.16.0',
    exportedAt: Date.now(),
    data: {
      favoriteTerms: getFavoriteTerms(),
      wrongQuestions: getWrongQuestions(),
      quizAttempts: getQuizAttempts()
    }
  };
}

function importLocalBackup(backup) {
  if (!validateLocalBackup(backup)) return false;
  saveFavoriteTerms(backup.data.favoriteTerms);
  saveWrongQuestions(backup.data.wrongQuestions);
  saveQuizAttempts(backup.data.quizAttempts);
  return true;
}

function clearAllLocalUserData() {
  saveFavoriteTerms([]);
  saveWrongQuestions([]);
  saveQuizAttempts([]);
}

module.exports = {
  // 收藏术语
  FAVORITE_TERMS_KEY: FAVORITE_TERMS_KEY,
  getFavoriteTerms: getFavoriteTerms,
  saveFavoriteTerms: saveFavoriteTerms,
  isFavoriteTerm: isFavoriteTerm,
  addFavoriteTerm: addFavoriteTerm,
  removeFavoriteTerm: removeFavoriteTerm,
  getFavoriteTermCount: getFavoriteTermCount,
  // 错题本
  WRONG_QUESTIONS_KEY: WRONG_QUESTIONS_KEY,
  getWrongQuestions: getWrongQuestions,
  saveWrongQuestions: saveWrongQuestions,
  addWrongQuestion: addWrongQuestion,
  removeWrongQuestion: removeWrongQuestion,
  clearWrongQuestions: clearWrongQuestions,
  getWrongQuestionCount: getWrongQuestionCount,
  // 做题记录
  QUIZ_ATTEMPTS_KEY: QUIZ_ATTEMPTS_KEY,
  getQuizAttempts: getQuizAttempts,
  saveQuizAttempts: saveQuizAttempts,
  addQuizAttempt: addQuizAttempt,
  clearQuizAttempts: clearQuizAttempts,
  getQuizAttemptCount: getQuizAttemptCount,
  getTodayQuizAttemptCount: getTodayQuizAttemptCount,
  getQuizStats: getQuizStats,
  getQuizStatsByFilter: getQuizStatsByFilter,
  getLastAttempt: getLastAttempt,
  // 本地数据备份 / 恢复
  validateLocalBackup: validateLocalBackup,
  exportLocalBackup: exportLocalBackup,
  importLocalBackup: importLocalBackup,
  clearAllLocalUserData: clearAllLocalUserData
};
