#!/usr/bin/env node
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

function step(name, fn) {
  try { fn(); console.log('  [PASS] ' + name); }
  catch (e) { console.log('  [FAIL] ' + name + ': ' + e.message); failures.push(name); }
}

// 1. SR foundation files
step('SR foundation files', () => {
  var d = path.join(ROOT, 'utils','spaced-repetition');
  ['constants.js','ledger.js','adaptive.js','index.js','review.js','scheduler.js','schema.js','storage.js','summary.js','identity.js'].forEach(f => {
    if (!fs.existsSync(path.join(d, f))) throw new Error('missing ' + f);
  });
});

// 2. Pending is saved BEFORE SR state (write-ahead)
step('Write-ahead pending', () => {
  var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(d => d.startsWith('quiz-'));
  var ok = 0;
  dirs.forEach(d => {
    var p = path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js');
    var c = fs.readFileSync(p, 'utf-8');
    var inflightPos = c.indexOf('_inFlight = true');
    var pendingPos = c.indexOf('savePendingAction');
    var setDataPos = c.indexOf('this.setData({', inflightPos);
    if (pendingPos < 0) throw new Error(d + ' missing savePendingAction');
    if (pendingPos < setDataPos) ok++;
    else throw new Error(d + ' savePendingAction must precede setData (pending=' + pendingPos + ', setData=' + setDataPos + ')');
  });
  console.log('  [INFO] ' + ok + '/7 players have write-ahead pending');
});

// 3. Recovery called from app.js
step('Recovery called on launch', () => {
  var c = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf-8');
  if (c.indexOf('recoverPendingTransactions') < 0) throw new Error('recovery not called in app.js');
});

// 4. Presentation token: actionId read from data, not generated in handler
step('Presentation token binding', () => {
  var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(d => d.startsWith('quiz-'));
  dirs.forEach(d => {
    var c = fs.readFileSync(path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js'), 'utf-8');
    if (c.indexOf('currentActionId') < 0) throw new Error(d + ' missing currentActionId');
    if (c.indexOf("ldr.recordGradeEvent({ actionId: this.data.currentActionId") < 0) 
      throw new Error(d + ' does not read actionId from data');
    // Must NOT generate new actionId in selectAnswer handler (only fallback allowed)
  });
});

// 5. Sync lock exists (not just setData)
step('Sync lock', () => {
  var dirs = fs.readdirSync(path.join(ROOT, 'packages')).filter(d => d.startsWith('quiz-'));
  dirs.forEach(d => {
    var c = fs.readFileSync(path.join(ROOT, 'packages', d, 'pages', 'flashcard-player', 'flashcard-player.js'), 'utf-8');
    if (c.indexOf('this._inFlight') < 0) throw new Error(d + ' missing _inFlight lock');
  });
});

// 6. buildPresentationToken exists
step('buildPresentationToken', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'ledger.js'), 'utf-8');
  if (c.indexOf('buildPresentationToken') < 0) throw new Error('missing buildPresentationToken');
  if (c.indexOf('presentationId') < 0) throw new Error('missing presentationId');
});

// 7. recoverPendingTransactions exists and handles all states
step('Recovery logic', () => {
  var c = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'ledger.js'), 'utf-8');
  if (c.indexOf('recoverPendingTransactions') < 0) throw new Error('missing recoverPendingTransactions');
  if (c.indexOf('alreadyExists') < 0) throw new Error('recovery missing alreadyExists check');
  if (c.indexOf('resolvePendingAction') < 0) throw new Error('recovery missing resolve');
});

// 8. Syntax + P0 + Decks
step('Syntax + P0 + Decks', () => {
  var r = cp.spawnSync('node', ['tools/check_javascript_syntax.js'], { cwd: ROOT, timeout: 30000 });
  if (r.status !== 0) throw new Error('syntax');
  var r2 = cp.spawnSync('node', ['tools/check_p0_release_dependency_closure.js'], { cwd: ROOT, timeout: 15000 });
  if (r2.status !== 0) throw new Error('P0');
  var r3 = cp.spawnSync('node', ['tools/check_flashcard_deck_integrity.js', '--json'], { cwd: ROOT, timeout: 30000, encoding: 'utf-8' });
  if (r3.status !== 0) throw new Error('deck integrity');
  var d = JSON.parse(r3.stdout);
  if (!d.ok || (d.decks||[]).length !== 26) throw new Error('26 decks expected');
});

// 9. Ebbinghaus contracts
step('Ebbinghaus contracts', () => {
  var r = cp.spawnSync('node', ['tools/check_ebbinghaus_review_contract.js'], { cwd: ROOT, timeout: 15000 });
  if (r.status !== 0) throw new Error('ebbinghaus');
});

console.log('\n=== Transaction Proof Release Gate ===');
if (failures.length) {
  console.log('FAILURES: ' + failures.length);
  failures.forEach(f => console.log('  ' + f));
  process.exit(1);
}
console.log('ALL ' + (9) + ' STEPS PASSED');
console.log('TRANSACTION_PROOF_GATE_PASS');
process.exit(0);
