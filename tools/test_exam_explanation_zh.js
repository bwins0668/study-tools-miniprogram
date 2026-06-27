'use strict';
var fs = require('fs');
var path = require('path');

var PROJECT_ROOT = path.resolve(__dirname, '..');
var SUBPACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];
var FAILURES = [];

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

var totalQuestions = 0;
var zhExplanations = 0;
var jaExplanations = 0;
var missingExplanationZh = 0;
var bindingErrors = 0;
var japaneseFallback = 0;

for (var i = 0; i < SUBPACKAGES.length; i++) {
  var pkg = SUBPACKAGES[i];
  var qp = path.join(PROJECT_ROOT, 'packages', pkg, 'data', 'questions.js');
  if (!fs.existsSync(qp)) { FAILURES.push({pkg: pkg, reason: 'questions.js not found'}); continue; }
  var d = loadJsModule(qp);
  if (!d) { FAILURES.push({pkg: pkg, reason: 'failed to parse questions.js'}); continue; }
  
  var byYear = d.questionsByYear || {};
  var years = Object.keys(byYear);
  for (var j = 0; j < years.length; j++) {
    var qs = byYear[years[j]];
    for (var k = 0; k < qs.length; k++) {
      var q = qs[k];
      totalQuestions++;
      
      // Check explanationZh
      if (q.explanationZh && typeof q.explanationZh === 'string' && q.explanationZh.trim().length > 10) {
        zhExplanations++;
      } else {
        missingExplanationZh++;
        FAILURES.push({pkg: pkg, questionId: q.id, reason: 'missing or short explanationZh'});
      }
      
      // Check explanationJa
      if (q.explanationJa && typeof q.explanationJa === 'string' && q.explanationJa.trim().length > 10) {
        jaExplanations++;
      }
      
      // Check japanese fallback
      var zh = (q.explanationZh || '').trim();
      var ja = (q.explanationJa || '').trim();
      if (zh && ja && zh === ja && zh.length > 0) {
        japaneseFallback++;
        FAILURES.push({pkg: pkg, questionId: q.id, reason: 'explanationZh is identical to explanationJa (fallback)'});
      }
      
      // Check binding error (correct answer option)
      var answer = q.answer;
      var opts = q.options || [];
      if (answer) {
        for (var m = 0; m < opts.length; m++) {
          if (opts[m].key === answer) {
            var optZh = (opts[m].textZh || '').trim();
            var optJa = (opts[m].textJa || '').trim();
            if (optZh === optJa && optZh.length > 0 && !/^[\d]+$/.test(optZh) && !/^[A-Za-z]{2,8}$/.test(optZh) && !/^[a-d]([、,][a-d])*$/.test(optZh)) {
              bindingErrors++;
              FAILURES.push({pkg: pkg, questionId: q.id, reason: 'correct option textZh identical to textJa'});
            }
          }
        }
      }
    }
  }
}

var report = {
  totalQuestions: totalQuestions,
  chineseExplanations: zhExplanations,
  japaneseExplanations: jaExplanations,
  missingExplanationZh: missingExplanationZh,
  bindingErrors: bindingErrors,
  japaneseFallback: japaneseFallback,
  failures: FAILURES.slice(0, 50)
};

console.log('=== Exam Explanation Chinese Audit ===');
console.log('Total questions:        ' + totalQuestions);
console.log('Chinese explanations:   ' + zhExplanations);
console.log('Japanese explanations:  ' + jaExplanations);
console.log('Missing explanationZh:  ' + missingExplanationZh);
console.log('Binding errors:         ' + bindingErrors);
console.log('Japanese fallback:      ' + japaneseFallback);

var passed = missingExplanationZh === 0 && bindingErrors === 0 && japaneseFallback === 0;
console.log('');
if (passed) {
  console.log('RESULT: PASS — All explanations complete');
  process.exit(0);
} else {
  console.log('RESULT: FAIL — ' + FAILURES.length + ' gaps (first 50 shown)');
  for (var f = 0; f < FAILURES.length && f < 50; f++) {
    console.log('  [' + FAILURES[f].pkg + '] ' + FAILURES[f].questionId + ': ' + FAILURES[f].reason);
  }
  process.exit(1);
}
