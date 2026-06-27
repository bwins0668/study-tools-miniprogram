'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var PKGS = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function loadJs(fp) {
  var c = fs.readFileSync(fp, 'utf8').replace(/^\s*\/\/.*$/gm, '');
  var m = c.match(/module\.exports\s*=\s*([\s\S]+)$/);
  if (m) { var e = m[1].trim(); while (e.endsWith(';')) e=e.slice(0,-1);
    try { return JSON.parse(e); } catch (_) {
      try { var s={}; new Function('s','with(s){return ('+e+')}')(s); return s; } catch (_2) { return null; }
    }
  }
  return null;
}

var failures = [];
for (var i = 0; i < PKGS.length; i++) {
  var pkg = PKGS[i];
  var qp = path.join(ROOT, 'packages', pkg, 'data', 'questions.js');
  var ep = path.join(ROOT, 'packages', pkg, 'data', 'explanations_zh.js');
  if (!fs.existsSync(qp)) continue;
  var d = loadJs(qp); if (!d) continue;
  var explById = {};
  if (fs.existsSync(ep)) {
    var ed = loadJs(ep);
    if (ed && typeof ed === 'object') for (var ek in ed) explById[ek] = ed[ek];
  }
  
  // Load flashcard player source to check for explanations_zh import
  var pp = path.join(ROOT, 'packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.js');
  var hasExplImport = fs.existsSync(pp) && /explanations_zh/.test(fs.readFileSync(pp, 'utf8'));
  
  var years = Object.keys(d.questionsByYear || {});
  for (var j = 0; j < years.length; j++) {
    var qs = d.questionsByYear[years[j]];
    for (var k = 0; k < 3 && k < qs.length; k++) {
      var q = qs[k];
      // Check explanationZh source
      var gen = explById[q.id] || '';
      if (!gen || gen.length < 20) {
        failures.push({ pkg: pkg, qid: q.id, reason: 'missing real explanation in explanations_zh' });
      }
    }
  }
  
  if (!hasExplImport) {
    failures.push({ pkg: pkg, reason: 'flashcard player does NOT import explanations_zh.js' });
  }
}

var passed = failures.length === 0;
console.log('=== Flashcard Feedback Bilingual Audit ===');
console.log('Packages checked: ' + PKGS.length);
console.log('Failures:          ' + failures.length);
for (var f = 0; f < failures.length; f++) {
  console.log('  [' + failures[f].pkg + '] ' + failures[f].qid + ': ' + failures[f].reason);
}
console.log('');
console.log(passed ? 'RESULT: PASS' : 'RESULT: FAIL');
process.exit(passed ? 0 : 1);
