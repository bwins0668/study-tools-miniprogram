// tools/check_java_originality_selftest.js
// Runs self-tests on the Java originality check tool using mock positive and negative samples.
// Runs: node tools/check_java_originality_selftest.js

const fs = require('fs');
const path = require('path');
const { runValidation } = require('./check_java_originality');

const TEMP_DIR = path.join(__dirname, '../scratch');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 1. 定义合规的正向样本
const POSITIVE_DATA = {
  chapters: [
    {
      id: "ch-java-test",
      titleZh: "测试章",
      titleJa: "テスト章",
      lessons: [
        {
          id: "lesson-java-test-01",
          chapterId: "ch-java-test",
          titleZh: "原创Java概念",
          titleJa: "オリジナルの概念",
          targetZh: "本节目标是学些东西",
          targetJa: "この目標は何かを学ぶことです",
          motivationZh: "为什么我们需要这个概念的中文阐明",
          motivationJa: "なぜこれが必要なのかの日本語の説明",
          analogyZh: "一个精致的生活类比例子，比如咖啡机",
          analogyJa: "スマートコーヒーメーカーのような比喩的な例",
          explanationZh: "这里有长篇大论的中文解释，说明这个Java知识点是如何工作的，初学者为什么能够很方便地看懂它。",
          explanationJa: "これはオリジナルの日本語での丁寧な説明文です。日本のIT教育のスタイルや言葉遣いに寄り添って記述されており、カナも含まれています。",
          terminology: [
            { zh: "类", ja: "クラス", en: "class" }
          ],
          codeDemo: "public class KitchenRobot {\n  public static void main(String[] args) {\n    int hourlyWage = 1200;\n    System.out.println(hourlyWage);\n  }\n}",
          codeExplanation: [
            "第一行是类声明。",
            "第二行是程序入口。"
          ],
          commonMisunderstandings: [
            {
              titleZh: "常见误区",
              titleJa: "よくある誤解",
              descZh: "中文说明误区细节",
              descJa: "日本語での誤解の説明"
            }
          ],
          summaryZh: "一句话小结中文",
          summaryJa: "日本語でのまとめ",
          connectionZh: "下一节预告中文",
          connectionJa: "日本語での次回予告"
        }
      ]
    }
  ]
};

// 2. 负向样本 A：含有教材违禁词 StudentCard
const NEGATIVE_DATA_COPYRIGHT = JSON.parse(JSON.stringify(POSITIVE_DATA));
NEGATIVE_DATA_COPYRIGHT.chapters[0].lessons[0].codeDemo = "public class StudentCard { }";

// 3. 负向样本 B：缺少 analogy 板块
const NEGATIVE_DATA_MISSING_ANALOGY = JSON.parse(JSON.stringify(POSITIVE_DATA));
delete NEGATIVE_DATA_MISSING_ANALOGY.chapters[0].lessons[0].analogyZh;

// 4. 负向样本 C：含有空泛变量命名
const NEGATIVE_DATA_DUMMY_VAR = JSON.parse(JSON.stringify(POSITIVE_DATA));
NEGATIVE_DATA_DUMMY_VAR.chapters[0].lessons[0].codeDemo = "public class KitchenRobot {\n  void work() {\n    int a = 10;\n  }\n}";

// 5. 负向样本 D：双语字数极端失衡
const NEGATIVE_DATA_IMBALANCE = JSON.parse(JSON.stringify(POSITIVE_DATA));
NEGATIVE_DATA_IMBALANCE.chapters[0].lessons[0].explanationJa = "はい"; // 只有2个字

// 6. 负向样本 E：日文只有汉字无假名
const NEGATIVE_DATA_NO_KANA = JSON.parse(JSON.stringify(POSITIVE_DATA));
NEGATIVE_DATA_NO_KANA.chapters[0].lessons[0].explanationJa = "日本電子計算機機能"; // 无假名

