#!/usr/bin/env node
/**
 * audit_miniprogram_package_size.js
 * 只读审计微信小程序主包候选文件与大文件分布。
 *
 * 说明：这里的 main-package candidate 是基于 app.json / subpackages /
 * packOptions.ignore 的近似估算，不等同于微信开发者工具编译后的真实包体积。
 */

'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var ONE_KB = 1024;
var ONE_MB = 1024 * 1024;

function toRel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function readJson(rel, fallback) {
  try {
    return JSON.parse(readText(rel));
  } catch (e) {
    return fallback || {};
  }
}

function formatSize(bytes) {
  if (bytes >= ONE_MB) return (bytes / ONE_MB).toFixed(2) + ' MB';
  return (bytes / ONE_KB).toFixed(1) + ' KB';
}

function walk(dir, files) {
  files = files || [];
  var entries;
  try {
    entries = fs.readdirSync(dir);
  } catch (e) {
    return files;
  }

  for (var i = 0; i < entries.length; i++) {
    var name = entries[i];
    var full = path.join(dir, name);
    var rel = toRel(full);
    if (rel === '.git' || rel.indexOf('.git/') === 0) continue;
    var stat;
    try {
      stat = fs.statSync(full);
    } catch (e) {
      continue;
    }
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (stat.isFile()) {
      files.push({ rel: rel, abs: full, size: stat.size });
    }
  }
  return files;
}

function normalizeRuleValue(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function createIgnoreMatcher(packOptions) {
  var rules = (packOptions && packOptions.ignore) || [];
  return function isIgnored(rel) {
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i] || {};
      var type = rule.type;
      var value = normalizeRuleValue(rule.value);
      if (!value) continue;
      if (type === 'folder' && (rel === value || rel.indexOf(value + '/') === 0)) return true;
      if (type === 'file' && rel === value) return true;
      if (type === 'suffix' && rel.endsWith(value)) return true;
      if (type === 'prefix' && rel.indexOf(value) === 0) return true;
    }
    return false;
  };
}

function sumSize(files) {
  return files.reduce(function (sum, item) { return sum + item.size; }, 0);
}

function topFiles(files, count) {
  return files.slice().sort(function (a, b) { return b.size - a.size; }).slice(0, count);
}

function printFiles(title, files, count) {
  console.log('\n' + title);
  topFiles(files, count || 20).forEach(function (item, index) {
    console.log(String(index + 1).padStart(2, ' ') + '. ' + formatSize(item.size).padStart(9, ' ') + '  ' + item.rel);
  });
  if (files.length === 0) console.log('  (none)');
}

function addFile(set, rel) {
  if (!rel) return;
  rel = rel.replace(/\\/g, '/').replace(/^\/+/, '');
  set[rel] = true;
}

function resolveWithExt(fromRel, request) {
  if (!request || request.charAt(0) !== '.') return null;
  var base = path.normalize(path.join(path.dirname(fromRel), request)).replace(/\\/g, '/');
  var candidates = [base, base + '.js', base + '.json', base + '.wxml', base + '.wxss', base + '.png', base + '.jpg'];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(path.join(ROOT, candidates[i]))) return candidates[i];
  }
  return null;
}

function crawlReferencedMainFiles(appJson) {
  var seen = {};
  var queue = [];

  function enqueue(rel) {
    if (!rel || seen[rel]) return;
    seen[rel] = true;
    queue.push(rel);
  }

  ['app.js', 'app.json', 'app.wxss', 'theme.json', 'sitemap.json'].forEach(enqueue);
  (appJson.pages || []).forEach(function (page) {
    ['.js', '.json', '.wxml', '.wxss'].forEach(function (ext) { enqueue(page + ext); });
  });

  var tabItems = appJson.tabBar && appJson.tabBar.list ? appJson.tabBar.list : [];
  tabItems.forEach(function (item) {
    enqueue(item.iconPath);
    enqueue(item.selectedIconPath);
  });

  while (queue.length > 0) {
    var rel = queue.shift();
    var abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    var ext = path.extname(rel);
    var text = '';
    try {
      text = fs.readFileSync(abs, 'utf8');
    } catch (e) {
      continue;
    }

    if (ext === '.js') {
      var requireRe = /require\(['"]([^'"]+)['"]\)|from\s+['"]([^'"]+)['"]/g;
      var match;
      while ((match = requireRe.exec(text)) !== null) {
        enqueue(resolveWithExt(rel, match[1] || match[2]));
      }
    } else if (ext === '.wxss') {
      var importRe = /@import\s+['"]([^'"]+)['"]/g;
      var cssMatch;
      while ((cssMatch = importRe.exec(text)) !== null) {
        enqueue(resolveWithExt(rel, cssMatch[1]));
      }
    } else if (ext === '.wxml') {
      var srcRe = /\s(?:src|icon|image)=["']([^"']+)["']/g;
      var srcMatch;
      while ((srcMatch = srcRe.exec(text)) !== null) {
        enqueue(resolveWithExt(rel, srcMatch[1]));
      }
    } else if (ext === '.json') {
      try {
        var json = JSON.parse(text);
        var components = json.usingComponents || {};
        Object.keys(components).forEach(function (key) {
          enqueue(resolveWithExt(rel, components[key]));
        });
      } catch (e) {}
    }
  }

  return seen;
}

