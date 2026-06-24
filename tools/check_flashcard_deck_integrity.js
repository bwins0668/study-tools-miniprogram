#!/usr/bin/env node
'use strict';
var path = require('path');
var fs = require('fs');
var PROJECT = path.resolve(__dirname, '..');
var JSON_MODE = process.argv.indexOf('--json') !== -1;
function log() { if (!JSON_MODE) console.log.apply(console, arguments); }

// --- normalizeCard (mirrors flashcard-player.js) ---
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();
}
function normalizeCard(raw) {
  if (!raw || !raw.id) return null;
  var qJa = stripHtml(raw.questionJa || '');
  var qZh = stripHtml(raw.questionZh || '');
  if (!qJa && !qZh) return null;
  var options = Array.isArray(raw.options) ? raw.options : [];
  if (options.length < 2) return null;
  var normalizedOptions = [], hasCorrect = false;
  for (var i = 0; i < options.length; i++) {
    var o = options[i];
    var oJa = stripHtml(o.textJa || o.text || '');
    var oZh = stripHtml(o.textZh || o.text || '');
    if (!oJa && !oZh) continue;
    var isCorrect = o.key === raw.answer || o.isCorrect === true;
    if (isCorrect) hasCorrect = true;
    normalizedOptions.push({ key: o.key || String.fromCharCode(65 + i), textJa: oJa, textZh: oZh, isCorrect: isCorrect });
  }
  if (!hasCorrect || normalizedOptions.length < 2) return null;
  return { id: 'fc_' + raw.id };
}
function countRenderable(questions) {
  if (!questions) return 0;
  var count = 0;
  for (var i = 0; i < questions.length; i++) {
    if (normalizeCard(questions[i])) count++;
  }
  return count;
}

// --- Setup ---
var subpackages = (JSON.parse(fs.readFileSync(path.join(PROJECT, 'app.json'), 'utf8')).subpackages || []).reduce(function(m, sp) { m[sp.name] = sp; return m; }, {});
var globalManifest = require(path.join(PROJECT, 'packages/quiz/data/flashcard-manifest.js'));
var EXAMS = ['itpass', 'sg'];
var issues = [];
var rows = [];
var totalRawExpected = 0, totalRawActual = 0, totalRenderableExpected = 0, totalRenderableActual = 0;

function loadLocal(root) {
  var mf = null, ld = null;
  try { mf = require(path.join(PROJECT, root, 'data/deck-manifest.js')); } catch(e) {}
  try { ld = require(path.join(PROJECT, root, 'data/loader.js')); } catch(e) {}
  return { manifest: mf, loader: ld };
}
function verifyPlayer(pkgName, pkgRoot) {
  var sp = subpackages[pkgName];
  if (!sp) return { ok: false, reason: 'SUBPACKAGE_NOT_REGISTERED' };
  var pages = (sp.pages || []).map(function(p) { return p.replace(/\\/g, '/'); });
  if (pages.indexOf('pages/flashcard-player/flashcard-player') === -1) return { ok: false, reason: 'PLAYER_PAGE_MISSING' };
  var base = path.join(PROJECT, pkgRoot, 'pages/flashcard-player/flashcard-player');
  var missing = ['.js','.wxml','.wxss','.json'].filter(function(e) { return !fs.existsSync(base + e); });
  if (missing.length > 0) return { ok: false, reason: 'PLAYER_FILE_MISSING: ' + missing.join(', ') };
  return { ok: true, playerRoute: '/' + pkgRoot + '/pages/flashcard-player/flashcard-player' };
}

log('=== Flashcard Deck Integrity Check (v2 — raw + renderable) ===');
log('');

