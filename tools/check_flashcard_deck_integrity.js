#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var PROJECT = path.resolve(__dirname, '..');

var JSON_MODE = process.argv.indexOf('--json') !== -1;

function log() {
  if (!JSON_MODE) console.log.apply(console, arguments);
}

// Load global manifest
var appJsonPath = path.join(PROJECT, 'app.json');
var appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
var subpackages = appJson.subpackages || appJson.subPackages || [];

var subpackageMap = {};
for (var i = 0; i < subpackages.length; i++) {
  var sp = subpackages[i];
  subpackageMap[sp.name] = sp;
}

// Load global manifest
var globalManifestPath = path.join(PROJECT, 'packages/quiz/data/flashcard-manifest.js');
var globalManifest;
try {
  globalManifest = require(globalManifestPath);
} catch (e) {
  console.error('FAIL: cannot load global manifest:', e.message);
  process.exit(1);
}

// Load past exam index
var pastExamIndexPath = path.join(PROJECT, 'packages/quiz/data/past_exam_bank/index.js');
var pastExamIndex = require(pastExamIndexPath);

var EXAMS = ['itpass', 'sg'];
var issues = [];
var rows = [];
var totalExpected = 0;
var totalActual = 0;

function loadLocalManifest(packageRoot) {
  try {
    var mfPath = path.join(PROJECT, packageRoot, 'data/deck-manifest.js');
    return require(mfPath);
  } catch (e) {
    return null;
  }
}

function loadLocalLoader(packageRoot) {
  try {
    var loaderPath = path.join(PROJECT, packageRoot, 'data/loader.js');
    return require(loaderPath);
  } catch (e) {
    return null;
  }
}

function verifyPlayerPage(packageName, packageRoot) {
  var sp = subpackageMap[packageName];
  if (!sp) {
    return { ok: false, reason: 'SUBPACKAGE_NOT_REGISTERED' };
  }
  var pages = (sp.pages || []).map(function(p) { return p.replace(/\\/g, '/'); });
  var playerPage = 'pages/flashcard-player/flashcard-player';
  var hasPlayer = pages.indexOf(playerPage) !== -1;
  if (!hasPlayer) {
    return { ok: false, reason: 'PLAYER_PAGE_MISSING' };
  }
  // Check files exist
  var pageBase = path.join(PROJECT, packageRoot, playerPage);
  var exts = ['.js', '.wxml', '.wxss', '.json'];
  var missing = [];
  for (var i = 0; i < exts.length; i++) {
    if (!fs.existsSync(pageBase + exts[i])) {
      missing.push(playerPage + exts[i]);
    }
  }
  if (missing.length > 0) {
    return { ok: false, reason: 'PLAYER_FILE_MISSING: ' + missing.join(', ') };
  }
  return { ok: true, playerRoute: '/' + packageRoot + '/' + playerPage };
}

log('=== Flashcard Deck Integrity Check ===');
log('');

