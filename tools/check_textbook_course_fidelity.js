#!/usr/bin/env node
'use strict';

/*
 * R5.2 textbook fidelity checker.
 *
 * This gate checks whether textbook lesson text is specific enough to be
 * reviewed. It intentionally does not read PDFs or mutate content; PDF source
 * review is tracked in the external R5.2 ledger.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var content = require(path.join(ROOT, 'packages/course-content/data/textbook-course.js'));
var questionData = require(path.join(ROOT, 'packages/quiz/data/course_questions.js'));
var questions = questionData.questions || [];
var questionsById = {};
questions.forEach(function (q) { questionsById[q.id] = q; });

var failures = [];

var FORBIDDEN_GENERIC_PHRASES = [
  '教材の該当ページに沿って',
  '目的、対象、使われる場面',
  '定義語を一つだけ覚えるのではなく',
  '教材ページの見出し語と周辺語',
  '出題では、名称そのものよりも',
  '似た語を語感だけで選ぶ',
  '関連語をすべて同じ意味として扱う',
  '先抓对象和目的',
  '拆成对象、动作、结果',
  '读选项时先判断对象是人、数据、系统还是组织',
  '不要凭词面感觉选答案'
];

function fail(message) {
  failures.push(message);
}

function parseArgs(argv) {
  var options = { all: false, exam: '', chapters: [] };
  for (var i = 2; i < argv.length; i++) {
    var arg = argv[i];
    if (arg === '--all') {
      options.all = true;
    } else if (arg === '--exam') {
      options.exam = argv[++i] || '';
    } else if (arg === '--chapters') {
      options.chapters = String(argv[++i] || '').split(',').map(function (item) {
        return item.trim().padStart(2, '0');
      }).filter(Boolean);
    } else if (arg === '--help' || arg === '-h') {
      printUsage(0);
    } else {
      fail('unknown argument: ' + arg);
    }
  }
  if (!options.all) {
    if (options.exam !== 'itpass' && options.exam !== 'sg') fail('use --all or --exam <itpass|sg>');
    if (!options.chapters.length) fail('use --chapters <01,02,...> with --exam');
  }
  return options;
}

function printUsage(exitCode) {
  console.log([
    'Usage:',
    '  node tools/check_textbook_course_fidelity.js --all',
    '  node tools/check_textbook_course_fidelity.js --exam itpass --chapters 01,02,03',
    '  node tools/check_textbook_course_fidelity.js --exam sg --chapters 01,02,03'
  ].join('\n'));
  process.exit(exitCode);
}

function effectiveLength(text) {
  return String(text || '').replace(/\s+/g, '').length;
}

function normalize(text) {
  return String(text || '')
    .replace(/\s+/g, '')
    .replace(/[「」『』【】［］\[\]（）()]/g, '')
    .toLowerCase();
}

function stripLeadingNumber(title) {
  return String(title || '').replace(/^\d+(?:-\d+)*\s*/, '').trim();
}

function splitTerms(text) {
  return String(text || '')
    .replace(/^\d+(?:-\d+)*\s*/, '')
    .split(/[、，・\/／（）()\s]+/)
    .map(function (item) { return item.trim(); })
    .filter(function (item) { return item.length >= 2 && !/^(第|章|演習問題|解説)$/.test(item); });
}

function unitKeywords(unit) {
  var words = [];
  words = words.concat(splitTerms(unit.titleJa));
  (unit.sourceRefs || []).forEach(function (ref) {
    words = words.concat(ref.anchorTermsJa || []);
  });
  (unit.sections || []).forEach(function (section) {
    words = words.concat(section.englishTerms || []);
  });
  words.push(stripLeadingNumber(unit.titleJa));
  var seen = {};
  return words.map(function (word) { return String(word || '').trim(); })
    .filter(function (word) {
      if (!word || word.length < 2) return false;
      if (seen[word]) return false;
      seen[word] = true;
      return true;
    });
}

function containsKeyword(text, unit) {
  var normalized = normalize(text);
  return unitKeywords(unit).some(function (word) {
    return normalized.indexOf(normalize(word)) >= 0;
  });
}

function hasContrastLanguage(text, unit) {
  var value = String(text || '');
  var markers = [
    '混同', '区別', 'ではなく', '一方', '対して', '違い', '誤り', '誤答',
    '条件', '場合', '優先', '比較', '逆', 'だけ', 'ない', 'ずに', '混淆',
    '而不是', '区别', '条件', '场景', '混同', '混淆', '误把', '相反'
  ];
  var hasMarker = markers.some(function (marker) { return value.indexOf(marker) >= 0; });
  return hasMarker && containsKeyword(value, unit);
}

