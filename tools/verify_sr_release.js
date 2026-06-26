#!/usr/bin/env node
'use strict';
/**
 * verify:sr:release — One-command SR release gate.
 *
 * Runs every static and runtime gate relevant to spaced repetition.
 * Exits non-zero on any failure.
 */

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var ROOT = path.resolve(__dirname, '..');
var IGNORED_DIR = path.join(ROOT, 'tools', 'test-artifacts');
var REPORT_PATH = path.join(IGNORED_DIR, 'verify-sr-release-report.json');

// ── Reporter ──
var steps = [];
var startTime = Date.now();
var allPassed = true;

function step(name, fn) {
  var entry = { name: name, status: 'PENDING', detail: '' };
  steps.push(entry);
  process.stdout.write('\n  [' + (steps.length) + '/' + (totalStepCount) + '] ' + name + ' ... ');
  try {
    var result = fn();
    if (result === true || result === undefined || result === null) {
      entry.status = 'PASS';
      process.stdout.write('PASS\n');
    } else if (result === false) {
      entry.status = 'FAIL';
      allPassed = false;
      process.stdout.write('FAIL\n');
    } else {
      entry.status = result.status || 'PASS';
      entry.detail = result.detail || '';
      if (entry.status === 'FAIL') { allPassed = false; }
      process.stdout.write(entry.status + (entry.detail ? ' | ' + entry.detail : '') + '\n');
    }
  } catch (e) {
    entry.status = 'FAIL';
    entry.detail = e.message || String(e);
    allPassed = false;
    process.stdout.write('FAIL: ' + entry.detail + '\n');
  }
}

function run(cmd, args, opts) {
  opts = opts || {};
  var result = child_process.spawnSync(cmd, args || [], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf-8',
    timeout: opts.timeout || 120000,
    env: Object.assign({}, process.env, opts.env || {})
  });
  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
    error: result.error
  };
}

function verifyRun(cmd, args, opts) {
  var r = run(cmd, args, opts);
  if (r.error) throw new Error(cmd + ' error: ' + r.error.message);
  if (r.status !== 0) {
    var detail = (r.stderr || r.stdout || '').split('\n').slice(0, 5).join(' | ');
    throw new Error('exit=' + r.status + ' ' + detail);
  }
  return { status: 'PASS', detail: r.stdout.split('\n')[0] };
}

function npmRun(script, opts) {
  if (process.platform === 'win32') {
    return verifyRun(process.env.COMSPEC || 'cmd.exe', ['/c', 'npm', 'run', '--silent', script], opts);
  }
  return verifyRun('npm', ['run', '--silent', script], opts);
}

function nodeRun(script, opts) {
  return verifyRun('node', [script], opts);
}

// ── Actual steps ──
var stepsDef = [
  { name: 'PYTHONPATH pre-check', fn: function () {
    if (process.env.PYTHONPATH) {
      return { status: 'WARN', detail: 'PYTHONPATH=' + process.env.PYTHONPATH };
    }
    return { status: 'PASS', detail: 'clean' };
  }},
  { name: 'git diff --check', fn: function () {
    var r = run('git', ['diff', '--check'], { cwd: ROOT });
    if (r.status !== 0) throw new Error(r.stderr || r.stdout);
    return { status: 'PASS', detail: r.stdout.split('\n').filter(function(l){return l;}).length + ' warnings' };
  }},
  { name: 'SR spaced-foundation', fn: function () { return npmRun('test:spaced-foundation'); }},
  { name: 'SR ebbinghaus contract', fn: function () { return npmRun('test:ebbinghaus-review-contract'); }},
  { name: 'SR review queue contract', fn: function () { return npmRun('test:review-queue-contract'); }},
  { name: 'SR R2d phase E (Node)', fn: function () { return npmRun('test:r2d-phase-e'); }},
  { name: 'Minium syntax check', fn: function () { return npmRun('test:minium:syntax'); }},
  { name: 'P0 contract', fn: function () { return npmRun('test'); }},
  { name: 'Miniprogram checks', fn: function () { return npmRun('test:miniprogram-checks'); }},
  { name: 'Deck integrity (26 decks)', fn: function () { return npmRun('test:decks'); }},
  { name: 'Subpackage registry', fn: function () { return npmRun('test:registry'); }},
  { name: 'P0 release closure', fn: function () { return npmRun('test:p0-release-closure'); }}
];

var totalStepCount = stepsDef.length;

function writeReport() {
  var elapsed = Date.now() - startTime;
  var report = {
    status: allPassed ? 'PASS' : 'FAIL',
    startedAt: startTime,
    finishedAt: Date.now(),
    elapsedMs: elapsed,
    steps: steps,
    summary: { pass: 0, fail: 0, warn: 0 }
  };
  steps.forEach(function (s) {
    if (s.status === 'PASS') report.summary.pass++;
    else if (s.status === 'WARN') report.summary.warn++;
    else report.summary.fail++;
  });
  try {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');
  } catch (_) {}
  return report;
}

// ═══════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════
process.stdout.write('\n=== SR Release Gate ===\n');

stepsDef.forEach(function (s) {
  step(s.name, s.fn);
});

var report = writeReport();
var headline = steps.filter(function(s){return s.status!=='PASS';}).map(function(s){return s.name+'='+s.status;}).join(', ');

process.stdout.write('\n--- Summary ---\n');
process.stdout.write('  PASS: ' + report.summary.pass + '  FAIL: ' + report.summary.fail + '  WARN: ' + report.summary.warn + '\n');
process.stdout.write('  Status: ' + report.status + '\n');
process.stdout.write('  Elapsed: ' + (report.elapsedMs / 1000).toFixed(1) + 's\n');
process.stdout.write('  Report: ' + REPORT_PATH + '\n');
if (headline) process.stdout.write('  Non-passing: ' + headline + '\n');

process.exit(allPassed ? 0 : (report.summary.fail > 0 ? 1 : 0));
