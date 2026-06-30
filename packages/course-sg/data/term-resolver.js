// Canonical IT term registry & resolver
// Maps legacy keyTerms (termJa/termZh/english) to canonical en/ja/zh

var canonicalMap = {
  "情報に関する理論": {en:"Information Theory",ja:"情報理論",zh:"信息理论"},
  "コンピュータの構成とCPU": {en:"CPU",ja:"CPU",zh:"CPU"},
  "主記憶と補助記憶": {en:"Memory",ja:"メモリ",zh:"存储器"},
  "半導体メモリ": {en:"Semiconductor Memory",ja:"半導体メモリ",zh:"半导体存储器"},
  "入出力装置": {en:"I/O Device",ja:"入出力装置",zh:"输入输出设备"},
  "入出力インタフェース": {en:"I/O Interface",ja:"入出力インタフェース",zh:"输入输出接口"},
  "AI": {en:"AI",ja:"AI（人工知能）",zh:"人工智能"},
  "確率と統計": {en:"Probability & Statistics",ja:"確率・統計",zh:"概率与统计"},
  "基数変換": {en:"Radix Conversion",ja:"基数変換",zh:"进制转换"},
  "ソフトウェア": {en:"Software",ja:"ソフトウェア",zh:"软件"},
  "OS": {en:"Operating System",ja:"OS（オペレーティングシステム）",zh:"操作系统"},
  "ファイル管理": {en:"File Management",ja:"ファイル管理",zh:"文件管理"},
  "表計算ソフト": {en:"Spreadsheet",ja:"表計算ソフト",zh:"电子表格软件"},
  "データベース": {en:"Database",ja:"データベース",zh:"数据库"},
  "データベース管理システム": {en:"DBMS",ja:"DBMS",zh:"数据库管理系统"},
  "ネットワーク": {en:"Network",ja:"ネットワーク",zh:"网络"},
  "LAN": {en:"LAN",ja:"LAN",zh:"局域网"},
  "WAN": {en:"WAN",ja:"WAN",zh:"广域网"},
  "インターネット": {en:"Internet",ja:"インターネット",zh:"互联网"},
  "プロトコル": {en:"Protocol",ja:"プロトコル",zh:"协议"},
  "TCP/IP": {en:"TCP/IP",ja:"TCP/IP",zh:"TCP/IP协议族"},
  "セキュリティ": {en:"Security",ja:"セキュリティ",zh:"安全"},
  "暗号化": {en:"Encryption",ja:"暗号化",zh:"加密"},
  "ファイアウォール": {en:"Firewall",ja:"ファイアウォール",zh:"防火墙"},
  "認証": {en:"Authentication",ja:"認証",zh:"认证"},
  "アルゴリズム": {en:"Algorithm",ja:"アルゴリズム",zh:"算法"},
  "プログラム": {en:"Program",ja:"プログラム",zh:"程序"},
  "システム開発": {en:"System Development",ja:"システム開発",zh:"系统开发"},
  "プロジェクト管理": {en:"Project Management",ja:"プロジェクト管理",zh:"项目管理"},
  "情報システム": {en:"Information System",ja:"情報システム",zh:"信息系统"},
  "経営戦略": {en:"Business Strategy",ja:"経営戦略",zh:"经营战略"},
  "マーケティング": {en:"Marketing",ja:"マーケティング",zh:"市场营销"},
  "企業活動": {en:"Corporate Activity",ja:"企業活動",zh:"企业活动"},
  "内部統制": {en:"Internal Control",ja:"内部統制",zh:"内部控制"},
  "コンプライアンス": {en:"Compliance",ja:"コンプライアンス",zh:"合规"},
  "知的財産権": {en:"IP Rights",ja:"知的財産権",zh:"知识产权"},
  "個人情報保護": {en:"Personal Info Protection",ja:"個人情報保護",zh:"个人信息保护"},
  "ファイルのバックアップ": {en:"Backup",ja:"バックアップ",zh:"备份"},
  "システム構成": {en:"System Configuration",ja:"システム構成",zh:"系统构成"},
  "クラウドコンピューティング": {en:"Cloud Computing",ja:"クラウドコンピューティング",zh:"云计算"},
  "情報セキュリティ": {en:"Information Security",ja:"情報セキュリティ",zh:"信息安全"},
  "マルウェア": {en:"Malware",ja:"マルウェア",zh:"恶意软件"},
  "ランサムウェア": {en:"Ransomware",ja:"ランサムウェア",zh:"勒索软件"},
  "ISMS": {en:"ISMS",ja:"ISMS（情報セキュリティマネジメントシステム）",zh:"信息安全管理体系"},
  "リスク管理": {en:"Risk Management",ja:"リスク管理",zh:"风险管理"},
  "不正アクセス": {en:"Unauthorized Access",ja:"不正アクセス",zh:"非法访问"},
  "VPN": {en:"VPN",ja:"VPN",zh:"虚拟专用网络"},
  "PKI": {en:"PKI",ja:"PKI（公開鍵基盤）",zh:"公钥基础设施"},
  "デジタル署名": {en:"Digital Signature",ja:"デジタル署名",zh:"数字签名"},
  "可用性": {en:"Availability",ja:"可用性",zh:"可用性"},
  "機密性": {en:"Confidentiality",ja:"機密性",zh:"机密性"},
  "完全性": {en:"Integrity",ja:"完全性",zh:"完整性"}
};

function resolveCanonical(legacyTerm) {
  var ja = legacyTerm.termJa || '';
  var canonical = canonicalMap[ja];
  if (canonical) {
    return {
      id: legacyTerm.id || ja,
      en: canonical.en,
      ja: canonical.ja,
      zh: canonical.zh,
      definitionJa: '',
      definitionZh: '',
      contextJa: '',
      contextZh: '',
      examCueJa: '',
      examCueZh: '',
      sourceRefs: legacyTerm.sourceRefs || [],
      isRenderable: true
    };
  }
  // Fallback: use legacy data with normalization
  return {
    id: legacyTerm.id || ja,
    en: legacyTerm.english || legacyTerm.en || ja,
    ja: ja,
    zh: legacyTerm.termZh || ja,
    definitionJa: '',
    definitionZh: '',
    contextJa: '',
    contextZh: '',
    examCueJa: '',
    examCueZh: '',
    sourceRefs: legacyTerm.sourceRefs || [],
    isRenderable: true
  };
}

function resolveDisplayTerms(unit) {
  var terms = (unit && unit.keyTerms) || [];
  return terms.map(resolveCanonical).filter(function(t) { return t.isRenderable; });
}

function getTermById(termId) {
  // Look up in canonical map
  for (var k in canonicalMap) {
    if (k === termId) {
      var c = canonicalMap[k];
      return {
        id: termId,
        en: c.en, ja: c.ja, zh: c.zh,
        definitionJa: '', definitionZh: '',
        contextJa: '', contextZh: '',
        examCueJa: '', examCueZh: '',
        sourceRefs: []
      };
    }
  }
  return null;
}

module.exports = { resolveDisplayTerms: resolveDisplayTerms, getTermById: getTermById };
