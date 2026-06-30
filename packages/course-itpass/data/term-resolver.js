// Canonical IT term registry — R5.4.6B complete ledger
// No fallback: every term must match a canonical entry or be excluded from UI

var canonicalMap = {
  // === IT Passport: Chapter 1 Hardware & Theory ===
  "情報に関する理論": {en:"Information Theory",ja:"情報理論",zh:"信息理论"},
  "コンピュータの構成とCPU": {en:"CPU",ja:"CPU",zh:"CPU"},
  "コンピュータの構成": {en:"Computer Architecture",ja:"コンピュータの構成",zh:"计算机构成"},
  "主記憶と補助記憶": {en:"Memory",ja:"メモリ",zh:"存储器"},
  "半導体メモリ": {en:"Semiconductor Memory",ja:"半導体メモリ",zh:"半导体存储器"},
  "入出力装置": {en:"I/O Device",ja:"入出力装置",zh:"输入输出设备"},
  "入出力インタフェース": {en:"I/O Interface",ja:"入出力インタフェース",zh:"输入输出接口"},
  "AI": {en:"AI",ja:"AI（人工知能）",zh:"人工智能"},
  "確率と統計": {en:"Probability & Statistics",ja:"確率・統計",zh:"概率与统计"},
  "基数変換": {en:"Radix Conversion",ja:"基数変換",zh:"进制转换"},
  "集合": {en:"Set Theory",ja:"集合論",zh:"集合论"},
  "論理演算": {en:"Logic Operation",ja:"論理演算",zh:"逻辑运算"},
  "データ構造": {en:"Data Structure",ja:"データ構造",zh:"数据结构"},
  "補助記憶": {en:"Secondary Storage",ja:"補助記憶装置",zh:"辅助存储器"},
  "主記憶": {en:"Main Memory",ja:"主記憶装置",zh:"主存储器"},
  "キャッシュメモリ": {en:"Cache Memory",ja:"キャッシュメモリ",zh:"高速缓存"},
  "レジスタ": {en:"Register",ja:"レジスタ",zh:"寄存器"},
  "クロック": {en:"Clock",ja:"クロック",zh:"时钟"},
  "パイプライン": {en:"Pipeline",ja:"パイプライン処理",zh:"流水线"},
  "マルチコア": {en:"Multi-core",ja:"マルチコア",zh:"多核"},
  "DRAM": {en:"DRAM",ja:"DRAM",zh:"动态随机存储器"},
  "SRAM": {en:"SRAM",ja:"SRAM",zh:"静态随机存储器"},
  "ROM": {en:"ROM",ja:"ROM",zh:"只读存储器"},
  "フラッシュメモリ": {en:"Flash Memory",ja:"フラッシュメモリ",zh:"闪存"},
  "USB": {en:"USB",ja:"USB",zh:"通用串行总线"},
  "SSD": {en:"SSD",ja:"SSD",zh:"固态硬盘"},
  "HDD": {en:"HDD",ja:"HDD",zh:"机械硬盘"},
  "BIOS": {en:"BIOS",ja:"BIOS",zh:"基本输入输出系统"},

  // === Chapter 2 Software ===
  "ソフトウェア": {en:"Software",ja:"ソフトウェア",zh:"软件"},
  "OS": {en:"Operating System",ja:"OS（オペレーティングシステム）",zh:"操作系统"},
  "ファイル管理": {en:"File Management",ja:"ファイル管理",zh:"文件管理"},
  "表計算ソフト": {en:"Spreadsheet",ja:"表計算ソフト",zh:"电子表格"},
  "応用ソフトウェア": {en:"Application Software",ja:"応用ソフトウェア",zh:"应用软件"},
  "基本ソフトウェア": {en:"System Software",ja:"基本ソフトウェア",zh:"系统软件"},
  "カーネル": {en:"Kernel",ja:"カーネル",zh:"内核"},
  "シェル": {en:"Shell",ja:"シェル",zh:"外壳"},
  "仮想記憶": {en:"Virtual Memory",ja:"仮想記憶",zh:"虚拟内存"},
  "マルチタスク": {en:"Multitasking",ja:"マルチタスク",zh:"多任务"},
  "ファイルシステム": {en:"File System",ja:"ファイルシステム",zh:"文件系统"},
  "ディレクトリ": {en:"Directory",ja:"ディレクトリ",zh:"目录"},
  "バッチ処理": {en:"Batch Processing",ja:"バッチ処理",zh:"批处理"},
  "リアルタイム処理": {en:"Real-time Processing",ja:"リアルタイム処理",zh:"实时处理"},

  // === Chapter 3 System Configuration ===
  "システム構成": {en:"System Configuration",ja:"システム構成",zh:"系统构成"},
  "クライアントサーバ": {en:"Client-Server",ja:"クライアントサーバ",zh:"客户端-服务器"},
  "クラウド": {en:"Cloud Computing",ja:"クラウドコンピューティング",zh:"云计算"},
  "仮想化": {en:"Virtualization",ja:"仮想化",zh:"虚拟化"},
  "冗長化": {en:"Redundancy",ja:"冗長化",zh:"冗余"},
  "フォールトトレラント": {en:"Fault Tolerant",ja:"フォールトトレラント",zh:"容错"},
  "信頼性": {en:"Reliability",ja:"信頼性",zh:"可靠性"},
  "可用性": {en:"Availability",ja:"可用性",zh:"可用性"},
  "クラスタ": {en:"Cluster",ja:"クラスタ",zh:"集群"},
  "負荷分散": {en:"Load Balancing",ja:"負荷分散",zh:"负载均衡"},
  "バックアップ": {en:"Backup",ja:"バックアップ",zh:"备份"},
  "ファイルのバックアップ": {en:"Backup",ja:"バックアップ",zh:"备份"},
  "リストア": {en:"Restore",ja:"リストア",zh:"恢复"},

  // === Chapter 4 Network ===
  "ネットワーク": {en:"Network",ja:"ネットワーク",zh:"网络"},
  "LAN": {en:"LAN",ja:"LAN",zh:"局域网"},
  "WAN": {en:"WAN",ja:"WAN",zh:"广域网"},
  "インターネット": {en:"Internet",ja:"インターネット",zh:"互联网"},
  "プロトコル": {en:"Protocol",ja:"プロトコル",zh:"协议"},
  "TCP/IP": {en:"TCP/IP",ja:"TCP/IP",zh:"TCP/IP协议族"},
  "OSI参照モデル": {en:"OSI Model",ja:"OSI参照モデル",zh:"OSI参考模型"},
  "IPアドレス": {en:"IP Address",ja:"IPアドレス",zh:"IP地址"},
  "DNS": {en:"DNS",ja:"DNS",zh:"域名系统"},
  "DHCP": {en:"DHCP",ja:"DHCP",zh:"动态主机配置协议"},
  "ルータ": {en:"Router",ja:"ルータ",zh:"路由器"},
  "スイッチ": {en:"Switch",ja:"スイッチ",zh:"交换机"},
  "ハブ": {en:"Hub",ja:"ハブ",zh:"集线器"},
  "MACアドレス": {en:"MAC Address",ja:"MACアドレス",zh:"MAC地址"},
  "CSMA/CD": {en:"CSMA/CD",ja:"CSMA/CD",zh:"载波侦听多路访问/冲突检测"},

  // === Chapter 5 Security ===
  "セキュリティ": {en:"Security",ja:"セキュリティ",zh:"安全"},
  "情報セキュリティ": {en:"Information Security",ja:"情報セキュリティ",zh:"信息安全"},
  "暗号化": {en:"Encryption",ja:"暗号化",zh:"加密"},
  "ファイアウォール": {en:"Firewall",ja:"ファイアウォール",zh:"防火墙"},
  "認証": {en:"Authentication",ja:"認証",zh:"认证"},
  "マルウェア": {en:"Malware",ja:"マルウェア",zh:"恶意软件"},
  "ランサムウェア": {en:"Ransomware",ja:"ランサムウェア",zh:"勒索软件"},
  "ウイルス": {en:"Virus",ja:"ウイルス",zh:"病毒"},
  "ワーム": {en:"Worm",ja:"ワーム",zh:"蠕虫"},
  "トロイの木馬": {en:"Trojan Horse",ja:"トロイの木馬",zh:"特洛伊木马"},
  "スパイウェア": {en:"Spyware",ja:"スパイウェア",zh:"间谍软件"},
  "不正アクセス": {en:"Unauthorized Access",ja:"不正アクセス",zh:"非法访问"},
  "アクセス制御": {en:"Access Control",ja:"アクセス制御",zh:"访问控制"},
  "機密性": {en:"Confidentiality",ja:"機密性",zh:"机密性"},
  "完全性": {en:"Integrity",ja:"完全性",zh:"完整性"},
  "PKI": {en:"PKI",ja:"PKI（公開鍵基盤）",zh:"公钥基础设施"},
  "デジタル署名": {en:"Digital Signature",ja:"デジタル署名",zh:"数字签名"},
  "公開鍵": {en:"Public Key",ja:"公開鍵",zh:"公钥"},
  "秘密鍵": {en:"Private Key",ja:"秘密鍵",zh:"私钥"},
  "VPN": {en:"VPN",ja:"VPN",zh:"虚拟专用网络"},
  "ISMS": {en:"ISMS",ja:"ISMS（情報セキュリティマネジメントシステム）",zh:"信息安全管理体系"},
  "リスク管理": {en:"Risk Management",ja:"リスク管理",zh:"风险管理"},
  "CIA": {en:"CIA Triad",ja:"CIA（機密性・完全性・可用性）",zh:"CIA三元组"},

  // === Chapter 6 Database ===
  "データベース": {en:"Database",ja:"データベース",zh:"数据库"},
  "RDB": {en:"RDB",ja:"リレーショナルデータベース",zh:"关系数据库"},
  "SQL": {en:"SQL",ja:"SQL",zh:"结构化查询语言"},
  "正規化": {en:"Normalization",ja:"正規化",zh:"规范化"},
  "トランザクション": {en:"Transaction",ja:"トランザクション",zh:"事务"},
  "ACID": {en:"ACID",ja:"ACID特性",zh:"ACID特性"},
  "排他制御": {en:"Concurrency Control",ja:"排他制御",zh:"并发控制"},
  "デッドロック": {en:"Deadlock",ja:"デッドロック",zh:"死锁"},
  "インデックス": {en:"Index",ja:"インデックス",zh:"索引"},
  "データモデル": {en:"Data Model",ja:"データモデル",zh:"数据模型"},
  "ER図": {en:"ER Diagram",ja:"ER図",zh:"实体关系图"},
  "データベース管理システム": {en:"DBMS",ja:"DBMS",zh:"数据库管理系统"},

  // === Chapter 7 Algorithm & Programming ===
  "アルゴリズム": {en:"Algorithm",ja:"アルゴリズム",zh:"算法"},
  "プログラム": {en:"Program",ja:"プログラム",zh:"程序"},
  "プログラミング": {en:"Programming",ja:"プログラミング",zh:"编程"},
  "フローチャート": {en:"Flowchart",ja:"フローチャート",zh:"流程图"},
  "ソート": {en:"Sort",ja:"ソート（整列）",zh:"排序"},
  "探索": {en:"Search",ja:"探索",zh:"搜索"},
  "再帰": {en:"Recursion",ja:"再帰",zh:"递归"},
  "オブジェクト指向": {en:"Object-Oriented",ja:"オブジェクト指向",zh:"面向对象"},
  "変数": {en:"Variable",ja:"変数",zh:"变量"},
  "配列": {en:"Array",ja:"配列",zh:"数组"},
  "関数": {en:"Function",ja:"関数",zh:"函数"},
  "コンパイラ": {en:"Compiler",ja:"コンパイラ",zh:"编译器"},
  "インタプリタ": {en:"Interpreter",ja:"インタプリタ",zh:"解释器"},

  // === Chapter 8 Management ===
  "システム開発": {en:"System Development",ja:"システム開発",zh:"系统开发"},
  "プロジェクト": {en:"Project",ja:"プロジェクト",zh:"项目"},
  "プロジェクト管理": {en:"Project Management",ja:"プロジェクト管理",zh:"项目管理"},
  "WBS": {en:"WBS",ja:"WBS（作業分解構造）",zh:"工作分解结构"},
  "システム開発ライフサイクル": {en:"SDLC",ja:"システム開発ライフサイクル",zh:"系统开发生命周期"},
  "ウォータフォール": {en:"Waterfall",ja:"ウォータフォールモデル",zh:"瀑布模型"},
  "アジャイル": {en:"Agile",ja:"アジャイル開発",zh:"敏捷开发"},
  "テスト": {en:"Testing",ja:"テスト",zh:"测试"},
  "レビュー": {en:"Review",ja:"レビュー",zh:"评审"},
  "品質": {en:"Quality",ja:"品質",zh:"质量"},
  "情報システム": {en:"Information System",ja:"情報システム",zh:"信息系统"},
  "ERP": {en:"ERP",ja:"ERP（企業資源計画）",zh:"企业资源计划"},
  "SCM": {en:"SCM",ja:"SCM（サプライチェーン管理）",zh:"供应链管理"},
  "CRM": {en:"CRM",ja:"CRM（顧客関係管理）",zh:"客户关系管理"},
  "SLA": {en:"SLA",ja:"SLA（サービスレベル合意）",zh:"服务水平协议"},

  // === Chapter 9 Enterprise & Legal ===
  "経営戦略": {en:"Business Strategy",ja:"経営戦略",zh:"经营战略"},
  "マーケティング": {en:"Marketing",ja:"マーケティング",zh:"市场营销"},
  "企業活動": {en:"Corporate Activity",ja:"企業活動",zh:"企业活动"},
  "SWOT": {en:"SWOT",ja:"SWOT分析",zh:"SWOT分析"},
  "PPM": {en:"PPM",ja:"PPM（プロダクトポートフォリオマネジメント）",zh:"产品组合管理"},
  "BPR": {en:"BPR",ja:"BPR（ビジネスプロセスリエンジニアリング）",zh:"业务流程再造"},
  "BSC": {en:"BSC",ja:"BSC（バランススコアカード）",zh:"平衡计分卡"},
  "コンプライアンス": {en:"Compliance",ja:"コンプライアンス",zh:"合规"},
  "内部統制": {en:"Internal Control",ja:"内部統制",zh:"内部控制"},
  "コーポレートガバナンス": {en:"Corporate Governance",ja:"コーポレートガバナンス",zh:"公司治理"},
  "知的財産権": {en:"IP Rights",ja:"知的財産権",zh:"知识产权"},
  "特許": {en:"Patent",ja:"特許",zh:"专利"},
  "著作権": {en:"Copyright",ja:"著作権",zh:"著作权"},
  "商標": {en:"Trademark",ja:"商標",zh:"商标"},
  "個人情報保護": {en:"Personal Info Protection",ja:"個人情報保護",zh:"个人信息保护"},
  "個人情報": {en:"Personal Information",ja:"個人情報",zh:"个人信息"},
  "CSR": {en:"CSR",ja:"CSR（企業の社会的責任）",zh:"企业社会责任"},

  // === Chapter 10 Strategy ===
  "IoT": {en:"IoT",ja:"IoT（モノのインターネット）",zh:"物联网"},
  "ビッグデータ": {en:"Big Data",ja:"ビッグデータ",zh:"大数据"},
  "情報システム戦略": {en:"IS Strategy",ja:"情報システム戦略",zh:"信息系统战略"},
  "EA": {en:"EA",ja:"EA（エンタープライズアーキテクチャ）",zh:"企业架构"},
  "BPO": {en:"BPO",ja:"BPO（ビジネスプロセスアウトソーシング）",zh:"业务流程外包"},
  "RFP": {en:"RFP",ja:"RFP（提案依頼書）",zh:"提案请求书"},

  // === SG Specific Terms ===
  "情報セキュリティポリシー": {en:"Security Policy",ja:"情報セキュリティポリシー",zh:"信息安全策略"},
  "リスク": {en:"Risk",ja:"リスク",zh:"风险"},
  "脅威": {en:"Threat",ja:"脅威",zh:"威胁"},
  "脆弱性": {en:"Vulnerability",ja:"脆弱性",zh:"漏洞"},
  "対策": {en:"Countermeasure",ja:"対策",zh:"对策"},
  "ガイドライン": {en:"Guideline",ja:"ガイドライン",zh:"指南"},
  "監査": {en:"Audit",ja:"監査",zh:"审计"},
  "インシデント": {en:"Incident",ja:"インシデント",zh:"事件"},
  "CSIRT": {en:"CSIRT",ja:"CSIRT",zh:"计算机安全事件响应团队"},
  "DMZ": {en:"DMZ",ja:"DMZ",zh:"隔离区"},
  "IDS": {en:"IDS",ja:"IDS（侵入検知システム）",zh:"入侵检测系统"},
  "IPS": {en:"IPS",ja:"IPS（侵入防止システム）",zh:"入侵防御系统"},
  "SSL/TLS": {en:"SSL/TLS",ja:"SSL/TLS",zh:"安全套接层/传输层安全"},
  "シングルサインオン": {en:"SSO",ja:"SSO（シングルサインオン）",zh:"单点登录"},
  "二要素認証": {en:"2FA",ja:"二要素認証",zh:"双因素认证"},
  "生体認証": {en:"Biometrics",ja:"生体認証",zh:"生物识别"},
  "パスワード": {en:"Password",ja:"パスワード",zh:"密码"},
  "ログ": {en:"Log",ja:"ログ",zh:"日志"},
  "フォレンジック": {en:"Forensics",ja:"フォレンジック",zh:"取证"},
  "BCP": {en:"BCP",ja:"BCP（事業継続計画）",zh:"业务连续性计划"},
  "BCM": {en:"BCM",ja:"BCM（事業継続マネジメント）",zh:"业务连续性管理"},
  "オフラインバックアップ": {en:"Offline Backup",ja:"オフラインバックアップ",zh:"离线备份"},
  "ネットワークセグメント": {en:"Network Segment",ja:"ネットワークセグメント",zh:"网段"},
  "無線LAN": {en:"Wi-Fi",ja:"無線LAN",zh:"无线局域网"},
  "BYOD": {en:"BYOD",ja:"BYOD",zh:"自带设备"},
  "標的型攻撃": {en:"Targeted Attack",ja:"標的型攻撃",zh:"定向攻击"},
  "DoS攻撃": {en:"DoS Attack",ja:"DoS攻撃",zh:"拒绝服务攻击"},
  "SQLインジェクション": {en:"SQL Injection",ja:"SQLインジェクション",zh:"SQL注入"},
  "クロスサイトスクリプティング": {en:"XSS",ja:"XSS（クロスサイトスクリプティング）",zh:"跨站脚本攻击"},
  "ソーシャルエンジニアリング": {en:"Social Engineering",ja:"ソーシャルエンジニアリング",zh:"社会工程学"},
  "フィッシング": {en:"Phishing",ja:"フィッシング",zh:"钓鱼攻击"},
};

