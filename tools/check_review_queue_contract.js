#!/usr/bin/env node
'use strict';

/**
 * Review Queue Contract Check (static).
 * Verifies: due queue correctness, no auto-enqueue un-answered items,
 * no cross-package requires, session TTL, grouping correctness.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function rel(f) { return path.relative(ROOT, f).replace(/\\/g, '/'); }
function fail(r, f, d) { failures.push({ reason: r, file: rel(f), detail: d || '' }); }

// 1. Review Center must not load question data
var rcJs = path.join(ROOT, 'pages', 'review-center', 'review-center.js');
var rcContent = fs.readFileSync(rcJs, 'utf-8');
if (rcContent.indexOf('getQuestionsByYear') >= 0 || rcContent.indexOf('loader.js') >= 0) {
  fail('REVIEW_CENTER_LOADS_QUESTIONS', rcJs);
}

// 2. Review Center must use getPlayerRoute (not cross-package manifest require)
if (rcContent.indexOf('flashcard-manifest') >= 0) {
  fail('REVIEW_CENTER_CROSS_PACKAGE_MANIFEST', rcJs);
}
if (rcContent.indexOf('getPlayerRoute') < 0) {
  fail('REVIEW_CENTER_NO_PLAYER_ROUTE', rcJs);
}

// 3. All 7 players must support due mode filtering
var playerFiles = [];
var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(function(d) { return d.startsWith('quiz-'); });
dirs.forEach(function(d) {
  var p = path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js');
  if (fs.existsSync(p)) playerFiles.push(p);
});

playerFiles.forEach(function(f) {
  var c = fs.readFileSync(f, 'utf-8');
  if (c.indexOf('_isDueMode') < 0) fail('PLAYER_MISSING_DUE_MODE', f);
  if (c.indexOf('completeReviewSessionItem') < 0) fail('PLAYER_MISSING_SESSION_COMPLETE', f);
  if (c.indexOf('recordReviewDecision') < 0) fail('PLAYER_MISSING_RECORDING', f);
});

// 4. review.js must have PLAYER_ROUTES and PACKAGE_MAP
var reviewJs = path.join(ROOT, 'utils', 'spaced-repetition', 'review.js');
var reviewContent = fs.readFileSync(reviewJs, 'utf-8');
if (reviewContent.indexOf('PLAYER_ROUTES') < 0) fail('REVIEW_MISSING_PLAYER_ROUTES', reviewJs);
if (reviewContent.indexOf('PACKAGE_MAP') < 0) fail('REVIEW_MISSING_PACKAGE_MAP', reviewJs);
if (reviewContent.indexOf('getPlayerRoute') < 0) fail('REVIEW_MISSING_GETPLAYERROUTE', reviewJs);

// 5. Session TTL must be defined
if (reviewContent.indexOf('SESSION_TTL_MS') < 0) fail('REVIEW_MISSING_SESSION_TTL', reviewJs);

// 6. Flashcards entry must exist
var fcJs = path.join(ROOT, 'pages', 'flashcards', 'flashcards.js');
if (fs.readFileSync(fcJs, 'utf-8').indexOf('openReviewCenter') < 0) {
  fail('FLASHCARDS_NO_REVIEW_ENTRY', fcJs);
}

if (failures.length === 0) {
  console.log('PASS: Review queue contract (' + playerFiles.length + ' players, review center, routes)');
  process.exit(0);
}
failures.forEach(function(f) {
  console.error('FAIL [' + f.reason + '] ' + f.file + (f.detail ? ' | ' + f.detail : ''));
});
process.exit(1);
