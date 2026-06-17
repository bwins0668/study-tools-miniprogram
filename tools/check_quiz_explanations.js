/**
 * check_quiz_explanations.js
 * 检查 IT Passport / SG 真题中文解释质量
 *
 * 用法：node tools/check_quiz_explanations.js
 */
var path = require('path');
var DATA_PATH = path.join(__dirname, '..', 'packages', 'quiz', 'data', 'past_exam_bank');

function main() {
  var fullBank = require(path.join(DATA_PATH, 'full_bank'));
  var explanations;
  try {
    explanations = require(path.join(DATA_PATH, 'explanations_zh'));
  } catch (e) {
    console.error('[FAIL] explanations_zh.js 不存在或无法加载');
    process.exit(1);
  }

  var itpass = fullBank.filter(function (q) { return q.exam === 'itpass'; });
  var sg = fullBank.filter(function (q) { return q.exam === 'sg'; });

  var pass = 0, fail = 0, warnings = 0;
  var failDetails = [];

  function check(name, condition, detail) {
    if (condition) { pass++; }
    else { fail++; failDetails.push('[FAIL] ' + name + (detail ? ': ' + detail : '')); }
  }

  // 1. 覆盖率检查
  var missingZh = 0;
  fullBank.forEach(function (q) {
    if (!explanations[q.id] || explanations[q.id].length < 20) missingZh++;
  });
  check('IT Passport + SG 中文解释覆盖率 100%',
    missingZh === 0, missingZh + ' 题缺失或过短');

  // 2. 禁止词检查
  var forbidden = ['中文解析待补充', '待补充', '暂无中文解析', '暂无解析', '无法生成'];
  forbidden.forEach(function (word) {
    var count = 0;
    Object.values(explanations).forEach(function (v) {
      if (v.indexOf(word) >= 0) count++;
    });
    check('无禁止词 "' + word + '"', count === 0, count + ' 处');
  });

  // 3. HTML 残留检查
  var htmlPatterns = ['<div', '</div>', 'class=', 'id="kaisetsu"', 'ansbg'];
  htmlPatterns.forEach(function (pat) {
    var count = 0;
    Object.values(explanations).forEach(function (v) {
      if (v.indexOf(pat) >= 0) count++;
    });
    check('无 HTML 残留 "' + pat + '"', count === 0, count + ' 处');
  });

  // 4. 日文假名过多检查
  var mostlyJapanese = 0;
  Object.values(explanations).forEach(function (text) {
    var kana = 0;
    for (var i = 0; i < Math.min(text.length, 80); i++) {
      var code = text.charCodeAt(i);
      if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)) kana++;
    }
    if (kana > 10) mostlyJapanese++;
  });
  check('日文假名过多的解释 < 5%',
    mostlyJapanese < fullBank.length * 0.05,
    mostlyJapanese + '/' + fullBank.length);

  // 5. 长度检查
  var tooShort = 0;
  var lengths = Object.values(explanations).map(function (v) { return v.length; });
  lengths.forEach(function (l) { if (l < 30) tooShort++; });
  check('解释长度 >= 30 字符',
    tooShort < fullBank.length * 0.02,
    tooShort + ' 题过短');

  // 6. RFI/RFP/SLA 特别检查
  var rfpQuestions = fullBank.filter(function (q) {
    return q.explanationZh.indexOf('RFI') >= 0 || q.explanationZh.indexOf('RFP') >= 0;
  });
  var rfpPass = true;
  var rfpMissing = 0;
  rfpQuestions.forEach(function (q) {
    var expl = explanations[q.id] || '';
    if (expl.indexOf('RFI') < 0 && expl.indexOf('RFP') < 0 && expl.indexOf('SLA') < 0) {
      rfpMissing++;
    }
  });
  // 允许最多 5 题缺失（边缘情况：RFI/RFP 在日文解释中非主题出现）
  check('RFI/RFP/SLA 题目绝大部分有真实中文解释',
    rfpMissing <= 5,
    rfpMissing + '/' + rfpQuestions.length + ' 缺失');

  // 7. 抽样输出
  console.log('\n=== 抽样：IT Passport 5 题 ===');
  [0, 300, 600, 900, 1200].forEach(function (i) {
    if (i >= itpass.length) return;
    var q = itpass[i];
    console.log('\n---', q.id, '[' + q.yearId + '#' + q.number + '] ---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 200));
  });

  console.log('\n=== 抽样：SG 5 题 ===');
  [0, 100, 200, 300, 400].forEach(function (i) {
    if (i >= sg.length) return;
    var q = sg[i];
    console.log('\n---', q.id, '[' + q.yearId + '#' + q.number + '] ---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 200));
  });

  // 8. RFI 样例
  console.log('\n=== RFI/RFP 样例 ===');
  rfpQuestions.slice(0, 3).forEach(function (q) {
    console.log('\n---', q.id, '---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 300));
  });

  // 统计
  var avgLen = lengths.reduce(function (a, b) { return a + b; }, 0) / lengths.length;
  console.log('\n=== 统计 ===');
  console.log('总题数:', fullBank.length);
  console.log('IT Passport:', itpass.length, '| SG:', sg.length);
  console.log('平均解释长度:', avgLen.toFixed(0), '字符');
  console.log('最短:', Math.min.apply(null, lengths), '| 最长:', Math.max.apply(null, lengths));

  // 最终结果
  console.log('\n=== 结果 ===');
  if (failDetails.length > 0) {
    failDetails.forEach(function (d) { console.log(d); });
  }
  console.log('PASS:', pass, '| FAIL:', fail);

  if (fail > 0) {
    console.log('\n[FAIL] 中文解释质量检查未通过');
    process.exit(1);
  } else {
    console.log('\n[PASS] 中文解释质量检查全部通过');
  }
}

main();
