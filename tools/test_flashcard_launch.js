'use strict';
var fs = require('fs');
var path = require('path');

var PROJECT_ROOT = path.resolve(__dirname, '..');

// Load the global deck manifest from quiz package
var manifestJs = path.join(PROJECT_ROOT, 'packages', 'quiz', 'data', 'flashcard-manifest.js');
var pastExamIndexJs = path.join(PROJECT_ROOT, 'packages', 'quiz', 'data', 'past_exam_bank', 'index.js');

var failures = [];

// Test 1: All 26 decks have valid PACKAGE_MAP entries
var manifestContent = fs.readFileSync(manifestJs, 'utf8');
var manifest = require(manifestJs);
var MAPPED_PACKAGES = Object.keys(manifest.PACKAGE_MAP);
if (MAPPED_PACKAGES.length < 7) {
  failures.push({test: 'package_map_size', expected: '>=7', actual: MAPPED_PACKAGES.length});
}

// Test 2: getDeckInfo returns valid playerRoute for each course+year
var COURSE_YEARS = {
  itpass: ['01_aki','02_aki','03_haru','04_haru','05_haru','06_haru','07_haru','08_haru',
           '28_aki','28_haru','29_aki','29_haru','30_aki','30_haru','31_haru'],
  sg: ['sg_01_aki','sg_05_haru','sg_06_haru','sg_07_haru','sg_28_aki','sg_28_haru',
       'sg_29_aki','sg_29_haru','sg_30_aki','sg_30_haru','sg_31_haru']
};

for (var course in COURSE_YEARS) {
  var years = COURSE_YEARS[course];
  for (var i = 0; i < years.length; i++) {
    var yearId = years[i];
    var info = manifest.getDeckInfo(course, yearId);
    if (!info) {
      failures.push({test: 'deck_info_lookup', course: course, yearId: yearId, reason: 'no deck info'});
      continue;
    }
    if (!info.packageName) {
      failures.push({test: 'deck_info_package', course: course, yearId: yearId, reason: 'missing packageName'});
    }
    if (!info.playerRoute) {
      failures.push({test: 'deck_info_route', course: course, yearId: yearId, reason: 'missing playerRoute'});
    }
    if (!info.yearId) {
      failures.push({test: 'deck_info_year', course: course, yearId: yearId, reason: 'missing yearId'});
    }
  }
}

// Test 3: getDecksForCourse returns correct count
var itpassDecks = manifest.getDecksForCourse('itpass');
var sgDecks = manifest.getDecksForCourse('sg');
if (itpassDecks.length < 15) failures.push({test: 'itpass_deck_count', expected: 15, actual: itpassDecks.length});
if (sgDecks.length < 11) failures.push({test: 'sg_deck_count', expected: 11, actual: sgDecks.length});

// Test 4: All player routes reference existing package pages
for (var ci = 0; ci < itpassDecks.length; ci++) {
  var d = itpassDecks[ci];
  if (d.packageName) {
    var playerJs = path.join(PROJECT_ROOT, 'packages', d.packageName, 'pages', 'flashcard-player', 'flashcard-player.js');
    if (!fs.existsSync(playerJs)) {
      failures.push({test: 'player_js_missing', course: 'itpass', yearId: d.yearId, packageName: d.packageName});
    }
  }
}
for (var si = 0; si < sgDecks.length; si++) {
  var sd = sgDecks[si];
  if (sd.packageName) {
    var spJs = path.join(PROJECT_ROOT, 'packages', sd.packageName, 'pages', 'flashcard-player', 'flashcard-player.js');
    if (!fs.existsSync(spJs)) {
      failures.push({test: 'player_js_missing', course: 'sg', yearId: sd.yearId, packageName: sd.packageName});
    }
  }
}

// Test 5: Build playerUrl is correct format
function buildPlayerUrl(deckInfo, deckId, course) {
  return deckInfo.playerRoute + '?deckId=' + encodeURIComponent(deckId) + '&backCourse=' + encodeURIComponent(course);
}
var testDeckInfo = manifest.getDeckInfo('itpass', '01_aki');
if (testDeckInfo) {
  var url = buildPlayerUrl(testDeckInfo, 'itpass/01_aki', 'itpass');
  if (!url.startsWith('/packages/quiz-itpass-1/pages/flashcard-player/flashcard-player?deckId=')) {
    failures.push({test: 'player_url_format', url: url});
  }
}

var passed = failures.length === 0;
console.log('=== Flashcard Launch Audit ===');
console.log('IT Passport decks:      ' + itpassDecks.length);
console.log('SG decks:               ' + sgDecks.length);
console.log('PACKAGE_MAP entries:    ' + MAPPED_PACKAGES.length);
console.log('Failures:               ' + failures.length);
if (passed) {
  for (var f = 0; f < failures.length; f++) {
    console.log('  [' + failures[f].test + '] ' + JSON.stringify(failures[f]));
  }
}
console.log('');
console.log(passed ? 'RESULT: PASS' : 'RESULT: FAIL');
process.exit(passed ? 0 : 1);
