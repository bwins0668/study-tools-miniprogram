#!/usr/bin/env node
'use strict';

/* Full repository JavaScript parser gate. It does not execute application code. */
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var SKIP = new Set(['.git', 'node_modules', 'tools/test-artifacts', 'tools/review-batches', 'artifacts']);
var SKIP_PREFIX = ['packages/'];
var SKIP_FILE = ['_batch_', '_temp', '_dump', '_translate', '_fix_', '_raw', '_to_', '_questions_', '_extract', 'batch_', 'translated_', 'questions_to_translate.json', '_parsed.json'];
var files = [];

function isSkippedFile(relative) {
  var name = path.basename(relative);
  if (name.endsWith('.r18_backup')) return true;
  if (name === 'translations_zh.js') return true;
  if (name === 'check_js.py' || name === 'extract.py' || name === 'gen_batch.py' || name === 'translate.py' || name === 'translate.js') return true;
  for (var i = 0; i < SKIP_FILE.length; i++) {
    if (name.startsWith(SKIP_FILE[i])) return true;
  }
  return false;
}

function visit(relative) {
  var absolute = path.join(ROOT, relative);
  var stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    if (SKIP.has(relative.replace(/\\/g, '/'))) return;
    fs.readdirSync(absolute).forEach(function (name) {
      visit(path.join(relative, name));
    });
    return;
  }
  if (stat.isFile() && path.extname(relative) === '.js') {
    if (!isSkippedFile(relative)) files.push(relative);
  }
}

visit('.');
files.sort();
var failures = [];
files.forEach(function (relative) {
  var result = childProcess.spawnSync(process.execPath, ['--check', path.join(ROOT, relative)], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 15000
  });
  if (result.status !== 0) {
    failures.push({ file: relative, output: String(result.stderr || result.stdout || '').slice(0, 1200) });
  }
});

if (failures.length) {
  console.error('JavaScript syntax FAIL (' + failures.length + '/' + files.length + ')');
  failures.forEach(function (item) {
    console.error('- ' + item.file + '\n' + item.output);
  });
  process.exit(1);
}
console.log('JavaScript syntax PASS (' + files.length + ' files)');
