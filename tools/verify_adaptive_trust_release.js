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

// 1. SR gate (inline)
step('SR gate', () => {
  // Check key Foundation files exist and are syntactically correct
  var srDir = path.join(ROOT, 'utils', 'spaced-repetition');
  var required = ['constants.js','scheduler.js','schema.js','storage.js','summary.js','identity.js','index.js','review.js','adaptive.js','ledger.js'];
  required.forEach(function(f) {
    if (!fs.existsSync(path.join(srDir, f))) fail('missing sr/' + f);
  });
  // Verify identity audit constants
  var c = require(path.join(srDir, 'constants.js'));
  if (!c.STATES || !c.GRADES) fail('SR constants incomplete');
  // Check review.js has getPlayerRoute
  var rv = fs.readFileSync(path.join(srDir, 'review.js'), 'utf-8');
  if (rv.indexOf('getPlayerRoute') < 0) fail('review missing getPlayerRoute');
});

// 2. Adaptive module v2
step('Adaptive v2 exports', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'adaptive.js'), 'utf-8');
  if (c.indexOf('reasonCode') < 0) fail('missing reasonCode');
  if (c.indexOf('evidenceLevel') < 0) fail('missing evidenceLevel');
  if (c.indexOf("kind: 'resume_session'") < 0) fail('missing resume_session kind');
  if (c.indexOf("kind: 'all_done'") < 0) fail('missing all_done kind');
  if (c.indexOf("weak_focus_state") < 0) fail('missing weak_focus_state kind (current-state fallback)');
  if (c.indexOf('ledger_backed') < 0) fail('missing ledger_backed evidence level');
  if (c.indexOf('recentDifficultyCount') < 0) fail('missing recentDifficultyCount (ledger-backed)');
  if (c.indexOf('getLearningRecommendation') < 0) fail('missing getLearningRecommendation');
  // Must NOT use fake "recentAgainCount" based on single lastGrade
  if (c.indexOf('lastGrade') >= 0) fail('adaptive still uses lastGrade for recent history — must use ledger');
  if (c.indexOf('recentAgainCount') >= 0) fail('adaptive still uses recentAgainCount — renamed to recentDifficultyCount');
});

// 3. Ledger module
step('Ledger module', () => {
  var f = path.join(ROOT, 'utils', 'spaced-repetition', 'ledger.js');
  if (!fs.existsSync(f)) fail('ledger.js not found');
  var c = fs.readFileSync(f, 'utf-8');
  if (c.indexOf('recordGradeEvent') < 0) fail('missing recordGradeEvent');
  if (c.indexOf('countRecentDifficulties') < 0) fail('missing countRecentDifficulties');
  if (c.indexOf('getStreakDays') < 0) fail('missing getStreakDays');
  if (c.indexOf('localDayKey') < 0) fail('missing localDayKey');
  if (c.indexOf('dedupeKey') < 0) fail('missing dedupeKey');
  if (c.indexOf('MAX_EVENTS') < 0) fail('missing MAX_EVENTS cap');
  // Must NOT use toISOString for date keys
  if (c.indexOf('toISOString') >= 0) fail('ledger uses toISOString (UTC) — must use local date');
});

// 4. Index exports
step('Index exports', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'index.js'), 'utf-8');
  if (c.indexOf("ledger: require('./ledger')") < 0) fail('index missing ledger export');
});

// 5. Players wired to ledger
step('Players wired to ledger', () => {
  var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(function(d) { return d.startsWith('quiz-'); });
  var count = 0;
  dirs.forEach(function(d) {
    var p = path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js');
    if (!fs.existsSync(p)) return;
    var c = fs.readFileSync(p, 'utf-8');
    if (c.indexOf('recordGradeEvent') < 0) fail(d + ' player missing recordGradeEvent');
    count++;
  });
  if (count !== 7) fail('expected 7 players, found ' + count);
});

// 6. Home page wired to kind-based UI
step('Home page wired to kind', () => {
  var wxml = path.join(ROOT, 'pages', 'home', 'home.wxml');
  var c = fs.readFileSync(wxml, 'utf-8');
  if (c.indexOf("item.kind") < 0) fail('home.wxml still uses item.type instead of item.kind');
  if (c.indexOf("weak_focus_state") < 0) fail('home.wxml missing weak_focus_state kind');
  if (c.indexOf("adaptiveRec.sub") < 0 && c.indexOf("item.sub") < 0) fail('home.wxml uses subtitle instead of sub');
});

// 7. Syntax + P0 + decks
step('Syntax + P0 + decks', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_javascript_syntax.js')], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('syntax');
  var r2 = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_p0_release_dependency_closure.js')], { cwd: ROOT, timeout: 15000 });
  if (r2.status !== 0) fail('P0 closure');
});

step('Deck integrity', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_flashcard_deck_integrity.js'), '--json'], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('deck integrity');
  var d = JSON.parse(r.stdout.toString());
  if (!d.ok) fail('deck integrity: ok=false');
  if ((d.decks || []).length !== 26) fail('expected 26 decks');
});

// 8. Ebbinghaus contracts
step('Ebbinghaus contracts', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_ebbinghaus_review_contract.js')], { cwd: ROOT, timeout: 15000 });
  if (r.status !== 0) fail('ebbinghaus');
});

// Report
console.log('=== Adaptive Trust Release Gate ===');
results.forEach(r => console.log('  [' + r.status + '] ' + r.step));
console.log('Passed: ' + results.filter(r => r.status === 'PASS').length + '/' + results.length);
if (failures.length) { console.error('\nFAILURES:'); failures.forEach(f => console.error('  ' + f)); process.exit(1); }
console.log('ADAPTIVE_TRUST_GATE_PASS');
process.exit(0);
