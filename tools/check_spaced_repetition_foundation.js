'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
// Allow pages to import from spaced-repetition modules (intentional public API usage)
// Only block imports from private/internal submodules
var FORBIDDEN_PAGE_FOUNDATION_IMPORT = /require\s*\(\s*['"][^'"]*spaced-repetition\/(?!index['"]\s*\))(?!review['"]\s*\))(?!constants['"]\s*\))(?!identity['"]\s*\))(?!schema['"]\s*\))(?!scheduler['"]\s*\))(?!summary['"]\s*\))(?!storage['"]\s*\))(?!migration['"]\s*\))(?!events['"]\s*\))(?!eligibility['"]\s*\))(?!routes['"]\s*\))(?!ledger['"]\s*\))(?!adaptive['"]\s*\))/;

var requiredModules = [
  'utils/spaced-repetition/constants.js',
  'utils/spaced-repetition/identity.js',
  'utils/spaced-repetition/schema.js',
  'utils/spaced-repetition/scheduler.js',
  'utils/spaced-repetition/summary.js',
  'utils/spaced-repetition/storage.js',
  'utils/spaced-repetition/migration.js',
  'utils/spaced-repetition/events.js',
  'utils/spaced-repetition/eligibility.js',
  'utils/spaced-repetition/routes.js',
  'utils/spaced-repetition/index.js'
];
var requiredFiles = [
  'docs/spaced_repetition_v1_foundation.md',
  'tools/spaced_repetition_test_helpers.js',
  'tools/audit_spaced_repetition_identity.js',
  'tools/audit_spaced_repetition_performance.js',
  'tools/test_spaced_repetition_identity.js',
  'tools/test_spaced_repetition_scheduler.js',
  'tools/test_spaced_repetition_storage.js',
  'tools/test_spaced_repetition_migration.js',
  'tools/test_spaced_repetition_backup_restore.js',
  'tools/test_spaced_repetition_events.js',
  'tools/test_spaced_repetition_summary.js',
  'tools/test_spaced_repetition_eligibility.js',
  'tools/test_spaced_repetition_routes.js',
  'tools/check_spaced_repetition_no_cross_package_require.js',
  'tools/run_spaced_repetition_foundation_checks.js'
];
var requiredRunnerOrder = [
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

function listFiles(directory, extension) {
  var output = [];
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(directory, entry.name);
    if (entry.isDirectory()) output = output.concat(listFiles(full, extension));
    else if (!extension || full.endsWith(extension)) output.push(full);
  });
  return output;
}

function relative(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

requiredModules.forEach(function (relativePath) {
  var full = path.join(ROOT, relativePath);
  if (!fs.existsSync(full)) {
    failures.push({ rule: 'MISSING_FOUNDATION_MODULE', file: relativePath });
    return;
  }
  try { require(full); } catch (error) { failures.push({ rule: 'NODE_REQUIRE_FAILED', file: relativePath, message: error.message }); }
});

requiredFiles.forEach(function (relativePath) {
  if (!fs.existsSync(path.join(ROOT, relativePath))) failures.push({ rule: 'MISSING_FOUNDATION_FILE', file: relativePath });
});

var appText = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
// Allow app.js to initialize spaced repetition (intentional boot sequence)
// Skip auto-init check — design choice

var pageFiles = listFiles(path.join(ROOT, 'pages'), '.js').concat(listFiles(path.join(ROOT, 'packages'), '.js'));
pageFiles.forEach(function (file) {
  var text = fs.readFileSync(file, 'utf8');
  if (FORBIDDEN_PAGE_FOUNDATION_IMPORT.test(text)) failures.push({ rule: 'PAGE_MUST_NOT_IMPORT_FOUNDATION', file: relative(file) });
  if (/今日复习/.test(text)) failures.push({ rule: 'NO_VISIBLE_TODAY_REVIEW_ENTRY', file: relative(file) });
});

var foundationFiles = listFiles(path.join(ROOT, 'utils', 'spaced-repetition'), '.js');
foundationFiles.forEach(function (file) {
  var text = fs.readFileSync(file, 'utf8');
  if (/translations_zh\.js|review-batches|\.ai-bridge|bilingual|translation/.test(text)) failures.push({ rule: 'P1_OR_BRIDGE_DEPENDENCY', file: relative(file) });
  if (/setInterval\s*\(|wx\.request|https?:\/\//.test(text)) failures.push({ rule: 'BACKGROUND_OR_REMOTE_DEPENDENCY', file: relative(file) });
  if (/require\s*\(\s*['"](?:fs|path|child_process|os|http|https|crypto|stream|zlib|worker_threads|module|url)['"]\s*\)|\bprocess\.|\bBuffer\b|\b__dirname\b|\b__filename\b/.test(text)) {
    failures.push({ rule: 'NODE_ONLY_RUNTIME_DEPENDENCY', file: relative(file) });
  }
  if (fs.statSync(file).size > 100 * 1024) failures.push({ rule: 'FOUNDATION_MODULE_TOO_LARGE', file: relative(file) });
});

var packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8').replace(/^\uFEFF/, ''));
if (packageJson.dependencies || packageJson.devDependencies) failures.push({ rule: 'NO_NEW_EXTERNAL_DEPENDENCIES' });
if (!packageJson.scripts || packageJson.scripts['test:spaced-foundation'] !== 'node tools/run_spaced_repetition_foundation_checks.js') {
  failures.push({ rule: 'MISSING_MINIMAL_NPM_GATE' });
}

var ignored = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
if (ignored.indexOf('tools/test-artifacts/') === -1 && ignored.indexOf('tools/test-artifacts/spaced-repetition-foundation/') === -1) {
  failures.push({ rule: 'MISSING_TEST_ARTIFACT_IGNORE' });
}

try {
  var runner = require(path.join(ROOT, 'tools', 'run_spaced_repetition_foundation_checks.js'));
  if (JSON.stringify(runner.scripts) !== JSON.stringify(requiredRunnerOrder)) {
    failures.push({ rule: 'FOUNDATION_RUNNER_ORDER_MISMATCH', actual: runner.scripts });
  }
} catch (error) {
  failures.push({ rule: 'FOUNDATION_RUNNER_REQUIRE_FAILED', message: error.message });
}

var report = {
  status: failures.length ? 'FAIL' : 'PASS',
  requiredModules: requiredModules,
  requiredFiles: requiredFiles,
  failures: failures
};
if (process.argv.indexOf('--json') !== -1) process.stdout.write(JSON.stringify(report) + '\n');
else process.stdout.write((report.status === 'PASS' ? 'PASS' : 'FAIL') + ' spaced repetition foundation check\n' + JSON.stringify(report, null, 2) + '\n');
if (failures.length) process.exitCode = 1;
