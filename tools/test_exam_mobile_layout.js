'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');

var PKGS = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];
var failures = [];

for (var i = 0; i < PKGS.length; i++) {
  var pkg = PKGS[i];
  var cssPath = path.join(ROOT, 'packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxss');
  var wxmlPath = path.join(ROOT, 'packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxml');
  
  if (!fs.existsSync(cssPath)) { failures.push({pkg:pkg,test:'css_file',reason:'missing wxss'}); continue; }
  if (!fs.existsSync(wxmlPath)) { failures.push({pkg:pkg,test:'wxml_file',reason:'missing wxml'}); continue; }
  
  var css = fs.readFileSync(cssPath, 'utf8');
  var wxml = fs.readFileSync(wxmlPath, 'utf8');
  
  // Test 1: fc-feedback-detail should NOT have flex-direction:row
  if (/fc-feedback-detail.*flex-direction\s*:\s*row/.test(css)) {
    failures.push({pkg:pkg,test:'feedback_layout',reason:'fc-feedback-detail has flex-direction:row (would cause side-by-side)'});
  }
  
  // Test 2: fc-feedback-label should not use low-contrast color (#999 or lighter)
  if (/fc-feedback-label\s*\{[^}]*color\s*:\s*(#999|#aaa|#ccc|#ddd|rgba\([^)]*0\.[012][^)]*\))/i.test(css)) {
    failures.push({pkg:pkg,test:'label_contrast',reason:'fc-feedback-label has low-contrast color'});
  }
  
  // Test 3: verify selectedAnswerZh/correctAnswerZh references
  if (!/selectedOption\.textZh|correctOption\.textZh|hasTextZh/.test(wxml)) {
    failures.push({pkg:pkg,test:'option_zh_display',reason:'Chinese option text not rendered in feedback'});
  }
  
  // Test 4: next button exists
  if (!/nextCard|次の問題/.test(wxml)) {
    failures.push({pkg:pkg,test:'next_button',reason:'Next question button missing'});
  }
}

var passed = failures.length === 0;
console.log('=== Exam Mobile Layout Audit ===');
console.log('Packages checked: ' + PKGS.length);
console.log('Failures:          ' + failures.length);
for (var f = 0; f < failures.length; f++) {
  console.log('  [' + failures[f].pkg + '] ' + failures[f].test + ': ' + failures[f].reason);
}
console.log('');
console.log(passed ? 'RESULT: PASS — Mobile layout contract verified' : 'RESULT: FAIL');
process.exit(passed ? 0 : 1);
