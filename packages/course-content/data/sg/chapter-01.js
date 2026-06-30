module.exports = {
  "chapter": {
    "id": "sg-ch01",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 1,
    "titleJa": "第1章 情報セキュリティとは",
    "titleZh": "第1章 什么是信息安全"
  },
  "units": [
    {
      "id": "sg-1-1-1",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "1-1-1",
      "titleJa": "1-1-1 情報セキュリティとは",
      "titleZh": "1-1-1 什么是信息安全",
      "overviewJa": "情報セキュリティとはは、SG基礎分野で情報資産を守る目的、対象、脅威、対策の関係を整理する。機密性、完全性、可用性を中心に、事故が起きたときに何が損なわれるかを判断する。PDF 36-37ページの「情報セキュリティとは」を定位語に、試験では「機密性」「完全性」「可用性」「情報資産」「脅威」「脆弱性」が判断線です。単なるウイルス対策やネットワーク技術との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "什么是信息安全用于为了保护信息资产，让组织在业务中维持机密性、完整性、可用性。本单元依据 PDF 36-37 页的「情報セキュリティとは」定位，重点理解：信息安全不是只装安全软件，而是围绕信息资产、威胁、脆弱性和对策建立管理思路。判断时要看损害的是 CIA 中哪一项。考试常用机密性、完整性、可用性、信息资产、威胁、脆弱性是判断线索来换说法；同时要和单纯杀毒或网络技术区分。",
      "learningGoalJa": "問題文の条件を読み取り、「情報セキュリティとは」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-1-1 什么是信息安全”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "情報セキュリティとはを学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。情報資産を守る目的、対象、脅威、対策の関係を整理する。機密性、完全性、可用性を中心に、事故が起きたときに何が損なわれるかを判断する。この関係を押さえると、情報セキュリティとはは単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではCIA、Confidentiality、Integrity、Availability、Asset、Threatが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习什么是信息安全时，先判断它是在讲攻击、资产、管理还是评价。信息安全不是只装安全软件，而是围绕信息资产、威胁、脆弱性和对策建立管理思路。判断时要看损害的是 CIA 中哪一项。这样可以把CIA、Confidentiality、Integrity、Availability、Asset、Threat等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "CIA",
            "Confidentiality",
            "Integrity",
            "Availability",
            "Asset",
            "Threat"
          ],
          "examFocusJa": "「情報セキュリティとは」の設問では、「機密性」「完全性」「可用性」「情報資産」「脅威」「脆弱性」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、単なるウイルス対策やネットワーク技術の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「情報セキュリティとは」相关题时，先抓机密性、完整性、可用性、信息资产、威胁、脆弱性是判断线索。再判断题目问对象、原因、影响还是对策，并排除单纯杀毒或网络技术。",
          "commonMistakeJa": "「情報セキュリティとは」を単なるウイルス対策やネットワーク技術と混同すると誤答します。特に情報セキュリティを機密性だけの問題と考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「情報セキュリティとは」和单纯杀毒或网络技术混淆，尤其是把信息安全只理解成保密问题。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 36,
              "pdfPageEnd": 37,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-1 情報セキュリティとは",
              "anchorTermsJa": [
                "情報セキュリティとは"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、情報セキュリティとはが単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「機密性」「完全性」「可用性」「情報資産」「脅威」「脆弱性」が判断線です。その語が出たら、まず为了保护信息资产，让组织在业务中维持机密性、完整性、可用性という意味に対応する日本語条件を探します。合わない場合は、単なるウイルス対策やネットワーク技術を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把什么是信息安全放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。机密性、完整性、可用性、信息资产、威胁、脆弱性是判断线索。看到这些线索时，先判断是否符合“为了保护信息资产，让组织在业务中维持机密性、完整性、可用性”；如果不符合，就可能是在让你误选单纯杀毒或网络技术。",
          "englishTerms": [
            "CIA",
            "Confidentiality",
            "Integrity",
            "Availability",
            "Asset",
            "Threat"
          ],
          "examFocusJa": "情報セキュリティとはの見分け方は、「機密性」「完全性」「可用性」「情報資産」「脅威」「脆弱性」が判断線ですを文章中から拾い、単なるウイルス対策やネットワーク技術ではなく情報セキュリティとはを答えるべき条件かを確認することです。",
          "examFocusZh": "什么是信息安全的判断线索是机密性、完整性、可用性、信息资产、威胁、脆弱性是判断线索，同时确认题干要求的是否是「情報セキュリティとは」，而不是单纯杀毒或网络技术。",
          "commonMistakeJa": "情報セキュリティとはではなく単なるウイルス対策やネットワーク技術の説明を選ぶ誤りに注意します。原因は、情報セキュリティを機密性だけの問題と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「情報セキュリティとは」（什么是信息安全）和单纯杀毒或网络技术混淆。错误通常来自把信息安全只理解成保密问题，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 36,
              "pdfPageEnd": 37,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-1 情報セキュリティとは",
              "anchorTermsJa": [
                "情報セキュリティとは"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "CIA",
          "termZh": "CIA",
          "english": "CIA"
        },
        {
          "termJa": "Confidentiality",
          "termZh": "Confidentiality",
          "english": "Confidentiality"
        },
        {
          "termJa": "Integrity",
          "termZh": "Integrity",
          "english": "Integrity"
        },
        {
          "termJa": "Availability",
          "termZh": "Availability",
          "english": "Availability"
        },
        {
          "termJa": "Asset",
          "termZh": "Asset",
          "english": "Asset"
        },
        {
          "termJa": "Threat",
          "termZh": "Threat",
          "english": "Threat"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "情報セキュリティとはと単なるウイルス対策やネットワーク技術を混同する",
          "trapZh": "把什么是信息安全和单纯杀毒或网络技术混为一谈。"
        },
        {
          "trapJa": "情報セキュリティを機密性だけの問題と考える",
          "trapZh": "把信息安全只理解成保密问题"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0001"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 36,
          "pdfPageEnd": 37,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-1-1 情報セキュリティとは",
          "anchorTermsJa": [
            "情報セキュリティとは"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-1-2",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "1-1-2",
      "titleJa": "1-1-2 【事例1】マルウェア感染",
      "titleZh": "1-1-2 案例一：恶意软件感染与威胁",
      "overviewJa": "【事例1】マルウェア感染は、SG脅威事例分野でマルウェア感染の事例では、添付ファイル、Web閲覧、USB媒体などの侵入経路と、感染後の情報漏えい、改ざん、停止を対応させる。事例問題は原因、兆候、初動対応を順番に読む。PDF 38-42ページの「【事例1】マルウェア感染」を定位語に、試験では「添付ファイル」「感染」「不正プログラム」「情報漏えい」「駆除」「初動対応」が判断線です。ランサムウェアや標的型攻撃との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "案例一：恶意软件感染用于通过感染案例理解恶意软件如何进入、扩散并影响业务。本单元依据 PDF 38-42 页的「【事例1】マルウェア感染」定位，重点理解：案例题要按感染路径、发生现象、影响范围和初动应对来读。恶意软件可能造成泄露、篡改、停止，不只是“电脑变慢”。考试常用附件、感染、不正程序、信息泄露、清除、初动响应是判断线索来换说法；同时要和勒索软件或定向攻击区分。",
      "learningGoalJa": "問題文の条件を読み取り、「【事例1】マルウェア感染」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-1-2 案例一：恶意软件感染与威胁”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "【事例1】マルウェア感染を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。マルウェア感染の事例では、添付ファイル、Web閲覧、USB媒体などの侵入経路と、感染後の情報漏えい、改ざん、停止を対応させる。事例問題は原因、兆候、初動対応を順番に読む。この関係を押さえると、【事例1】マルウェア感染は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではMalware、Virus、Trojan、Attachment、Incident Responseが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习案例一：恶意软件感染时，先判断它是在讲攻击、资产、管理还是评价。案例题要按感染路径、发生现象、影响范围和初动应对来读。恶意软件可能造成泄露、篡改、停止，不只是“电脑变慢”。这样可以把Malware、Virus、Trojan、Attachment、Incident Response等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Malware",
            "Virus",
            "Trojan",
            "Attachment",
            "Incident Response"
          ],
          "examFocusJa": "「【事例1】マルウェア感染」の設問では、「添付ファイル」「感染」「不正プログラム」「情報漏えい」「駆除」「初動対応」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、ランサムウェアや標的型攻撃の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「【事例1】マルウェア感染」相关题时，先抓附件、感染、不正程序、信息泄露、清除、初动响应是判断线索。再判断题目问对象、原因、影响还是对策，并排除勒索软件或定向攻击。",
          "commonMistakeJa": "「【事例1】マルウェア感染」をランサムウェアや標的型攻撃と混同すると誤答します。特に感染経路を確認せず、すぐ復旧操作だけを選ぶ場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「【事例1】マルウェア感染」和勒索软件或定向攻击混淆，尤其是不确认感染路径，只选择立即恢复操作。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 38,
              "pdfPageEnd": 42,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-2 【事例1】マルウェア感染",
              "anchorTermsJa": [
                "【事例1】マルウェア感染"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、【事例1】マルウェア感染が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「添付ファイル」「感染」「不正プログラム」「情報漏えい」「駆除」「初動対応」が判断線です。その語が出たら、まず通过感染案例理解恶意软件如何进入、扩散并影响业务という意味に対応する日本語条件を探します。合わない場合は、ランサムウェアや標的型攻撃を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把案例一：恶意软件感染放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。附件、感染、不正程序、信息泄露、清除、初动响应是判断线索。看到这些线索时，先判断是否符合“通过感染案例理解恶意软件如何进入、扩散并影响业务”；如果不符合，就可能是在让你误选勒索软件或定向攻击。",
          "englishTerms": [
            "Malware",
            "Virus",
            "Trojan",
            "Attachment",
            "Incident Response"
          ],
          "examFocusJa": "【事例1】マルウェア感染の見分け方は、「添付ファイル」「感染」「不正プログラム」「情報漏えい」「駆除」「初動対応」が判断線ですを文章中から拾い、ランサムウェアや標的型攻撃ではなく【事例1】マルウェア感染を答えるべき条件かを確認することです。",
          "examFocusZh": "案例一：恶意软件感染的判断线索是附件、感染、不正程序、信息泄露、清除、初动响应是判断线索，同时确认题干要求的是否是「【事例1】マルウェア感染」，而不是勒索软件或定向攻击。",
          "commonMistakeJa": "【事例1】マルウェア感染ではなくランサムウェアや標的型攻撃の説明を選ぶ誤りに注意します。原因は、感染経路を確認せず、すぐ復旧操作だけを選ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「【事例1】マルウェア感染」（案例一：恶意软件感染）和勒索软件或定向攻击混淆。错误通常来自不确认感染路径，只选择立即恢复操作，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 38,
              "pdfPageEnd": 42,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-2 【事例1】マルウェア感染",
              "anchorTermsJa": [
                "【事例1】マルウェア感染"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Malware",
          "termZh": "Malware",
          "english": "Malware"
        },
        {
          "termJa": "Virus",
          "termZh": "Virus",
          "english": "Virus"
        },
        {
          "termJa": "Trojan",
          "termZh": "Trojan",
          "english": "Trojan"
        },
        {
          "termJa": "Attachment",
          "termZh": "Attachment",
          "english": "Attachment"
        },
        {
          "termJa": "Incident Response",
          "termZh": "Incident Response",
          "english": "Incident Response"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "【事例1】マルウェア感染とランサムウェアや標的型攻撃を混同する",
          "trapZh": "把案例一：恶意软件感染和勒索软件或定向攻击混为一谈。"
        },
        {
          "trapJa": "感染経路を確認せず、すぐ復旧操作だけを選ぶ",
          "trapZh": "不确认感染路径，只选择立即恢复操作"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0002"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 38,
          "pdfPageEnd": 42,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-1-2 【事例1】マルウェア感染",
          "anchorTermsJa": [
            "【事例1】マルウェア感染"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-1-3",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "1-1-3",
      "titleJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
      "titleZh": "1-1-3 案例二：勒索软件与网络隔离备份",
      "overviewJa": "【事例2】ランサムウェアとバックアップは、SG脅威事例分野でランサムウェアはデータを暗号化し、復旧や業務継続を妨げます。バックアップは取得するだけでなく、世代管理、ネットワーク分離、復元手順の確認まで含めて考える必要があります。PDF 43-46ページの「【事例2】ランサムウェアとバックアップ」を定位語に、試験では「ランサムウェア」「暗号化」「バックアップ」「復元」「ネットワーク分離」「業務継続」が判断線です。通常のマルウェア感染対応や単純なファイルコピーとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "案例二：勒索软件与备份用于理解勒索软件加密数据后的影响，以及离线备份和恢复计划的重要性。本单元依据 PDF 43-46 页的「【事例2】ランサムウェアとバックアップ」定位，重点理解：勒索软件会加密数据并阻碍业务继续。备份不是只复制一份文件，还要考虑版本、离线或隔离保存、恢复测试和业务继续计划。考试常用勒索软件、加密、备份、恢复、网络隔离、业务连续性是判断线索来换说法；同时要和普通恶意软件处理或单纯复制文件区分。",
      "learningGoalJa": "問題文の条件を読み取り、「【事例2】ランサムウェアとバックアップ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-1-3 案例二：勒索软件与网络隔离备份”相关选项，并说清楚判断依据。",
      "sourceAccess": {
        "mode": "locator_only",
        "status": "unbound",
        "displayLabel": "原书定位已验证 / 原书阅读尚未绑定",
        "documentId": null,
        "url": null
      },
      "learningExperience": {
        "goalJa": "ランサムウェアの事例を、攻撃の仕組み、バックアップの保存条件、復旧手順、業務継続の判断に分けて読めるようにする。",
        "goalZh": "先理解勒索软件、备份、恢复、离线隔离和 BCP 的关系，再用这些条件判断案例题的正确对策。",
        "coreConcept": {
          "headingJa": "ランサムウェア対策は復旧可能性まで含めて考える",
          "headingZh": "勒索软件对策要看到“能否恢复业务”",
          "bodyJa": "ランサムウェアは、利用者や組織のデータを暗号化し、復号や再利用のために金銭を要求する攻撃です。被害を受けた後は、感染端末を止めるだけでは業務は戻りません。重要なのは、暗号化されていないバックアップが残っているか、バックアップから復旧できる手順を確認しているか、業務を止めないための優先順位を決めているかです。同じネットワーク上のバックアップは攻撃の影響を受ける可能性があるため、世代管理、オフライン保管、復旧訓練、BCPを組み合わせて考えます。",
          "bodyZh": "勒索软件不是“普通病毒感染”四个字就能解释完的知识点。它会把数据加密，让企业即使有设备也无法使用业务数据。备份也不是复制一份就结束：如果备份一直连在同一网络里，也可能一起被加密。考试要你判断的是恢复能力，所以要同时看备份介质是否隔离、是否有多代版本、是否做过 Restore 测试，以及 BCP 是否规定了业务优先级。"
        },
        "prerequisiteConcepts": [
          {
            "labelJa": "暗号化されたデータ",
            "labelZh": "被加密的数据",
            "bodyJa": "攻撃後にファイルが存在していても、正しく読めなければ業務では使えません。",
            "bodyZh": "文件还在不代表业务可继续，关键是是否能恢复可读、可用的数据。"
          },
          {
            "labelJa": "バックアップと復旧",
            "labelZh": "备份与恢复",
            "bodyJa": "バックアップは取得、保管、復旧確認までそろって初めて対策になります。",
            "bodyZh": "备份要能真的恢复，只有“有一份副本”不足以说明安全。"
          },
          {
            "labelJa": "業務継続",
            "labelZh": "业务连续性",
            "bodyJa": "復旧順序、代替手段、再開基準をBCPとして決めておくと被害時の判断がぶれません。",
            "bodyZh": "BCP 负责告诉组织先恢复什么、怎么临时维持业务、何时恢复正常。"
          }
        ],
        "caseBreakdown": [
          {
            "labelJa": "何が起きたか",
            "labelZh": "发生了什么",
            "bodyJa": "攻撃者はランサムウェアで業務データを暗号化し、通常の利用や共有をできない状態にします。",
            "bodyZh": "攻击者通过勒索软件加密业务数据，使企业无法正常读取或使用这些数据。"
          },
          {
            "labelJa": "なぜ同一ネットワークのバックアップが弱いか",
            "labelZh": "为什么同网备份脆弱",
            "bodyJa": "バックアップ媒体が常時接続されていると、攻撃の影響範囲に含まれ、バックアップ自体も暗号化されるおそれがあります。",
            "bodyZh": "如果备份介质一直在线并在同一网络里，攻击扩散时备份也可能被加密，恢复路径会一起失效。"
          },
          {
            "labelJa": "どう判断するか",
            "labelZh": "题目如何判断",
            "bodyJa": "設問でネットワーク分離、オフライン保管、復旧手順の確認、世代管理が出たら、復旧可能性を高める対策として読む。",
            "bodyZh": "题干出现网络隔离、离线保存、恢复演练、多代备份时，通常是在问如何提高可恢复性。"
          },
          {
            "labelJa": "正しい対策は何か",
            "labelZh": "正确对策是什么",
            "bodyJa": "感染端末の隔離に加え、暗号化されていないバックアップから復旧し、BCPに従って優先業務を再開します。",
            "bodyZh": "不仅要隔离感染终端，还要用未被加密的备份恢复，并按 BCP 先恢复关键业务。"
          }
        ],
        "examCues": [
          {
            "cueJa": "「バックアップがある」だけではなく、「オフライン」「世代管理」「復旧確認」があるかを確認する。",
            "cueZh": "看到“有备份”还不够，要继续看是否离线、是否多代保存、是否验证过恢复。"
          },
          {
            "cueJa": "「業務を継続する」「優先順位を決める」という条件があれば、BCPや復旧計画の観点で読む。",
            "cueZh": "题干强调业务继续、恢复优先级时，要从 BCP 和恢复计划判断。"
          }
        ],
        "mistakeComparisons": [
          {
            "aJa": "バックアップ",
            "bJa": "復旧",
            "bodyJa": "バックアップはデータを残す行為で、復旧はそのデータを使って業務に戻す行為です。保存だけで復旧できるとは限りません。",
            "bodyZh": "Backup 是保留数据副本，Restore 是用副本让系统或业务恢复。考试会用“有备份但未测试恢复”来设陷阱。"
          },
          {
            "aJa": "同一ネットワーク上の保存",
            "bJa": "オフライン保管",
            "bodyJa": "同一ネットワーク上の保存は運用しやすい一方で攻撃の影響を受けやすく、オフライン保管は復旧用の最後の退避先になります。",
            "bodyZh": "同网保存方便但可能一起被加密；离线备份牺牲一些便利性，用来保住恢复来源。"
          }
        ]
      },
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "【事例2】ランサムウェアとバックアップを学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。ランサムウェアはデータを暗号化し、復旧や業務継続を妨げます。バックアップは取得するだけでなく、世代管理、ネットワーク分離、復元手順の確認まで含めて考える必要があります。この関係を押さえると、【事例2】ランサムウェアとバックアップは単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではRansomware、Backup、Restore、Offline Backup、BCPが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习案例二：勒索软件与备份时，先判断它是在讲攻击、资产、管理还是评价。勒索软件会加密数据并阻碍业务继续。备份不是只复制一份文件，还要考虑版本、离线或隔离保存、恢复测试和业务继续计划。这样可以把Ransomware、Backup、Restore、Offline Backup、BCP等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Ransomware",
            "Backup",
            "Restore",
            "Offline Backup",
            "BCP"
          ],
          "examFocusJa": "「【事例2】ランサムウェアとバックアップ」の設問では、「ランサムウェア」「暗号化」「バックアップ」「復元」「ネットワーク分離」「業務継続」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、通常のマルウェア感染対応や単純なファイルコピーの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「【事例2】ランサムウェアとバックアップ」相关题时，先抓勒索软件、加密、备份、恢复、网络隔离、业务连续性是判断线索。再判断题目问对象、原因、影响还是对策，并排除普通恶意软件处理或单纯复制文件。",
          "commonMistakeJa": "「【事例2】ランサムウェアとバックアップ」を通常のマルウェア感染対応や単純なファイルコピーと混同すると誤答します。特にバックアップを同じネットワーク上に置けば十分と考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「【事例2】ランサムウェアとバックアップ」和普通恶意软件处理或单纯复制文件混淆，尤其是误以为备份放在同一网络上就足够。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、【事例2】ランサムウェアとバックアップが単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「ランサムウェア」「暗号化」「バックアップ」「復元」「ネットワーク分離」「業務継続」が判断線です。その語が出たら、まず理解勒索软件加密数据后的影响，以及离线备份和恢复计划的重要性という意味に対応する日本語条件を探します。合わない場合は、通常のマルウェア感染対応や単純なファイルコピーを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把案例二：勒索软件与备份放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。勒索软件、加密、备份、恢复、网络隔离、业务连续性是判断线索。看到这些线索时，先判断是否符合“理解勒索软件加密数据后的影响，以及离线备份和恢复计划的重要性”；如果不符合，就可能是在让你误选普通恶意软件处理或单纯复制文件。",
          "englishTerms": [
            "Ransomware",
            "Backup",
            "Restore",
            "Offline Backup",
            "BCP"
          ],
          "examFocusJa": "【事例2】ランサムウェアとバックアップの見分け方は、「ランサムウェア」「暗号化」「バックアップ」「復元」「ネットワーク分離」「業務継続」が判断線ですを文章中から拾い、通常のマルウェア感染対応や単純なファイルコピーではなく【事例2】ランサムウェアとバックアップを答えるべき条件かを確認することです。",
          "examFocusZh": "案例二：勒索软件与备份的判断线索是勒索软件、加密、备份、恢复、网络隔离、业务连续性是判断线索，同时确认题干要求的是否是「【事例2】ランサムウェアとバックアップ」，而不是普通恶意软件处理或单纯复制文件。",
          "commonMistakeJa": "【事例2】ランサムウェアとバックアップではなく通常のマルウェア感染対応や単純なファイルコピーの説明を選ぶ誤りに注意します。原因は、バックアップを同じネットワーク上に置けば十分と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「【事例2】ランサムウェアとバックアップ」（案例二：勒索软件与备份）和普通恶意软件处理或单纯复制文件混淆。错误通常来自误以为备份放在同一网络上就足够，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "id": "ransomware",
          "en": "Ransomware",
          "ja": "ランサムウェア",
          "zh": "勒索软件",
          "termJa": "ランサムウェア",
          "termZh": "勒索软件",
          "english": "Ransomware",
          "termType": "security-threat",
          "definitionJa": "データやシステムを暗号化し、利用できない状態にして復旧の対価を要求するマルウェアです。",
          "definitionZh": "勒索软件会加密数据或系统，使业务无法正常使用，再要求支付赎金换取恢复条件。",
          "contextJa": "この単元では、バックアップが同時に暗号化されないように保管方法と復旧手順を考える起点になります。",
          "contextZh": "本节用它说明：真正的安全不是感染后才杀毒，而是提前准备不会一起被加密的恢复路径。",
          "compareWith": [
            "malware",
            "backup",
            "restore"
          ],
          "examCueJa": "「暗号化」「身代金」「復旧不能」が出たらランサムウェア被害として読む。",
          "examCueZh": "题干出现加密、赎金、无法恢复时，优先判断为勒索软件场景。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "backup",
          "en": "Backup",
          "ja": "バックアップ",
          "zh": "备份",
          "termJa": "バックアップ",
          "termZh": "备份",
          "english": "Backup",
          "termType": "recovery-control",
          "definitionJa": "障害や攻撃に備えて、重要なデータを別媒体や別場所に保存しておく対策です。",
          "definitionZh": "备份是在故障或攻击前，把重要数据保存到其他介质或位置，以便之后恢复。",
          "contextJa": "ランサムウェア対策では、バックアップが攻撃の影響を受けない場所にあるかが判断点になります。",
          "contextZh": "在勒索软件场景中，备份的价值取决于它是否不会和原数据一起被加密。",
          "compareWith": [
            "restore",
            "offline-backup",
            "bcp"
          ],
          "examCueJa": "「取得済み」だけでなく、世代管理、隔離、復旧確認があるかを見る。",
          "examCueZh": "考试不会只看是否备份，还会看是否隔离、多代保存、能否恢复。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "restore",
          "en": "Restore",
          "ja": "復旧",
          "zh": "恢复",
          "termJa": "復旧",
          "termZh": "恢复",
          "english": "Restore",
          "termType": "recovery-process",
          "definitionJa": "バックアップなどを利用して、データやシステムを業務で使える状態に戻すことです。",
          "definitionZh": "恢复是利用备份等手段，让数据或系统重新回到业务可使用状态。",
          "contextJa": "事例では、バックアップを持っているだけでなく、復旧手順を確認しているかが問われます。",
          "contextZh": "本节强调备份必须能恢复；没有演练或流程，备份可能只是心理安慰。",
          "compareWith": [
            "backup",
            "bcp",
            "incident-response"
          ],
          "examCueJa": "「復元手順」「復旧訓練」「業務再開」が出たらRestoreの観点で読む。",
          "examCueZh": "题干出现恢复步骤、恢复演练、业务重启时，要从 Restore 角度判断。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "offline-backup",
          "en": "Offline Backup",
          "ja": "オフラインバックアップ",
          "zh": "离线备份",
          "termJa": "オフラインバックアップ",
          "termZh": "离线备份",
          "english": "Offline Backup",
          "termType": "recovery-control",
          "definitionJa": "通常時はネットワークから切り離した媒体や環境にバックアップを保管する考え方です。",
          "definitionZh": "离线备份是把备份保存在平时不连接网络的介质或环境中，降低一起被攻击的风险。",
          "contextJa": "ランサムウェアでは同一ネットワークの保存先も暗号化される可能性があるため、分離が重要になります。",
          "contextZh": "本案例用它区分“有备份”和“有不会一起被加密的备份”。",
          "compareWith": [
            "backup",
            "network-share",
            "restore"
          ],
          "examCueJa": "「同一ネットワーク」「常時接続」と対比して、分離保管の効果を判断する。",
          "examCueZh": "题干把同网、常时连接与离线隔离对比时，要选能避免备份一起受害的做法。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "bcp",
          "en": "BCP",
          "ja": "事業継続計画（BCP）",
          "zh": "业务连续性计划（BCP）",
          "termJa": "事業継続計画（BCP）",
          "termZh": "业务连续性计划（BCP）",
          "english": "BCP",
          "expansionEn": "Business Continuity Plan",
          "termType": "continuity-plan",
          "definitionJa": "災害、障害、攻撃が起きても重要業務を継続又は早期再開するための計画です。",
          "definitionZh": "BCP 是在灾害、故障或攻击发生时，让关键业务继续或尽快恢复的计划。",
          "contextJa": "復旧対象の優先順位や代替手段を決めるため、バックアップ対策を業務継続の判断につなげます。",
          "contextZh": "本节里 BCP 用来把技术恢复和业务优先级连接起来，不只是 IT 部门的备份清单。",
          "compareWith": [
            "restore",
            "backup",
            "incident-response"
          ],
          "examCueJa": "「重要業務」「優先順位」「早期再開」が出たらBCPの観点を確認する。",
          "examCueZh": "出现关键业务、优先级、尽快恢复时，要从 BCP 判断。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 43,
              "pdfPageEnd": 46,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
              "anchorTermsJa": [
                "【事例2】ランサムウェアとバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "commonTraps": [
        {
          "trapJa": "【事例2】ランサムウェアとバックアップと通常のマルウェア感染対応や単純なファイルコピーを混同する",
          "trapZh": "把案例二：勒索软件与备份和普通恶意软件处理或单纯复制文件混为一谈。"
        },
        {
          "trapJa": "バックアップを同じネットワーク上に置けば十分と考える",
          "trapZh": "误以为备份放在同一网络上就足够"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0003"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 43,
          "pdfPageEnd": 46,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
          "anchorTermsJa": [
            "【事例2】ランサムウェアとバックアップ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-1",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "1-2-1",
      "titleJa": "1-2-1 情報セキュリティの目的と考え方",
      "titleZh": "1-2-1 信息安全的根本目的与思考方式",
      "overviewJa": "情報セキュリティの目的と考え方は、SG基礎分野で情報セキュリティの目的は、情報資産を適切に利用できる状態で守ることです。対策は業務を止めるためではなく、リスクを許容範囲に抑えながら事業目的を支えるために選びます。PDF 47-50ページの「情報セキュリティの目的と考え方」を定位語に、試験では「目的」「リスク」「情報資産」「業務継続」「利用可能性」「対策」が判断線です。個別の攻撃名や技術対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "信息安全的目的用于明确安全管理服务于业务持续和风险降低，而不只是禁止操作。本单元依据 PDF 47-50 页的「情報セキュリティの目的と考え方」定位，重点理解：安全的目的不是把所有操作都禁止，而是在可接受风险内保护信息资产并支撑业务。要把安全目标和业务目标一起看。考试常用目的、风险、信息资产、业务连续性、可用性、对策是判断线索来换说法；同时要和具体攻击名称或单个技术措施区分。",
      "learningGoalJa": "問題文の条件を読み取り、「情報セキュリティの目的と考え方」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-2-1 信息安全的根本目的与思考方式”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "情報セキュリティの目的と考え方を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。情報セキュリティの目的は、情報資産を適切に利用できる状態で守ることです。対策は業務を止めるためではなく、リスクを許容範囲に抑えながら事業目的を支えるために選びます。この関係を押さえると、情報セキュリティの目的と考え方は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではRisk、Security Objective、Business Continuity、Controlが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习信息安全的目的时，先判断它是在讲攻击、资产、管理还是评价。安全的目的不是把所有操作都禁止，而是在可接受风险内保护信息资产并支撑业务。要把安全目标和业务目标一起看。这样可以把Risk、Security Objective、Business Continuity、Control等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Risk",
            "Security Objective",
            "Business Continuity",
            "Control"
          ],
          "examFocusJa": "「情報セキュリティの目的と考え方」の設問では、「目的」「リスク」「情報資産」「業務継続」「利用可能性」「対策」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、個別の攻撃名や技術対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「情報セキュリティの目的と考え方」相关题时，先抓目的、风险、信息资产、业务连续性、可用性、对策是判断线索。再判断题目问对象、原因、影响还是对策，并排除具体攻击名称或单个技术措施。",
          "commonMistakeJa": "「情報セキュリティの目的と考え方」を個別の攻撃名や技術対策と混同すると誤答します。特に対策が厳しければ常に良いと考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「情報セキュリティの目的と考え方」和具体攻击名称或单个技术措施混淆，尤其是误以为措施越严格就一定越好。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 47,
              "pdfPageEnd": 50,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-1 情報セキュリティの目的と考え方",
              "anchorTermsJa": [
                "情報セキュリティの目的と考え方"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、情報セキュリティの目的と考え方が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「目的」「リスク」「情報資産」「業務継続」「利用可能性」「対策」が判断線です。その語が出たら、まず明确安全管理服务于业务持续和风险降低，而不只是禁止操作という意味に対応する日本語条件を探します。合わない場合は、個別の攻撃名や技術対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把信息安全的目的放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。目的、风险、信息资产、业务连续性、可用性、对策是判断线索。看到这些线索时，先判断是否符合“明确安全管理服务于业务持续和风险降低，而不只是禁止操作”；如果不符合，就可能是在让你误选具体攻击名称或单个技术措施。",
          "englishTerms": [
            "Risk",
            "Security Objective",
            "Business Continuity",
            "Control"
          ],
          "examFocusJa": "情報セキュリティの目的と考え方の見分け方は、「目的」「リスク」「情報資産」「業務継続」「利用可能性」「対策」が判断線ですを文章中から拾い、個別の攻撃名や技術対策ではなく情報セキュリティの目的と考え方を答えるべき条件かを確認することです。",
          "examFocusZh": "信息安全的目的的判断线索是目的、风险、信息资产、业务连续性、可用性、对策是判断线索，同时确认题干要求的是否是「情報セキュリティの目的と考え方」，而不是具体攻击名称或单个技术措施。",
          "commonMistakeJa": "情報セキュリティの目的と考え方ではなく個別の攻撃名や技術対策の説明を選ぶ誤りに注意します。原因は、対策が厳しければ常に良いと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「情報セキュリティの目的と考え方」（信息安全的目的）和具体攻击名称或单个技术措施混淆。错误通常来自误以为措施越严格就一定越好，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 47,
              "pdfPageEnd": 50,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-1 情報セキュリティの目的と考え方",
              "anchorTermsJa": [
                "情報セキュリティの目的と考え方"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Risk",
          "termZh": "Risk",
          "english": "Risk"
        },
        {
          "termJa": "Security Objective",
          "termZh": "Security Objective",
          "english": "Security Objective"
        },
        {
          "termJa": "Business Continuity",
          "termZh": "Business Continuity",
          "english": "Business Continuity"
        },
        {
          "termJa": "Control",
          "termZh": "Control",
          "english": "Control"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "情報セキュリティの目的と考え方と個別の攻撃名や技術対策を混同する",
          "trapZh": "把信息安全的目的和具体攻击名称或单个技术措施混为一谈。"
        },
        {
          "trapJa": "対策が厳しければ常に良いと考える",
          "trapZh": "误以为措施越严格就一定越好"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0004"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 47,
          "pdfPageEnd": 50,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-1 情報セキュリティの目的と考え方",
          "anchorTermsJa": [
            "情報セキュリティの目的と考え方"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-2",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "1-2-2",
      "titleJa": "1-2-2 情報セキュリティの基本",
      "titleZh": "1-2-2 信息安全三要素 (CIA) 与衍生要素",
      "overviewJa": "情報セキュリティの基本は、SG基礎分野で基本要素では、機密性は許可された人だけが情報を見られること、完全性は正確で改ざんされていないこと、可用性は必要なときに使えることです。真正性、責任追跡性、否認防止なども問題で問われます。PDF 51-52ページの「情報セキュリティの基本」を定位語に、試験では「機密性」「完全性」「可用性」「真正性」「責任追跡性」「否認防止」が判断線です。脅威の種類やリスク対応との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "信息安全基本要素用于用 CIA 及相关要素判断信息安全事故损害了什么。本单元依据 PDF 51-52 页的「情報セキュリティの基本」定位，重点理解：CIA 是判断事故影响的主轴：泄露影响机密性，篡改影响完整性，服务停止影响可用性。还要理解真实性、可追踪性和抗抵赖等扩展要素。考试常用机密性、完整性、可用性、真实性、责任追踪、抗抵赖是判断线索来换说法；同时要和威胁分类或风险应对区分。",
      "learningGoalJa": "問題文の条件を読み取り、「情報セキュリティの基本」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-2-2 信息安全三要素 (CIA) 与衍生要素”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "情報セキュリティの基本を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。基本要素では、機密性は許可された人だけが情報を見られること、完全性は正確で改ざんされていないこと、可用性は必要なときに使えることです。真正性、責任追跡性、否認防止なども問題で問われます。この関係を押さえると、情報セキュリティの基本は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではCIA、Authenticity、Accountability、Non-repudiationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习信息安全基本要素时，先判断它是在讲攻击、资产、管理还是评价。CIA 是判断事故影响的主轴：泄露影响机密性，篡改影响完整性，服务停止影响可用性。还要理解真实性、可追踪性和抗抵赖等扩展要素。这样可以把CIA、Authenticity、Accountability、Non-repudiation等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "CIA",
            "Authenticity",
            "Accountability",
            "Non-repudiation"
          ],
          "examFocusJa": "「情報セキュリティの基本」の設問では、「機密性」「完全性」「可用性」「真正性」「責任追跡性」「否認防止」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、脅威の種類やリスク対応の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「情報セキュリティの基本」相关题时，先抓机密性、完整性、可用性、真实性、责任追踪、抗抵赖是判断线索。再判断题目问对象、原因、影响还是对策，并排除威胁分类或风险应对。",
          "commonMistakeJa": "「情報セキュリティの基本」を脅威の種類やリスク対応と混同すると誤答します。特に可用性を秘密保持、完全性を利用可能性と取り違える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「情報セキュリティの基本」和威胁分类或风险应对混淆，尤其是把可用性误当成保密，把完整性误当成可使用。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 51,
              "pdfPageEnd": 52,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-2 情報セキュリティの基本",
              "anchorTermsJa": [
                "情報セキュリティの基本"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、情報セキュリティの基本が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「機密性」「完全性」「可用性」「真正性」「責任追跡性」「否認防止」が判断線です。その語が出たら、まず用 CIA 及相关要素判断信息安全事故损害了什么という意味に対応する日本語条件を探します。合わない場合は、脅威の種類やリスク対応を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把信息安全基本要素放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。机密性、完整性、可用性、真实性、责任追踪、抗抵赖是判断线索。看到这些线索时，先判断是否符合“用 CIA 及相关要素判断信息安全事故损害了什么”；如果不符合，就可能是在让你误选威胁分类或风险应对。",
          "englishTerms": [
            "CIA",
            "Authenticity",
            "Accountability",
            "Non-repudiation"
          ],
          "examFocusJa": "情報セキュリティの基本の見分け方は、「機密性」「完全性」「可用性」「真正性」「責任追跡性」「否認防止」が判断線ですを文章中から拾い、脅威の種類やリスク対応ではなく情報セキュリティの基本を答えるべき条件かを確認することです。",
          "examFocusZh": "信息安全基本要素的判断线索是机密性、完整性、可用性、真实性、责任追踪、抗抵赖是判断线索，同时确认题干要求的是否是「情報セキュリティの基本」，而不是威胁分类或风险应对。",
          "commonMistakeJa": "情報セキュリティの基本ではなく脅威の種類やリスク対応の説明を選ぶ誤りに注意します。原因は、可用性を秘密保持、完全性を利用可能性と取り違えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「情報セキュリティの基本」（信息安全基本要素）和威胁分类或风险应对混淆。错误通常来自把可用性误当成保密，把完整性误当成可使用，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 51,
              "pdfPageEnd": 52,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-2 情報セキュリティの基本",
              "anchorTermsJa": [
                "情報セキュリティの基本"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "CIA",
          "termZh": "CIA",
          "english": "CIA"
        },
        {
          "termJa": "Authenticity",
          "termZh": "Authenticity",
          "english": "Authenticity"
        },
        {
          "termJa": "Accountability",
          "termZh": "Accountability",
          "english": "Accountability"
        },
        {
          "termJa": "Non-repudiation",
          "termZh": "Non-repudiation",
          "english": "Non-repudiation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "情報セキュリティの基本と脅威の種類やリスク対応を混同する",
          "trapZh": "把信息安全基本要素和威胁分类或风险应对混为一谈。"
        },
        {
          "trapJa": "可用性を秘密保持、完全性を利用可能性と取り違える",
          "trapZh": "把可用性误当成保密，把完整性误当成可使用"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0005"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 51,
          "pdfPageEnd": 52,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-2 情報セキュリティの基本",
          "anchorTermsJa": [
            "情報セキュリティの基本"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-3",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "1-2-3",
      "titleJa": "1-2-3 脅威の種類",
      "titleZh": "1-2-3 安全威胁的分类 (人为/物理/技术)",
      "overviewJa": "脅威の種類は、SG脅威分類分野で脅威は、故意の不正、人的ミス、障害、災害、技術的攻撃などに分けて考えます。発生原因と被害対象を整理すると、必要な予防策、検知策、復旧策が見えます。PDF 53-54ページの「脅威の種類」を定位語に、試験では「故意」「過失」「災害」「障害」「盗難」「不正アクセス」が判断線です。マルウェアなど個別攻撃手口との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "威胁种类用于按人为、技术、物理、环境等来源分类安全威胁。本单元依据 PDF 53-54 页的「脅威の種類」定位，重点理解：威胁既包括故意攻击，也包括误操作、设备故障、灾害和技术攻击。分类时要看来源和影响对象，才能判断应采取预防、检测还是恢复措施。考试常用故意、过失、灾害、故障、盗窃、非法访问是判断线索来换说法；同时要和恶意软件等具体攻击手法区分。",
      "learningGoalJa": "問題文の条件を読み取り、「脅威の種類」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-2-3 安全威胁的分类 (人为/物理/技术)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "脅威の種類を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。脅威は、故意の不正、人的ミス、障害、災害、技術的攻撃などに分けて考えます。発生原因と被害対象を整理すると、必要な予防策、検知策、復旧策が見えます。この関係を押さえると、脅威の種類は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではThreat、Human Error、Disaster、Failure、Unauthorized Accessが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习威胁种类时，先判断它是在讲攻击、资产、管理还是评价。威胁既包括故意攻击，也包括误操作、设备故障、灾害和技术攻击。分类时要看来源和影响对象，才能判断应采取预防、检测还是恢复措施。这样可以把Threat、Human Error、Disaster、Failure、Unauthorized Access等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Threat",
            "Human Error",
            "Disaster",
            "Failure",
            "Unauthorized Access"
          ],
          "examFocusJa": "「脅威の種類」の設問では、「故意」「過失」「災害」「障害」「盗難」「不正アクセス」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、マルウェアなど個別攻撃手口の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「脅威の種類」相关题时，先抓故意、过失、灾害、故障、盗窃、非法访问是判断线索。再判断题目问对象、原因、影响还是对策，并排除恶意软件等具体攻击手法。",
          "commonMistakeJa": "「脅威の種類」をマルウェアなど個別攻撃手口と混同すると誤答します。特に脅威をすべて外部攻撃だけと考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「脅威の種類」和恶意软件等具体攻击手法混淆，尤其是把威胁全部理解成外部攻击。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 53,
              "pdfPageEnd": 54,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-3 脅威の種類",
              "anchorTermsJa": [
                "脅威の種類"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、脅威の種類が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「故意」「過失」「災害」「障害」「盗難」「不正アクセス」が判断線です。その語が出たら、まず按人为、技术、物理、环境等来源分类安全威胁という意味に対応する日本語条件を探します。合わない場合は、マルウェアなど個別攻撃手口を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把威胁种类放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。故意、过失、灾害、故障、盗窃、非法访问是判断线索。看到这些线索时，先判断是否符合“按人为、技术、物理、环境等来源分类安全威胁”；如果不符合，就可能是在让你误选恶意软件等具体攻击手法。",
          "englishTerms": [
            "Threat",
            "Human Error",
            "Disaster",
            "Failure",
            "Unauthorized Access"
          ],
          "examFocusJa": "脅威の種類の見分け方は、「故意」「過失」「災害」「障害」「盗難」「不正アクセス」が判断線ですを文章中から拾い、マルウェアなど個別攻撃手口ではなく脅威の種類を答えるべき条件かを確認することです。",
          "examFocusZh": "威胁种类的判断线索是故意、过失、灾害、故障、盗窃、非法访问是判断线索，同时确认题干要求的是否是「脅威の種類」，而不是恶意软件等具体攻击手法。",
          "commonMistakeJa": "脅威の種類ではなくマルウェアなど個別攻撃手口の説明を選ぶ誤りに注意します。原因は、脅威をすべて外部攻撃だけと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「脅威の種類」（威胁种类）和恶意软件等具体攻击手法混淆。错误通常来自把威胁全部理解成外部攻击，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 53,
              "pdfPageEnd": 54,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-3 脅威の種類",
              "anchorTermsJa": [
                "脅威の種類"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Threat",
          "termZh": "Threat",
          "english": "Threat"
        },
        {
          "termJa": "Human Error",
          "termZh": "Human Error",
          "english": "Human Error"
        },
        {
          "termJa": "Disaster",
          "termZh": "Disaster",
          "english": "Disaster"
        },
        {
          "termJa": "Failure",
          "termZh": "Failure",
          "english": "Failure"
        },
        {
          "termJa": "Unauthorized Access",
          "termZh": "Unauthorized Access",
          "english": "Unauthorized Access"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "脅威の種類とマルウェアなど個別攻撃手口を混同する",
          "trapZh": "把威胁种类和恶意软件等具体攻击手法混为一谈。"
        },
        {
          "trapJa": "脅威をすべて外部攻撃だけと考える",
          "trapZh": "把威胁全部理解成外部攻击"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0006"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 53,
          "pdfPageEnd": 54,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-3 脅威の種類",
          "anchorTermsJa": [
            "脅威の種類"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-4",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "1-2-4",
      "titleJa": "1-2-4 マルウェア・不正プログラム",
      "titleZh": "恶意软件、不正プログラム",
      "overviewJa": "マルウェア・不正プログラムは、SG脅威分類分野でマルウェアは、自己増殖するもの、利用者をだますもの、情報を盗むもの、遠隔操作を可能にするものなど性質が異なります。感染経路と被害内容を結び付けて種類を判断します。PDF 55-57ページの「マルウェア」を定位語に、試験では「ウイルス」「ワーム」「トロイの木馬」「スパイウェア」「バックドア」「感染経路」が判断線です。不正アクセスや標的型攻撃の全体像との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "恶意软件与不正程序用于区分病毒、蠕虫、木马、间谍软件等不正程序的传播和影响。本单元依据 PDF 55-57 页的「マルウェア」定位，重点理解：恶意软件不是一个单一类型。病毒、蠕虫、木马、间谍软件、后门等在传播方式、伪装方式和影响上不同，要从感染路径和损害内容判断。考试常用病毒、蠕虫、木马、间谍软件、后门、感染路径是判断线索来换说法；同时要和非法访问或定向攻击整体过程区分。",
      "learningGoalJa": "問題文の条件を読み取り、「マルウェア・不正プログラム」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“恶意软件、不正プログラム”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "マルウェア・不正プログラムを学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。マルウェアは、自己増殖するもの、利用者をだますもの、情報を盗むもの、遠隔操作を可能にするものなど性質が異なります。感染経路と被害内容を結び付けて種類を判断します。この関係を押さえると、マルウェア・不正プログラムは単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではVirus、Worm、Trojan Horse、Spyware、Backdoor、Malwareが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习恶意软件与不正程序时，先判断它是在讲攻击、资产、管理还是评价。恶意软件不是一个单一类型。病毒、蠕虫、木马、间谍软件、后门等在传播方式、伪装方式和影响上不同，要从感染路径和损害内容判断。这样可以把Virus、Worm、Trojan Horse、Spyware、Backdoor、Malware等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Virus",
            "Worm",
            "Trojan Horse",
            "Spyware",
            "Backdoor",
            "Malware"
          ],
          "examFocusJa": "「マルウェア・不正プログラム」の設問では、「ウイルス」「ワーム」「トロイの木馬」「スパイウェア」「バックドア」「感染経路」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、不正アクセスや標的型攻撃の全体像の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「マルウェア・不正プログラム」相关题时，先抓病毒、蠕虫、木马、间谍软件、后门、感染路径是判断线索。再判断题目问对象、原因、影响还是对策，并排除非法访问或定向攻击整体过程。",
          "commonMistakeJa": "「マルウェア・不正プログラム」を不正アクセスや標的型攻撃の全体像と混同すると誤答します。特にすべてのマルウェアが自己増殖すると考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「マルウェア・不正プログラム」和非法访问或定向攻击整体过程混淆，尤其是误以为所有恶意软件都会自我复制。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 55,
              "pdfPageEnd": 57,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-4 マルウェア・不正プログラム",
              "anchorTermsJa": [
                "マルウェア",
                "不正プログラム"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、マルウェア・不正プログラムが単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「ウイルス」「ワーム」「トロイの木馬」「スパイウェア」「バックドア」「感染経路」が判断線です。その語が出たら、まず区分病毒、蠕虫、木马、间谍软件等不正程序的传播和影响という意味に対応する日本語条件を探します。合わない場合は、不正アクセスや標的型攻撃の全体像を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把恶意软件与不正程序放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。病毒、蠕虫、木马、间谍软件、后门、感染路径是判断线索。看到这些线索时，先判断是否符合“区分病毒、蠕虫、木马、间谍软件等不正程序的传播和影响”；如果不符合，就可能是在让你误选非法访问或定向攻击整体过程。",
          "englishTerms": [
            "Virus",
            "Worm",
            "Trojan Horse",
            "Spyware",
            "Backdoor",
            "Malware"
          ],
          "examFocusJa": "マルウェア・不正プログラムの見分け方は、「ウイルス」「ワーム」「トロイの木馬」「スパイウェア」「バックドア」「感染経路」が判断線ですを文章中から拾い、不正アクセスや標的型攻撃の全体像ではなくマルウェア・不正プログラムを答えるべき条件かを確認することです。",
          "examFocusZh": "恶意软件与不正程序的判断线索是病毒、蠕虫、木马、间谍软件、后门、感染路径是判断线索，同时确认题干要求的是否是「マルウェア・不正プログラム」，而不是非法访问或定向攻击整体过程。",
          "commonMistakeJa": "マルウェア・不正プログラムではなく不正アクセスや標的型攻撃の全体像の説明を選ぶ誤りに注意します。原因は、すべてのマルウェアが自己増殖すると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「マルウェア・不正プログラム」（恶意软件与不正程序）和非法访问或定向攻击整体过程混淆。错误通常来自误以为所有恶意软件都会自我复制，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 55,
              "pdfPageEnd": 57,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-4 マルウェア・不正プログラム",
              "anchorTermsJa": [
                "マルウェア",
                "不正プログラム"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Virus",
          "termZh": "Virus",
          "english": "Virus"
        },
        {
          "termJa": "Worm",
          "termZh": "Worm",
          "english": "Worm"
        },
        {
          "termJa": "Trojan Horse",
          "termZh": "Trojan Horse",
          "english": "Trojan Horse"
        },
        {
          "termJa": "Spyware",
          "termZh": "Spyware",
          "english": "Spyware"
        },
        {
          "termJa": "Backdoor",
          "termZh": "Backdoor",
          "english": "Backdoor"
        },
        {
          "termJa": "Malware",
          "termZh": "Malware",
          "english": "Malware"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "マルウェア・不正プログラムと不正アクセスや標的型攻撃の全体像を混同する",
          "trapZh": "把恶意软件与不正程序和非法访问或定向攻击整体过程混为一谈。"
        },
        {
          "trapJa": "すべてのマルウェアが自己増殖すると考える",
          "trapZh": "误以为所有恶意软件都会自我复制"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 55,
          "pdfPageEnd": 57,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-4 マルウェア・不正プログラム",
          "anchorTermsJa": [
            "マルウェア",
            "不正プログラム"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-5",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "1-2-5",
      "titleJa": "1-2-5 不正と攻撃のメカニズム",
      "titleZh": "不正与攻撃的メカニズム",
      "overviewJa": "不正と攻撃のメカニズムは、SG攻撃理解分野で不正行為では、なりすまし、権限昇格、脆弱性の悪用、ログ消去などが組み合わされます。攻撃名だけでなく、どの段階で何を突破しているかを読むと対策を選べます。PDF 58-61ページの「不正と攻撃のメカニズム」を定位語に、試験では「なりすまし」「脆弱性」「権限昇格」「侵入」「ログ」「攻撃手順」が判断線です。マルウェア単体や暗号技術との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "不正与攻击机制用于把攻击者利用弱点、取得权限、扩大影响的机制连成因果链。本单元依据 PDF 58-61 页的「不正と攻撃のメカニズム」定位，重点理解：攻击机制要按“入口、利用弱点、取得权限、扩大影响、隐藏痕迹”来理解。题目不会只问名称，常考攻击在哪一环节突破控制。考试常用冒充、脆弱性、提权、入侵、日志、攻击步骤是判断线索来换说法；同时要和单个恶意软件或加密技术区分。",
      "learningGoalJa": "問題文の条件を読み取り、「不正と攻撃のメカニズム」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“不正与攻撃的メカニズム”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "不正と攻撃のメカニズムを学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。不正行為では、なりすまし、権限昇格、脆弱性の悪用、ログ消去などが組み合わされます。攻撃名だけでなく、どの段階で何を突破しているかを読むと対策を選べます。この関係を押さえると、不正と攻撃のメカニズムは単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではPrivilege Escalation、Spoofing、Vulnerability、Log、Attack Chainが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习不正与攻击机制时，先判断它是在讲攻击、资产、管理还是评价。攻击机制要按“入口、利用弱点、取得权限、扩大影响、隐藏痕迹”来理解。题目不会只问名称，常考攻击在哪一环节突破控制。这样可以把Privilege Escalation、Spoofing、Vulnerability、Log、Attack Chain等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Privilege Escalation",
            "Spoofing",
            "Vulnerability",
            "Log",
            "Attack Chain"
          ],
          "examFocusJa": "「不正と攻撃のメカニズム」の設問では、「なりすまし」「脆弱性」「権限昇格」「侵入」「ログ」「攻撃手順」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、マルウェア単体や暗号技術の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「不正と攻撃のメカニズム」相关题时，先抓冒充、脆弱性、提权、入侵、日志、攻击步骤是判断线索。再判断题目问对象、原因、影响还是对策，并排除单个恶意软件或加密技术。",
          "commonMistakeJa": "「不正と攻撃のメカニズム」をマルウェア単体や暗号技術と混同すると誤答します。特に攻撃を一つの単発動作だけと考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「不正と攻撃のメカニズム」和单个恶意软件或加密技术混淆，尤其是把攻击理解成一次性单个动作。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 58,
              "pdfPageEnd": 61,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-5 不正と攻撃のメカニズム",
              "anchorTermsJa": [
                "不正と攻撃のメカニズム"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、不正と攻撃のメカニズムが単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「なりすまし」「脆弱性」「権限昇格」「侵入」「ログ」「攻撃手順」が判断線です。その語が出たら、まず把攻击者利用弱点、取得权限、扩大影响的机制连成因果链という意味に対応する日本語条件を探します。合わない場合は、マルウェア単体や暗号技術を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把不正与攻击机制放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。冒充、脆弱性、提权、入侵、日志、攻击步骤是判断线索。看到这些线索时，先判断是否符合“把攻击者利用弱点、取得权限、扩大影响的机制连成因果链”；如果不符合，就可能是在让你误选单个恶意软件或加密技术。",
          "englishTerms": [
            "Privilege Escalation",
            "Spoofing",
            "Vulnerability",
            "Log",
            "Attack Chain"
          ],
          "examFocusJa": "不正と攻撃のメカニズムの見分け方は、「なりすまし」「脆弱性」「権限昇格」「侵入」「ログ」「攻撃手順」が判断線ですを文章中から拾い、マルウェア単体や暗号技術ではなく不正と攻撃のメカニズムを答えるべき条件かを確認することです。",
          "examFocusZh": "不正与攻击机制的判断线索是冒充、脆弱性、提权、入侵、日志、攻击步骤是判断线索，同时确认题干要求的是否是「不正と攻撃のメカニズム」，而不是单个恶意软件或加密技术。",
          "commonMistakeJa": "不正と攻撃のメカニズムではなくマルウェア単体や暗号技術の説明を選ぶ誤りに注意します。原因は、攻撃を一つの単発動作だけと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「不正と攻撃のメカニズム」（不正与攻击机制）和单个恶意软件或加密技术混淆。错误通常来自把攻击理解成一次性单个动作，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 58,
              "pdfPageEnd": 61,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-5 不正と攻撃のメカニズム",
              "anchorTermsJa": [
                "不正と攻撃のメカニズム"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Privilege Escalation",
          "termZh": "Privilege Escalation",
          "english": "Privilege Escalation"
        },
        {
          "termJa": "Spoofing",
          "termZh": "Spoofing",
          "english": "Spoofing"
        },
        {
          "termJa": "Vulnerability",
          "termZh": "Vulnerability",
          "english": "Vulnerability"
        },
        {
          "termJa": "Log",
          "termZh": "Log",
          "english": "Log"
        },
        {
          "termJa": "Attack Chain",
          "termZh": "Attack Chain",
          "english": "Attack Chain"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "不正と攻撃のメカニズムとマルウェア単体や暗号技術を混同する",
          "trapZh": "把不正与攻击机制和单个恶意软件或加密技术混为一谈。"
        },
        {
          "trapJa": "攻撃を一つの単発動作だけと考える",
          "trapZh": "把攻击理解成一次性单个动作"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 58,
          "pdfPageEnd": 61,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-5 不正と攻撃のメカニズム",
          "anchorTermsJa": [
            "不正と攻撃のメカニズム"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-1-2-6",
      "exam": "sg",
      "chapterId": "sg-ch01",
      "topicId": "technology",
      "order": 9,
      "nativeSectionId": "1-2-6",
      "titleJa": "1-2-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、章内の事例、CIA、脅威、マルウェアを横断して問われます。答えを暗記するより、被害が何に当たり、原因がどの脅威で、どの対策が有効かを対応させることが重要です。PDF 62-65ページの「演習問題」を定位語に、試験では「演習問題」「機密性」「脅威」「マルウェア」「対策」「事例」が判断線です。個別ページだけの用語暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "第1章演习问题用于用本章案例和基本概念检验 CIA、威胁分类、恶意软件判断是否能落到题干条件。本单元依据 PDF 62-65 页的「演習問題」定位，重点理解：演习题不是新知识点，而是把本章的安全目的、CIA、威胁分类和恶意软件案例放在一起检查。做题时要把事故现象、受损要素、威胁来源和对策联系起来。考试常用演习问题、机密性、威胁、恶意软件、对策、案例是判断线索来换说法；同时要和只背单页术语区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。演習問題では、章内の事例、CIA、脅威、マルウェアを横断して問われます。答えを暗記するより、被害が何に当たり、原因がどの脅威で、どの対策が有効かを対応させることが重要です。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではExercise、CIA、Threat、Malware、Controlが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习第1章演习问题时，先判断它是在讲攻击、资产、管理还是评价。演习题不是新知识点，而是把本章的安全目的、CIA、威胁分类和恶意软件案例放在一起检查。做题时要把事故现象、受损要素、威胁来源和对策联系起来。这样可以把Exercise、CIA、Threat、Malware、Control等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "CIA",
            "Threat",
            "Malware",
            "Control"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「機密性」「脅威」「マルウェア」「対策」「事例」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、個別ページだけの用語暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、机密性、威胁、恶意软件、对策、案例是判断线索。再判断题目问对象、原因、影响还是对策，并排除只背单页术语。",
          "commonMistakeJa": "「演習問題」を個別ページだけの用語暗記と混同すると誤答します。特に解答だけを覚えて、事例条件を読み替えられない場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单页术语混淆，尤其是只记答案，无法把案例条件换说法后重新判断。要回到案例里的受害对象、原因和对策。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 62,
              "pdfPageEnd": 65,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-6 演習問題",
              "anchorTermsJa": [
                "演習問題"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「演習問題」「機密性」「脅威」「マルウェア」「対策」「事例」が判断線です。その語が出たら、まず用本章案例和基本概念检验 CIA、威胁分类、恶意软件判断是否能落到题干条件という意味に対応する日本語条件を探します。合わない場合は、個別ページだけの用語暗記を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把第1章演习问题放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。演习问题、机密性、威胁、恶意软件、对策、案例是判断线索。看到这些线索时，先判断是否符合“用本章案例和基本概念检验 CIA、威胁分类、恶意软件判断是否能落到题干条件”；如果不符合，就可能是在让你误选只背单页术语。",
          "englishTerms": [
            "Exercise",
            "CIA",
            "Threat",
            "Malware",
            "Control"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「機密性」「脅威」「マルウェア」「対策」「事例」が判断線ですを文章中から拾い、個別ページだけの用語暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "第1章演习问题的判断线索是演习问题、机密性、威胁、恶意软件、对策、案例是判断线索，同时确认题干要求的是否是「演習問題」，而不是只背单页术语。",
          "commonMistakeJa": "演習問題ではなく個別ページだけの用語暗記の説明を選ぶ誤りに注意します。原因は、解答だけを覚えて、事例条件を読み替えられないときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（第1章演习问题）和只背单页术语混淆。错误通常来自只记答案，无法把案例条件换说法后重新判断，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 62,
              "pdfPageEnd": 65,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-2-6 演習問題",
              "anchorTermsJa": [
                "演習問題"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Exercise",
          "termZh": "Exercise",
          "english": "Exercise"
        },
        {
          "termJa": "CIA",
          "termZh": "CIA",
          "english": "CIA"
        },
        {
          "termJa": "Threat",
          "termZh": "Threat",
          "english": "Threat"
        },
        {
          "termJa": "Malware",
          "termZh": "Malware",
          "english": "Malware"
        },
        {
          "termJa": "Control",
          "termZh": "Control",
          "english": "Control"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と個別ページだけの用語暗記を混同する",
          "trapZh": "把第1章演习问题和只背单页术语混为一谈。"
        },
        {
          "trapJa": "解答だけを覚えて、事例条件を読み替えられない",
          "trapZh": "只记答案，无法把案例条件换说法后重新判断"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 62,
          "pdfPageEnd": 65,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-2-6 演習問題",
          "anchorTermsJa": [
            "演習問題"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
