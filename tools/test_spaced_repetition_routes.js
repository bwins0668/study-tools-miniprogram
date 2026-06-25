'use strict';

var helpers = require('./spaced_repetition_test_helpers');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var routes = require('../utils/spaced-repetition/routes');

helpers.run('test_spaced_repetition_routes', function () {
  var now = 1700000000000;
  var term = schema.createMemoryItem(identity.createTermIdentity('route-term'), now);
  var anki = schema.createMemoryItem(identity.createAnkiIdentity('route-anki'), now);
  var exam = schema.createMemoryItem(identity.createExamIdentity('itpass', 'deck-2025', 'q-7'), now);

  var termLocator = routes.createReviewLocator(term);
  var ankiLocator = routes.createReviewLocator(anki);
  var examLocator = routes.createReviewLocator(exam);
  helpers.equal(termLocator.from, 'spaced-review', 'TERM_LOCATOR_SOURCE');
  helpers.equal(examLocator.course, 'itpass', 'EXAM_LOCATOR_COURSE');
  helpers.equal(examLocator.deckId, 'deck-2025', 'EXAM_LOCATOR_DECK');
  helpers.equal(examLocator.questionId, 'q-7', 'EXAM_LOCATOR_QUESTION');
  helpers.equal(routes.resolveReviewTarget(termLocator).target, 'glossary-term-detail', 'TERM_TARGET');
  helpers.equal(routes.resolveReviewTarget(ankiLocator).target, 'anki-player', 'ANKI_TARGET');
  helpers.equal(routes.resolveReviewTarget(examLocator).target, 'exam-flashcard-player', 'EXAM_TARGET');

  var tamperedExam = JSON.parse(JSON.stringify(examLocator));
  tamperedExam.questionId = 'other-question';
  helpers.equal(routes.parseReviewLocator(tamperedExam), null, 'TAMPERED_EXAM_LOCATOR_REJECTED');
  helpers.equal(routes.parseReviewLocator({ from: 'other', memoryItemId: term.memoryItemId, sourceType: 'term' }), null, 'FOREIGN_ROUTE_REJECTED');
  helpers.equal(routes.createReviewLocator({ memoryItemId: 'invalid', sourceType: 'term' }), null, 'INVALID_ITEM_REJECTED');

  return { targets: [routes.resolveReviewTarget(termLocator).target, routes.resolveReviewTarget(ankiLocator).target, routes.resolveReviewTarget(examLocator).target] };
});
