'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');

// Load manifest
var manifest = require(path.join(ROOT, 'packages', 'quiz', 'data', 'flashcard-manifest'));
var allDecks = [];
allDecks = allDecks.concat(manifest.getDecksForCourse('itpass'));
allDecks = allDecks.concat(manifest.getDecksForCourse('sg'));

var report = { decksCovered: allDecks.length, results: [] };
var passed = true;

// Check each deck's flashcard-player has spaces repetition import
for (var i = 0; i < allDecks.length; i++) {
  var d = allDecks[i];
  var pp = path.join(ROOT, 'packages', d.packageName, 'pages', 'flashcard-player', 'flashcard-player.js');
  if (!fs.existsSync(pp)) {
    report.results.push({ deck: d.yearId, test: 'player_exists', status: 'FAIL' });
    passed = false; continue;
  }
  var content = fs.readFileSync(pp, 'utf8');
  var hasSRS = /spaced-repetition/.test(content);
  var hasLedger = /ledger|savePendingAction|recordGradeEvent/.test(content);
  
  report.results.push({
    deck: d.yearId, package: d.packageName,
    playerExists: true,
    hasSRSImport: hasSRS,
    hasLedgerLogic: hasLedger,
    status: hasSRS && hasLedger ? 'PASS' : 'FAIL'
  });
  if (!hasSRS || !hasLedger) passed = false;
}

console.log('=== Flashcard SRS Coverage Audit ===');
console.log('Total decks: ' + report.decksCovered);
console.log('With SRS:    ' + report.results.filter(function(r){return r.status==='PASS'}).length);
console.log('Missing SRS: ' + report.results.filter(function(r){return r.status!=='PASS'}).length);
console.log('');
for (var j = 0; j < report.results.length; j++) {
  var r = report.results[j];
  console.log((r.status==='PASS'?'✅':'❌') + ' ' + r.deck + ' | ' + r.package + ' | SRS=' + r.hasSRSImport + ' | Ledger=' + r.hasLedgerLogic);
}
console.log('');
console.log(passed ? 'RESULT: PASS — All ' + report.decksCovered + ' decks have SRS integration' : 'RESULT: FAIL');
process.exit(passed ? 0 : 1);