for (var e = 0; e < EXAMS.length; e++) {
  var exam = EXAMS[e];
  var decks = globalManifest.getDecksForCourse(exam);
  log('--- ' + exam.toUpperCase() + ' (' + decks.length + ' decks) ---');

  for (var d = 0; d < decks.length; d++) {
    var deck = decks[d];
    var deckId = exam + '/' + deck.yearId;

    var pkgRoot = deck.packageRoot || ('packages/' + deck.packageName);
  var playerCheck = verifyPlayerPage(deck.packageName, pkgRoot);
    var localManifest = loadLocalManifest(pkgRoot);
    var localDeck = localManifest ? localManifest.getDeckInfo(deckId) : null;

    // Load actual questions from local loader
    var loader = loadLocalLoader(pkgRoot);
    var actualQuestions = loader ? loader.getQuestionsByYear(exam, deck.yearId) : null;
    var actualCount = actualQuestions ? actualQuestions.length : 0;

    var localManifestFound = !!localDeck;
    var expectedCount = deck.count || 0;
    var status = 'OK';

    if (!playerCheck.ok) {
      status = 'FAIL: ' + playerCheck.reason;
      issues.push({ deckId: deckId, reason: playerCheck.reason });
    }
    if (!localManifest) {
      status = 'FAIL: LOCAL_MANIFEST_MISSING';
      issues.push({ deckId: deckId, reason: 'LOCAL_MANIFEST_MISSING' });
    } else if (!localDeck) {
      status = 'FAIL: DECK_ID_MISMATCH';
      issues.push({ deckId: deckId, reason: 'DECK_ID_MISMATCH: deckId=' + deckId + ' not found in local manifest' });
    } else {
      // Verify local manifest fields
      if (localDeck.deckId !== deckId) {
        status = 'FAIL: DECK_ID_MISMATCH (local=' + localDeck.deckId + ' expected=' + deckId + ')';
        issues.push({ deckId: deckId, reason: 'DECK_ID_MISMATCH local=' + localDeck.deckId });
      }
      if (localDeck.expectedCount !== expectedCount) {
        status = 'FAIL: COUNT_MISMATCH (local=' + localDeck.expectedCount + ' manifest=' + expectedCount + ')';
        issues.push({ deckId: deckId, reason: 'COUNT_MISMATCH' });
      }
      if (localDeck.course !== exam) {
        status = 'FAIL: COURSE_MISMATCH (local=' + localDeck.course + ' expected=' + exam + ')';
        issues.push({ deckId: deckId, reason: 'COURSE_MISMATCH' });
      }
    }

    if (status === 'OK' && expectedCount > 0 && actualCount === 0) {
      status = 'FAIL: EXPECTED_GT_0_BUT_ACTUAL_0';
      issues.push({ deckId: deckId, reason: 'expectedCount=' + expectedCount + ' actualCount=0' });
    }

    if (status === 'OK' && expectedCount > 0 && actualCount !== expectedCount) {
      status = 'WARN: COUNT_MISMATCH (expected=' + expectedCount + ' actual=' + actualCount + ')';
      issues.push({ deckId: deckId, reason: 'COUNT_MISMATCH expected=' + expectedCount + ' actual=' + actualCount });
    }

    totalExpected += expectedCount;
    totalActual += actualCount;

    rows.push({
      course: exam,
      deckId: deckId,
      yearLabel: deck.label,
      packageName: deck.packageName,
      playerRoute: playerCheck.ok ? playerCheck.playerRoute : 'N/A',
      localManifestFound: localManifestFound,
      expectedCount: expectedCount,
      actualCount: actualCount,
      status: status
    });

    log('  ' + deckId + ' | ' + deck.label + ' | pkg=' + deck.packageName + ' | expected=' + expectedCount + ' actual=' + actualCount + ' | ' + status);
  }
}

if (!JSON_MODE) {
  log('');
  log('=== Summary Table ===');
  log('course'.padEnd(8) + ' deckId'.padEnd(18) + ' yearLabel'.padEnd(18) + ' pkg'.padEnd(14) + ' playerRoute'.padEnd(50) + ' localManifest'.padEnd(15) + ' expected'.padEnd(10) + ' actual'.padEnd(8) + ' status');
  log('-'.repeat(145));
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    log(
      (row.course || '').padEnd(8) +
      (row.deckId || '').padEnd(18) +
      (row.yearLabel || '').padEnd(18) +
      (row.packageName || '').padEnd(14) +
      (row.playerRoute || '').padEnd(50) +
      (row.localManifestFound ? 'FOUND'.padEnd(15) : 'MISSING'.padEnd(15)) +
      String(row.expectedCount).padEnd(10) +
      String(row.actualCount).padEnd(8) +
      row.status
    );
  }

  log('');
  log('=== Summary ===');
  log('Total decks: ' + rows.length);
  log('Total expected questions: ' + totalExpected);
  log('Total actual questions: ' + totalActual);
  log('Issues found: ' + issues.length);

  if (issues.length > 0) {
    log('');
    log('=== Issues ===');
    for (var x = 0; x < issues.length; x++) {
      log('  [' + issues[x].deckId + '] ' + issues[x].reason);
    }
  }
}

if (JSON_MODE) {
  console.log(JSON.stringify({
    ok: issues.length === 0,
    totalDecks: rows.length,
    totalExpected: totalExpected,
    totalActual: totalActual,
    issues: issues.length,
    issueDetails: issues,
    decks: rows
  }, null, 2));
}

process.exit(issues.length === 0 ? 0 : 1);
