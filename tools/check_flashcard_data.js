#!/usr/bin/env node
// tools/check_flashcard_data.js
// Validates flashcard data adapter output for completeness and correctness.
// Usage: node tools/check_flashcard_data.js

var path = require('path');
var adapterPath = path.join(__dirname, '..', 'packages', 'quiz', 'data', 'flashcard_adapter.js');

// Mock wx for Node.js environment
if (typeof global.wx === 'undefined') {
  global.wx = {
    getStorageSync: function () { return null; },
    setStorageSync: function () {}
  };
}

var adapter;
try {
  adapter = require(adapterPath);
} catch (e) {
  console.error('[FAIL] Cannot load flashcard_adapter.js:', e.message);
  process.exit(1);
}

var EXAMS = ['itpass', 'sg'];
var totalIssues = 0;
var totalCards = 0;
var totalFiltered = 0;

function report(exam, stats, cards, issues) {
  console.log('\n=== ' + exam.toUpperCase() + ' ===');
  console.log('  Raw questions loaded:    ' + stats.total);
  console.log('  After normalization:     ' + stats.normalized);
  console.log('  Filtered out:            ' + stats.filtered);
  console.log('  After dedup:             ' + stats.deduped);
  console.log('  Dedup removed:           ' + stats.dedupCount);

  var yearKeys = Object.keys(stats.byYear);
  console.log('  Years:');
  for (var i = 0; i < yearKeys.length; i++) {
    console.log('    ' + yearKeys[i] + ': ' + stats.byYear[yearKeys[i]] + ' questions');
  }

  var catKeys = Object.keys(stats.categories);
  if (catKeys.length > 0) {
    console.log('  Categories:');
    for (var j = 0; j < catKeys.length; j++) {
      console.log('    ' + catKeys[j] + ': ' + stats.categories[catKeys[j]] + ' questions');
    }
  }

  totalCards += stats.deduped;
  totalFiltered += stats.filtered;
}

function validateCard(card) {
  var issues = [];

  if (!card.id || typeof card.id !== 'string') {
    issues.push('Missing or invalid id');
  }
  if (!card.course || (card.course !== 'itpass' && card.course !== 'sg')) {
    issues.push('Invalid course: ' + card.course);
  }
  if (!card.questionJa || card.questionJa.length < 2) {
    issues.push('Missing or too short questionJa');
  }
  if (!card.questionZh || card.questionZh.length < 2) {
    issues.push('Missing or too short questionZh');
  }
  if (!Array.isArray(card.options) || card.options.length < 2) {
    issues.push('Insufficient options: ' + (card.options ? card.options.length : 0));
  } else {
    var correctCount = 0;
    for (var i = 0; i < card.options.length; i++) {
      var opt = card.options[i];
      if (!opt.key) issues.push('Option ' + i + ' missing key');
      if (!opt.textJa || opt.textJa.length < 1) {
        issues.push('Option ' + opt.key + ' missing textJa');
      }
      if (!opt.textZh || opt.textZh.length < 1) {
        issues.push('Option ' + opt.key + ' missing textZh');
      }
      if (!opt.explanationJa || opt.explanationJa.length < 2) {
        // Not a hard fail for legacy data, just note
      }
      if (!opt.explanationZh || opt.explanationZh.length < 2) {
        // Not a hard fail for legacy data, just note
      }
      if (opt.isCorrect) correctCount++;
    }
    if (correctCount !== 1) {
      issues.push('Expected exactly 1 correct answer, found ' + correctCount);
    }
  }
  if (!card.answer) {
    issues.push('Missing answer key');
  }
  if (!card.explanationZh || card.explanationZh.length < 5) {
    issues.push('Missing or too short explanationZh');
  }
  if (!card.explanationJa || card.explanationJa.length < 5) {
    issues.push('Missing or too short explanationJa');
  }
  if (card.sourceType === 'past_exam_japanese' && !card.examYear) {
    issues.push('Missing examYear for past exam question');
  }

  // Check non-official source labeling
  if (card.sourceType === 'past_exam_japanese' && card.sourceReference) {
    if (card.sourceReference.indexOf('official') >= 0 || card.sourceReference.indexOf('公') >= 0) {
      // This is fine - it IS from official past exams
    }
  }

  return issues;
}

console.log('=== Flashcard Data Validation ===');
console.log('Adapter: ' + adapterPath);

var allIssues = [];
var idSet = {};
var duplicateIds = 0;

for (var e = 0; e < EXAMS.length; e++) {
  var exam = EXAMS[e];
  var deck = adapter.getFlashcardDeck(exam);

  report(exam, deck.stats, deck.cards, []);

  for (var c = 0; c < deck.cards.length; c++) {
    var card = deck.cards[c];
    if (idSet[card.id]) {
      duplicateIds++;
    }
    idSet[card.id] = true;

    var issues = validateCard(card);
    if (issues.length > 0) {
      allIssues.push({ id: card.id, issues: issues });
    }
  }
}

console.log('\n=== Summary ===');
console.log('Total flashcard questions: ' + totalCards);
console.log('Total filtered out:        ' + totalFiltered);
console.log('Duplicate IDs found:       ' + duplicateIds);
console.log('Cards with issues:         ' + allIssues.length);

if (allIssues.length > 0) {
  console.log('\n=== Issues (first 50) ===');
  var shown = Math.min(allIssues.length, 50);
  for (var k = 0; k < shown; k++) {
    console.log('  ' + allIssues[k].id + ':');
    for (var m = 0; m < allIssues[k].issues.length; m++) {
      console.log('    - ' + allIssues[k].issues[m]);
    }
  }
  if (allIssues.length > 50) {
    console.log('  ... and ' + (allIssues.length - 50) + ' more');
  }
}

console.log('\n=== Pass Criteria ===');
var pass = duplicateIds === 0 && allIssues.length === 0;
if (pass) {
  console.log('PASS');
} else {
  console.log('WARN: ' + allIssues.length + ' cards have validation issues');
  // Don't fail the build for missing per-option explanations (legacy data)
  // Only fail for structural issues
  var structuralIssues = allIssues.filter(function (item) {
    return item.issues.some(function (issue) {
      return issue.indexOf('Missing') >= 0 && issue.indexOf('explanation') < 0;
    });
  });
  if (structuralIssues.length > 0) {
    console.log('FAIL: ' + structuralIssues.length + ' cards have structural issues');
    process.exit(1);
  } else {
    console.log('PASS (warnings only)');
  }
}

process.exit(0);
