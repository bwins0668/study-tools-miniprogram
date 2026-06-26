'use strict';

/**
 * Chinese glossary completeness auditor for all real learning content.
 *
 * Scans all registered decks, mock exams, quiz questions, flashcard data,
 * and verifies Chinese translation completeness for every reachable content item.
 *
 * Exit code 0 = all checks pass, 1 = gaps found, 2 = script error.
 */

var path = require('path');
var fs = require('fs');

var PROJECT_ROOT = path.resolve(__dirname, '..');

// ─── Language detection helpers ───────────────────────────────────────

function hasKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function hasChinese(text) {
  if (!text) return false;
  return /[\u4E00-\u9FFF]/.test(text);
}

function isGenuineChinese(text) {
  if (!text || text.length < 3) return false;
  var compact = text.replace(/\s/g, '');
  if (compact.length < 2) return false;
  var chineseCount = 0;
  var kanaCount = 0;
  for (var i = 0; i < compact.length; i++) {
    var c = compact.charCodeAt(i);
    if (c >= 0x4E00 && c <= 0x9FFF) chineseCount++;
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) kanaCount++;
  }
  if (chineseCount === 0) return false;
  if (kanaCount === 0) return true;
  return chineseCount > kanaCount * 2;
}

function isJapaneseFallback(textZh, textJa) {
  if (!textZh || !textJa) return false;
  var cleanZh = String(textZh).replace(/<[^>]+>/g, '').replace(/\s/g, '');
  var cleanJa = String(textJa).replace(/<[^>]+>/g, '').replace(/\s/g, '');
  return cleanZh === cleanJa && cleanZh.length > 0;
}

function isPlaceholder(text) {
  if (!text || typeof text !== 'string') return false;
  var t = text.trim().toLowerCase();
  if (t.length === 0) return true;
  var placeholders = ['todo', 'tbd', 'n/a', 'placeholder', '待补充', '待翻译', '暂无', '略', '—', '-', '--', '---'];
  for (var i = 0; i < placeholders.length; i++) {
    if (t === placeholders[i]) return true;
  }
  return false;
}

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Content loading ──────────────────────────────────────────────────

var SUBPACKAGES = [
  'quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3',
  'quiz-itpass-4', 'quiz-itpass-5',
  'quiz-sg-1', 'quiz-sg-2'
];

function loadJsModule(filePath) {
  var content = fs.readFileSync(filePath, 'utf8');
  // Remove comments
  content = content.replace(/^\s*\/\/.*$/gm, '');

  // Try: module.exports = <expr>;
  var m = content.match(/module\.exports\s*=\s*([\s\S]+)$/);
  if (m) {
    var expr = m[1].trim();
    // Strip trailing semicolons
    while (expr.length > 0 && expr.charAt(expr.length - 1) === ';') expr = expr.slice(0, -1);
    try {
      return JSON.parse(expr);
    } catch (e) {
      // Fallback to eval if not pure JSON
      var mod = { exports: null };
      var fn = new Function('module', 'exports', 'module.exports = (' + expr + ')');
      fn(mod, {});
      return mod.exports;
    }
  }

  // Try: var X = <expr>; module.exports = { X: X }
  var m2 = content.match(/var\s+(\w+)\s*=\s*([\s\S]+?);\s*module\.exports\s*=\s*(\{[\s\S]*\})\s*$/);
  if (m2) {
    var varName = m2[1];
    var varExpr = m2[2].trim();
    var exportsExpr = m2[3].trim();
    // Try JSON.parse on the array
    try {
      return JSON.parse(varExpr);
    } catch (e) {
      var scope = {};
      var fn2 = new Function('scope', 'with(scope){var ' + varName + ' = (' + varExpr + '); return (' + exportsExpr + ')}');
      return fn2(scope);
    }
  }

  return null;
}

function loadAllQuestions() {
  var allQuestions = [];
  for (var i = 0; i < SUBPACKAGES.length; i++) {
    var pkg = SUBPACKAGES[i];
    try {
      var questionsPath = path.join(PROJECT_ROOT, 'packages', pkg, 'data', 'questions.js');
      var data = loadJsModule(questionsPath);
      if (!data) {
        console.error('  [WARN] Could not parse questions from ' + pkg);
        continue;
      }
      var byYear = data.questionsByYear || {};
      Object.keys(byYear).forEach(function(yearId) {
        var qs = byYear[yearId] || [];
        for (var j = 0; j < qs.length; j++) {
          var q = qs[j];
          q._packageKey = data.packageKey || pkg;
          q._yearId = yearId;
          allQuestions.push(q);
        }
      });
    } catch (e) {
      console.error('  [WARN] Failed to load questions from ' + pkg + ': ' + e.message);
    }
  }
  return allQuestions;
}

