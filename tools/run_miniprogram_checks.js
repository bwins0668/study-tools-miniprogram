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

// --- Helpers ---

function log() {
  console.log.apply(console, arguments);
}

function runStep(title, cmd, args, opts) {
  log('\n' + title);
  log('-'.repeat(title.length));
  try {
    child_process.execFileSync(cmd, args, Object.assign({ stdio: 'inherit' }, opts || {}));
    return true;
  } catch (e) {
    log('\nFAILED: ' + title);
    return false;
  }
}

// --- [3/4] JS syntax check (inline, same logic as the one-liner) ---

function checkJsSyntax() {
  log('\n[3/4] JS syntax check');
  log('-'.repeat(30));

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

  if (failed.length > 0) {
    log('JS syntax FAILED: ' + failed.length + ' file(s)');
    return false;
  }

  log('JS syntax OK: ' + files.length + ' file(s)');
  return true;
}

// --- [4/4] WXSS escaped newline guard (inline) ---

function checkWxssEscapedNewline() {
  log('\n[4/4] WXSS escaped newline guard');
  log('-'.repeat(30));

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

  if (badFiles.length > 0) {
    log('WXSS literal \\n found in:');
    for (var k = 0; k < badFiles.length; k++) {
      log('  ' + badFiles[k]);
    }
    return false;
  }

  log('WXSS escaped newline guard OK: 0 violations');
  return true;
}

// --- Main ---

function main() {
  log('========================================');
  log(' Miniprogram Checks — One-Command Gate');
  log('========================================');

  var results = [];

  // [1/4] Smoke test
  var step1 = runStep('[1/4] Smoke test', 'node', ['tools/miniprogram_smoke_test.js']);
  results.push(step1);

  // [2/4] Content compliance
  var step2 = runStep('[2/4] Content compliance', 'node', ['tools/check_content_compliance.js']);
  results.push(step2);

  // [3/4] JS syntax (inline)
  var step3 = checkJsSyntax();
  results.push(step3);

  // [4/4] WXSS escaped newline (inline)
  var step4 = checkWxssEscapedNewline();
  results.push(step4);

  // Summary
  log('\n========================================');
  log(' Summary');
  log('========================================');
  var labels = ['Smoke test', 'Content compliance', 'JS syntax', 'WXSS \\n guard'];
  var allPassed = true;
  for (var i = 0; i < results.length; i++) {
    var status = results[i] ? 'PASS' : 'FAIL';
    log('  [' + (i + 1) + '/4] ' + labels[i] + ': ' + status);
    if (!results[i]) allPassed = false;
  }

  log('');
  if (allPassed) {
    log('All miniprogram checks passed');
    process.exit(0);
  } else {
    log('One or more checks FAILED — do not commit until resolved');
    process.exit(1);
  }
}

main();
