'use strict';

var identity = require('./identity');

function createReviewLocator(memoryItem) {
  if (!memoryItem || typeof memoryItem !== 'object') return null;
  var parsed = identity.parseMemoryItemId(memoryItem.memoryItemId);
  if (!parsed || parsed.sourceType !== memoryItem.sourceType) return null;
  var ref = parsed.sourceRef;
  return {
    memoryItemId: parsed.memoryItemId,
    sourceType: parsed.sourceType,
    course: parsed.sourceType === 'exam' ? ref.course : null,
    deckId: parsed.sourceType === 'exam' ? ref.deckId : null,
    questionId: parsed.sourceType === 'exam' ? ref.questionId : null,
    from: 'spaced-review'
  };
}

function parseReviewLocator(options) {
  if (!options || options.from !== 'spaced-review') return null;
  var parsed = identity.parseMemoryItemId(options.memoryItemId);
  if (!parsed || parsed.sourceType !== options.sourceType) return null;
  if (parsed.sourceType === 'exam') {
    if (options.course !== parsed.sourceRef.course || options.deckId !== parsed.sourceRef.deckId || options.questionId !== parsed.sourceRef.questionId) return null;
  }
  return createReviewLocator({ memoryItemId: parsed.memoryItemId, sourceType: parsed.sourceType });
}

function resolveReviewTarget(locator) {
  var parsed = parseReviewLocator(locator);
  if (!parsed) return null;
  if (parsed.sourceType === 'term') return { target: 'glossary-term-detail', locator: parsed };
  if (parsed.sourceType === 'anki') return { target: 'anki-player', locator: parsed };
  if (parsed.sourceType === 'exam') return { target: 'exam-flashcard-player', locator: parsed };
  return null;
}

module.exports = {
  createReviewLocator: createReviewLocator,
  parseReviewLocator: parseReviewLocator,
  resolveReviewTarget: resolveReviewTarget
};