var knownNonTerms = {
  "情報資産と脅威": true, "サイバー攻撃": true, "ネットワーク方式": true,
  "ソフトウェア方式": true, "データベース方式": true, "システムの信頼性": true,
  "システムの評価": true, "情報セキュリティとリスク": true
};

function resolveCanonical(legacyTerm) {
  var ja = legacyTerm.termJa || '';
  var canonical = canonicalMap[ja];
  if (canonical) {
    return {
      id: legacyTerm.id || ja,
      en: canonical.en, ja: canonical.ja, zh: canonical.zh,
      definitionJa: '', definitionZh: '',
      contextJa: '', contextZh: '',
      examCueJa: '', examCueZh: '',
      sourceRefs: legacyTerm.sourceRefs || [],
      isRenderable: true, isCanonical: true
    };
  }
  // Mark as unresolved — must not be rendered in UI
  // Check if this is a known non-term (section title, etc.)
  if (knownNonTerms[ja]) {
    return null; // skip non-terms entirely
  }
  // Return null for unmatched terms — no fallback
  return null;
}

function resolveDisplayTerms(unit) {
  var terms = (unit && unit.keyTerms) || [];
  var resolved = [];
  var unresolved = [];
  terms.forEach(function(t) {
    var r = resolveCanonical(t);
    if (r) resolved.push(r);
    else unresolved.push(t.termJa || t.termZh || 'unknown');
  });
  return { terms: resolved, unresolvedRefs: unresolved, status: unresolved.length === 0 ? 'ready' : 'partial' };
}

function getTermById(termId) {
  for (var k in canonicalMap) {
    if (k === termId) {
      var c = canonicalMap[k];
      return { id: termId, en: c.en, ja: c.ja, zh: c.zh,
        definitionJa: '', definitionZh: '', contextJa: '', contextZh: '',
        examCueJa: '', examCueZh: '', sourceRefs: [] };
    }
  }
  return null;
}

module.exports = { resolveDisplayTerms: resolveDisplayTerms, getTermById: getTermById, canonicalMap: canonicalMap };
