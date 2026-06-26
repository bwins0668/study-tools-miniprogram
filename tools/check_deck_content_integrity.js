#!/usr/bin/env node
'use strict';
/**
 * 26-deck content integrity validator.
 * Reads all question data files and produces a structured audit report.
 * No data is modified — this is a read-only validator.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var IGNORED = path.join(ROOT, 'tools', 'test-artifacts');
var REPORT_PATH = path.join(IGNORED, 'deck-content-audit-report.json');
var TEXT_REPORT_PATH = path.join(IGNORED, 'deck-content-audit.txt');

// ── Load all question modules ──
var PACKAGES = [
  'quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3',
  'quiz-itpass-4', 'quiz-itpass-5',
  'quiz-sg-1', 'quiz-sg-2'
];

var reports = [];
var totalCards = 0;
var totalDecks = 0;
var allCardIds = {};
var allDecks = {};

PACKAGES.forEach(function (pkg) {
  var questionsPath = path.join(ROOT, 'packages', pkg, 'data', 'questions.js');
  if (!fs.existsSync(questionsPath)) {
    reports.push({ package: pkg, error: 'questions.js not found', decks: [], cards: 0 });
    return;
  }

  var mod = require(questionsPath);
  var byYear = mod.questionsByYear || {};
  var years = Object.keys(byYear);

  var deckInfo = { package: pkg, decks: [], totalCardsInPackage: 0, errors: [], warnings: [] };

  years.forEach(function (yearId) {
    var cards = byYear[yearId] || [];
    deckInfo.decks.push({
      yearId: yearId,
      cardCount: cards.length,
      firstCardId: cards.length > 0 ? cards[0].id : null,
      lastCardId: cards.length > 0 ? cards[cards.length - 1].id : null
    });
    deckInfo.totalCardsInPackage += cards.length;
    totalCards += cards.length;

    cards.forEach(function (card, idx) {
      // Track unique card IDs
      var cid = String(card.id || '');
      var deckKey = pkg + '/' + yearId;
      if (!allDecks[deckKey]) allDecks[deckKey] = { count: 0 };
      allDecks[deckKey].count++;

      if (!cid) {
        deckInfo.errors.push({ yearId: yearId, cardIndex: idx, issue: 'MISSING_CARD_ID' });
      } else {
        var idKey = deckKey + '#' + cid;
        if (allCardIds[idKey]) {
          deckInfo.errors.push({ yearId: yearId, cardIndex: idx, issue: 'DUPLICATE_CARD_ID', cardId: cid });
        } else {
          allCardIds[idKey] = true;
        }
      }

      // Check required fields
      if (!card.questionJa && !card.questionZh) {
        deckInfo.warnings.push({ yearId: yearId, cardId: cid, issue: 'MISSING_QUESTION' });
      }

      // Check options
      var opts = card.options || card.choices || [];
      if (!Array.isArray(opts) || opts.length < 2) {
        deckInfo.errors.push({ yearId: yearId, cardId: cid, issue: 'INSUFFICIENT_OPTIONS', count: Array.isArray(opts) ? opts.length : 0 });
      } else {
        var answerId = String(card.answerId || card.answer || '');
        var foundAnswer = false;
        var seenKeys = {};
        opts.forEach(function (opt, oi) {
          var optKey = String(opt.id || opt.key || '');
          if (!optKey) {
            deckInfo.warnings.push({ yearId: yearId, cardId: cid, issue: 'OPTION_MISSING_KEY', optionIndex: oi });
          }
          if (seenKeys[optKey]) {
            deckInfo.warnings.push({ yearId: yearId, cardId: cid, issue: 'DUPLICATE_OPTION_KEY', optionKey: optKey });
          }
          seenKeys[optKey] = true;
          if (optKey === answerId) foundAnswer = true;
          if (!opt.textJa && !opt.text) {
            deckInfo.warnings.push({ yearId: yearId, cardId: cid, issue: 'OPTION_MISSING_TEXT', optionKey: optKey });
          }
        });
        if (!foundAnswer && answerId) {
          deckInfo.errors.push({ yearId: yearId, cardId: cid, issue: 'ANSWER_NOT_IN_OPTIONS', answerId: answerId });
        }
      }

      // Check answer ID
      if (!card.answerId && !card.answer) {
        deckInfo.errors.push({ yearId: yearId, cardId: cid, issue: 'MISSING_ANSWER' });
      }

      // Check explanations
      if (!card.explanationJa && !card.explanationZh) {
        deckInfo.warnings.push({ yearId: yearId, cardId: cid, issue: 'MISSING_EXPLANATION' });
      }
    });
  });

  totalDecks += years.length;
  reports.push(deckInfo);
});

// ── Compile summary ──
var totalErrors = 0;
var totalWarnings = 0;
var duplicateCardCandidates = [];

reports.forEach(function (r) {
  totalErrors += r.errors.length;
  totalWarnings += r.warnings.length;
});

// Write JSON report
var report = {
  auditedAt: Date.now(),
  totalDecks: totalDecks,
  totalCards: totalCards,
  totalErrors: totalErrors,
  totalWarnings: totalWarnings,
  packages: reports,
  deckCounts: allDecks
};

try { fs.mkdirSync(IGNORED, { recursive: true }); } catch (_) {}
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

// Write text report
var lines = [];
lines.push('=== 26-Deck Content Audit ===');
lines.push('Audited at: ' + new Date(report.auditedAt).toISOString());
lines.push('');
lines.push('Decks: ' + totalDecks + '  Cards: ' + totalCards);
lines.push('Errors: ' + totalErrors + '  Warnings: ' + totalWarnings);
lines.push('');

reports.forEach(function (r) {
  lines.push('── ' + r.package + ' ──');
  lines.push('  Cards: ' + r.totalCardsInPackage + '  Decks: ' + r.decks.length);
  lines.push('  Errors: ' + r.errors.length + '  Warnings: ' + r.warnings.length);

  r.decks.forEach(function (d) {
    lines.push('    ' + d.yearId + ': ' + d.cardCount + ' cards [' + d.firstCardId + ' .. ' + d.lastCardId + ']');
  });

  r.errors.forEach(function (e) {
    lines.push('  ERROR: ' + e.yearId + ' card=' + (e.cardId || '#' + e.cardIndex) + ' ' + e.issue + (e.answerId ? ' answer=' + e.answerId : '') + (e.count !== undefined ? ' count=' + e.count : ''));
  });
  r.warnings.forEach(function (w) {
    lines.push('  WARN:  ' + w.yearId + ' card=' + w.cardId + ' ' + w.issue + (w.optionKey ? ' key=' + w.optionKey : '') + (w.optionIndex !== undefined ? ' idx=' + w.optionIndex : ''));
  });
});

lines.push('');
lines.push('=== Summary ===');
lines.push('Decks: ' + totalDecks + '  Cards: ' + totalCards);
lines.push('Errors: ' + totalErrors + '  Warnings: ' + totalWarnings);
if (totalErrors > 0 || totalWarnings > 0) {
  lines.push('STATUS: NEEDS_REVIEW');
} else {
  lines.push('STATUS: PASS');
}

fs.writeFileSync(TEXT_REPORT_PATH, lines.join('\n'), 'utf-8');
console.log(lines.join('\n'));

process.exit(totalErrors > 0 ? 1 : (totalWarnings > 0 ? 0 : 0));
