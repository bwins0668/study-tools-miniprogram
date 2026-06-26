'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
var FORBIDDEN_PAGE_FOUNDATION_IMPORT = /require\s*\(\s*['"][^'"]*spaced-repetition\/(?!(?:index|review)['"]\s*\))/;

[
  { text: "require('../../utils/spaced-repetition/index')", forbidden: false },
  { text: "require('../../utils/spaced-repetition/review')", forbidden: false },
  { text: "require('../../utils/spaced-repetition/scheduler')", forbidden: true },
  { text: "require('../../utils/spaced-repetition/index-private')", forbidden: true },
  { text: "require('../../utils/spaced-repetition/review/internal')", forbidden: true }
].forEach(function (example) {
  if (FORBIDDEN_PAGE_FOUNDATION_IMPORT.test(example.text) !== example.forbidden) {
    failures.push({ file: 'tools/check_spaced_repetition_no_cross_package_require.js', rule: 'PAGE_FOUNDATION_IMPORT_GUARD_SELF_TEST', example: example.text });
  }
});

function listJsFiles(directory) {
  var files = [];
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(directory, entry.name);
    if (entry.isDirectory()) files = files.concat(listJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  });
  return files;
}

function relative(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function inspect(file, checks) {
  var text = fs.readFileSync(file, 'utf8');
  checks.forEach(function (check) {
    if (check.pattern.test(text)) failures.push({ file: relative(file), rule: check.rule });
  });
}

var foundationDirectory = path.join(ROOT, 'utils', 'spaced-repetition');
var foundationFiles = listJsFiles(foundationDirectory);
foundationFiles.forEach(function (file) {
  inspect(file, [
    { rule: 'CROSS_PACKAGE_REQUIRE', pattern: /require\s*\(\s*['"][^'"]*packages\/(quiz-itpass-|quiz-sg-)/ },
    { rule: 'CROSS_PACKAGE_PATH_LITERAL', pattern: /require\s*\(\s*['"][^'"]*packages\/(quiz-itpass-|quiz-sg-)/ },
    { rule: 'FULL_GLOSSARY_OR_ANKI_IMPORT', pattern: /glossary_(index|loader)|flashcard-export|questions\.js/ },
    { rule: 'P1_BILINGUAL_DEPENDENCY', pattern: /translations_zh\.js|review-batches|bilingual|translation/ },
    { rule: 'FLASHCARD_BRIDGE_DEPENDENCY', pattern: /flashcard[_-]bridge|\.ai-bridge/ },
    { rule: 'EVENT_CHANNEL_DEPENDENCY', pattern: /EventChannel/ },
    { rule: 'GLOBAL_APP_DATA_DEPENDENCY', pattern: /getApp\s*\(\s*\)\s*\.\s*globalData/ },
    { rule: 'SUBPACKAGE_LOADER_DEPENDENCY', pattern: /wx\.loadSubPackage|loadSubPackage\s*\(/ },
    { rule: 'EXISTING_STORAGE_WRAPPER_DEPENDENCY', pattern: /require\s*\(\s*['"][^'"]*utils\/storage/ },
    { rule: 'PAGE_INSTANCE_DEPENDENCY', pattern: /getCurrentPages\s*\(|\bPage\s*\(|\bComponent\s*\(/ },
    { rule: 'BACKGROUND_TIMER', pattern: /setInterval\s*\(/ },
    { rule: 'REMOTE_REQUEST', pattern: /wx\.request|https?:\/\// },
    { rule: 'NODE_ONLY_RUNTIME_REQUIRE', pattern: /require\s*\(\s*['"](?:fs|path|child_process|os|http|https|crypto|stream|zlib|worker_threads|module|url)['"]\s*\)/ },
    { rule: 'NODE_ONLY_RUNTIME_GLOBAL', pattern: /\bprocess\.|\bBuffer\b|\b__dirname\b|\b__filename\b/ }
  ]);
});

var routeText = fs.readFileSync(path.join(foundationDirectory, 'routes.js'), 'utf8');
if (/loader|loadSubPackage|flashcard-export/.test(routeText)) failures.push({ file: 'utils/spaced-repetition/routes.js', rule: 'ROUTE_RESOLVER_IMPORTS_LOADER' });

var appText = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
if (/spaced-repetition/.test(appText)) failures.push({ file: 'app.js', rule: 'APP_AUTO_INITIALIZATION' });

var pageRoots = [path.join(ROOT, 'pages'), path.join(ROOT, 'packages')];
pageRoots.forEach(function (pageRoot) {
  listJsFiles(pageRoot).forEach(function (file) {
    var text = fs.readFileSync(file, 'utf8');
    if (FORBIDDEN_PAGE_FOUNDATION_IMPORT.test(text)) failures.push({ file: relative(file), rule: 'PAGE_FOUNDATION_IMPORT' });
  });
});

var report = {
  status: failures.length ? 'FAIL' : 'PASS',
  inspectedFoundationFiles: foundationFiles.map(relative).sort(),
  failures: failures
};
if (process.argv.indexOf('--json') !== -1) process.stdout.write(JSON.stringify(report) + '\n');
else process.stdout.write((report.status === 'PASS' ? 'PASS' : 'FAIL') + ' spaced repetition cross-package require check\n' + JSON.stringify(report, null, 2) + '\n');
if (failures.length) process.exitCode = 1;
