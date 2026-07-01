// tools/check_java_originality.js
// Java Course Content Originality and Structure Gate
// Runs: node tools/check_java_originality.js [filePath]

const fs = require('fs');
const path = require('path');

// 1. 违禁/版权高危词列表 (防范搬运教材)
const FORBIDDEN_PATTERNS = [
  /StudentCard/i,                  // 抄袭教材 Outline 第5章标志类
  /Eclipseでの実（行|の）の手順/i,   // 教材特定工具操作说明
  /プログラムコードが実行されるまで/i, // 教材第1章特定标题
  /クラス名の省略/i,                // 教材第6章特定小节标题
  /空欄に当てはまる用語を選ぼう/i,      // 教材第6章末习题特征词
  /スーパークラスのコンストラクタ/i,    // 教材第7章特定用语
  /多重継承をしたい場合もある/i        // 教材第8章特定标题句
];

// 2. 检查变量名是否为空泛的 a, b, x, y, test, temp
const DUMMY_VARIABLE_REGEXP = /\b(int|double|float|long|short|byte|char|boolean|String|var)\s+([abxys]|test|temp|tmp|val|value|num|data)\b\s*=/i;

function runValidation(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    return { success: false, error: `File not found: ${filePath}` };
  }

  let data;
  try {
    data = require(resolvedPath);
  } catch (err) {
    return { success: false, error: `Failed to require file: ${err.message}` };
  }

  if (!data || !Array.isArray(data.chapters)) {
    return { success: false, error: "Root object must export a 'chapters' array." };
  }

  const violations = [];

  data.chapters.forEach((chapter, cIdx) => {
    const chLabel = `Chapter[${cIdx}] (${chapter.titleZh || 'No Title'})`;
    if (!chapter.id || !chapter.titleZh || !chapter.titleJa) {
      violations.push(`${chLabel} is missing required field(s) 'id', 'titleZh', or 'titleJa'.`);
    }

    if (!Array.isArray(chapter.lessons)) {
      violations.push(`${chLabel} is missing 'lessons' array.`);
      return;
    }

    chapter.lessons.forEach((lesson, lIdx) => {
      const lesLabel = `Lesson[${lesson.id || lIdx}] (${lesson.titleZh || 'No Title'}) under ${chLabel}`;
      
      // A. 验证结构完整性 (14个必填字段)
      const requiredFields = [
        'id', 'chapterId', 'titleZh', 'titleJa',
        'targetZh', 'targetJa',
        'motivationZh', 'motivationJa',
        'analogyZh', 'analogyJa',
        'explanationZh', 'explanationJa',
        'terminology', 'codeDemo', 'codeExplanation',
        'commonMisunderstandings', 'summaryZh', 'summaryJa',
        'connectionZh', 'connectionJa'
      ];

      requiredFields.forEach(field => {
        if (lesson[field] === undefined || lesson[field] === null || lesson[field] === '') {
          violations.push(`${lesLabel} is missing required field '${field}'.`);
        }
      });

      // B. 校验中日双语平衡性，防止直译或敷衍
      if (lesson.explanationZh && lesson.explanationJa) {
        const lenZh = lesson.explanationZh.length;
        const lenJa = lesson.explanationJa.length;
        const ratio = lenZh / lenJa;
        if (ratio < 0.2 || ratio > 4.0) {
          violations.push(`${lesLabel}: Explanation bilingual length ratio (${ratio.toFixed(2)}) is outside allowed range [0.2, 4.0]. (Zh: ${lenZh}, Ja: ${lenJa})`);
        }
        // 校验日文必须含有假名，不能纯汉字
        if (!/[\u3040-\u309F\u30A0-\u30FF]/.test(lesson.explanationJa)) {
          violations.push(`${lesLabel}: explanationJa does not contain any Japanese Hiragana/Katakana.`);
        }
      }

      // C. 版权和高危特定教材用词审查
      FORBIDDEN_PATTERNS.forEach(pat => {
        const fullContent = JSON.stringify(lesson);
        if (pat.test(fullContent)) {
          violations.push(`${lesLabel}: Contains forbidden textbook phrase/class name matching ${pat.toString()}`);
        }
      });

      // D. 代码变量命名原创性检测
      if (lesson.codeDemo) {
        if (DUMMY_VARIABLE_REGEXP.test(lesson.codeDemo)) {
          violations.push(`${lesLabel}: codeDemo uses non-descriptive dummy variable names (e.g. a, b, x, y, test, temp).`);
        }
        if (!lesson.codeDemo.includes('class')) {
          violations.push(`${lesLabel}: codeDemo is missing 'class' declaration.`);
        }
      }

      // E. 术语表 (terminology) 的格式检查
      if (Array.isArray(lesson.terminology)) {
        lesson.terminology.forEach((term, tIdx) => {
          if (!term.zh || !term.ja || !term.en) {
            violations.push(`${lesLabel}: Terminology[${tIdx}] is missing 'zh', 'ja', or 'en' properties.`);
          }
        });
      } else if (lesson.terminology) {
        violations.push(`${lesLabel}: 'terminology' must be an array.`);
      }

      // F. 常见误解 (commonMisunderstandings) 格式检查
      if (Array.isArray(lesson.commonMisunderstandings)) {
        lesson.commonMisunderstandings.forEach((mis, mIdx) => {
          if (!mis.titleZh || !mis.titleJa || !mis.descZh || !mis.descJa) {
            violations.push(`${lesLabel}: commonMisunderstandings[${mIdx}] is missing 'titleZh', 'titleJa', 'descZh', or 'descJa'.`);
          }
        });
      } else if (lesson.commonMisunderstandings) {
        violations.push(`${lesLabel}: 'commonMisunderstandings' must be an array.`);
      }
    });
  });

  return {
    success: violations.length === 0,
    violations: violations
  };
}

function main() {
  const defaultPath = path.join(__dirname, '../packages/java-course/data/course_data.js');
  const targetPath = process.argv[2] || defaultPath;

  console.log(`Running Java Originality Gate on: ${targetPath}`);
  const result = runValidation(targetPath);

  if (!result.success) {
    console.error(`\x1b[31mJava Originality Check FAILED:\x1b[0m`);
    if (result.error) {
      console.error(`  Error: ${result.error}`);
    }
    if (result.violations && result.violations.length > 0) {
      result.violations.forEach(v => console.error(`  - ${v}`));
    }
    process.exit(1);
  } else {
    console.log(`\x1b[32mJava Originality Check PASSED!\x1b[0m`);
    process.exit(0);
  }
}

// Export for test files
module.exports = {
  runValidation,
  FORBIDDEN_PATTERNS,
  DUMMY_VARIABLE_REGEXP
};

if (require.main === module) {
  main();
}
