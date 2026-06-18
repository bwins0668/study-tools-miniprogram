// utils/quiz_dedupe.js
// Runtime deduplication for quiz questions by normalized content key.

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[Ａ-Ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[ａ-ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .toLowerCase();
}

function getQuestionDedupeKey(question) {
  var stem = normalizeText(question.questionZh || question.questionJa || question.title || question.term || '');
  var options = normalizeText(
    (question.options || []).map(function (o) { return (o.textZh || o.textJa || o.text || '').trim(); }).join('|')
  );
  var answer = normalizeText(question.answer || question.correctAnswer || question.correctIndex || '');
  return stem + '|' + options + '|' + answer;
}

function dedupeQuestions(questions) {
  var seen = Object.create(null);
  return questions.filter(function (question) {
    var key = getQuestionDedupeKey(question);
    if (!key || key === '||') return true;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

module.exports = {
  dedupeQuestions: dedupeQuestions,
  getQuestionDedupeKey: getQuestionDedupeKey
};
