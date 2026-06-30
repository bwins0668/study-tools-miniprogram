// IT Passport foundation terms — chapters 1-3 core concepts
var terms = [
  // === Chapter 1: Hardware & Basic Theory ===
  {
    id: "cpu",
    en: "CPU", ja: "CPU（中央処理装置）", zh: "CPU（中央处理器）",
    termType: "hardware-component",
    definitionJa: "コンピュータの中心的な処理装置。プログラムの命令を読み取り、解釈し、実行する。演算装置（ALU）と制御装置から構成され、クロック信号に同期して動作する。",
    definitionZh: "计算机的核心处理部件，负责读取、解释和执行程序指令。由运算器（ALU）和控制器组成，按时钟信号同步运行。",
    contextJa: "ITパスポート試験では、CPUの構成要素、クロック周波数と処理速度の関係、パイプライン処理の基本概念が出題される。",
    contextZh: "IT Passport考试会考察CPU的构成要素、时钟频率与处理速度的关系、流水线处理的基本概念。",
    compareWith: ["gpu", "microcontroller"],
    examCueJa: "「クロック周波数が高いほど処理速度が速い」「パイプライン処理は命令の並列実行を可能にする」を正しく理解する。制御装置と演算装置の役割の違いを問う問題に注意。",
    examCueZh: "正确理解「时钟频率越高处理速度越快」「流水线处理使指令可并行执行」。注意区分控制器和运算器的不同角色。",
    sourceRefs: ["itpass-ch01"]
  },
  {
    id: "ram",
    en: "RAM", ja: "RAM（主記憶装置）", zh: "RAM（主存储器）",
    termType: "hardware-component",
    definitionJa: "Random Access Memory。CPUが直接アクセスできる揮発性メモリ。電源を切るとデータが消える。DRAMとSRAMに分類され、主記憶装置として使用される。",
    definitionZh: "随机存取存储器，CPU可直接访问的易失性内存。断电后数据消失。分为DRAM和SRAM，用作主存储器。",
    contextJa: "DRAMとSRAMの違い（リフレッシュの要否、速度、コスト）、半導体メモリの分類（RAM/ROM、揮発性/不揮発性）が頻出。",
    contextZh: "DRAM与SRAM的区别（是否需要刷新、速度、成本）、半导体存储器的分类（RAM/ROM、易失性/非易失性）是常见考点。",
    compareWith: ["rom", "dram", "sram", "flash-memory"],
    examCueJa: "「RAMは揮発性、ROMは不揮発性」の基本分類を覚える。DRAMはリフレッシュが必要で安価、SRAMは高速だが高価。",
    examCueZh: "记住「RAM是易失性、ROM是非易失性」的基本分类。DRAM需要刷新、价格低；SRAM速度快但价格高。",
    sourceRefs: ["itpass-ch01"]
  },
  {
    id: "rom",
    en: "ROM", ja: "ROM（読出専用メモリ）", zh: "ROM（只读存储器）",
    termType: "hardware-component",
    definitionJa: "Read Only Memory。電源を切ってもデータが消えない不揮発性メモリ。BIOSやファームウェアの格納に使用される。マスクROM、PROM、EPROM、EEPROM、フラッシュメモリなどの種類がある。",
    definitionZh: "只读存储器，断电后数据不消失的非易失性内存。用于存储BIOS和固件。包括掩膜ROM、PROM、EPROM、EEPROM、闪存等类型。",
    contextJa: "ROMの種類と特徴（書き換え可否、消去方法）の区別が試験で問われる。フラッシュメモリはUSBメモリやSSDに使用される。",
    contextZh: "考试会考察ROM各类型的特征（是否可改写、擦除方式）。闪存用于USB存储器和SSD。",
    compareWith: ["ram", "flash-memory"],
    examCueJa: "「ROMは不揮発性」という基本性質と、各種ROMの書き換え可否の違いを整理する。EEPROMとフラッシュメモリは電気的に消去・書き換え可能。",
    examCueZh: "整理「ROM是非易失性」的基本性质以及各类型ROM的改写能力差异。EEPROM和闪存可通过电信号擦除和改写。",
    sourceRefs: ["itpass-ch01"]
  },
  // === Chapter 2: Software & OS ===
  {
    id: "os",
    en: "OS", ja: "OS（オペレーティングシステム）", zh: "OS（操作系统）",
    termType: "software-concept",
    definitionJa: "Operating System。コンピュータのハードウェア資源を管理し、アプリケーションに共通のインタフェースを提供する基本ソフトウェア。ジョブ管理、タスク管理、メモリ管理、ファイル管理などの機能を持つ。",
    definitionZh: "操作系统，管理计算机硬件资源、为应用程序提供通用接口的基础软件。具有作业管理、任务管理、内存管理、文件管理等功能。",
    contextJa: "カーネルとシェルの役割の違い、マルチタスクの種類（プリエンプティブ/ノンプリエンプティブ）、仮想記憶の仕組みが頻出。",
    contextZh: "内核与外壳的角色差异、多任务类型（抢占式/非抢占式）、虚拟内存机制是常见考点。",
    compareWith: ["kernel", "shell", "firmware"],
    examCueJa: "「カーネルはOSの中核でハードウェアを直接制御」「シェルは利用者とOSのインタフェース」の区別を理解する。仮想記憶は主記憶の不足を補う技術。",
    examCueZh: "理解「内核是OS核心，直接控制硬件」「外壳是用户与OS的接口」的区别。虚拟内存是弥补主存不足的技术。",
    sourceRefs: ["itpass-ch02"]
  },
  // === Chapter 3: Database ===
  {
    id: "dbms",
    en: "DBMS", ja: "DBMS（データベース管理システム）", zh: "DBMS（数据库管理系统）",
    termType: "software-concept",
    definitionJa: "Database Management System。データベースを管理・操作するためのソフトウェア。データの一元管理、整合性保持、同時実行制御、障害回復などの機能を提供する。",
    definitionZh: "数据库管理系统，用于管理和操作数据库的软件。提供数据集中管理、一致性维护、并发控制、故障恢复等功能。",
    contextJa: "RDBMS（リレーショナルデータベース管理システム）が主流。SQLを用いてデータの定義・操作・制御を行う。正規化、トランザクション管理、ACID特性が重要。",
    contextZh: "RDBMS（关系数据库管理系统）是主流。使用SQL进行数据定义、操作和控制。规范化、事务管理、ACID特性是重点。",
    compareWith: ["rdbms", "sql"],
    examCueJa: "「DBMSはデータの一元管理と整合性保持を実現する」「正規化はデータの重複を排除し整合性を高める」が基本。ACID（原子性、一貫性、独立性、永続性）の各特性を区別できること。",
    examCueZh: "「DBMS实现数据集中管理与一致性维护」「规范化消除数据冗余、提高一致性」是基础。能区分ACID（原子性、一致性、隔离性、持久性）各特性。",
    sourceRefs: ["itpass-ch03"]
  }
];

module.exports = terms;