function includesForbiddenGeneric(text) {
  return FORBIDDEN_GENERIC_PHRASES.filter(function (phrase) {
    return String(text || '').indexOf(phrase) >= 0;
  });
}

function validateLength(value, min, field) {
  if (effectiveLength(value) < min) {
    fail(field + ' too short: ' + effectiveLength(value) + ' < ' + min);
  }
}

function collectUnits(options) {
  if (options.all) return content.units.slice();
  var wanted = {};
  options.chapters.forEach(function (chapter) {
    wanted[options.exam + '-ch' + chapter] = true;
  });
  return content.units.filter(function (unit) {
    return unit.exam === options.exam && wanted[unit.chapterId];
  });
}

function assertNoDuplicate(units, getValue, label) {
  var byValue = {};
  units.forEach(function (unit) {
    var value = normalize(getValue(unit));
    if (!value) return;
    (byValue[value] || (byValue[value] = [])).push(unit.id);
  });
  Object.keys(byValue).forEach(function (value) {
    if (byValue[value].length > 1) {
      fail(label + ' exact duplicate across units: ' + byValue[value].join(', '));
    }
  });
}

function validateSourceRef(unit, ref, sourceById) {
  if (!ref || ref.verificationStatus !== 'verified') fail(unit.id + ' sourceRef must be verified');
  var source = sourceById[ref.sourceId];
  if (!source) {
    fail(unit.id + ' unknown sourceId: ' + ref.sourceId);
    return;
  }
  if (!Number.isInteger(ref.pdfPageStart) || !Number.isInteger(ref.pdfPageEnd)) {
    fail(unit.id + ' sourceRef pages must be integers');
  } else if (ref.pdfPageStart < 1 || ref.pdfPageEnd < ref.pdfPageStart || ref.pdfPageEnd > source.pdfPageCount) {
    fail(unit.id + ' sourceRef page range out of bounds');
  }
  if (!Array.isArray(ref.anchorTermsJa) || !ref.anchorTermsJa.length) {
    fail(unit.id + ' sourceRef anchorTermsJa required');
  }
}

function validateQuestionLinks(unit) {
  if (unit.practiceStatus === 'no_existing_course_question' && (unit.relatedQuestionIds || []).length > 0) {
    fail(unit.id + ' no_existing_course_question must not contain relatedQuestionIds');
  }
  (unit.relatedQuestionIds || []).forEach(function (qid) {
    var question = questionsById[qid];
    if (!question) {
      fail(unit.id + ' relatedQuestionId missing: ' + qid);
      return;
    }
    if (question.exam !== unit.exam) fail(unit.id + ' relatedQuestionId cross-exam: ' + qid);
    if (question.sourceType !== 'lesson_quiz') fail(unit.id + ' relatedQuestionId must be lesson_quiz: ' + qid);
  });
}

function validateNoForbiddenPayload(unit) {
  var text = JSON.stringify(unit);
  if (/[A-Za-z]:\\|G:\\|data:application\/pdf|base64,|%PDF|TODO|placeholder|UNKNOWN/i.test(text)) {
    fail(unit.id + ' contains forbidden local path, PDF/base64, TODO, placeholder, or UNKNOWN text');
  }
}

