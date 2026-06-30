// SG foundation terms — chapters 1-3 core concepts
var terms = [
  {
    id: "sg-info-security",
    en: "Information Security", ja: "情報セキュリティ", zh: "信息安全",
    termType: "security-concept",
    definitionJa: "情報資産の機密性（Confidentiality）、完全性（Integrity）、可用性（Availability）を維持すること。この3要素をCIAトライアドと呼び、情報セキュリティの基本概念である。",
    definitionZh: "维护信息资产的机密性（Confidentiality）、完整性（Integrity）、可用性（Availability）。这三要素称为CIA三元组，是信息安全的基本概念。",
    contextJa: "SG試験ではCIAの各要素の定義と具体例、情報セキュリティポリシーの階層（基本方針、対策基準、実施手順）が頻出。",
    contextZh: "SG考试中CIA各要素的定义与具体示例、信息安全策略的层级（基本方针、对策标准、实施步骤）是常见考点。",
    compareWith: ["sg-cia", "sg-risk-management"],
    examCueJa: "「機密性＝許可された者のみアクセス可能」「完全性＝データが正確で改ざんされていない」「可用性＝必要なときに利用可能」を正確に区別する。",
    examCueZh: "准确区分「机密性=仅授权者可访问」「完整性=数据准确未被篡改」「可用性=需要时可用」。",
    sourceRefs: ["sg-ch01"]
  },
  {
    id: "sg-malware",
    en: "Malware", ja: "マルウェア", zh: "恶意软件",
    termType: "security-threat",
    definitionJa: "Malicious Softwareの略。コンピュータウイルス、ワーム、トロイの木馬、スパイウェア、ランサムウェアなど、悪意のあるソフトウェアの総称。",
    definitionZh: "恶意软件的统称，包括计算机病毒、蠕虫、特洛伊木马、间谍软件、勒索软件等。",
    contextJa: "各マルウェアの感染経路、動作の違い、対策を区別できることが重要。ウイルスは自己複製し宿主ファイルが必要、ワームは自律的にネットワーク拡散する。",
    contextZh: "能区分各恶意软件的感染途径、行为差异和对策很重要。病毒需要宿主文件并自我复制，蠕虫可自主通过网络扩散。",
    compareWith: ["sg-virus", "sg-worm", "sg-ransomware", "sg-trojan"],
    examCueJa: "「ウイルス＝宿主が必要・自己複製」「ワーム＝自律拡散」「トロイの木馬＝有用ソフトを装う」「ランサムウェア＝データを暗号化し身代金要求」の区別を正確に。",
    examCueZh: "准确区分「病毒=需要宿主·自我复制」「蠕虫=自主扩散」「特洛伊木马=伪装成有用软件」「勒索软件=加密数据索要赎金」。",
    sourceRefs: ["sg-ch01"]
  },
  {
    id: "sg-ransomware",
    en: "Ransomware", ja: "ランサムウェア", zh: "勒索软件",
    termType: "security-threat",
    definitionJa: "感染したコンピュータのファイルを暗号化し、復号のための身代金（ランサム）を要求するマルウェア。バックアップがない場合、データ復旧が極めて困難になる。",
    definitionZh: "加密受感染计算机的文件，要求支付赎金以解密的恶意软件。没有备份时数据恢复极其困难。",
    contextJa: "ランサムウェア対策として、定期的なバックアップ（特にオフラインバックアップ）と、不審なメール添付ファイルを開かないことが重要。",
    contextZh: "作为勒索软件对策，定期备份（尤其是离线备份）和不打开可疑邮件附件至关重要。",
    compareWith: ["sg-backup", "sg-malware"],
    examCueJa: "「ランサムウェア対策＝定期的バックアップ＋オフライン保管」「同一ネットワーク上のバックアップも暗号化される可能性がある」を理解する。BCPとの違いも重要。",
    examCueZh: "理解「勒索软件对策=定期备份+离线保管」「同一网络上的备份也可能被加密」。与BCP的区别也很重要。",
    sourceRefs: ["sg-ch01"]
  },
  {
    id: "sg-backup",
    en: "Backup", ja: "バックアップ", zh: "备份",
    termType: "security-measure",
    definitionJa: "データの消失や破損に備えて、データの複製を作成し保管すること。フルバックアップ、差分バックアップ、増分バックアップなどの方式がある。",
    definitionZh: "为防范数据丢失或损坏，创建并保管数据副本。有全量备份、差异备份、增量备份等方式。",
    contextJa: "ランサムウェア対策としてのオフラインバックアップの重要性、バックアップの3-2-1ルール（3つのコピー、2つの異なるメディア、1つはオフサイト）が試験で問われる。",
    contextZh: "考试会考察作为勒索软件对策的离线备份重要性、备份的3-2-1规则（3份副本、2种不同介质、1份异地）。",
    compareWith: ["sg-ransomware", "sg-bcp"],
    examCueJa: "「バックアップがあれば復旧できる」だけでは不十分。「オフライン」「リストア手順の検証」「バックアップの世代管理」が実践的な対策として問われる。",
    examCueZh: "仅「有备份就能恢复」不够。「离线」「恢复步骤验证」「备份的版本管理」作为实践对策会被考察。",
    sourceRefs: ["sg-ch01"]
  }
];

module.exports = terms;
