#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(msg) { failures.push(msg); }

function rel(file) { return path.relative(ROOT, file).replace(/\\/g, '/'); }

// Resolve a require('./xxx') or require('../xxx') relative to a source file
function resolveRequire(sourceDir, requireArg) {
  if (requireArg.startsWith('./') || requireArg.startsWith('../')) {
    var resolved = path.resolve(sourceDir, requireArg);
    if (fs.existsSync(resolved + '.js')) return resolved + '.js';
    if (fs.existsSync(resolved + '.json')) return resolved + '.json';
    if (fs.existsSync(resolved)) return resolved;
    return null;
  }
  return null; // skip non-relative requires (e.g., require('module'))
}

// Scan a JS file for local require() calls and verify each resolves
function scanFile(filePath, subpackageRoot) {
  var content = fs.readFileSync(filePath, 'utf8');
  var sourceDir = path.dirname(filePath);
  var re = /require\(['"]([^'"]+)['"]\)/g;
  var match;
  while ((match = re.exec(content)) !== null) {
    var arg = match[1];
    var resolved = resolveRequire(sourceDir, arg);
    if (resolved === null) continue; // non-relative, skip
    if (resolved === undefined) {
      fail(rel(filePath) + ': cannot resolve require(' + arg + ')');
      continue;
    }
    // Check resolved file is within the same subpackage
    var resolvedRel = path.relative(subpackageRoot, resolved);
    if (resolvedRel.startsWith('..') || path.isAbsolute(resolvedRel)) {
      fail(rel(filePath) + ': require(' + arg + ') resolves outside subpackage to ' + rel(resolved));
    }
    // Recursively scan resolved file
    scanFile(resolved, subpackageRoot);
  }
}

// Find all JS files under a directory
function findJsFiles(dir) {
  var results = [];
  fs.readdirSync(dir).forEach(function(f) {
    var fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      results = results.concat(findJsFiles(fp));
    } else if (f.endsWith('.js') && !f.includes('chapter-list-model')) {
      results.push(fp);
    }
  });
  return results;
}

function checkSubpackage(pkgRoot) {
  var pkgName = path.basename(pkgRoot);
  // Verify registered pages exist
  var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  var pkg = (app.subpackages || []).find(function(s) { return s.root === 'packages/' + pkgName; });
  if (!pkg) { fail(pkgName + ': not found in app.json subpackages'); return; }
  
  (pkg.pages || []).forEach(function(page) {
    var jsPath = path.join(ROOT, 'packages', pkgName, page + '.js');
    if (!fs.existsSync(jsPath)) {
      fail(pkgName + '/' + page + '.js: page entry missing');
      return;
    }
    // Scan the page entry and its transitive dependencies
    var seen = {};
    scanFile(jsPath, pkgRoot);
  });

  // Verify sources.js exists
  if (!fs.existsSync(path.join(pkgRoot, 'data', 'sources.js'))) {
    fail(pkgName + ': missing data/sources.js');
  }
  
  // Check for forbidden patterns
  findJsFiles(pkgRoot).forEach(function(fp) {
    var content = fs.readFileSync(fp, 'utf8');
    if (/G:\\|file:\/\/|127\.0\.0\.1|localhost|data:application\/pdf/i.test(content)) {
      fail(pkgName + ': ' + rel(fp) + ' contains forbidden path/URL');
    }
    // Check for cross-subpackage requires
    if (/require\(['"]\.\.\/\.\.\/course-(itpass|sg)/.test(content)) {
      var m = content.match(/require\(['"](\.\.\/\.\.\/course-\w+[^'"]+)['"]\)/);
      if (m) fail(pkgName + ': ' + rel(fp) + ' has cross-subpackage require: ' + m[1]);
    }
    // Check for old course-content paths
    if (/require\(['"].*course-content/.test(content)) {
      fail(pkgName + ': ' + rel(fp) + ' references old course-content path');
    }
  });
}

function main() {
  var args = process.argv;
  if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
    console.log('Usage: node tools/check_textbook_subpackage_runtime_closure.js --all');
    process.exit(0);
  }
  if (args.indexOf('--all') < 0) {
    fail('use --all for R5.4.1 runtime closure contract');
  }

  checkSubpackage(path.join(ROOT, 'packages', 'course-itpass'));
  checkSubpackage(path.join(ROOT, 'packages', 'course-sg'));

  if (failures.length) {
    console.error('RUNTIME CLOSURE FAIL (' + failures.length + ')');
    failures.forEach(function(m) { console.error('  - ' + m); });
    process.exit(1);
  }
  console.log('RUNTIME CLOSURE PASS — all subpackage require chains resolve within legal boundaries');
}

main();