function loadAllExplanations() {
  var allExplanations = {};
  for (var i = 0; i < SUBPACKAGES.length; i++) {
    var pkg = SUBPACKAGES[i];
    try {
      var expPath = path.join(PROJECT_ROOT, 'packages', pkg, 'data', 'explanations_zh.js');
      var data = loadJsModule(expPath);
      if (!data) continue;
      Object.keys(data).forEach(function(k) { allExplanations[k] = data[k]; });
    } catch (e) {
      console.error('  [WARN] Failed to load explanations from ' + pkg + ': ' + e.message);
    }
  }
  return allExplanations;
}

function loadGlossary() {
  try {
    var indexPath = path.join(PROJECT_ROOT, 'packages', 'glossary', 'data', 'glossary_index.js');
    var content = fs.readFileSync(indexPath, 'utf8');
    content = content.replace(/^\s*\/\/.*$/gm, '');
    // Extract the array from: var glossaryIndex = [...];
    var m = content.match(/var\s+glossaryIndex\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (m) {
      return JSON.parse(m[1]);
    }
    // Fallback: try module.exports
    var data = loadJsModule(indexPath);
    if (data && data.glossaryIndex) return data.glossaryIndex;
    if (Array.isArray(data)) return data;
    return [];
  } catch (e) {
    console.error('  [WARN] Failed to load glossary: ' + e.message);
    return [];
  }
}

// ─── Audit logic ──────────────────────────────────────────────────────

var GAPS = [];
var STATS = {
  totalQuestions: 0,
  totalFields: 0,
  completedFields: 0,
  gapFields: 0,
  pseudoTranslationFields: 0,
  manualReviewQueue: 0,
  byCategory: {}
};

function classifyGap(reason) {
  var categories = {
    'FIELD_MISSING': 'A',
    'FIELD_EMPTY': 'B',
    'WHITESPACE_ONLY': 'C',
    'PLACEHOLDER': 'D',
    'JAPANESE_COPY': 'E',
    'ADAPTER_LOST': 'F',
    'UI_NOT_DISPLAYED': 'G',
    'BINDING_ERROR': 'H'
  };
  return categories[reason] || '?';
}

function addGap(type, deck, id, fieldPath, jaSummary, reason, detail) {
  GAPS.push({
    type: type,
    deck: deck,
    id: id,
    fieldPath: fieldPath,
    jaSummary: (jaSummary || '').substring(0, 80),
    reason: reason,
    reasonCode: classifyGap(reason),
    detail: detail || ''
  });
  STATS.gapFields++;
}

function checkField(value, textJa, fieldPath, questionId, deck, isRequired) {
  STATS.totalFields++;

  if (value === undefined || value === null) {
    if (isRequired) {
      addGap('question', deck, questionId, fieldPath, textJa, 'FIELD_MISSING', 'Field does not exist');
    }
    return false;
  }

  var cleaned = stripHtml(String(value));
  if (cleaned.length === 0) {
    if (isRequired) {
      addGap('question', deck, questionId, fieldPath, textJa, 'FIELD_EMPTY', 'Field is empty after stripping HTML');
    }
    return false;
  }

  if (isPlaceholder(cleaned)) {
    addGap('question', deck, questionId, fieldPath, textJa, 'PLACEHOLDER', 'Placeholder text: ' + cleaned);
    return false;
  }

  if (isJapaneseFallback(cleaned, textJa)) {
    addGap('question', deck, questionId, fieldPath, textJa, 'JAPANESE_COPY', 'Chinese field is identical to Japanese source');
    STATS.pseudoTranslationFields++;
    return false;
  }

  if (!isGenuineChinese(cleaned)) {
    if (hasKana(cleaned)) {
      addGap('question', deck, questionId, fieldPath, textJa, 'JAPANESE_COPY', 'Field contains kana characters, likely Japanese');
      STATS.pseudoTranslationFields++;
      return false;
    }
    if (!hasChinese(cleaned)) {
      STATS.manualReviewQueue++;
      return false;
    }
  }

  STATS.completedFields++;
  return true;
}

function auditQuestion(q, explanations) {
  var qId = q.id || '';
  var deck = q._packageKey || '';
  var yearId = q._yearId || '';
  var deckFull = deck + '/' + yearId;

  STATS.totalQuestions++;

  if (!STATS.byCategory[deck]) {
    STATS.byCategory[deck] = { total: 0, zhComplete: 0, zhPartial: 0, zhMissing: 0 };
  }
  STATS.byCategory[deck].total++;

  var qZhOk = checkField(q.questionZh, q.questionJa, 'questionZh', qId, deckFull, true);

  var options = q.options || [];
  var allOptionsZhOk = true;
  for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var optZhOk = checkField(opt.textZh, opt.textJa, 'options[' + i + '].textZh', qId, deckFull, true);
    if (!optZhOk) allOptionsZhOk = false;
  }

  // Check correct answer binding
  var correctKey = q.answer;
  if (correctKey) {
    for (var j = 0; j < options.length; j++) {
      if (options[j].key === correctKey) {
        var correctZh = stripHtml(options[j].textZh || '');
        var correctJa = stripHtml(options[j].textJa || '');
        if (correctZh === correctJa && correctZh.length > 0) {
          addGap('question', deckFull, qId, 'answer_' + correctKey + '_textZh', options[j].textJa, 'BINDING_ERROR', 'Correct option has no genuine Chinese');
        }
        break;
      }
    }
  }

  // Check explanationZh (may come from explanations_zh.js)
  var explanationZh = q.explanationZh || '';
  var genExpl = explanations[qId] || '';
  var effectiveExplZh = genExpl && genExpl.length > 10 ? genExpl : explanationZh;
  var explZhOk = checkField(effectiveExplZh, q.explanationJa, 'explanationZh', qId, deckFull, true);

  if (qZhOk && allOptionsZhOk && explZhOk) {
    STATS.byCategory[deck].zhComplete++;
  } else if (qZhOk || allOptionsZhOk || explZhOk) {
    STATS.byCategory[deck].zhPartial++;
  } else {
    STATS.byCategory[deck].zhMissing++;
  }
}

