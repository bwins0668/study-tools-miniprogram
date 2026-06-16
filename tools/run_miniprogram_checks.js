#!/usr/bin/env node
/**
 * run_miniprogram_checks.js — One-command gate for all miniprogram maintenance checks.
 *
 * Runs in sequence:
 *   [1/4] Smoke test            (node tools/miniprogram_smoke_test.js)
 *   [2/4] Content compliance    (node tools/check_content_compliance.js)
 *   [3/4] JS syntax check       (node --check on all project .js files)
 *   [4/4] WXSS escaped newline  (scan for literal backslash+n in .wxss files)
 *
 * Exit code: 0 if all pass, 1 if any step fails.
 * No external dependencies.
 */

'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

var JSON_MODE = process.argv.indexOf('--json') !== -1;

// --- Helpers ---

function log() {
  if (!JSON_MODE) {
    console.log.apply(console, arguments);
  }
}

function runStep(index, total, title, cmd, args, opts) {
  var label = '[' + index + '/' + total + '] ' + title;
  log('\n' + label);
  log('-'.repeat(40));
  var start = Date.now();
  var execOpts = Object.assign({ stdio: JSON_MODE ? 'pipe' : 'inherit' }, opts || {});
  try {
    child_process.execFileSync(cmd, args, execOpts);
  } catch (e) {
    var elapsed = Date.now() - start;
    log(label + ' ... FAIL (' + elapsed + ' ms)');
    return { pass: false, title: title, elapsed: elapsed, command: cmd + ' ' + args.join(' ') };
  }
  var elapsed2 = Date.now() - start;
  log(label + ' ... PASS (' + elapsed2 + ' ms)');
  return { pass: true, title: title, elapsed: elapsed2, command: cmd + ' ' + args.join(' ') };
}

// --- [3/4] JS syntax check (inline, same logic as the one-liner) ---

function checkJsSyntax() {
  log('\n[3/4] JS syntax check');
  log('-'.repeat(40));
  var start = Date.now();

  var SKIP_DIRS = ['node_modules', '.git', '.workbuddy'];
  var files = [];

  function walk(d) {
    try {
      var entries = fs.readdirSync(d);
    } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i];
      var full = path.join(d, name);
      try {
        var stat = fs.statSync(full);
      } catch (e) { continue; }
      if (stat.isDirectory()) {
        if (SKIP_DIRS.indexOf(name) === -1) walk(full);
      } else if (stat.isFile() && name.endsWith('.js')) {
        files.push(full);
      }
    }
  }

  walk('.');

  var failed = [];
  for (var j = 0; j < files.length; j++) {
    try {
      child_process.execFileSync('node', ['--check', files[j]], { stdio: 'pipe' });
    } catch (e) {
      log('  SYNTAX ERROR: ' + files[j]);
      failed.push(files[j]);
    }
  }

  var elapsed = Date.now() - start;
  if (failed.length > 0) {
    log('[3/4] JS syntax check ... FAIL (' + elapsed + ' ms)');
    log('JS syntax FAILED: ' + failed.length + ' file(s)');
    return { pass: false, title: 'JS syntax', elapsed: elapsed, command: 'node --check (inline)' };
  }

  log('[3/4] JS syntax check ... PASS (' + elapsed + ' ms)');
  log('JS syntax OK: ' + files.length + ' file(s)');
  return { pass: true, title: 'JS syntax', elapsed: elapsed, command: 'node --check (inline)' };
}

// --- [4/4] WXSS escaped newline guard (inline) ---

