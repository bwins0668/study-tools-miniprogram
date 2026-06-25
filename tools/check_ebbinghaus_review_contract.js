#!/usr/bin/env node
'use strict';

/**
 * Ebbinghaus Review Contract Check (static, no runtime).
 * Verifies all flashcard players have review recording wired,
 * Review Center doesn't load question bodies, no cross-package requires.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function rel(f) { return path.relative(ROOT, f).replace(/\\/g, '/'); }

function fail(reason, file, detail) {
  failures.push({ reason: reason, file: rel(file), detail: detail || '' });
}

// 1. All 7 local players must contain recordReviewDecision
var playerFiles = [];
var pkgDirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(function(d) { return d.startsWith('quiz-'); });
pkgDirs.forEach(function(d) {
  var pp = path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js');
  if (fs.existsSync(pp)) playerFiles.push(pp);
});

if (playerFiles.length !== 7) {
  fail('EXPECTED_7_PLAYERS', ROOT, 'found ' + playerFiles.length);
}

playerFiles.forEach(function(f) {
  var content = fs.readFileSync(f, 'utf-8');
  if (content.indexOf('recordReviewDecision') < 0) {
    fail('MISSING_REVIEW_RECORDING', f, 'selectAnswer must call recordReviewDecision');
  }
  // Cross-package require check
  if (content.match(/require\(['"]\.\.\/\.\.\/\.\.\/packages\//)) {
    fail('CROSS_PACKAGE_REQUIRE', f, 'player must not require other subpackage files');
  }
});

// 2. Review Center must exist
var rcJs = path.join(ROOT, 'pages', 'review-center', 'review-center.js');
if (!fs.existsSync(rcJs)) {
  fail('MISSING_REVIEW_CENTER', rcJs, 'page not found');
} else {
  var rcContent = fs.readFileSync(rcJs, 'utf-8');
  // Must NOT load question bodies
  if (rcContent.indexOf('loader.js') >= 0 || rcContent.indexOf('loadQuestions') >= 0) {
    fail('REVIEW_CENTER_LOADS_QUESTIONS', rcJs, 'Review Center must not load question bodies');
  }
  // Must use spaced-repetition
  if (rcContent.indexOf('spaced-repetition') < 0) {
    fail('REVIEW_CENTER_NO_SR', rcJs, 'Review Center must use spaced-repetition module');
  }
}

// 3. app.json must register review-center
var appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf-8'));
if (appJson.pages.indexOf('pages/review-center/review-center') < 0) {
  fail('REVIEW_CENTER_NOT_REGISTERED', 'app.json', 'page not in pages array');
}

// 4. Flashcards center must reference review
var fcJs = path.join(ROOT, 'pages', 'flashcards', 'flashcards.js');
var fcContent = fs.readFileSync(fcJs, 'utf-8');
if (fcContent.indexOf('openReviewCenter') < 0) {
  fail('FLASHCARDS_NO_REVIEW_ENTRY', fcJs, 'flashcards page missing review entry handler');
}

// 5. Foundation constants check
var constantsFile = path.join(ROOT, 'utils', 'spaced-repetition', 'constants.js');
var constContent = fs.readFileSync(constantsFile, 'utf-8');
if (constContent.indexOf('REVIEW_INTERVAL_DAYS') < 0) {
  fail('MISSING_REVIEW_INTERVALS', constantsFile);
}

// Summary
if (failures.length === 0) {
  console.log('PASS: Ebbinghaus review contract check (' + playerFiles.length + ' players, review center, flashcards entry)');
  process.exit(0);
} else {
  failures.forEach(function(f) {
    console.error('FAIL [' + f.reason + '] ' + f.file + (f.detail ? ' | ' + f.detail : ''));
  });
  console.error(failures.length + ' contract violation(s)');
  process.exit(1);
}
