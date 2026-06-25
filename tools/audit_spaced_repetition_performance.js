'use strict';

var fs = require('fs');
var path = require('path');
var identity = require('../utils/spaced-repetition/identity');
var schema = require('../utils/spaced-repetition/schema');
var summary = require('../utils/spaced-repetition/summary');

var ROOT = path.resolve(__dirname, '..');
var now = 1700000000000;
var state = schema.createEmptyState(now);

for (var i = 0; i < 1930; i++) {
  var built = identity.createExamIdentity(i < 1486 ? 'itpass' : 'sg', 'deck-' + Math.floor(i / 100), 'q-' + i);
  var item = schema.createMemoryItem(built, now);
  item.state = 'REVIEW';
  item.dueAt = i === 0 ? now : now + 86400000;
  state.items[item.memoryItemId] = item;
}

var fullStart = Date.now();
var rebuilt = summary.deriveSummary(state, now, 540);
var fullElapsedMs = Date.now() - fullStart;
var before = state.items[Object.keys(state.items)[0]];
var after = schema.clone(before);
after.dueAt = now + 86400000;
var incrementStart = Date.now();
var incremental = summary.updateSummaryIncrementally(rebuilt, before, after, state, now, 540);
var incrementalElapsedMs = Date.now() - incrementStart;

var summaryKeys = Object.keys(rebuilt).sort();
var forbiddenSummaryKeys = summaryKeys.filter(function (key) { return key === 'items' || key === 'reviewLog'; });
var source = fs.readFileSync(path.join(ROOT, 'utils', 'spaced-repetition', 'summary.js'), 'utf8');
var incrementBody = source.slice(source.indexOf('function updateSummaryIncrementally'), source.indexOf('module.exports'));
var scansAllItemsDuringIncrement = /getItemsArray|for\s*\(|forEach\s*\(/.test(incrementBody);
var report = {
  status: !forbiddenSummaryKeys.length && !scansAllItemsDuringIncrement ? 'PASS' : 'FAIL',
  generatedItems: Object.keys(state.items).length,
  fullRebuildElapsedMs: fullElapsedMs,
  incrementalElapsedMs: incrementalElapsedMs,
  summaryKeys: summaryKeys,
  dueCountAfterIncrement: incremental.dueCount,
  forbiddenSummaryKeys: forbiddenSummaryKeys,
  scansAllItemsDuringIncrement: scansAllItemsDuringIncrement
};

var artifactDir = path.join(__dirname, 'test-artifacts', 'spaced-repetition-foundation');
fs.mkdirSync(artifactDir, { recursive: true });
fs.writeFileSync(path.join(artifactDir, 'audit_spaced_repetition_performance.json'), JSON.stringify(report, null, 2) + '\n');

if (process.argv.indexOf('--json') !== -1) process.stdout.write(JSON.stringify(report) + '\n');
else process.stdout.write((report.status === 'PASS' ? 'PASS' : 'FAIL') + ' spaced repetition performance audit\n' + JSON.stringify(report, null, 2) + '\n');
if (report.status !== 'PASS') process.exitCode = 1;