EXAMS.forEach(function(exam) {
  var decks = globalManifest.getDecksForCourse(exam);
  log('--- ' + exam.toUpperCase() + ' (' + decks.length + ' decks) ---');
  decks.forEach(function(deck) {
    var deckId = exam + '/' + deck.yearId;
    var pkgRoot = deck.packageRoot || ('packages/' + deck.packageName);
    var playerCheck = verifyPlayer(deck.packageName, pkgRoot);
    var local = loadLocal(pkgRoot);
    var localDeck = local.manifest ? local.manifest.getDeckInfo(deckId) : null;
    var loader = local.loader;
    var rawQuestions = loader ? loader.getQuestionsByYear(exam, deck.yearId) : null;
    var rawActual = rawQuestions ? rawQuestions.length : 0;
    var renderableActual = countRenderable(rawQuestions);
    var rawExpected = localDeck ? localDeck.rawExpectedCount : (deck.count || 0);
    var renderableExpected = localDeck ? localDeck.renderableExpectedCount : rawExpected;
    var status = 'OK';
    if (!playerCheck.ok) { status = 'FAIL: ' + playerCheck.reason; issues.push({ deckId: deckId, reason: playerCheck.reason }); }
    else if (!local.manifest) { status = 'FAIL: LOCAL_MANIFEST_MISSING'; issues.push({ deckId: deckId, reason: 'LOCAL_MANIFEST_MISSING' }); }
    else if (!localDeck) { status = 'FAIL: DECK_ID_MISMATCH'; issues.push({ deckId: deckId, reason: 'DECK_ID_MISMATCH deckId=' + deckId }); }
    else {
      if (localDeck.rawExpectedCount !== deck.count) { status = 'FAIL: RAW_COUNT_MISMATCH (local=' + localDeck.rawExpectedCount + ' global=' + deck.count + ')'; issues.push({ deckId: deckId, reason: 'RAW_COUNT_MISMATCH' }); }
      if (localDeck.course !== exam) { status = 'FAIL: COURSE_MISMATCH'; issues.push({ deckId: deckId, reason: 'COURSE_MISMATCH' }); }
    }
    if (status === 'OK' && rawExpected > 0 && rawActual === 0) { status = 'FAIL: RAW_EXPECTED_GT_0_BUT_RAW_ACTUAL_0'; issues.push({ deckId: deckId, reason: 'rawExpected=' + rawExpected + ' rawActual=0' }); }
    if (status === 'OK' && rawActual !== rawExpected) { status = 'WARN: RAW_COUNT_MISMATCH (rawExpected=' + rawExpected + ' rawActual=' + rawActual + ')'; issues.push({ deckId: deckId, reason: 'RAW_COUNT_MISMATCH expected=' + rawExpected + ' actual=' + rawActual }); }
    if (status === 'OK' && renderableActual !== renderableExpected) { status = 'WARN: RENDERABLE_COUNT_MISMATCH (expected=' + renderableExpected + ' actual=' + renderableActual + ')'; issues.push({ deckId: deckId, reason: 'RENDERABLE_COUNT_MISMATCH expected=' + renderableExpected + ' actual=' + renderableActual }); }
    if (status === 'OK' && renderableActual === 0 && rawExpected > 0) { status = 'FAIL: RENDERABLE_ACTUAL_0'; issues.push({ deckId: deckId, reason: 'renderableActual=0 rawExpected=' + rawExpected }); }
    totalRawExpected += rawExpected; totalRawActual += rawActual; totalRenderableExpected += renderableExpected; totalRenderableActual += renderableActual;
    rows.push({ course: exam, deckId: deckId, yearLabel: deck.label, packageName: deck.packageName, playerRoute: playerCheck.ok ? playerCheck.playerRoute : 'N/A', localManifestFound: !!localDeck, rawExpected: rawExpected, rawActual: rawActual, renderableExpected: renderableExpected, renderableActual: renderableActual, status: status });
    log('  ' + deckId + ' | ' + deck.label + ' | ' + deck.packageName + ' | raw=' + rawExpected + '/' + rawActual + ' rend=' + renderableExpected + '/' + renderableActual + ' | ' + status);
  });
});

if (!JSON_MODE) {
  log('');
  log('=== Summary Table ===');
  log('course  deckId            yearLabel          pkg             rawExpected rawActual renderableExp renderableAct status');
  log('-'.repeat(130));
  rows.forEach(function(r) {
    log(
      (r.course || '').padEnd(8) +
      (r.deckId || '').padEnd(18) +
      (r.yearLabel || '').padEnd(18) +
      (r.packageName || '').padEnd(16) +
      String(r.rawExpected).padEnd(12) +
      String(r.rawActual).padEnd(10) +
      String(r.renderableExpected).padEnd(14) +
      String(r.renderableActual).padEnd(14) +
      r.status
    );
  });
  log('');
  log('=== Summary ===');
  log('Total decks: ' + rows.length);
  log('Total raw expected: ' + totalRawExpected + ', raw actual: ' + totalRawActual);
  log('Total renderable expected: ' + totalRenderableExpected + ', renderable actual: ' + totalRenderableActual);
  log('Issues found: ' + issues.length);
  if (issues.length > 0) { log(''); log('=== Issues ==='); issues.forEach(function(x) { log('  [' + x.deckId + '] ' + x.reason); }); }
}

if (JSON_MODE) {
  console.log(JSON.stringify({ ok: issues.length === 0, totalDecks: rows.length, totalRawExpected: totalRawExpected, totalRawActual: totalRawActual, totalRenderableExpected: totalRenderableExpected, totalRenderableActual: totalRenderableActual, issues: issues.length, issueDetails: issues, decks: rows }, null, 2));
}
process.exit(issues.length === 0 ? 0 : 1);
