// packages/java-course/data/course_data.js
// Structured Curriculum Data for Java Learning Module

module.exports = {
  chapters: [
    {
      id: "ch-java-01",
      titleZh: "第1章 Java语言初探",
      titleJa: "第1章 Javaの世界へようこそ",
      lessons: [
        {
          id: "lesson-java-1-01",
          chapterId: "ch-java-01",
          titleZh: "1-01 什么是程序与 Java？",
          titleJa: "1-01 プログラムとJava",
          targetZh: "本节目标：理解什么是“程序”，以及为什么在众多语言中我们要学习 Java 语言。",
          targetJa: "このセクションの目標：プログラムとは何か、そしてなぜJavaを学ぶのかを理解します。",
          motivationZh: "想象一下，你有一台全自动智能厨房机器人，但它默认什么都不会。如果你想喝一杯拿铁咖啡，你需要以极其精确的顺序写下一张纸条：1. 研磨豆子，2. 萃取浓缩，3. 打发牛奶，4. 融合。如果没有这张纸条，即使机器人拥有再先进的马达和传感器，也只能发呆。在数字世界里，那张精确的纸条就是“程序”，而写纸条的语言之一就是 Java。",
          motivationJa: "例えば、目の前に高性能な調理ロボットがあるとします。しかし、このロボットは指示がなければ動きません。「ラテを作って」と頼むには、1. 豆を挽く、2. エスプレッソを抽出する、3. ミルクを泡立てる、4. 混ぜる、という具体的な手順書を渡す必要があります。この「手順書」こそが「プログラム」であり、手順書を書くための言葉の一つがJavaです。",
          analogyZh: "类比：菜谱与厨师（Recipe and Chef）。程序就是“菜谱”，计算机主板和CPU就是“厨师”，而各种运行环境（如 JVM）就像是统一了计量单位和厨房用具的“标准化厨房”。无论你在中国的厨房还是日本的厨房，只要菜谱写得标准，做出来的味道和步骤都是完全相同的。",
          analogyJa: "たとえ：レシピと料理人。プログラムは「レシピ」であり、コンピュータ（CPU）は「料理人」です。そして、Javaの実行環境（JVM）は、世界中で統一された「標準システムキッチン」にあたります。日本のキッチンでも、中国のキッチンでも、同じ標準キッチンを使えばレシピ通りに全く同じ料理が作れます。",
          explanationZh: "Java 语言由 Sun Microsystems 公司于 1995 年推出（后被 Oracle 收购）。它最大的特点是“一次编写，到处运行”（Write Once, Run Anywhere）。这是因为 Java 代码不是直接运行在计算机的物理 CPU 上，而是运行在一个叫 JVM（Java Virtual Machine，Java虚拟机）的虚拟机软件里。这打破了 Windows、Mac、Linux 等系统的底层兼容限制。对于零基础学习者来说，Java 是一种“强类型”且高度规范的语言，虽然开头几行代码看起来有些繁琐，但它能帮你养成极度严谨的编程思维，这也是日本 IT 企业和技术考试（如 IT Passport）非常看重 Java 的原因。",
          explanationJa: "Javaは1995年にSun Microsystems社（現在はOracle社）によって発表されたプログラミング言語です。最大の強みは「一度書けば、どこでも動く（Write Once, Run Anywhere）」という点です。Javaのプログラムは、パソコンの物理的なCPUで直接動くのではなく、「JVM（Java仮想マシン）」という仮想の仕組みの上で動きます。そのため、Windows、Mac、Linuxのいずれでも同じコードがそのまま実行可能です。覚えるルールは少し多いですが、非常に厳密でバグが起きにくいため、日本のIT企業やITパスポート試験などでも中心的な言語として広く採用されています。",
          terminology: [
            {
              zh: "类（class）",
              ja: "クラス",
              en: "class"
            },
            {
              zh: "方法（method）",
              ja: "メソッド",
              en: "method"
            },
            {
              zh: "变量（variable）",
              ja: "変数",
              en: "variable"
            },
            {
              zh: "虚拟机（virtual machine）",
              ja: "仮想マシン",
              en: "virtual machine"
            }
          ],
          codeDemo: "public class KitchenRobot {\n    public static void main(String[] args) {\n        int hourlyWage = 1200; // 日本打工常见时薪\n        System.out.println(\"Robot activated. Hourly wage is: \" + hourlyWage + \" yen.\");\n    }\n}",
          codeExplanation: [
            "1. public class KitchenRobot：定义了一个名为 KitchenRobot 的公开类 (class)。在 Java 中，所有的代码都必须包含在类（class）声明的大括号中，且类名必须与文件名完全一致。",
            "2. public static void main(String[] args)：这是程序的“入口点”（entry point），称为主方法 (main method)。计算机运行 Java 程序时，会自动从这一行开始执行。",
            "3. int hourlyWage = 1200;：声明了一个整数类型的变量 (variable)，名字是 hourlyWage，并给它赋值为 1200 储存起来。",
            "4. System.out.println(...)：System.out.println() 用于在控制台屏幕上输出一行文字，我们在文字中拼接了 hourlyWage 变量的内容。"
          ],
          commonMisunderstandings: [
            {
              titleZh: "误区：Java 就是 JavaScript？",
              titleJa: "誤解：JavaとJavaScriptは同じもの？",
              descZh: "完全不是。它们是两种完全不同的编程语言，就像“雷锋”和“雷峰塔”，或者“热狗”和“狗”。Java 是一种静态编译语言，常用于大型企业级系统和后端开发；而 JavaScript 是一种动态解释语言，主要运行在浏览器中，用于为网页增添交互特效。",
              descJa: "名前が似ているため、「Java」と「JavaScript」は同じものと誤解されがちですが、全く異なる言語です。「メロン」と「メロンパン」くらい違います。Javaは大規模なシステム開発やバックエンドで使われ、JavaScriptは主にブラウザ上で動くウェブページに動きを与えるために使われます。"
            }
          ],
          summaryZh: "程序是让计算机工作的精密指令集。Java 语言以其 JVM 跨平台特性著称。所有的 Java 代码都必须写在类（class）内部，并且程序执行时必须寻找 main 方法作为启动入口。",
          summaryJa: "プログラムはコンピュータに対する指示書の集まりです。JavaはJVM（仮想マシン）のおかげで、環境を選ばず動く特徴があります。プログラムは必ずクラス（class）の中に書き、mainメソッドから処理が始まります。",
          connectionZh: "在下一节中，我们将实际体验如何运行这段代码，并带你深入理解 .java 源代码文件与编译后的 .class 字节码文件之间的秘密转换。",
          connectionJa: "次のセクションでは、このプログラムを実際に動かす手順を学びます。ソースコード（.javaファイル）がどのようにコンパイルされ、クラスファイル（.classファイル）になるのか、その仕組みに迫ります。"
        }
      ]
    }
  ]
};
