#!/usr/bin/env node
'use strict';

/**
 * Adaptive Learning Release Gate.
 * Checks: SR gate, RC gate, learning gate, deck integrity,
 * adaptive module exports, home page integration, weak signals,
 * recommendation priority, session awareness.
 */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
var warnings = [];
var results = [];

function step(name, fn) {
  try { fn(); results.push({ step: name, status: 'PASS' }); }
  catch (e) { results.push({ step: name, status: 'FAIL', error: e.message }); failures.push(name + ': ' + e.message); }
}

function fail(msg) { throw new Error(msg); }
function warn(msg) { warnings.push(msg); }

// 1. Foundation integrity
step('SR gate', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'run_spaced_repetition_foundation_checks.js')], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('SR foundation gate failed: exit ' + r.status);
});

// 2. Deck integrity
step('Deck integrity', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_flashcard_deck_integrity.js'), '--json'], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('deck integrity failed');
  var d = JSON.parse(r.stdout.toString());
  if (!d.ok) fail('deck integrity: ok=false');
  var total = Array.isArray(d.decks) ? d.decks.length : 0;
  if (total !== 26) fail('expected 26 decks, got ' + total);
  var issueCount = Array.isArray(d.issues) ? d.issues.length : d.issues;
  if (issueCount !== 0) fail(issueCount + ' deck issues');
});

// 3. Adaptive module exports
step('Adaptive module', () => {
  var f = path.join(ROOT, 'utils', 'spaced-repetition', 'adaptive.js');
  if (!fs.existsSync(f)) fail('adaptive.js not found');
  var c = fs.readFileSync(f, 'utf-8');
  if (c.indexOf('getLearningRecommendation') < 0) fail('missing getLearningRecommendation export');
  if (c.indexOf('_getUnfinishedSession') < 0) fail('missing unfinished session detection');
  if (c.indexOf('_computeWeakSignals') < 0) fail('missing weak signal computation');
  if (c.indexOf('_buildPriority') < 0) fail('missing priority builder');
  if (c.indexOf('resume_session') < 0) fail('missing resume_session priority');
  if (c.indexOf('overdue_review') < 0) fail('missing overdue_review priority');
  if (c.indexOf('due_review') < 0) fail('missing due_review priority');
  if (c.indexOf('weak_focus') < 0) fail('missing weak_focus priority');
  if (c.indexOf('all_done') < 0) fail('missing all_done fallback');
});

// 4. Index exports adaptive
step('Index exports adaptive', () => {
  var f = path.join(ROOT, 'utils', 'spaced-repetition', 'index.js');
  var c = fs.readFileSync(f, 'utf-8');
  if (c.indexOf("adaptive: require('./adaptive')") < 0) fail('index.js missing adaptive export');
});

// 5. Home page integration
step('Home page integration', () => {
  var f = path.join(ROOT, 'pages', 'home', 'home.js');
  var c = fs.readFileSync(f, 'utf-8');
  if (c.indexOf('adaptiveRec') < 0) fail('home.js missing adaptiveRec data');
  if (c.indexOf('getLearningRecommendation') < 0) fail('home.js missing getLearningRecommendation call');
  if (c.indexOf('openWeakDeck') < 0) fail('home.js missing openWeakDeck handler');
  if (c.indexOf('startNewLearning') < 0) fail('home.js missing startNewLearning handler');

  var wxml = path.join(ROOT, 'pages', 'home', 'home.wxml');
  var wc = fs.readFileSync(wxml, 'utf-8');
  if (wc.indexOf('adaptiveRec') < 0) fail('home.wxml missing adaptiveRec binding');
  if (wc.indexOf('resume_session') < 0) fail('home.wxml missing resume_session UI');
  if (wc.indexOf('all_done') < 0) fail('home.wxml missing all_done UI');
});

// 6. Ebbinghaus contracts still pass
step('Ebbinghaus contracts', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_ebbinghaus_review_contract.js')], { cwd: ROOT, timeout: 15000 });
  if (r.status !== 0) fail('ebbinghaus contract failed');
  var r2 = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_review_queue_contract.js')], { cwd: ROOT, timeout: 15000 });
  if (r2.status !== 0) fail('review queue contract failed');
});

// 7. Syntax check
step('JavaScript syntax', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_javascript_syntax.js')], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) fail('syntax check failed');
});

// 8. P0 release closure
step('P0 release closure', () => {
  var r = cp.spawnSync('node', [path.join(ROOT, 'tools', 'check_p0_release_dependency_closure.js')], { cwd: ROOT, timeout: 15000 });
  if (r.status !== 0) fail('P0 closure failed');
});

// 9. No cross-package require in home
step('No cross-package require', () => {
  var f = path.join(ROOT, 'pages', 'home', 'home.js');
  var c = fs.readFileSync(f, 'utf-8');
  if (c.match(/require\(['"]\.\.\/\.\.\/packages\//)) fail('home.js has cross-package require');
});

// ── Report ───────────────────────────────────────────────────────────
console.log('=== Adaptive Learning Release Gate ===');
results.forEach(r => console.log('  [' + r.status + '] ' + r.step));
if (warnings.length) warnings.forEach(w => console.log('  [WARN] ' + w));
console.log('Passed: ' + results.filter(r => r.status === 'PASS').length + '/' + results.length);
if (failures.length) {
  console.error('\nFAILURES:');
  failures.forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log('ADAPTIVE_LEARNING_GATE_PASS');
process.exit(0);