function validateUnit(unit, sourceById) {
  validateLength(unit.overviewJa, 90, unit.id + '.overviewJa');
  validateLength(unit.overviewZh, 70, unit.id + '.overviewZh');

  includesForbiddenGeneric(unit.overviewJa + '\n' + unit.overviewZh).forEach(function (phrase) {
    fail(unit.id + ' overview still contains generic template phrase: ' + phrase);
  });

  if (!Array.isArray(unit.sections) || !unit.sections.length) fail(unit.id + ' sections required');
  if (!Array.isArray(unit.sourceRefs) || !unit.sourceRefs.length) fail(unit.id + ' sourceRefs required');

  (unit.sourceRefs || []).forEach(function (ref) { validateSourceRef(unit, ref, sourceById); });
  validateQuestionLinks(unit);
  validateNoForbiddenPayload(unit);

  (unit.sections || []).forEach(function (section, index) {
    var prefix = unit.id + '.sections[' + index + ']';
    validateLength(section.explanationJa, 180, prefix + '.explanationJa');
    validateLength(section.explanationZh, 130, prefix + '.explanationZh');
    validateLength(section.examFocusJa, 45, prefix + '.examFocusJa');
    validateLength(section.examFocusZh, 35, prefix + '.examFocusZh');
    validateLength(section.commonMistakeJa, 45, prefix + '.commonMistakeJa');
    validateLength(section.commonMistakeZh, 35, prefix + '.commonMistakeZh');

    includesForbiddenGeneric([
      section.explanationJa, section.explanationZh, section.examFocusJa,
      section.examFocusZh, section.commonMistakeJa, section.commonMistakeZh
    ].join('\n')).forEach(function (phrase) {
      fail(prefix + ' still contains generic template phrase: ' + phrase);
    });

    if (!containsKeyword(section.examFocusJa, unit)) {
      fail(prefix + '.examFocusJa must include a title, anchor, or English keyword');
    }
    if (!hasContrastLanguage(section.commonMistakeJa, unit)) {
      fail(prefix + '.commonMistakeJa must include a concrete contrast/mistake relationship and unit keyword');
    }
    if (!hasContrastLanguage(section.commonMistakeZh, unit)) {
      fail(prefix + '.commonMistakeZh must include a concrete contrast/mistake relationship and unit keyword');
    }

    var reducedJa = normalize(section.explanationJa).replace(normalize(stripLeadingNumber(unit.titleJa)), '');
    var reducedZh = normalize(section.explanationZh).replace(normalize(unit.titleZh), '');
    if (reducedJa.length < 120) fail(prefix + '.explanationJa appears to mostly restate the title');
    if (reducedZh.length < 90) fail(prefix + '.explanationZh appears to mostly restate the title');

    if (!Array.isArray(section.sourceRefs) || !section.sourceRefs.length) {
      fail(prefix + ' verified sourceRefs required');
    } else {
      section.sourceRefs.forEach(function (ref) { validateSourceRef(unit, ref, sourceById); });
    }
  });
}

function main() {
  var options = parseArgs(process.argv);
  if (failures.length) printResultAndExit();

  var selected = collectUnits(options);
  if (!selected.length) fail('no units selected');

  var sourceById = {};
  (content.sources || []).forEach(function (source) { sourceById[source.sourceId] = source; });

  selected.forEach(function (unit) { validateUnit(unit, sourceById); });

  ['itpass', 'sg'].forEach(function (exam) {
    var examUnits = selected.filter(function (unit) { return unit.exam === exam; });
    if (!examUnits.length) return;
    assertNoDuplicate(examUnits, function (unit) { return (unit.sections || []).map(function (s) { return s.examFocusJa; }).join('\n'); }, exam + ' examFocusJa');
    assertNoDuplicate(examUnits, function (unit) { return (unit.sections || []).map(function (s) { return s.examFocusZh; }).join('\n'); }, exam + ' examFocusZh');
    assertNoDuplicate(examUnits, function (unit) { return (unit.sections || []).map(function (s) { return s.commonMistakeJa; }).join('\n'); }, exam + ' commonMistakeJa');
    assertNoDuplicate(examUnits, function (unit) { return (unit.sections || []).map(function (s) { return s.commonMistakeZh; }).join('\n'); }, exam + ' commonMistakeZh');
  });

  assertNoDuplicate(selected, function (unit) { return (unit.sections || []).map(function (s) { return s.explanationJa; }).join('\n'); }, 'explanationJa');
  assertNoDuplicate(selected, function (unit) { return (unit.sections || []).map(function (s) { return s.explanationZh; }).join('\n'); }, 'explanationZh');

  if (options.all) {
    var seenByExam = {};
    content.units.forEach(function (unit) {
      var text = normalize((unit.sections || []).map(function (s) { return s.explanationJa + '\n' + s.explanationZh; }).join('\n'));
      if (!seenByExam[text]) seenByExam[text] = {};
      if (!seenByExam[text][unit.exam]) seenByExam[text][unit.exam] = [];
      seenByExam[text][unit.exam].push(unit.id);
    });
    Object.keys(seenByExam).forEach(function (text) {
      var exams = Object.keys(seenByExam[text]);
      if (exams.length > 1) {
        fail('cross-exam exact explanation reuse: ' + JSON.stringify(seenByExam[text]));
      }
    });
  }

  printResultAndExit(selected);
}

function printResultAndExit(selected) {
  if (failures.length) {
    console.error('TEXTBOOK COURSE FIDELITY FAIL (' + failures.length + ')');
    failures.slice(0, 200).forEach(function (message) { console.error('  - ' + message); });
    if (failures.length > 200) console.error('  ... ' + (failures.length - 200) + ' more');
    process.exit(1);
  }
  console.log('TEXTBOOK COURSE FIDELITY PASS — ' + selected.length + ' unit(s) checked for specificity, duplicates, sourceRefs, and question links');
}

main();
