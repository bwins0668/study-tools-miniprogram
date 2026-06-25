'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var identity = require('../utils/spaced-repetition/identity');
var audit = require('./audit_spaced_repetition_identity');

helpers.run('test_spaced_repetition_identity', function () {
  var term = identity.createTermIdentity('term/with spaces');
  helpers.assert(term.ok, 'TERM_IDENTITY_REQUIRED');
  helpers.equal(term.memoryItemId, 'sr:v1:term:term%2Fwith%20spaces', 'TERM_ID_ENCODING');
  helpers.equal(identity.parseMemoryItemId(term.memoryItemId).sourceRef.termId, 'term/with spaces', 'TERM_ID_PARSE_ONCE');

  var anki = identity.createAnkiIdentity('term/with spaces');
  helpers.assert(anki.ok, 'ANKI_IDENTITY_REQUIRED');
  helpers.assert(anki.memoryItemId !== term.memoryItemId, 'TERM_AND_ANKI_PREFIXES_MUST_NOT_COLLIDE');
  helpers.equal(identity.parseMemoryItemId(anki.memoryItemId).sourceRef.cardId, 'term/with spaces', 'ANKI_ID_PARSE');

  var first = identity.createExamIdentity('ITPASS', ' 01 AKI ', 'Q:1');
  var second = identity.createExamIdentity('itpass', '02_aki', 'Q:1');
  var sg = identity.createExamIdentity('sg', '01_aki', 'Q:1');
  helpers.assert(first.ok && second.ok && sg.ok, 'EXAM_IDENTITIES_REQUIRED');
  helpers.assert(first.memoryItemId !== second.memoryItemId, 'RAW_ID_MUST_NOT_COLLIDE_ACROSS_DECKS');
  helpers.assert(first.memoryItemId !== sg.memoryItemId, 'RAW_ID_MUST_NOT_COLLIDE_ACROSS_COURSES');
  helpers.equal(first.sourceRef.deckId, '01_aki', 'CANONICAL_DECK_ID');
  helpers.assert(!identity.createExamIdentity('itpass', '', 'q').ok, 'AMBIGUOUS_EXAM_MUST_REVIEW');

  var report = audit.audit();
  helpers.equal(report.status, 'PASS', 'REAL_DATA_IDENTITY_AUDIT');
  helpers.assert(report.counts.term > 0, 'TERM_DATA_REQUIRED');
  helpers.assert(report.counts.anki > 0, 'ANKI_DATA_REQUIRED');
  helpers.equal(report.counts.totalPlayable, report.counts.itpassPlayable + report.counts.sgPlayable, 'PLAYABLE_TOTAL_MUST_MATCH_COURSE_SUM');
  helpers.equal(report.counts.collision, 0, 'NO_CROSS_SOURCE_MEMORY_ID_COLLISIONS');
  helpers.equal(report.terms.duplicates, 0, 'TERM_IDS_MUST_BE_UNIQUE');
  helpers.equal(report.terms.unlocatable, 0, 'TERM_IDS_MUST_BE_LOCATABLE');
  helpers.equal(report.anki.duplicates, 0, 'ANKI_IDS_MUST_BE_UNIQUE');
  helpers.equal(report.anki.unlocatable, 0, 'ANKI_IDS_MUST_BE_LOCATABLE');

  return {
    counts: report.counts,
    legacyRecords: report.legacyRecords,
    migrationReviewCount: report.migrationReviewCount
  };
});