function checkWxssEscapedNewline() {
  log('\n[4/4] WXSS escaped newline guard');
  log('-'.repeat(40));
  var start = Date.now();

  var SKIP_DIRS = ['node_modules', '.git', '.workbuddy'];
  var target = String.fromCharCode(92, 110); // literal backslash + n
  var badFiles = [];

  function walk(d) {
    try {
      var entries = fs.readdirSync(d);
    } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i];
      var full = path.join(d, name);
      try {
        var stat = fs.statSync(full);
      } catch (e) { continue; }
      if (stat.isDirectory()) {
        if (SKIP_DIRS.indexOf(name) === -1) walk(full);
      } else if (stat.isFile() && name.endsWith('.wxss')) {
        var txt = fs.readFileSync(full, 'utf8');
        if (txt.indexOf(target) >= 0) {
          badFiles.push(full);
        }
      }
    }
  }

  walk('.');

  var elapsed = Date.now() - start;
  if (badFiles.length > 0) {
    log('[4/4] WXSS escaped newline guard ... FAIL (' + elapsed + ' ms)');
    log('WXSS literal \\n found in:');
    for (var k = 0; k < badFiles.length; k++) {
      log('  ' + badFiles[k]);
    }
    return { pass: false, title: 'WXSS \\n guard', elapsed: elapsed, command: 'fs scan (inline)' };
  }

  log('[4/4] WXSS escaped newline guard ... PASS (' + elapsed + ' ms)');
  log('WXSS escaped newline guard OK: 0 violations');
  return { pass: true, title: 'WXSS \\n guard', elapsed: elapsed, command: 'fs scan (inline)' };
}

// --- Main ---

function main() {
  var totalStart = Date.now();

  log('========================================');
  log(' Miniprogram checks');
  log('========================================');
  log('Node: ' + process.version);
  log('CWD:  ' + process.cwd());
  log('Checks: 4');
  log('');

  var results = [];

  // [1/4] Smoke test
  var r1 = runStep(1, 4, 'Smoke test', 'node', ['tools/miniprogram_smoke_test.js']);
  results.push(r1);

  // [2/4] Content compliance
  var r2 = runStep(2, 4, 'Content compliance', 'node', ['tools/check_content_compliance.js']);
  results.push(r2);

  // [3/4] JS syntax (inline)
  var r3 = checkJsSyntax();
  results.push(r3);

  // [4/4] WXSS escaped newline (inline)
  var r4 = checkWxssEscapedNewline();
  results.push(r4);

  // Summary computation
  var totalElapsed = Date.now() - totalStart;
  var passedCount = 0;
  var failedCount = 0;
  var failedStep = null;
  for (var i = 0; i < results.length; i++) {
    if (results[i].pass) {
      passedCount++;
    } else {
      failedCount++;
      if (!failedStep) failedStep = results[i].title;
    }
  }
  var allPassed = failedCount === 0;

  // --- JSON mode output ---
  if (JSON_MODE) {
    var steps = [];
    for (var j = 0; j < results.length; j++) {
      steps.push({
        index: j + 1,
        name: results[j].title,
        ok: results[j].pass,
        durationMs: results[j].elapsed,
        command: results[j].command
      });
    }

    var jsonResult = {
      ok: allPassed,
      totalChecks: results.length,
      passedChecks: passedCount,
      failedChecks: failedCount,
      durationMs: totalElapsed,
      environment: {
        node: process.version,
        cwd: process.cwd()
      },
      steps: steps
    };

    if (!allPassed) {
      jsonResult.failedStep = failedStep;
      jsonResult.nextStep = 'inspect the error above, fix the issue, then rerun node tools/run_miniprogram_checks.js';
      jsonResult.error = 'Check failed: ' + failedStep;
    }

    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(allPassed ? 0 : 1);
    return;
  }

  // --- Human-readable summary (unchanged) ---
  log('\n========================================');
  log(' Summary');
  log('========================================');
  for (var k = 0; k < results.length; k++) {
    var status = results[k].pass ? 'PASS' : 'FAIL';
    var timing = ' (' + results[k].elapsed + ' ms)';
    log('  [' + (k + 1) + '/4] ' + results[k].title + ': ' + status + timing);
  }

  log('');
  if (allPassed) {
    log('All miniprogram checks passed in ' + totalElapsed + ' ms');
    process.exit(0);
  } else {
    log('Miniprogram checks failed');
    log('Failed step: ' + failedStep);
    log('Next step: inspect the error above, fix the issue, then rerun node tools/run_miniprogram_checks.js');
    process.exit(1);
  }
}

main();
