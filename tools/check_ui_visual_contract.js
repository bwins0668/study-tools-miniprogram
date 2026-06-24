#!/usr/bin/env node
'use strict';

/*
 * Stable UI contract for the home service cards and flashcard center.
 * This intentionally checks structural facts only; it is not a pixel snapshot.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}
function requireMatch(content, expression, message) {
  if (!expression.test(content)) failures.push(message);
}
function forbidMatch(content, expression, message) {
  if (expression.test(content)) failures.push(message);
}
function balancedBraces(content, label) {
  var open = (content.match(/\{/g) || []).length;
  var close = (content.match(/\}/g) || []).length;
  if (open !== close) failures.push(label + ' has unbalanced braces: ' + open + '/' + close);
}

var homeWxml = read('pages/home/home.wxml');
var homeWxss = read('pages/home/home.wxss');
var flashcardsWxml = read('pages/flashcards/flashcards.wxml');
var flashcardsWxss = read('pages/flashcards/flashcards.wxss');
var flashcardsJs = read('pages/flashcards/flashcards.js');

requireMatch(homeWxml, /entry-card-itpass[\s\S]*?hover-class="home-card-pressed"/, 'home IT Passport card has no pressed-state contract');
requireMatch(homeWxml, /wrongQuestionCount\s*>\s*0/, 'mistakes badge no longer has its own count condition');
requireMatch(homeWxss, /\.entry-card::before[\s\S]*?border-radius:\s*50%/, 'ordinary service-card outline ring is missing');
forbidMatch(homeWxss, /\.entry-card-primary::before/, 'IT Passport still has a primary pseudo-element override');
requireMatch(homeWxss, /\.home-card-pressed[\s\S]*?scale\(0\.98\)/, 'home pressed state is missing 0.98 scale feedback');
requireMatch(read('pages/home/home.js'), /_releaseNavigationSoon[\s\S]*?600/, 'home navigation debounce is missing');
requireMatch(read('pages/home/home.js'), /onHide:\s*function[\s\S]*?_clearNavigationLock/, 'home navigation lock is not released on hide');

forbidMatch(flashcardsWxml, /course-icon-symbol/, 'flashcard center still renders the dash placeholder icon');
forbidMatch(flashcardsWxss, /course-icon-symbol|#6366f1/, 'flashcard center still contains placeholder or blue-purple icon styling');
requireMatch(flashcardsWxml, /course-icon-glyph-\{\{item\.iconKey\}\}/, 'dynamic course icon class is missing');
requireMatch(flashcardsWxml, /course-icon-glyph-stack/, 'knowledge-card stack icon key is missing');
requireMatch(flashcardsJs, /iconKey:\s*'document'/, 'IT Passport does not expose the document icon key');
requireMatch(flashcardsJs, /iconKey:\s*'shield'/, 'SG does not expose the shield icon key');
requireMatch(flashcardsWxml, /hover-class="flashcard-card-pressed"/, 'flashcard cards have no native pressed-state contract');
requireMatch(flashcardsJs, /_releaseNavigationSoon[\s\S]*?600/, 'flashcard navigation debounce is missing');
requireMatch(flashcardsJs, /onHide:\s*function[\s\S]*?_clearNavigationLock/, 'flashcard navigation lock is not released on hide');
forbidMatch(flashcardsJs, /past_exam_bank|flashcard_adapter|loadSubPackage\s*:\s*function/, 'flashcard center reintroduced a data/loading dependency outside its UI boundary');

balancedBraces(homeWxss, 'pages/home/home.wxss');
balancedBraces(flashcardsWxss, 'pages/flashcards/flashcards.wxss');

if (failures.length) {
  console.error('UI visual contract FAIL');
  failures.forEach(function (failure) { console.error('- ' + failure); });
  process.exit(1);
}
console.log('UI visual contract PASS');
console.log('home: no IT Passport solid-dot override; mistakes badge independent');
console.log('flashcards: document/shield/stack local monochrome icons; no dash placeholder');
console.log('interaction: native hover feedback and local navigation lock present');
