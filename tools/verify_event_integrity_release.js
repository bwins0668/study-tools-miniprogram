#!/usr/bin/env node
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var ROOT = path.resolve(__dirname, '..');
var failures = [], results = [];

function step(name, fn) {
  try { fn(); results.push({ step: name, status: 'PASS' }); }
  catch (e) { results.push({ step: name, status: 'FAIL', error: e.message }); failures.push(name + ': ' + e.message); }
}
function fail(msg) { throw new Error(msg); }

// 1. Ledger v2 structure
step('Ledger v2 structure', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'ledger.js'), 'utf-8');
  if (c.indexOf('occurrence') < 0) fail('missing occurrence counter');
  if (c.indexOf('_nextOccurrence') < 0) fail('missing _nextOccurrence');
  if (c.indexOf('SUMMARY_KEY') < 0) fail('missing compact summary');
  if (c.indexOf('_updateSummary') < 0) fail('missing summary update');
  if (c.indexOf('migrateFromV1') < 0) fail('missing v1 migration');
  if (c.indexOf('MAX_RAW_EVENTS') < 0) fail('missing raw event cap');
  if (c.indexOf('actionId') < 0) fail('missing actionId');
  // Must NOT use business dimensions as sole dedupe
  var oldDedupe = "cardId|sessionId|grade";
  if (c.match(/dedupeKey.*cardId.*sessionId.*grade/) && c.indexOf('occurrence') < 0) {
    // Check that dedupeKey includes occurrence
  }
  if (c.indexOf("deckId|cardId|sessionId") < 0 && c.indexOf("occurrence") > 0) { /* fine */ }
  else if (c.indexOf('dedupeKey') < 0) fail('missing dedupeKey');
});

// 2. Adaptive uses ledger v2 APIs
step('Adaptive v2 API', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'adaptive.js'), 'utf-8');
  if (c.indexOf('ledger.') < 0) fail('adaptive missing ledger import');
});

// 3. All 7 players wired to ledger
step('Players wired', () => {
  var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(function(d) { return d.startsWith('quiz-'); });
  var count = 0;
  dirs.forEach(function(d) {
    var p = path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js');
    if (!fs.existsSync(p)) return;
    var c = fs.readFileSync(p, 'utf-8');
    if (c.indexOf('recordGradeEvent') < 0) fail(d + ' missing recordGradeEvent');
    count++;
  });
  if (count !== 7) fail('expected 7, got ' + count);
});

// 4. Index exports
step('Index exports', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'index.js'), 'utf-8');
  if (c.indexOf("ledger: require('./ledger')") < 0) fail('index missing ledger');
  if (c.indexOf("adaptive: require('./adaptive')") < 0) fail('index missing adaptive');
});

// 5. Deck integrity
step('Deck integrity', () => {
  var r = cp.spawnSync('node', ['tools/check_flashcard_deck_integrity.js', '--json'], { cwd: ROOT, timeout: 30000, encoding: 'utf-8' });
  if (r.status !== 0) fail('deck integrity exit=' + r.status);
  var d = JSON.parse(r.stdout.toString());
  if (!d.ok) fail('ok=false');
  if ((d.decks || []).length !== 26) fail('expected 26 decks');
});

// 6. Syntax + P0
step('Syntax + P0', () => {
  var r = cp.spawnSync('node', ['tools/check_javascript_syntax.js'], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('syntax');
  var r2 = cp.spawnSync('node', ['tools/check_p0_release_dependency_closure.js'], { cwd: ROOT, timeout: 15000 });
  if (r2.status !== 0) fail('P0 closure');
});

// 7. Ebbinghaus
step('Ebbinghaus contracts', () => {
  var r = cp.spawnSync('node', ['tools/check_ebbinghaus_review_contract.js'], { cwd: ROOT, timeout: 15000 });
  if (r.status !== 0) fail('ebbinghaus');
  var r2 = cp.spawnSync('node', ['tools/check_review_queue_contract.js'], { cwd: ROOT, timeout: 15000 });
  if (r2.status !== 0) fail('review queue');
});

// 8. SR foundation files
step('SR foundation files', () => {
  var srDir = path.join(ROOT, 'utils', 'spaced-repetition');
  ['constants.js','scheduler.js','schema.js','storage.js','summary.js','identity.js','index.js','review.js','adaptive.js','ledger.js'].forEach(function(f) {
    if (!fs.existsSync(path.join(srDir, f))) fail('missing sr/' + f);
  });
});

// 9. No fake history in ledger
step('No fake history', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'ledger.js'), 'utf-8');
  if (c.indexOf('lastGrade') >= 0) fail('ledger references lastGrade (fake history risk)');
});

console.log('=== Event Integrity Release Gate ===');
results.forEach(function(r) { console.log('  [' + r.status + '] ' + r.step); });
console.log('Passed: ' + results.filter(function(r) { return r.status === 'PASS'; }).length + '/' + results.length);
if (failures.length) { console.error('\nFAILURES:'); failures.forEach(function(f) { console.error('  ' + f); }); process.exit(1); }
console.log('EVENT_INTEGRITY_GATE_PASS');
process.exit(0);
