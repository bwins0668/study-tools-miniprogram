'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var scripts = [
  'audit_spaced_repetition_identity.js',
  'test_spaced_repetition_identity.js',
  'test_spaced_repetition_scheduler.js',
  'test_spaced_repetition_storage.js',
  'test_spaced_repetition_migration.js',
  'test_spaced_repetition_backup_restore.js',
  'test_spaced_repetition_events.js',
  'test_spaced_repetition_summary.js',
  'test_spaced_repetition_eligibility.js',
  'test_spaced_repetition_routes.js',
  'check_spaced_repetition_no_cross_package_require.js',
  'audit_spaced_repetition_performance.js',
  'check_spaced_repetition_foundation.js'
];

function parseReport(output) {
  var trimmed = String(output || '').trim();
  if (!trimmed) return null;
  try { return JSON.parse(trimmed); } catch (error) {}
  var lines = trimmed.split(/\r?\n/).filter(Boolean);
  for (var i = lines.length - 1; i >= 0; i--) {
    try { return JSON.parse(lines[i]); } catch (error) {}
  }
  return null;
}

function runChecks(options) {
  options = options || {};
  var wantsJson = !!options.json;
  var results = scripts.map(function (script) {
    var execution = childProcess.spawnSync(process.execPath, [path.join(__dirname, script), '--json'], {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8'
    });
    var stdout = (execution.stdout || '').trim();
    var stderr = (execution.stderr || '').trim();
    var result = parseReport(stdout);
    var exitCode = execution.status === null ? 1 : execution.status;
    var passed = exitCode === 0 && result && result.status === 'PASS';
    return {
      script: script,
      exitCode: exitCode,
      status: passed ? 'PASS' : 'FAIL',
      resultStatus: result && result.status ? result.status : null,
      stdout: wantsJson ? undefined : stdout,
      stderr: stderr,
      error: execution.error ? execution.error.message : null
    };
  });

  var failures = results.filter(function (result) { return result.status !== 'PASS'; });
  var report = {
    status: failures.length ? 'FAIL' : 'PASS',
    checks: results.map(function (result) {
      return {
        script: result.script,
        exitCode: result.exitCode,
        status: result.status,
        resultStatus: result.resultStatus
      };
    }),
    failures: failures
  };

  var artifactDir = path.join(__dirname, 'test-artifacts', 'spaced-repetition-foundation');
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(path.join(artifactDir, 'run_spaced_repetition_foundation_checks.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (require.main === module) {
  var report = runChecks({ json: process.argv.indexOf('--json') !== -1 });
  if (process.argv.indexOf('--json') !== -1) process.stdout.write(JSON.stringify(report) + '\n');
  else process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (report.status !== 'PASS') process.exitCode = 1;
}

module.exports = {
  runChecks: runChecks,
  scripts: scripts.slice()
};
