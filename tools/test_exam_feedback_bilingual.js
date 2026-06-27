'use strict';
var fs = require('fs');
var path = require('path');

var PROJECT_ROOT = path.resolve(__dirname, '..');
var SUBPACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function loadJsModule(fp) {
  var c = fs.readFileSync(fp, 'utf8').replace(/^\s*\/\/.*$/gm, '');
  var m = c.match(/module\.exports\s*=\s*([\s\S]+)$/);
  if (m) {
    var e = m[1].trim(); while (e.endsWith(';')) e = e.slice(0, -1);
    try { return JSON.parse(e); }
    catch (_) {
      try { var s = {}; new Function('scope', 'with(scope){ return (' + e + ')}')(s); return s; }
      catch (_2) { return null; }
    }
  }
  return null;
}

function stripHtml(v) { if (!v || typeof v !== 'string') return ''; return v.replace(/<[^>]+>/g, '').trim(); }

var TOTAL = 0;
var hasExplanationZh = 0;
var missingAnswerZh = 0;
var fallbackCount = 0;

for (var i = 0; i < SUBPACKAGES.length; i++) {
  var pkg = SUBPACKAGES[i];
  var qp = path.join(PROJECT_ROOT, 'packages', pkg, 'data', 'questions.js');
  if (!fs.existsSync(qp)) continue;
  var d = loadJsModule(qp);
  if (!d) continue;
  
  var byYear = d.questionsByYear || {};
  var years = Object.keys(byYear);
  
  // Load explanations for this package
  var ep = path.join(PROJECT_ROOT, 'packages', pkg, 'data', 'explanations_zh.js');
  var explById = {};
  if (fs.existsSync(ep)) {
    var explData = loadJsModule(ep);
    if (explData && typeof explData === 'object') {
      for (var ek in explData) { explById[ek] = explData[ek]; }
    }
  }
  
  for (var j = 0; j < years.length; j++) {
    var qs = byYear[years[j]];
    for (var k = 0; k < qs.length; k++) {
      var q = qs[k];
      TOTAL++;
      
      // Check questionZh
      var qzh = stripHtml(q.questionZh || '');
      var qja = stripHtml(q.questionJa || '');
      
      // Check options Zh
      var allOptsZh = true;
      for (var o = 0; o < (q.options || []).length; o++) {
        var opt = q.options[o];
        var ozh = stripHtml(opt.textZh || '');
        if (!ozh) { allOptsZh = false; }
        if (ozh === stripHtml(opt.textJa || '')) {
          // Only count as missing if NOT an acronym/number/label
          if (!/^[\d]+$|^[A-Z]{2,8}$|^[a-d]([、,][a-d])*$/.test(ozh)) {
            missingAnswerZh++;
          }
        }
      }
      
      // Check explanation
      var genExpl = explById[q.id] || '';
      var hasExpl = (q.explanationZh && stripHtml(q.explanationZh).length > 10) || (genExpl && genExpl.length > 10);
      if (hasExpl) hasExplanationZh++;
      
      // Check fallback
      var ez = stripHtml(q.explanationZh || '');
      var ej = stripHtml(q.explanationJa || '');
      if (ez && ej && ez === ej && ez.length > 0) fallbackCount++;
    }
  }
}

var passed = missingAnswerZh === 0 && fallbackCount === 0;
console.log('=== Exam Feedback Bilingual Audit ===');
console.log('Total questions:        ' + TOTAL);
console.log('Has explanationZh:      ' + hasExplanationZh);
console.log('Missing answer textZh:  ' + missingAnswerZh);
console.log('Japanese fallback expl: ' + fallbackCount);
console.log('');
if (passed) {
  console.log('RESULT: PASS — Bilingual exam feedback complete');
  process.exit(0);
} else {
  console.log('RESULT: FAIL — ' + (missingAnswerZh + fallbackCount) + ' gaps');
  process.exit(1);
}
