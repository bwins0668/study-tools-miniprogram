'use strict';

var identity = require('../utils/spaced-repetition/identity');
var flashcardAdapter = require('../packages/quiz/data/flashcard_adapter');

var PACKAGE_KEYS = [
  'quiz-itpass-1',
  'quiz-itpass-2',
  'quiz-itpass-3',
  'quiz-itpass-4',
  'quiz-itpass-5',
  'quiz-sg-1',
  'quiz-sg-2'
];

function countDuplicates(values) {
  var seen = {};
  var duplicates = [];
  values.forEach(function (value) {
    var key = String(value);
    seen[key] = (seen[key] || 0) + 1;
  });
  Object.keys(seen).forEach(function (key) {
    if (seen[key] > 1) duplicates.push({ value: key, count: seen[key] });
  });
  return { unique: Object.keys(seen).length, duplicates: duplicates };
}

function auditTerms() {
  var index = require('../packages/glossary/data/glossary_index').glossaryIndex || [];
  var ids = [];
  var memoryIds = [];
  var unlocatable = [];
  index.forEach(function (term, indexPosition) {
    var built = identity.createTermIdentity(term && term.id);
    if (!built.ok) {
      unlocatable.push({ index: indexPosition, reason: built.review.reason });
      return;
    }
    ids.push(built.sourceRef.termId);
    memoryIds.push(built.memoryItemId);
  });
  var duplicateData = countDuplicates(ids);
  return {
    total: index.length,
    unique: duplicateData.unique,
    duplicates: duplicateData.duplicates.length,
    duplicateSamples: duplicateData.duplicates.slice(0, 20),
    unlocatable: unlocatable.length,
    unlocatableSamples: unlocatable.slice(0, 20),
    memoryIds: memoryIds
  };
}

function auditAnkiCards() {
  // The current Anki player presents glossary-index terms, so its stable card key is term.id.
  var index = require('../packages/glossary/data/glossary_index').glossaryIndex || [];
  var ids = [];
  var memoryIds = [];
  var unlocatable = [];
  index.forEach(function (term, indexPosition) {
    var built = identity.createAnkiIdentity(term && term.id);
    if (!built.ok) {
      unlocatable.push({ index: indexPosition, reason: built.review.reason });
      return;
    }
    ids.push(built.sourceRef.cardId);
    memoryIds.push(built.memoryItemId);
  });
  var duplicateData = countDuplicates(ids);
  return {
    total: index.length,
    unique: duplicateData.unique,
    duplicates: duplicateData.duplicates.length,
    unlocatable: unlocatable.length,
    unlocatableSamples: unlocatable.slice(0, 20),
    memoryIds: memoryIds
  };
}