function main() {
  var projectConfig = readJson('project.config.json', {});
  var appJson = readJson('app.json', {});
  var subpackageRoots = (appJson.subpackages || []).map(function (pkg) {
    return normalizeRuleValue(pkg.root);
  }).filter(Boolean);
  var isIgnored = createIgnoreMatcher(projectConfig.packOptions || {});
  var referenced = crawlReferencedMainFiles(appJson);

  var allFiles = walk(ROOT);
  var ignoredFiles = [];
  var subpackageFiles = [];
  var candidateFiles = [];

  allFiles.forEach(function (file) {
    var rel = file.rel;
    if (isIgnored(rel)) {
      ignoredFiles.push(file);
      return;
    }
    var inSubpackage = subpackageRoots.some(function (root) {
      return rel === root || rel.indexOf(root + '/') === 0;
    });
    if (inSubpackage) {
      subpackageFiles.push(file);
      return;
    }
    candidateFiles.push(file);
  });

  var referencedFiles = candidateFiles.filter(function (file) { return referenced[file.rel]; });
  var unreferencedCandidates = candidateFiles.filter(function (file) {
    return !referenced[file.rel] && !/\.(json|js|wxml|wxss|png|jpg|jpeg|webp|svg)$/.test(file.rel);
  });
  var largeSourceFiles = allFiles.filter(function (file) {
    return /\.(js|json|wxml|wxss)$/.test(file.rel) && file.size > 100 * ONE_KB;
  });
  var largeResources = allFiles.filter(function (file) {
    return /\.(png|jpg|jpeg|webp|gif|mp3|mp4|zip|pdf)$/.test(file.rel) && file.size > 200 * ONE_KB;
  });
  var suspectedSubpackageInMain = candidateFiles.filter(function (file) {
    return file.rel.indexOf('packages/quiz/') === 0 || file.rel.indexOf('packages/glossary/') === 0;
  });

  console.log('=== Miniprogram Package Size Audit ===');
  console.log('Root:', ROOT);
  console.log('Note: auxiliary audit, not equal to WeChat compiler output.');
  console.log('\n--- Config ---');
  console.log('miniprogramRoot:', projectConfig.miniprogramRoot || '(not set)');
  console.log('app pages:', (appJson.pages || []).join(', '));
  console.log('subpackages:', subpackageRoots.join(', ') || '(none)');
  console.log('tabBar pages:', (appJson.tabBar && appJson.tabBar.list || []).map(function (item) { return item.pagePath; }).join(', '));
  console.log('packOptions.ignore:', ((projectConfig.packOptions || {}).ignore || []).length, 'rules');

  var setting = projectConfig.setting || {};
  var settingKeys = [
    'es6', 'postcss', 'minified', 'minifyWXSS', 'minifyWXML', 'compileWorklet',
    'componentFramework', 'lazyCodeLoading', 'useCompilerPlugins', 'enhance',
    'sourceMap', 'uploadWithSourceMap', 'checkInvalidKey', 'showShadowRootInWxmlPanel',
    'packNpmManually', 'packNpmRelationList'
  ];
  console.log('settings:');
  settingKeys.forEach(function (key) {
    var value = key === 'lazyCodeLoading' ? appJson.lazyCodeLoading : setting[key];
    if (typeof value !== 'undefined') console.log('  ' + key + ': ' + JSON.stringify(value));
  });

  console.log('\n--- Size Summary ---');
  console.log('all tracked-like files scanned:', allFiles.length, formatSize(sumSize(allFiles)));
  console.log('ignored by packOptions:', ignoredFiles.length, formatSize(sumSize(ignoredFiles)));
  console.log('subpackage files:', subpackageFiles.length, formatSize(sumSize(subpackageFiles)));
  console.log('main-package candidate:', candidateFiles.length, formatSize(sumSize(candidateFiles)));
  console.log('referenced main seed/crawl:', referencedFiles.length, formatSize(sumSize(referencedFiles)));
  console.log('suspected subpackage files in main candidate:', suspectedSubpackageInMain.length);

  printFiles('--- Main Package Candidate Top 50 ---', candidateFiles, 50);
  printFiles('--- Referenced Main Files Top 30 ---', referencedFiles, 30);
  printFiles('--- Root Large JS/WXSS/WXML/JSON >100KB ---', largeSourceFiles, 30);
  printFiles('--- Large Resources >200KB ---', largeResources, 30);
  printFiles('--- Ignored Files Top 30 ---', ignoredFiles, 30);
  printFiles('--- Suspected Unreferenced Non-runtime Main Candidates ---', unreferencedCandidates, 30);

  if (sumSize(candidateFiles) > 1.5 * ONE_MB) {
    console.log('\n[RISK] main-package candidate is above 1.5 MB. Re-check in WeChat DevTools after pruning or moving files.');
  } else {
    console.log('\n[OK] main-package candidate is below 1.5 MB in this auxiliary audit.');
  }
}

main();