function writeTempConfig(name, obj) {
  const file = path.join(TEMP_DIR, `temp_self_test_${name}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf-8');
  return file;
}

function cleanUpFile(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {}
}

function runSelfTests() {
  console.log("=== Starting Java Originality Gate Self-Tests ===");

  let testPassed = true;

  // Test 1: 正向样本通过
  const fPos = writeTempConfig('positive', POSITIVE_DATA);
  const rPos = runValidation(fPos);
  cleanUpFile(fPos);
  if (rPos.success) {
    console.log("PASS: Positive sample correctly accepted.");
  } else {
    console.error("FAIL: Positive sample was rejected! Violations:", rPos.violations);
    testPassed = false;
  }

  // Test 2: 拦截 StudentCard 违禁词
  const fNegA = writeTempConfig('neg_copyright', NEGATIVE_DATA_COPYRIGHT);
  const rNegA = runValidation(fNegA);
  cleanUpFile(fNegA);
  if (!rNegA.success && rNegA.violations.some(v => v.includes("forbidden textbook phrase"))) {
    console.log("PASS: Negative sample with copyright issue correctly intercepted.");
  } else {
    console.error("FAIL: Failed to intercept copyright violation! Result:", rNegA);
    testPassed = false;
  }

  // Test 3: 拦截缺失 analogy 属性
  const fNegB = writeTempConfig('neg_missing', NEGATIVE_DATA_MISSING_ANALOGY);
  const rNegB = runValidation(fNegB);
  cleanUpFile(fNegB);
  if (!rNegB.success && rNegB.violations.some(v => v.includes("missing required field 'analogyZh'"))) {
    console.log("PASS: Negative sample with missing required fields correctly intercepted.");
  } else {
    console.error("FAIL: Failed to intercept missing field! Result:", rNegB);
    testPassed = false;
  }

  // Test 4: 拦截空泛变量命名 int a = 10
  const fNegC = writeTempConfig('neg_dummy', NEGATIVE_DATA_DUMMY_VAR);
  const rNegC = runValidation(fNegC);
  cleanUpFile(fNegC);
  if (!rNegC.success && rNegC.violations.some(v => v.includes("uses non-descriptive dummy variable names"))) {
    console.log("PASS: Negative sample with dummy variable names correctly intercepted.");
  } else {
    console.error("FAIL: Failed to intercept dummy variables! Result:", rNegC);
    testPassed = false;
  }

  // Test 5: 拦截双语篇幅极其不均衡
  const fNegD = writeTempConfig('neg_imbalance', NEGATIVE_DATA_IMBALANCE);
  const rNegD = runValidation(fNegD);
  cleanUpFile(fNegD);
  if (!rNegD.success && rNegD.violations.some(v => v.includes("bilingual length ratio"))) {
    console.log("PASS: Negative sample with bilingual length imbalance correctly intercepted.");
  } else {
    console.error("FAIL: Failed to intercept bilingual length imbalance! Result:", rNegD);
    testPassed = false;
  }

  // Test 6: 拦截没有日文假名的纯汉字日文
  const fNegE = writeTempConfig('neg_no_kana', NEGATIVE_DATA_NO_KANA);
  const rNegE = runValidation(fNegE);
  cleanUpFile(fNegE);
  if (!rNegE.success && rNegE.violations.some(v => v.includes("does not contain any Japanese Hiragana/Katakana"))) {
    console.log("PASS: Negative sample without Japanese Kana correctly intercepted.");
  } else {
    console.error("FAIL: Failed to intercept Japanese Kana absence! Result:", rNegE);
    testPassed = false;
  }

  if (testPassed) {
    console.log("\x1b[32m=== All Self-Tests PASSED! Originality Gate is working 100% correctly ===\x1b[0m");
    process.exit(0);
  } else {
    console.error("\x1b[31m=== Self-Tests FAILED! Originality Gate has gaps in verification ===\x1b[0m");
    process.exit(1);
  }
}

runSelfTests();