function auditExamPackages() {
  var perCourse = { itpass: [], sg: [] };
  var rawTotals = { itpass: 0, sg: 0 };
  var filteredTotals = { itpass: 0, sg: 0 };
  var rawIdLocations = {};
  var migrationReview = [];

  PACKAGE_KEYS.forEach(function (packageKey) {
    var loader = require('../packages/' + packageKey + '/data/loader');
    var meta = loader.meta || {};
    var course = meta.exam;
    var byYear = loader.questionsByYear || {};
    Object.keys(byYear).forEach(function (deckId) {
      var list = byYear[deckId] || [];
      list.forEach(function (question, index) {
        var questionCourse = question && question.exam ? question.exam : course;
        if (rawTotals[questionCourse] === undefined) rawTotals[questionCourse] = 0;
        rawTotals[questionCourse] += 1;

        var playableCard = flashcardAdapter.normalizeQuestion(question);
        if (!playableCard) {
          if (filteredTotals[questionCourse] === undefined) filteredTotals[questionCourse] = 0;
          filteredTotals[questionCourse] += 1;
          return;
        }

        var questionId = playableCard.sourceId;
        var normalizedDeckId = playableCard.yearId || deckId;
        var normalizedCourse = playableCard.course || questionCourse;
        if (!normalizedCourse || questionId === undefined || questionId === null || questionId === '') {
          migrationReview.push({ packageKey: packageKey, deckId: deckId, index: index, reason: 'EXAM_SOURCE_NOT_UNIQUE' });
          return;
        }
        var built = identity.createExamIdentity(normalizedCourse, normalizedDeckId, questionId);
        if (!built.ok) {
          migrationReview.push({ packageKey: packageKey, deckId: deckId, index: index, reason: built.review.reason });
          return;
        }
        if (!perCourse[normalizedCourse]) perCourse[normalizedCourse] = [];
        perCourse[normalizedCourse].push(built.memoryItemId);
        var rawId = String(questionId);
        rawIdLocations[rawId] = rawIdLocations[rawId] || [];
        rawIdLocations[rawId].push({ course: normalizedCourse, deckId: normalizedDeckId, memoryItemId: built.memoryItemId });
      });
    });
  });

  function summarize(course) {
    var ids = perCourse[course] || [];
    var duplicateData = countDuplicates(ids);
    return {
      rawTotal: rawTotals[course] || 0,
      filteredOut: filteredTotals[course] || 0,
      playable: ids.length,
      unique: duplicateData.unique,
      collisions: duplicateData.duplicates.length,
      collisionSamples: duplicateData.duplicates.slice(0, 20),
      memoryIds: ids
    };
  }

  var itpass = summarize('itpass');
  var sg = summarize('sg');
  var combinedIds = (perCourse.itpass || []).concat(perCourse.sg || []);
  var combined = countDuplicates(combinedIds);
  var rawDuplicates = Object.keys(rawIdLocations).filter(function (rawId) { return rawIdLocations[rawId].length > 1; }).map(function (rawId) {
    return { rawId: rawId, locations: rawIdLocations[rawId].slice(0, 10) };
  });

  return {
    itpass: itpass,
    sg: sg,
    combined: {
      rawTotal: itpass.rawTotal + sg.rawTotal,
      filteredOut: itpass.filteredOut + sg.filteredOut,
      playable: combinedIds.length,
      unique: combined.unique,
      collisions: combined.duplicates.length,
      memoryIds: combinedIds
    },
    rawIdDuplicateSamples: rawDuplicates.slice(0, 20),
    migrationReview: migrationReview
  };
}

function auditLegacyRecords(examReport) {
  var rawDuplicateCount = examReport.rawIdDuplicateSamples.length;
  return {
    favoriteTerms: {
      storageKey: 'study-tools-mini-favorite-terms-v1',
      existingFields: ['id', 'savedAt'],
      currentDedupKey: 'id',
      mapping: 'UNIQUE_WHEN_TERM_ID_EXISTS',
      reviewRequired: 0
    },
    wrongQuestions: {
      storageKey: 'study-tools-mini-wrong-questions-v1',
      existingFields: ['id', 'exam', 'wrongAt', 'lastAnswer', 'sourceType', 'yearId', 'questionSnapshot'],
      currentDedupKey: 'id (legacy cross-course/deck ambiguity risk)',
      mapping: 'REQUIRES_exam_AND_yearId_OR_questionSnapshot.yearId',
      reviewRequired: rawDuplicateCount > 0 ? 'records missing both yearId and questionSnapshot.yearId must return NEEDS_REVIEW' : 0
    }
  };
}

function audit() {
  var terms = auditTerms();
  var anki = auditAnkiCards();
  var exams = auditExamPackages();
  var allMemoryIds = terms.memoryIds.concat(anki.memoryIds, exams.combined.memoryIds);
  var allDuplicates = countDuplicates(allMemoryIds);
  var counts = {
    term: terms.total,
    anki: anki.total,
    itpassPlayable: exams.itpass.playable,
    sgPlayable: exams.sg.playable,
    totalPlayable: exams.combined.playable,
    collision: allDuplicates.duplicates.length
  };
  var failures = [];
  if (terms.duplicates || terms.unlocatable) failures.push('TERM_IDENTITY_NOT_STABLE');
  if (anki.duplicates || anki.unlocatable) failures.push('ANKI_IDENTITY_NOT_STABLE');
  if (exams.itpass.collisions || exams.sg.collisions || exams.combined.collisions || exams.migrationReview.length) failures.push('EXAM_IDENTITY_NOT_STABLE');
  if (counts.collision) failures.push('CROSS_SOURCE_MEMORY_ITEM_ID_COLLISION');
  return {
    status: failures.length ? 'FAIL' : 'PASS',
    reportVersion: 2,
    counts: counts,
    terms: terms,
    anki: anki,
    flashcards: exams,
    legacyRecords: auditLegacyRecords(exams),
    migrationReviewCount: exams.migrationReview.length,
    failures: failures
  };
}

if (require.main === module) {
  var report = audit();
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (report.status !== 'PASS') process.exitCode = 1;
}

module.exports = {
  audit: audit
};
