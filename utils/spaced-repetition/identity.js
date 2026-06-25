'use strict';

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function encodeSegment(value) {
  return encodeURIComponent(String(value).trim());
}

function decodeOnce(value) {
  try {
    return decodeURIComponent(String(value));
  } catch (error) {
    return null;
  }
}

function normalizeCourse(course) {
  if (!hasValue(course)) return null;
  var normalized = String(course).trim().toLowerCase();
  return /^[a-z0-9_-]+$/.test(normalized) ? normalized : null;
}

function normalizeDeckId(deckId) {
  if (!hasValue(deckId)) return null;
  return String(deckId).trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeOpaqueId(value) {
  if (!hasValue(value)) return null;
  return String(value).trim();
}

function isSerializable(value) {
  try {
    JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
}

function cloneSerializable(value) {
  return JSON.parse(JSON.stringify(value));
}

function createReview(reason, input) {
  return {
    status: 'NEEDS_REVIEW',
    reason: reason,
    input: isSerializable(input) ? cloneSerializable(input) : null
  };
}

function createTermIdentity(termId) {
  var normalized = normalizeOpaqueId(termId);
  if (!normalized) return { ok: false, review: createReview('TERM_ID_REQUIRED', { termId: termId }) };
  return {
    ok: true,
    memoryItemId: 'sr:v1:term:' + encodeSegment(normalized),
    sourceType: 'term',
    sourceRef: { termId: normalized }
  };
}

function createAnkiIdentity(cardId) {
  var normalized = normalizeOpaqueId(cardId);
  if (!normalized) return { ok: false, review: createReview('ANKI_CARD_ID_REQUIRED', { cardId: cardId }) };
  return {
    ok: true,
    memoryItemId: 'sr:v1:anki:' + encodeSegment(normalized),
    sourceType: 'anki',
    sourceRef: { cardId: normalized }
  };
}

function createExamIdentity(course, deckId, questionId) {
  var normalizedCourse = normalizeCourse(course);
  var normalizedDeckId = normalizeDeckId(deckId);
  var normalizedQuestionId = normalizeOpaqueId(questionId);
  if (!normalizedCourse || !normalizedDeckId || !normalizedQuestionId) {
    return {
      ok: false,
      review: createReview('EXAM_SOURCE_NOT_UNIQUE', {
        course: course,
        deckId: deckId,
        questionId: questionId
      })
    };
  }
  return {
    ok: true,
    memoryItemId: 'sr:v1:exam:' + normalizedCourse + ':' + encodeSegment(normalizedDeckId) + ':' + encodeSegment(normalizedQuestionId),
    sourceType: 'exam',
    sourceRef: {
      course: normalizedCourse,
      deckId: normalizedDeckId,
      questionId: normalizedQuestionId
    }
  };
}

function createMemoryIdentity(sourceType, sourceRef) {
  if (!isSerializable(sourceRef)) {
    return { ok: false, review: createReview('SOURCE_REF_NOT_SERIALIZABLE', sourceRef) };
  }
  if (sourceType === 'term') return createTermIdentity(sourceRef && sourceRef.termId);
  if (sourceType === 'anki') return createAnkiIdentity(sourceRef && sourceRef.cardId);
  if (sourceType === 'exam') {
    return createExamIdentity(sourceRef && sourceRef.course, sourceRef && sourceRef.deckId, sourceRef && sourceRef.questionId);
  }
  return { ok: false, review: createReview('UNKNOWN_SOURCE_TYPE', { sourceType: sourceType, sourceRef: sourceRef }) };
}

function parseMemoryItemId(memoryItemId) {
  if (!hasValue(memoryItemId)) return null;
  var parts = String(memoryItemId).split(':');
  if (parts[0] !== 'sr' || parts[1] !== 'v1') return null;

  if (parts.length === 4 && parts[2] === 'term') {
    var termId = decodeOnce(parts[3]);
    var termIdentity = createTermIdentity(termId);
    return termIdentity.ok && termIdentity.memoryItemId === memoryItemId ? termIdentity : null;
  }
  if (parts.length === 4 && parts[2] === 'anki') {
    var cardId = decodeOnce(parts[3]);
    var ankiIdentity = createAnkiIdentity(cardId);
    return ankiIdentity.ok && ankiIdentity.memoryItemId === memoryItemId ? ankiIdentity : null;
  }
  if (parts.length === 6 && parts[2] === 'exam') {
    var course = parts[3];
    var deckId = decodeOnce(parts[4]);
    var questionId = decodeOnce(parts[5]);
    var examIdentity = createExamIdentity(course, deckId, questionId);
    return examIdentity.ok && examIdentity.memoryItemId === memoryItemId ? examIdentity : null;
  }
  return null;
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  var keys = Object.keys(value).sort();
  var parts = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (value[key] === undefined || typeof value[key] === 'function') continue;
    parts.push(JSON.stringify(key) + ':' + stableStringify(value[key]));
  }
  return '{' + parts.join(',') + '}';
}

module.exports = {
  encodeSegment: encodeSegment,
  decodeOnce: decodeOnce,
  normalizeCourse: normalizeCourse,
  normalizeDeckId: normalizeDeckId,
  normalizeOpaqueId: normalizeOpaqueId,
  isSerializable: isSerializable,
  createReview: createReview,
  createTermIdentity: createTermIdentity,
  createAnkiIdentity: createAnkiIdentity,
  createExamIdentity: createExamIdentity,
  createMemoryIdentity: createMemoryIdentity,
  parseMemoryItemId: parseMemoryItemId,
  stableStringify: stableStringify,
  shortId: function () {
    return 'xxxxxxxxxx'.replace(/x/g, function () { return Math.floor(Math.random() * 36).toString(36); });
  },
  buildEventId: function (sourceType, course, deckId, questionId, grade, ts) {
    return ['ev', sourceType, course, deckId, questionId, grade, String(ts)].join(':');
  }
};