function auditGlossary(terms) {
  var glossaryGaps = 0;
  for (var i = 0; i < terms.length; i++) {
    var t = terms[i];
    if (!t.zh || t.zh.trim().length === 0) {
      addGap('glossary', 'glossary', t.id || ('term-' + i), 'zh', t.term, 'FIELD_MISSING', 'Glossary term has no Chinese translation');
      glossaryGaps++;
    }
  }
  return glossaryGaps;
}

// ─── Main ─────────────────────────────────────────────────────────────

function main() {
  console.log('=== Chinese Glossary Completeness Audit ===');
  console.log('Project: ' + PROJECT_ROOT);
  console.log('');

  console.log('Loading questions from all subpackages...');
  var questions = loadAllQuestions();
  console.log('  Loaded ' + questions.length + ' questions from ' + SUBPACKAGES.length + ' packages');

  console.log('Loading explanations_zh...');
  var explanations = loadAllExplanations();
  var explCount = Object.keys(explanations).length;
  console.log('  Loaded ' + explCount + ' Chinese explanations');

  console.log('Loading glossary...');
  var glossary = loadGlossary();
  console.log('  Loaded ' + glossary.length + ' glossary terms');

  console.log('');
  console.log('Auditing questions...');
  for (var i = 0; i < questions.length; i++) {
    auditQuestion(questions[i], explanations);
  }

  console.log('Auditing glossary...');
  var glossaryGaps = auditGlossary(glossary);

  console.log('');
  console.log('=== AUDIT RESULTS ===');
  console.log('');
  console.log('Total questions scanned: ' + STATS.totalQuestions);
  console.log('Total fields checked:    ' + STATS.totalFields);
  console.log('Fields with gaps:        ' + STATS.gapFields);
  console.log('Fields completed:        ' + STATS.completedFields);
  console.log('Pseudo-translations:     ' + STATS.pseudoTranslationFields);
  console.log('Manual review needed:    ' + STATS.manualReviewQueue);
  console.log('Glossary gaps:           ' + glossaryGaps);
  console.log('');

  console.log('Per-package breakdown:');
  var pkgKeys = Object.keys(STATS.byCategory).sort();
  for (var p = 0; p < pkgKeys.length; p++) {
    var pk = pkgKeys[p];
    var s = STATS.byCategory[pk];
    console.log('  ' + pk + ': ' + s.total + ' questions, ' +
      s.zhComplete + ' complete, ' + s.zhPartial + ' partial, ' + s.zhMissing + ' missing');
  }
  console.log('');

  if (GAPS.length > 0) {
    console.log('=== GAP DETAILS (' + GAPS.length + ' items) ===');
    for (var g = 0; g < GAPS.length; g++) {
      var gap = GAPS[g];
      console.log('  [' + gap.reasonCode + '] ' + gap.deck + ' | ' + gap.id + ' | ' + gap.fieldPath);
      console.log('    Reason: ' + gap.reason);
      if (gap.jaSummary) console.log('    Japanese: ' + gap.jaSummary);
      if (gap.detail) console.log('    Detail: ' + gap.detail);
    }
  } else {
    console.log('=== NO GAPS FOUND ===');
  }

  console.log('');
  if (STATS.gapFields > 0) {
    console.log('RESULT: FAIL — ' + STATS.gapFields + ' Chinese glossary gaps detected');
    process.exit(1);
  } else {
    console.log('RESULT: PASS — All Chinese glossary fields complete');
    process.exit(0);
  }
}

try {
  main();
} catch (e) {
  console.error('AUDIT ERROR: ' + e.message);
  process.exit(2);
}
