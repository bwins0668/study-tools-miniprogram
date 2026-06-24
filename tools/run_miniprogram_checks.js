#!/usr/bin/env node
/**
 * run_miniprogram_checks.js — One-command gate for all miniprogram maintenance checks.
 *
 * Normal mode runs seven checks, including miniprogram_smoke_test.js.
 * JSON mode is intentionally leaf-only: it excludes the smoke test so R3.91
 * can query this command without spawning the smoke test again.
 *
 * Exit code: 0 if all checks pass, 1 if any leaf or normal-mode check fails.
 * No external dependencies.
 */

'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

var JSON_MODE = process.argv.indexOf('--json') !== -1;
var FULL_TOTAL_CHECKS = 7;
var TOTAL_CHECKS = JSON_MODE ? 6 : FULL_TOTAL_CHECKS;

// --- Helpers ---

function log() {
  if (!JSON_MODE) {
    console.log.apply(console, arguments);
  }
}

function boundedOutput(value) {
  return String(value || '').trim().slice(0, 12000);
}

function runStep(index, total, title, cmd, args, opts) {
  var label = '[' + index + '/' + total + '] ' + title;
  var command = cmd + ' ' + args.join(' ');
  log('\n' + label);
  log('-'.repeat(40));
  var start = Date.now();
  var execOpts = Object.assign({ stdio: JSON_MODE ? 'pipe' : 'inherit' }, opts || {});
  try {
    child_process.execFileSync(cmd, args, execOpts);
  } catch (e) {
    var elapsed = Date.now() - start;
    var stdout = boundedOutput(e && e.stdout);
    var stderr = boundedOutput(e && e.stderr);
    var error = String(e && e.message || 'unknown child-process failure');
    if (!JSON_MODE) {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
    log(label + ' ... FAIL (' + elapsed + ' ms)');
    return {
      pass: false,
      title: title,
      elapsed: elapsed,
      command: command,
      exitCode: typeof e.status === 'number' ? e.status : null,
      stdout: stdout,
      stderr: stderr,
      error: error
    };
  }
  var elapsed2 = Date.now() - start;
  log(label + ' ... PASS (' + elapsed2 + ' ms)');
  return { pass: true, title: title, elapsed: elapsed2, command: command };
}

// --- JS syntax check (inline, same logic as the one-liner) ---

function checkJsSyntax() {
  var index = arguments.length > 0 ? arguments[0] : 6;
  var total = arguments.length > 1 ? arguments[1] : TOTAL_CHECKS;
  log('\n[' + index + '/' + total + '] JS syntax check');
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
    log('[' + index + '/' + total + '] JS syntax check ... FAIL (' + elapsed + ' ms)');
    log('JS syntax FAILED: ' + failed.length + ' file(s)');
    return {
      pass: false,
      title: 'JS syntax',
      elapsed: elapsed,
      command: 'node --check (inline)',
      exitCode: 1,
      stdout: '',
      stderr: 'Syntax errors: ' + failed.join(', '),
      error: 'JavaScript syntax check failed'
    };
  }

  log('[' + index + '/' + total + '] JS syntax check ... PASS (' + elapsed + ' ms)');
  log('JS syntax OK: ' + files.length + ' file(s)');
  return { pass: true, title: 'JS syntax', elapsed: elapsed, command: 'node --check (inline)' };
}

// --- WXSS escaped newline guard (inline) ---

function checkWxssEscapedNewline() {
  var index = arguments.length > 0 ? arguments[0] : 7;
  var total = arguments.length > 1 ? arguments[1] : TOTAL_CHECKS;
  log('\n[' + index + '/' + total + '] WXSS escaped newline guard');
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
    log('[' + index + '/' + total + '] WXSS escaped newline guard ... FAIL (' + elapsed + ' ms)');
    log('WXSS literal \\n found in:');
    for (var k = 0; k < badFiles.length; k++) {
      log('  ' + badFiles[k]);
    }
    return {
      pass: false,
      title: 'WXSS \\n guard',
      elapsed: elapsed,
      command: 'fs scan (inline)',
      exitCode: 1,
      stdout: '',
      stderr: 'WXSS literal backslash+n found in: ' + badFiles.join(', '),
      error: 'WXSS escaped newline guard failed'
    };
  }

  log('[' + index + '/' + total + '] WXSS escaped newline guard ... PASS (' + elapsed + ' ms)');
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
  log('Checks: ' + TOTAL_CHECKS);
  log('');

  var results = [];
  var checkIndex = 1;

  results.push(runStep(checkIndex++, TOTAL_CHECKS,
    'Subpackage registry', 'node', ['tools/check_subpackage_registry.js']));

  // JSON is the leaf-only contract queried by R3.91. Running smoke here would
  // re-enter R3.91 and turn a contract check into a process cycle.
  if (!JSON_MODE) {
    results.push(runStep(checkIndex++, TOTAL_CHECKS,
      'Smoke test', 'node', ['tools/miniprogram_smoke_test.js']));
  }

  results.push(runStep(checkIndex++, TOTAL_CHECKS,
    'Content compliance', 'node', ['tools/check_content_compliance.js']));
  results.push(runStep(checkIndex++, TOTAL_CHECKS,
    'Quiz explanations', 'node', ['tools/check_quiz_explanations.js']));
  results.push(runStep(checkIndex++, TOTAL_CHECKS,
    'Package size audit', 'node', ['tools/audit_miniprogram_package_size.js']));
  results.push(checkJsSyntax(checkIndex++, TOTAL_CHECKS));
  results.push(checkWxssEscapedNewline(checkIndex++, TOTAL_CHECKS));

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
    var checks = [];
    var failures = [];
    for (var j = 0; j < results.length; j++) {
      var result = results[j];
      checks.push({
        index: j + 1,
        name: result.title,
        ok: result.pass,
        durationMs: result.elapsed,
        command: result.command
      });
      if (!result.pass) {
        failures.push({
          index: j + 1,
          name: result.title,
          command: result.command,
          exitCode: typeof result.exitCode === 'number' ? result.exitCode : 1,
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          error: result.error || ('Check failed: ' + result.title)
        });
      }
    }

    var jsonResult = {
      success: allPassed,
      ok: allPassed,
      totalChecks: results.length,
      passedChecks: passedCount,
      failedChecks: failedCount,
      durationMs: totalElapsed,
      environment: {
        node: process.version,
        cwd: process.cwd()
      },
      checks: checks,
      steps: checks,
      failures: failures
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
    log('  [' + (k + 1) + '/' + results.length + '] ' + results[k].title + ': ' + status + timing);
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
