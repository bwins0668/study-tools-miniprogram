module.exports = {
  "chapter": {
    "id": "sg-ch04",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 4,
    "titleJa": "第4章 情報セキュリティ対策",
    "titleZh": "第4章 信息安全对策"
  },
  "units": [
    {
      "id": "sg-4-1-1",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "management",
      "order": 1,
      "nativeSectionId": "4-1-1",
      "titleJa": "4-1-1 人的セキュリティ対策",
      "titleZh": "4-1-1 人的安全对策与防范社会工程学欺骗",
      "overviewJa": "人的セキュリティ対策は、SG対策分野で人的対策では、教育、誓約、権限管理、職務分掌、休暇取得、退職時手続などで人に起因するリスクを抑えます。ソーシャルエンジニアリングは人の心理や運用の隙を突くため、技術対策だけでは防げません。PDF 192-197ページの「人的セキュリティ対策」を定位語に、試験では「教育」「職務分掌」「内部不正」「ソーシャルエンジニアリング」「権限管理」が判断線です。技術的セキュリティ対策や物理的対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "人的安全对策用于通过教育、规则和组织管理降低人为错误、内部不正和社会工程风险。本单元依据 PDF 192-197 页的「人的セキュリティ対策」定位，重点理解：人的对策通过教育、承诺书、权限管理、职责分离、休假、离职手续等降低人为风险。社会工程利用人的心理和流程漏洞，不能只靠技术设备解决。考试常用教育、职责分离、内部不正、社会工程、权限管理是判断线索来换说法；同时要和技术安全对策或物理对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「人的セキュリティ対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-1-1 人的安全对策与防范社会工程学欺骗”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "人的セキュリティ対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。人的対策では、教育、誓約、権限管理、職務分掌、休暇取得、退職時手続などで人に起因するリスクを抑えます。ソーシャルエンジニアリングは人の心理や運用の隙を突くため、技術対策だけでは防げません。この関係を押さえると、人的セキュリティ対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではSocial Engineering、Education、Segregation of Duties、Insider Threat、Access Controlが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习人的安全对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。人的对策通过教育、承诺书、权限管理、职责分离、休假、离职手续等降低人为风险。社会工程利用人的心理和流程漏洞，不能只靠技术设备解决。这样可以把Social Engineering、Education、Segregation of Duties、Insider Threat、Access Control等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Social Engineering",
            "Education",
            "Segregation of Duties",
            "Insider Threat",
            "Access Control"
          ],
          "examFocusJa": "「人的セキュリティ対策」の設問では、「教育」「職務分掌」「内部不正」「ソーシャルエンジニアリング」「権限管理」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、技術的セキュリティ対策や物理的対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「人的セキュリティ対策」相关题时，先抓教育、职责分离、内部不正、社会工程、权限管理是判断线索。再判断题目问对象、责任、流程还是效果，并排除技术安全对策或物理对策。",
          "commonMistakeJa": "「人的セキュリティ対策」を技術的セキュリティ対策や物理的対策と混同すると誤答します。特に教育だけで内部不正を完全に防げると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「人的セキュリティ対策」和技术安全对策或物理对策混淆，尤其是误以为只做教育就能完全防止内部不正。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 192,
              "pdfPageEnd": 197,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-1-1 人的セキュリティ対策",
              "anchorTermsJa": [
                "人的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、人的セキュリティ対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「教育」「職務分掌」「内部不正」「ソーシャルエンジニアリング」「権限管理」が判断線です。その語が出たら、まず通过教育、规则和组织管理降低人为错误、内部不正和社会工程风险という意味に対応する日本語条件を探します。合わない場合は、技術的セキュリティ対策や物理的対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把人的安全对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。教育、职责分离、内部不正、社会工程、权限管理是判断线索。看到这些线索时，先判断是否符合“通过教育、规则和组织管理降低人为错误、内部不正和社会工程风险”；如果不符合，就可能是在让你误选技术安全对策或物理对策。",
          "englishTerms": [
            "Social Engineering",
            "Education",
            "Segregation of Duties",
            "Insider Threat",
            "Access Control"
          ],
          "examFocusJa": "人的セキュリティ対策の見分け方は、「教育」「職務分掌」「内部不正」「ソーシャルエンジニアリング」「権限管理」が判断線ですを文章中から拾い、技術的セキュリティ対策や物理的対策ではなく人的セキュリティ対策を答えるべき条件かを確認することです。",
          "examFocusZh": "人的安全对策的判断线索是教育、职责分离、内部不正、社会工程、权限管理是判断线索，同时确认题干要求的是否是「人的セキュリティ対策」，而不是技术安全对策或物理对策。",
          "commonMistakeJa": "人的セキュリティ対策ではなく技術的セキュリティ対策や物理的対策の説明を選ぶ誤りに注意します。原因は、教育だけで内部不正を完全に防げると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「人的セキュリティ対策」（人的安全对策）和技术安全对策或物理对策混淆。错误通常来自误以为只做教育就能完全防止内部不正，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 192,
              "pdfPageEnd": 197,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-1-1 人的セキュリティ対策",
              "anchorTermsJa": [
                "人的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Social Engineering",
          "termZh": "Social Engineering",
          "english": "Social Engineering"
        },
        {
          "termJa": "Education",
          "termZh": "Education",
          "english": "Education"
        },
        {
          "termJa": "Segregation of Duties",
          "termZh": "Segregation of Duties",
          "english": "Segregation of Duties"
        },
        {
          "termJa": "Insider Threat",
          "termZh": "Insider Threat",
          "english": "Insider Threat"
        },
        {
          "termJa": "Access Control",
          "termZh": "Access Control",
          "english": "Access Control"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "人的セキュリティ対策と技術的セキュリティ対策や物理的対策を混同する",
          "trapZh": "把人的安全对策和技术安全对策或物理对策混为一谈。"
        },
        {
          "trapJa": "教育だけで内部不正を完全に防げると考える",
          "trapZh": "误以为只做教育就能完全防止内部不正"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0023"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 192,
          "pdfPageEnd": 197,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-1-1 人的セキュリティ対策",
          "anchorTermsJa": [
            "人的セキュリティ対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-1-2",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "management",
      "order": 2,
      "nativeSectionId": "4-1-2",
      "titleJa": "4-1-2 演習問題",
      "titleZh": "4-1-2 课后本章历年真题演练",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、人的ミス、内部不正、教育、職務分掌、ソーシャルエンジニアリングを横断して問います。誰が、どの権限で、どの運用手順を破ったかを事例から読みます。PDF 198-203ページの「演習問題」を定位語に、試験では「演習問題」「人的対策」「教育」「内部不正」「職務分掌」が判断線です。技術的対策の名称問題との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "人的对策演习问题用于检查人的安全对策、教育、职务分离和社会工程防范是否能按案例判断。本单元依据 PDF 198-203 页的「演習問題」定位，重点理解：本节演习把人为错误、内部不正、教育、职责分离和社会工程放在案例中考。要从谁、用什么权限、破坏了什么流程来判断。考试常用演习问题、人的对策、教育、内部不正、职责分离是判断线索来换说法；同时要和技术对策名称题区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-1-2 课后本章历年真题演练”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、人的ミス、内部不正、教育、職務分掌、ソーシャルエンジニアリングを横断して問います。誰が、どの権限で、どの運用手順を破ったかを事例から読みます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Human Security、Education、Insider Threatが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习人的对策演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习把人为错误、内部不正、教育、职责分离和社会工程放在案例中考。要从谁、用什么权限、破坏了什么流程来判断。这样可以把Exercise、Human Security、Education、Insider Threat等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Human Security",
            "Education",
            "Insider Threat"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「人的対策」「教育」「内部不正」「職務分掌」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、技術的対策の名称問題の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、人的对策、教育、内部不正、职责分离是判断线索。再判断题目问对象、责任、流程还是效果，并排除技术对策名称题。",
          "commonMistakeJa": "「演習問題」を技術的対策の名称問題と混同すると誤答します。特に対策名だけを見て、人と手順の条件を読まない場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和技术对策名称题混淆，尤其是只看对策名称，不读人员和流程条件。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 198,
              "pdfPageEnd": 203,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-1-2 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「人的対策」「教育」「内部不正」「職務分掌」が判断線です。その語が出たら、まず检查人的安全对策、教育、职务分离和社会工程防范是否能按案例判断という意味に対応する日本語条件を探します。合わない場合は、技術的対策の名称問題を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把人的对策演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、人的对策、教育、内部不正、职责分离是判断线索。看到这些线索时，先判断是否符合“检查人的安全对策、教育、职务分离和社会工程防范是否能按案例判断”；如果不符合，就可能是在让你误选技术对策名称题。",
          "englishTerms": [
            "Exercise",
            "Human Security",
            "Education",
            "Insider Threat"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「人的対策」「教育」「内部不正」「職務分掌」が判断線ですを文章中から拾い、技術的対策の名称問題ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "人的对策演习问题的判断线索是演习问题、人的对策、教育、内部不正、职责分离是判断线索，同时确认题干要求的是否是「演習問題」，而不是技术对策名称题。",
          "commonMistakeJa": "演習問題ではなく技術的対策の名称問題の説明を選ぶ誤りに注意します。原因は、対策名だけを見て、人と手順の条件を読まないときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（人的对策演习问题）和技术对策名称题混淆。错误通常来自只看对策名称，不读人员和流程条件，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 198,
              "pdfPageEnd": 203,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-1-2 演習問題",
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
          "termJa": "Human Security",
          "termZh": "Human Security",
          "english": "Human Security"
        },
        {
          "termJa": "Education",
          "termZh": "Education",
          "english": "Education"
        },
        {
          "termJa": "Insider Threat",
          "termZh": "Insider Threat",
          "english": "Insider Threat"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と技術的対策の名称問題を混同する",
          "trapZh": "把人的对策演习问题和技术对策名称题混为一谈。"
        },
        {
          "trapJa": "対策名だけを見て、人と手順の条件を読まない",
          "trapZh": "只看对策名称，不读人员和流程条件"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0024"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 198,
          "pdfPageEnd": 203,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-1-2 演習問題",
          "anchorTermsJa": [
            "演習問題"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-1",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "4-2-1",
      "titleJa": "4-2-1 クラッキング・不正アクセス対策",
      "titleZh": "4-2-1 边界防御技术 (防火墙分组过滤机制与DMZ非武装区)",
      "overviewJa": "クラッキング・不正アクセス対策は、SG技術対策分野で不正アクセス対策では、ファイアウォール、DMZ、IDS/IPS、アクセス制御、脆弱性修正を組み合わせます。入口を遮断する対策、侵入を検知する対策、公開サーバを分離する対策を役割で分けます。PDF 204-208ページの「クラッキング」を定位語に、試験では「ファイアウォール」「DMZ」「IDS」「IPS」「アクセス制御」「脆弱性」が判断線です。マルウェア対策やセキュアプロトコルとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "破解与非法访问对策用于用边界控制、检测和访问控制降低非法侵入风险。本单元依据 PDF 204-208 页的「クラッキング」定位，重点理解：非法访问对策要组合防火墙、DMZ、IDS/IPS、访问控制和漏洞修正。要区分阻断入口、检测入侵、隔离公开服务器这些不同职责。考试常用防火墙、DMZ、IDS、IPS、访问控制、脆弱性是判断词来换说法；同时要和恶意软件对策或安全协议区分。",
      "learningGoalJa": "問題文の条件を読み取り、「クラッキング・不正アクセス対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-2-1 边界防御技术 (防火墙分组过滤机制与DMZ非武装区)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "クラッキング・不正アクセス対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。不正アクセス対策では、ファイアウォール、DMZ、IDS/IPS、アクセス制御、脆弱性修正を組み合わせます。入口を遮断する対策、侵入を検知する対策、公開サーバを分離する対策を役割で分けます。この関係を押さえると、クラッキング・不正アクセス対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではFirewall、DMZ、IDS、IPS、Access Control、Vulnerabilityが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习破解与非法访问对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。非法访问对策要组合防火墙、DMZ、IDS/IPS、访问控制和漏洞修正。要区分阻断入口、检测入侵、隔离公开服务器这些不同职责。这样可以把Firewall、DMZ、IDS、IPS、Access Control、Vulnerability等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Firewall",
            "DMZ",
            "IDS",
            "IPS",
            "Access Control",
            "Vulnerability"
          ],
          "examFocusJa": "「クラッキング・不正アクセス対策」の設問では、「ファイアウォール」「DMZ」「IDS」「IPS」「アクセス制御」「脆弱性」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、マルウェア対策やセキュアプロトコルの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「クラッキング・不正アクセス対策」相关题时，先抓防火墙、DMZ、IDS、IPS、访问控制、脆弱性是判断词。再判断题目问对象、责任、流程还是效果，并排除恶意软件对策或安全协议。",
          "commonMistakeJa": "「クラッキング・不正アクセス対策」をマルウェア対策やセキュアプロトコルと混同すると誤答します。特にファイアウォールが侵入後の不正操作をすべて防ぐと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「クラッキング・不正アクセス対策」和恶意软件对策或安全协议混淆，尤其是误以为防火墙能防住入侵后的所有不正操作。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 204,
              "pdfPageEnd": 208,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-1 クラッキング・不正アクセス対策",
              "anchorTermsJa": [
                "クラッキング",
                "不正アクセス対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、クラッキング・不正アクセス対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「ファイアウォール」「DMZ」「IDS」「IPS」「アクセス制御」「脆弱性」が判断線です。その語が出たら、まず用边界控制、检测和访问控制降低非法侵入风险という意味に対応する日本語条件を探します。合わない場合は、マルウェア対策やセキュアプロトコルを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把破解与非法访问对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。防火墙、DMZ、IDS、IPS、访问控制、脆弱性是判断词。看到这些线索时，先判断是否符合“用边界控制、检测和访问控制降低非法侵入风险”；如果不符合，就可能是在让你误选恶意软件对策或安全协议。",
          "englishTerms": [
            "Firewall",
            "DMZ",
            "IDS",
            "IPS",
            "Access Control",
            "Vulnerability"
          ],
          "examFocusJa": "クラッキング・不正アクセス対策の見分け方は、「ファイアウォール」「DMZ」「IDS」「IPS」「アクセス制御」「脆弱性」が判断線ですを文章中から拾い、マルウェア対策やセキュアプロトコルではなくクラッキング・不正アクセス対策を答えるべき条件かを確認することです。",
          "examFocusZh": "破解与非法访问对策的判断线索是防火墙、DMZ、IDS、IPS、访问控制、脆弱性是判断词，同时确认题干要求的是否是「クラッキング・不正アクセス対策」，而不是恶意软件对策或安全协议。",
          "commonMistakeJa": "クラッキング・不正アクセス対策ではなくマルウェア対策やセキュアプロトコルの説明を選ぶ誤りに注意します。原因は、ファイアウォールが侵入後の不正操作をすべて防ぐと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「クラッキング・不正アクセス対策」（破解与非法访问对策）和恶意软件对策或安全协议混淆。错误通常来自误以为防火墙能防住入侵后的所有不正操作，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 204,
              "pdfPageEnd": 208,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-1 クラッキング・不正アクセス対策",
              "anchorTermsJa": [
                "クラッキング",
                "不正アクセス対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Firewall",
          "termZh": "Firewall",
          "english": "Firewall"
        },
        {
          "termJa": "DMZ",
          "termZh": "DMZ",
          "english": "DMZ"
        },
        {
          "termJa": "IDS",
          "termZh": "IDS",
          "english": "IDS"
        },
        {
          "termJa": "IPS",
          "termZh": "IPS",
          "english": "IPS"
        },
        {
          "termJa": "Access Control",
          "termZh": "Access Control",
          "english": "Access Control"
        },
        {
          "termJa": "Vulnerability",
          "termZh": "Vulnerability",
          "english": "Vulnerability"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "クラッキング・不正アクセス対策とマルウェア対策やセキュアプロトコルを混同する",
          "trapZh": "把破解与非法访问对策和恶意软件对策或安全协议混为一谈。"
        },
        {
          "trapJa": "ファイアウォールが侵入後の不正操作をすべて防ぐと考える",
          "trapZh": "误以为防火墙能防住入侵后的所有不正操作"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0025"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 204,
          "pdfPageEnd": 208,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-1 クラッキング・不正アクセス対策",
          "anchorTermsJa": [
            "クラッキング",
            "不正アクセス対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-2",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "4-2-2",
      "titleJa": "4-2-2 マルウェア・不正プログラム対策",
      "titleZh": "4-2-2 恶意软件防范技术与沙箱隔离监测 (Sandbox)",
      "overviewJa": "マルウェア・不正プログラム対策は、SG技術対策分野でマルウェア対策では、ウイルス対策ソフト、パターンファイル更新、振る舞い検知、サンドボックス、アプリケーション制御を組み合わせます。感染前の予防、感染時の検知、感染後の隔離と復旧を分けて読みます。PDF 209-212ページの「マルウェア」を定位語に、試験では「ウイルス対策」「パターンファイル」「振る舞い検知」「サンドボックス」「隔離」が判断線です。不正アクセス対策やバックアップ対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "恶意软件对策用于通过检测、隔离、更新和限制执行降低恶意程序感染与扩散。本单元依据 PDF 209-212 页的「マルウェア」定位，重点理解：恶意软件对策包括杀毒软件、特征库更新、行为检测、沙箱、应用控制。判断时要区分感染前预防、感染时检测、感染后隔离与恢复。考试常用杀毒、特征库、行为检测、沙箱、隔离是判断词来换说法；同时要和非法访问对策或备份对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「マルウェア・不正プログラム対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-2-2 恶意软件防范技术与沙箱隔离监测 (Sandbox)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "マルウェア・不正プログラム対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。マルウェア対策では、ウイルス対策ソフト、パターンファイル更新、振る舞い検知、サンドボックス、アプリケーション制御を組み合わせます。感染前の予防、感染時の検知、感染後の隔離と復旧を分けて読みます。この関係を押さえると、マルウェア・不正プログラム対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではAntivirus、Signature、Behavior Detection、Sandbox、Quarantineが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习恶意软件对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。恶意软件对策包括杀毒软件、特征库更新、行为检测、沙箱、应用控制。判断时要区分感染前预防、感染时检测、感染后隔离与恢复。这样可以把Antivirus、Signature、Behavior Detection、Sandbox、Quarantine等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Antivirus",
            "Signature",
            "Behavior Detection",
            "Sandbox",
            "Quarantine"
          ],
          "examFocusJa": "「マルウェア・不正プログラム対策」の設問では、「ウイルス対策」「パターンファイル」「振る舞い検知」「サンドボックス」「隔離」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、不正アクセス対策やバックアップ対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「マルウェア・不正プログラム対策」相关题时，先抓杀毒、特征库、行为检测、沙箱、隔离是判断词。再判断题目问对象、责任、流程还是效果，并排除非法访问对策或备份对策。",
          "commonMistakeJa": "「マルウェア・不正プログラム対策」を不正アクセス対策やバックアップ対策と混同すると誤答します。特にパターンファイルだけで未知の不正プログラムも検知できると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「マルウェア・不正プログラム対策」和非法访问对策或备份对策混淆，尤其是误以为只靠特征库就能检测所有未知恶意程序。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 209,
              "pdfPageEnd": 212,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-2 マルウェア・不正プログラム対策",
              "anchorTermsJa": [
                "マルウェア",
                "不正プログラム対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、マルウェア・不正プログラム対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「ウイルス対策」「パターンファイル」「振る舞い検知」「サンドボックス」「隔離」が判断線です。その語が出たら、まず通过检测、隔离、更新和限制执行降低恶意程序感染与扩散という意味に対応する日本語条件を探します。合わない場合は、不正アクセス対策やバックアップ対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把恶意软件对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。杀毒、特征库、行为检测、沙箱、隔离是判断词。看到这些线索时，先判断是否符合“通过检测、隔离、更新和限制执行降低恶意程序感染与扩散”；如果不符合，就可能是在让你误选非法访问对策或备份对策。",
          "englishTerms": [
            "Antivirus",
            "Signature",
            "Behavior Detection",
            "Sandbox",
            "Quarantine"
          ],
          "examFocusJa": "マルウェア・不正プログラム対策の見分け方は、「ウイルス対策」「パターンファイル」「振る舞い検知」「サンドボックス」「隔離」が判断線ですを文章中から拾い、不正アクセス対策やバックアップ対策ではなくマルウェア・不正プログラム対策を答えるべき条件かを確認することです。",
          "examFocusZh": "恶意软件对策的判断线索是杀毒、特征库、行为检测、沙箱、隔离是判断词，同时确认题干要求的是否是「マルウェア・不正プログラム対策」，而不是非法访问对策或备份对策。",
          "commonMistakeJa": "マルウェア・不正プログラム対策ではなく不正アクセス対策やバックアップ対策の説明を選ぶ誤りに注意します。原因は、パターンファイルだけで未知の不正プログラムも検知できると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「マルウェア・不正プログラム対策」（恶意软件对策）和非法访问对策或备份对策混淆。错误通常来自误以为只靠特征库就能检测所有未知恶意程序，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 209,
              "pdfPageEnd": 212,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-2 マルウェア・不正プログラム対策",
              "anchorTermsJa": [
                "マルウェア",
                "不正プログラム対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Antivirus",
          "termZh": "Antivirus",
          "english": "Antivirus"
        },
        {
          "termJa": "Signature",
          "termZh": "Signature",
          "english": "Signature"
        },
        {
          "termJa": "Behavior Detection",
          "termZh": "Behavior Detection",
          "english": "Behavior Detection"
        },
        {
          "termJa": "Sandbox",
          "termZh": "Sandbox",
          "english": "Sandbox"
        },
        {
          "termJa": "Quarantine",
          "termZh": "Quarantine",
          "english": "Quarantine"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "マルウェア・不正プログラム対策と不正アクセス対策やバックアップ対策を混同する",
          "trapZh": "把恶意软件对策和非法访问对策或备份对策混为一谈。"
        },
        {
          "trapJa": "パターンファイルだけで未知の不正プログラムも検知できると考える",
          "trapZh": "误以为只靠特征库就能检测所有未知恶意程序"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0026"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 209,
          "pdfPageEnd": 212,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-2 マルウェア・不正プログラム対策",
          "anchorTermsJa": [
            "マルウェア",
            "不正プログラム対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-3",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "4-2-3",
      "titleJa": "4-2-3 携帯端末・無線LANのセキュリティ対策",
      "titleZh": "4-2-3 移动终端与无线局域网安全加密协议 (WPA3)",
      "overviewJa": "携帯端末・無線LANのセキュリティ対策は、SG技術対策分野で携帯端末ではMDM、リモートロック、リモートワイプ、端末暗号化を考えます。無線LANではWPA2/WPA3、強い認証、SSID管理、暗号化設定を確認します。端末紛失対策と通信盗聴対策を分けます。PDF 213-216ページの「携帯端末」を定位語に、試験では「MDM」「リモートワイプ」「WPA2」「WPA3」「SSID」「端末暗号化」が判断線です。マルウェア対策やセキュアプロトコルとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "移动终端与无线 LAN 对策用于保护移动设备和无线通信，降低遗失、盗用和窃听风险。本单元依据 PDF 213-216 页的「携帯端末」定位，重点理解：移动终端对策包括 MDM、远程锁定、远程擦除、设备加密。无线 LAN 对策包括 WPA2/WPA3、强认证、SSID 管理和加密设置。要区分设备丢失风险和无线窃听风险。考试常用MDM、远程擦除、WPA2、WPA3、SSID、终端加密是判断词来换说法；同时要和恶意软件对策或安全协议区分。",
      "learningGoalJa": "問題文の条件を読み取り、「携帯端末・無線LANのセキュリティ対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-2-3 移动终端与无线局域网安全加密协议 (WPA3)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "携帯端末・無線LANのセキュリティ対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。携帯端末ではMDM、リモートロック、リモートワイプ、端末暗号化を考えます。無線LANではWPA2/WPA3、強い認証、SSID管理、暗号化設定を確認します。端末紛失対策と通信盗聴対策を分けます。この関係を押さえると、携帯端末・無線LANのセキュリティ対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではMDM、Remote Wipe、WPA2、WPA3、SSID、Device Encryptionが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习移动终端与无线 LAN 对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。移动终端对策包括 MDM、远程锁定、远程擦除、设备加密。无线 LAN 对策包括 WPA2/WPA3、强认证、SSID 管理和加密设置。要区分设备丢失风险和无线窃听风险。这样可以把MDM、Remote Wipe、WPA2、WPA3、SSID、Device Encryption等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "MDM",
            "Remote Wipe",
            "WPA2",
            "WPA3",
            "SSID",
            "Device Encryption"
          ],
          "examFocusJa": "「携帯端末・無線LANのセキュリティ対策」の設問では、「MDM」「リモートワイプ」「WPA2」「WPA3」「SSID」「端末暗号化」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、マルウェア対策やセキュアプロトコルの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「携帯端末・無線LANのセキュリティ対策」相关题时，先抓MDM、远程擦除、WPA2、WPA3、SSID、终端加密是判断词。再判断题目问对象、责任、流程还是效果，并排除恶意软件对策或安全协议。",
          "commonMistakeJa": "「携帯端末・無線LANのセキュリティ対策」をマルウェア対策やセキュアプロトコルと混同すると誤答します。特にSSIDを隠せば暗号化が不要になると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「携帯端末・無線LANのセキュリティ対策」和恶意软件对策或安全协议混淆，尤其是误以为隐藏 SSID 就不需要加密。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 213,
              "pdfPageEnd": 216,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-3 携帯端末・無線LANのセキュリティ対策",
              "anchorTermsJa": [
                "携帯端末",
                "無線LANのセキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、携帯端末・無線LANのセキュリティ対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「MDM」「リモートワイプ」「WPA2」「WPA3」「SSID」「端末暗号化」が判断線です。その語が出たら、まず保护移动设备和无线通信，降低遗失、盗用和窃听风险という意味に対応する日本語条件を探します。合わない場合は、マルウェア対策やセキュアプロトコルを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把移动终端与无线 LAN 对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。MDM、远程擦除、WPA2、WPA3、SSID、终端加密是判断词。看到这些线索时，先判断是否符合“保护移动设备和无线通信，降低遗失、盗用和窃听风险”；如果不符合，就可能是在让你误选恶意软件对策或安全协议。",
          "englishTerms": [
            "MDM",
            "Remote Wipe",
            "WPA2",
            "WPA3",
            "SSID",
            "Device Encryption"
          ],
          "examFocusJa": "携帯端末・無線LANのセキュリティ対策の見分け方は、「MDM」「リモートワイプ」「WPA2」「WPA3」「SSID」「端末暗号化」が判断線ですを文章中から拾い、マルウェア対策やセキュアプロトコルではなく携帯端末・無線LANのセキュリティ対策を答えるべき条件かを確認することです。",
          "examFocusZh": "移动终端与无线 LAN 对策的判断线索是MDM、远程擦除、WPA2、WPA3、SSID、终端加密是判断词，同时确认题干要求的是否是「携帯端末・無線LANのセキュリティ対策」，而不是恶意软件对策或安全协议。",
          "commonMistakeJa": "携帯端末・無線LANのセキュリティ対策ではなくマルウェア対策やセキュアプロトコルの説明を選ぶ誤りに注意します。原因は、SSIDを隠せば暗号化が不要になると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「携帯端末・無線LANのセキュリティ対策」（移动终端与无线 LAN 对策）和恶意软件对策或安全协议混淆。错误通常来自误以为隐藏 SSID 就不需要加密，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 213,
              "pdfPageEnd": 216,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-3 携帯端末・無線LANのセキュリティ対策",
              "anchorTermsJa": [
                "携帯端末",
                "無線LANのセキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "MDM",
          "termZh": "MDM",
          "english": "MDM"
        },
        {
          "termJa": "Remote Wipe",
          "termZh": "Remote Wipe",
          "english": "Remote Wipe"
        },
        {
          "termJa": "WPA2",
          "termZh": "WPA2",
          "english": "WPA2"
        },
        {
          "termJa": "WPA3",
          "termZh": "WPA3",
          "english": "WPA3"
        },
        {
          "termJa": "SSID",
          "termZh": "SSID",
          "english": "SSID"
        },
        {
          "termJa": "Device Encryption",
          "termZh": "Device Encryption",
          "english": "Device Encryption"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "携帯端末・無線LANのセキュリティ対策とマルウェア対策やセキュアプロトコルを混同する",
          "trapZh": "把移动终端与无线 LAN 对策和恶意软件对策或安全协议混为一谈。"
        },
        {
          "trapJa": "SSIDを隠せば暗号化が不要になると考える",
          "trapZh": "误以为隐藏 SSID 就不需要加密"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0027"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 213,
          "pdfPageEnd": 216,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-3 携帯端末・無線LANのセキュリティ対策",
          "anchorTermsJa": [
            "携帯端末",
            "無線LANのセキュリティ対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-4",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "4-2-4",
      "titleJa": "4-2-4 デジタルフォレンジックス・証拠保全対策",
      "titleZh": "4-2-4 计算机司法取证与事故数字取证保全机制 (Forensics)",
      "overviewJa": "デジタルフォレンジックス・証拠保全対策は、SG技術対策分野でデジタルフォレンジックスでは、証拠を改変しない形で取得し、ログ、ディスクイメージ、時刻情報、保管記録を残します。原因調査と証拠能力を両立するため、作業手順と証拠保全を厳密に管理します。PDF 217-218ページの「デジタルフォレンジックス」を定位語に、試験では「証拠保全」「ログ」「ディスクイメージ」「改変防止」「チェーンオブカストディ」が判断線です。単なる障害復旧やバックアップとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数字取证与证据保全用于在安全事件后保全日志、磁盘映像和证据链，支持原因调查和法律应对。本单元依据 PDF 217-218 页的「デジタルフォレンジックス」定位，重点理解：数字取证要以不改写证据的方式取得日志、磁盘镜像、时间信息和保管记录。它既服务原因调查，也服务法律或纪律处理，因此要重视证据链。考试常用证据保全、日志、磁盘镜像、防篡改、证据链是判断词来换说法；同时要和单纯故障恢复或备份区分。",
      "learningGoalJa": "問題文の条件を読み取り、「デジタルフォレンジックス・証拠保全対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-2-4 计算机司法取证与事故数字取证保全机制 (Forensics)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "デジタルフォレンジックス・証拠保全対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。デジタルフォレンジックスでは、証拠を改変しない形で取得し、ログ、ディスクイメージ、時刻情報、保管記録を残します。原因調査と証拠能力を両立するため、作業手順と証拠保全を厳密に管理します。この関係を押さえると、デジタルフォレンジックス・証拠保全対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではDigital Forensics、Evidence、Log、Disk Image、Chain of Custodyが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数字取证与证据保全时，先判断它是在讲对策、法务、审计、服务还是项目管理。数字取证要以不改写证据的方式取得日志、磁盘镜像、时间信息和保管记录。它既服务原因调查，也服务法律或纪律处理，因此要重视证据链。这样可以把Digital Forensics、Evidence、Log、Disk Image、Chain of Custody等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Digital Forensics",
            "Evidence",
            "Log",
            "Disk Image",
            "Chain of Custody"
          ],
          "examFocusJa": "「デジタルフォレンジックス・証拠保全対策」の設問では、「証拠保全」「ログ」「ディスクイメージ」「改変防止」「チェーンオブカストディ」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、単なる障害復旧やバックアップの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「デジタルフォレンジックス・証拠保全対策」相关题时，先抓证据保全、日志、磁盘镜像、防篡改、证据链是判断词。再判断题目问对象、责任、流程还是效果，并排除单纯故障恢复或备份。",
          "commonMistakeJa": "「デジタルフォレンジックス・証拠保全対策」を単なる障害復旧やバックアップと混同すると誤答します。特に調査のためなら元データを直接編集してよいと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「デジタルフォレンジックス・証拠保全対策」和单纯故障恢复或备份混淆，尤其是误以为为了调查可以直接编辑原始数据。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 217,
              "pdfPageEnd": 218,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-4 デジタルフォレンジックス・証拠保全対策",
              "anchorTermsJa": [
                "デジタルフォレンジックス",
                "証拠保全対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、デジタルフォレンジックス・証拠保全対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「証拠保全」「ログ」「ディスクイメージ」「改変防止」「チェーンオブカストディ」が判断線です。その語が出たら、まず在安全事件后保全日志、磁盘映像和证据链，支持原因调查和法律应对という意味に対応する日本語条件を探します。合わない場合は、単なる障害復旧やバックアップを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把数字取证与证据保全放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。证据保全、日志、磁盘镜像、防篡改、证据链是判断词。看到这些线索时，先判断是否符合“在安全事件后保全日志、磁盘映像和证据链，支持原因调查和法律应对”；如果不符合，就可能是在让你误选单纯故障恢复或备份。",
          "englishTerms": [
            "Digital Forensics",
            "Evidence",
            "Log",
            "Disk Image",
            "Chain of Custody"
          ],
          "examFocusJa": "デジタルフォレンジックス・証拠保全対策の見分け方は、「証拠保全」「ログ」「ディスクイメージ」「改変防止」「チェーンオブカストディ」が判断線ですを文章中から拾い、単なる障害復旧やバックアップではなくデジタルフォレンジックス・証拠保全対策を答えるべき条件かを確認することです。",
          "examFocusZh": "数字取证与证据保全的判断线索是证据保全、日志、磁盘镜像、防篡改、证据链是判断词，同时确认题干要求的是否是「デジタルフォレンジックス・証拠保全対策」，而不是单纯故障恢复或备份。",
          "commonMistakeJa": "デジタルフォレンジックス・証拠保全対策ではなく単なる障害復旧やバックアップの説明を選ぶ誤りに注意します。原因は、調査のためなら元データを直接編集してよいと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「デジタルフォレンジックス・証拠保全対策」（数字取证与证据保全）和单纯故障恢复或备份混淆。错误通常来自误以为为了调查可以直接编辑原始数据，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 217,
              "pdfPageEnd": 218,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-4 デジタルフォレンジックス・証拠保全対策",
              "anchorTermsJa": [
                "デジタルフォレンジックス",
                "証拠保全対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Digital Forensics",
          "termZh": "Digital Forensics",
          "english": "Digital Forensics"
        },
        {
          "termJa": "Evidence",
          "termZh": "Evidence",
          "english": "Evidence"
        },
        {
          "termJa": "Log",
          "termZh": "Log",
          "english": "Log"
        },
        {
          "termJa": "Disk Image",
          "termZh": "Disk Image",
          "english": "Disk Image"
        },
        {
          "termJa": "Chain of Custody",
          "termZh": "Chain of Custody",
          "english": "Chain of Custody"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "デジタルフォレンジックス・証拠保全対策と単なる障害復旧やバックアップを混同する",
          "trapZh": "把数字取证与证据保全和单纯故障恢复或备份混为一谈。"
        },
        {
          "trapJa": "調査のためなら元データを直接編集してよいと考える",
          "trapZh": "误以为为了调查可以直接编辑原始数据"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0028"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 217,
          "pdfPageEnd": 218,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-4 デジタルフォレンジックス・証拠保全対策",
          "anchorTermsJa": [
            "デジタルフォレンジックス",
            "証拠保全対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-5",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "4-2-5",
      "titleJa": "4-2-5 その他の技術的セキュリティ対策",
      "titleZh": "そ的他的技术的安全对策",
      "overviewJa": "その他の技術的セキュリティ対策は、SG技術対策分野でその他の技術的対策には、パッチ適用、脆弱性診断、ログ監視、DLP、WAF、端末制御などがあります。攻撃を防ぐ、検知する、被害を抑える、証跡を残すという役割で整理します。PDF 219-224ページの「その他の技術的セキュリティ対策」を定位語に、試験では「パッチ」「脆弱性診断」「ログ監視」「DLP」「WAF」「端末制御」が判断線です。特定の単体対策だけの説明との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "其他技术安全对策用于用补丁、日志监视、漏洞诊断和信息泄露防止等补强整体防御。本单元依据 PDF 219-224 页的「その他の技術的セキュリティ対策」定位，重点理解：其他技术措施包括补丁、漏洞诊断、日志监视、DLP、WAF、终端控制等。要按预防、检测、抑制损害、留下证迹来理解。考试常用补丁、漏洞诊断、日志监视、DLP、WAF、终端控制是判断词来换说法；同时要和单一具体对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「その他の技術的セキュリティ対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“そ的他的技术的安全对策”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "その他の技術的セキュリティ対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。その他の技術的対策には、パッチ適用、脆弱性診断、ログ監視、DLP、WAF、端末制御などがあります。攻撃を防ぐ、検知する、被害を抑える、証跡を残すという役割で整理します。この関係を押さえると、その他の技術的セキュリティ対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではPatch、Vulnerability Scan、Log Monitoring、DLP、WAFが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习其他技术安全对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。其他技术措施包括补丁、漏洞诊断、日志监视、DLP、WAF、终端控制等。要按预防、检测、抑制损害、留下证迹来理解。这样可以把Patch、Vulnerability Scan、Log Monitoring、DLP、WAF等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Patch",
            "Vulnerability Scan",
            "Log Monitoring",
            "DLP",
            "WAF"
          ],
          "examFocusJa": "「その他の技術的セキュリティ対策」の設問では、「パッチ」「脆弱性診断」「ログ監視」「DLP」「WAF」「端末制御」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、特定の単体対策だけの説明の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「その他の技術的セキュリティ対策」相关题时，先抓补丁、漏洞诊断、日志监视、DLP、WAF、终端控制是判断词。再判断题目问对象、责任、流程还是效果，并排除单一具体对策。",
          "commonMistakeJa": "「その他の技術的セキュリティ対策」を特定の単体対策だけの説明と混同すると誤答します。特にログを取れば自動的に攻撃を防げると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「その他の技術的セキュリティ対策」和单一具体对策混淆，尤其是误以为只要记录日志就能自动阻止攻击。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 219,
              "pdfPageEnd": 224,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-5 その他の技術的セキュリティ対策",
              "anchorTermsJa": [
                "その他の技術的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、その他の技術的セキュリティ対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「パッチ」「脆弱性診断」「ログ監視」「DLP」「WAF」「端末制御」が判断線です。その語が出たら、まず用补丁、日志监视、漏洞诊断和信息泄露防止等补强整体防御という意味に対応する日本語条件を探します。合わない場合は、特定の単体対策だけの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把其他技术安全对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。补丁、漏洞诊断、日志监视、DLP、WAF、终端控制是判断词。看到这些线索时，先判断是否符合“用补丁、日志监视、漏洞诊断和信息泄露防止等补强整体防御”；如果不符合，就可能是在让你误选单一具体对策。",
          "englishTerms": [
            "Patch",
            "Vulnerability Scan",
            "Log Monitoring",
            "DLP",
            "WAF"
          ],
          "examFocusJa": "その他の技術的セキュリティ対策の見分け方は、「パッチ」「脆弱性診断」「ログ監視」「DLP」「WAF」「端末制御」が判断線ですを文章中から拾い、特定の単体対策だけの説明ではなくその他の技術的セキュリティ対策を答えるべき条件かを確認することです。",
          "examFocusZh": "其他技术安全对策的判断线索是补丁、漏洞诊断、日志监视、DLP、WAF、终端控制是判断词，同时确认题干要求的是否是「その他の技術的セキュリティ対策」，而不是单一具体对策。",
          "commonMistakeJa": "その他の技術的セキュリティ対策ではなく特定の単体対策だけの説明の説明を選ぶ誤りに注意します。原因は、ログを取れば自動的に攻撃を防げると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「その他の技術的セキュリティ対策」（其他技术安全对策）和单一具体对策混淆。错误通常来自误以为只要记录日志就能自动阻止攻击，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 219,
              "pdfPageEnd": 224,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-5 その他の技術的セキュリティ対策",
              "anchorTermsJa": [
                "その他の技術的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Patch",
          "termZh": "Patch",
          "english": "Patch"
        },
        {
          "termJa": "Vulnerability Scan",
          "termZh": "Vulnerability Scan",
          "english": "Vulnerability Scan"
        },
        {
          "termJa": "Log Monitoring",
          "termZh": "Log Monitoring",
          "english": "Log Monitoring"
        },
        {
          "termJa": "DLP",
          "termZh": "DLP",
          "english": "DLP"
        },
        {
          "termJa": "WAF",
          "termZh": "WAF",
          "english": "WAF"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "その他の技術的セキュリティ対策と特定の単体対策だけの説明を混同する",
          "trapZh": "把其他技术安全对策和单一具体对策混为一谈。"
        },
        {
          "trapJa": "ログを取れば自動的に攻撃を防げると考える",
          "trapZh": "误以为只要记录日志就能自动阻止攻击"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 219,
          "pdfPageEnd": 224,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-5 その他の技術的セキュリティ対策",
          "anchorTermsJa": [
            "その他の技術的セキュリティ対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-2-6",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "4-2-6",
      "titleJa": "4-2-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、技術的対策の名称だけでなく、どの脅威を防ぎ、どの段階で検知し、どの証拠を残すかが問われます。入口、端末、通信、証跡の位置を分けます。PDF 225-234ページの「演習問題」を定位語に、試験では「演習問題」「技術的対策」「検知」「隔離」「証拠」「ログ」が判断線です。人的対策や物理的対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "技术对策演习问题用于检查边界防御、恶意软件、移动无线、取证和其他技术对策的职责区别。本单元依据 PDF 225-234 页的「演習問題」定位，重点理解：本节演习会把防火墙、恶意软件对策、无线安全、取证、日志等混合考。要判断对策作用在入口、终端、通信还是证据保全过程。考试常用演习问题、技术对策、检测、隔离、证据、日志是判断词来换说法；同时要和人的对策或物理对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、技術的対策の名称だけでなく、どの脅威を防ぎ、どの段階で検知し、どの証拠を残すかが問われます。入口、端末、通信、証跡の位置を分けます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Technical Control、Detection、Evidence、Logが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习技术对策演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习会把防火墙、恶意软件对策、无线安全、取证、日志等混合考。要判断对策作用在入口、终端、通信还是证据保全过程。这样可以把Exercise、Technical Control、Detection、Evidence、Log等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Technical Control",
            "Detection",
            "Evidence",
            "Log"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「技術的対策」「検知」「隔離」「証拠」「ログ」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、人的対策や物理的対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、技术对策、检测、隔离、证据、日志是判断词。再判断题目问对象、责任、流程还是效果，并排除人的对策或物理对策。",
          "commonMistakeJa": "「演習問題」を人的対策や物理的対策と混同すると誤答します。特に対策が置かれる位置を読まずに名称だけで選ぶ場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和人的对策或物理对策混淆，尤其是不看对策部署位置，只按名称选择。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 225,
              "pdfPageEnd": 234,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-6 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「技術的対策」「検知」「隔離」「証拠」「ログ」が判断線です。その語が出たら、まず检查边界防御、恶意软件、移动无线、取证和其他技术对策的职责区别という意味に対応する日本語条件を探します。合わない場合は、人的対策や物理的対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把技术对策演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、技术对策、检测、隔离、证据、日志是判断词。看到这些线索时，先判断是否符合“检查边界防御、恶意软件、移动无线、取证和其他技术对策的职责区别”；如果不符合，就可能是在让你误选人的对策或物理对策。",
          "englishTerms": [
            "Exercise",
            "Technical Control",
            "Detection",
            "Evidence",
            "Log"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「技術的対策」「検知」「隔離」「証拠」「ログ」が判断線ですを文章中から拾い、人的対策や物理的対策ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "技术对策演习问题的判断线索是演习问题、技术对策、检测、隔离、证据、日志是判断词，同时确认题干要求的是否是「演習問題」，而不是人的对策或物理对策。",
          "commonMistakeJa": "演習問題ではなく人的対策や物理的対策の説明を選ぶ誤りに注意します。原因は、対策が置かれる位置を読まずに名称だけで選ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（技术对策演习问题）和人的对策或物理对策混淆。错误通常来自不看对策部署位置，只按名称选择，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 225,
              "pdfPageEnd": 234,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-2-6 演習問題",
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
          "termJa": "Technical Control",
          "termZh": "Technical Control",
          "english": "Technical Control"
        },
        {
          "termJa": "Detection",
          "termZh": "Detection",
          "english": "Detection"
        },
        {
          "termJa": "Evidence",
          "termZh": "Evidence",
          "english": "Evidence"
        },
        {
          "termJa": "Log",
          "termZh": "Log",
          "english": "Log"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と人的対策や物理的対策を混同する",
          "trapZh": "把技术对策演习问题和人的对策或物理对策混为一谈。"
        },
        {
          "trapJa": "対策が置かれる位置を読まずに名称だけで選ぶ",
          "trapZh": "不看对策部署位置，只按名称选择"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 225,
          "pdfPageEnd": 234,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-2-6 演習問題",
          "anchorTermsJa": [
            "演習問題"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-3-1",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "management",
      "order": 9,
      "nativeSectionId": "4-3-1",
      "titleJa": "4-3-1 物理的セキュリティ対策",
      "titleZh": "4-3-1 机房入退室门禁管理与防尾随互锁安全门",
      "overviewJa": "物理的セキュリティ対策は、SG物理対策分野で物理的対策では、入退室管理、監視カメラ、施錠、アンチパスバック、共連れ防止、耐震、防火、停電対策を扱います。情報資産はデータだけでなく、サーバ室、媒体、端末、設備にも存在します。PDF 235-239ページの「物理的セキュリティ対策」を定位語に、試験では「入退室管理」「監視カメラ」「施錠」「共連れ」「アンチパスバック」「UPS」が判断線です。人的対策やネットワーク対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "物理安全对策用于通过入退室、设备保护、防灾和环境控制保护设施与设备。本单元依据 PDF 235-239 页的「物理的セキュリティ対策」定位，重点理解：物理安全包括出入管理、监控、上锁、防尾随、互锁门、防震、防火、停电对策。信息资产不只在数据中，也存在于服务器房、介质、终端和设备里。考试常用出入管理、监控、上锁、尾随、反潜回、UPS 是判断词来换说法；同时要和人的对策或网络对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「物理的セキュリティ対策」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-3-1 机房入退室门禁管理与防尾随互锁安全门”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "物理的セキュリティ対策を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。物理的対策では、入退室管理、監視カメラ、施錠、アンチパスバック、共連れ防止、耐震、防火、停電対策を扱います。情報資産はデータだけでなく、サーバ室、媒体、端末、設備にも存在します。この関係を押さえると、物理的セキュリティ対策は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではPhysical Security、Mantrap、Anti-passback、CCTV、UPS、Access Cardが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习物理安全对策时，先判断它是在讲对策、法务、审计、服务还是项目管理。物理安全包括出入管理、监控、上锁、防尾随、互锁门、防震、防火、停电对策。信息资产不只在数据中，也存在于服务器房、介质、终端和设备里。这样可以把Physical Security、Mantrap、Anti-passback、CCTV、UPS、Access Card等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Physical Security",
            "Mantrap",
            "Anti-passback",
            "CCTV",
            "UPS",
            "Access Card"
          ],
          "examFocusJa": "「物理的セキュリティ対策」の設問では、「入退室管理」「監視カメラ」「施錠」「共連れ」「アンチパスバック」「UPS」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、人的対策やネットワーク対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「物理的セキュリティ対策」相关题时，先抓出入管理、监控、上锁、尾随、反潜回、UPS 是判断词。再判断题目问对象、责任、流程还是效果，并排除人的对策或网络对策。",
          "commonMistakeJa": "「物理的セキュリティ対策」を人的対策やネットワーク対策と混同すると誤答します。特に物理対策を災害対策だけと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「物理的セキュリティ対策」和人的对策或网络对策混淆，尤其是把物理安全只理解成灾害对策。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 235,
              "pdfPageEnd": 239,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-3-1 物理的セキュリティ対策",
              "anchorTermsJa": [
                "物理的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、物理的セキュリティ対策が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「入退室管理」「監視カメラ」「施錠」「共連れ」「アンチパスバック」「UPS」が判断線です。その語が出たら、まず通过入退室、设备保护、防灾和环境控制保护设施与设备という意味に対応する日本語条件を探します。合わない場合は、人的対策やネットワーク対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把物理安全对策放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。出入管理、监控、上锁、尾随、反潜回、UPS 是判断词。看到这些线索时，先判断是否符合“通过入退室、设备保护、防灾和环境控制保护设施与设备”；如果不符合，就可能是在让你误选人的对策或网络对策。",
          "englishTerms": [
            "Physical Security",
            "Mantrap",
            "Anti-passback",
            "CCTV",
            "UPS",
            "Access Card"
          ],
          "examFocusJa": "物理的セキュリティ対策の見分け方は、「入退室管理」「監視カメラ」「施錠」「共連れ」「アンチパスバック」「UPS」が判断線ですを文章中から拾い、人的対策やネットワーク対策ではなく物理的セキュリティ対策を答えるべき条件かを確認することです。",
          "examFocusZh": "物理安全对策的判断线索是出入管理、监控、上锁、尾随、反潜回、UPS 是判断词，同时确认题干要求的是否是「物理的セキュリティ対策」，而不是人的对策或网络对策。",
          "commonMistakeJa": "物理的セキュリティ対策ではなく人的対策やネットワーク対策の説明を選ぶ誤りに注意します。原因は、物理対策を災害対策だけと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「物理的セキュリティ対策」（物理安全对策）和人的对策或网络对策混淆。错误通常来自把物理安全只理解成灾害对策，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 235,
              "pdfPageEnd": 239,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-3-1 物理的セキュリティ対策",
              "anchorTermsJa": [
                "物理的セキュリティ対策"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Physical Security",
          "termZh": "Physical Security",
          "english": "Physical Security"
        },
        {
          "termJa": "Mantrap",
          "termZh": "Mantrap",
          "english": "Mantrap"
        },
        {
          "termJa": "Anti-passback",
          "termZh": "Anti-passback",
          "english": "Anti-passback"
        },
        {
          "termJa": "CCTV",
          "termZh": "CCTV",
          "english": "CCTV"
        },
        {
          "termJa": "UPS",
          "termZh": "UPS",
          "english": "UPS"
        },
        {
          "termJa": "Access Card",
          "termZh": "Access Card",
          "english": "Access Card"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "物理的セキュリティ対策と人的対策やネットワーク対策を混同する",
          "trapZh": "把物理安全对策和人的对策或网络对策混为一谈。"
        },
        {
          "trapJa": "物理対策を災害対策だけと考える",
          "trapZh": "把物理安全只理解成灾害对策"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0029"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 235,
          "pdfPageEnd": 239,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-3-1 物理的セキュリティ対策",
          "anchorTermsJa": [
            "物理的セキュリティ対策"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-3-2",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "management",
      "order": 10,
      "nativeSectionId": "4-3-2",
      "titleJa": "4-3-2 演習問題",
      "titleZh": "4-3-2 课后本章历年真题演练",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、入退室管理、共連れ防止、設備保護、防災を条件から選びます。誰が施設に入り、どの媒体や設備を守るのかを読むことが重要です。PDF 240-243ページの「演習問題」を定位語に、試験では「演習問題」「入退室」「共連れ」「設備」「災害」「媒体」が判断線です。技術的対策の名称問題との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "物理安全演习问题用于检查入退室、尾随防止、设备保护和灾害对策能否按场景判断。本单元依据 PDF 240-243 页的「演習問題」定位，重点理解：本节演习把门禁、防尾随、设备保护、防灾混在一起考。先看谁进入哪里、保护的是介质、服务器还是设施，再选对策。考试常用演习问题、出入、尾随、设备、灾害、介质是判断词来换说法；同时要和技术对策名称题区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-3-2 课后本章历年真题演练”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、入退室管理、共連れ防止、設備保護、防災を条件から選びます。誰が施設に入り、どの媒体や設備を守るのかを読むことが重要です。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Physical Security、Facility、Media、Disasterが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习物理安全演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习把门禁、防尾随、设备保护、防灾混在一起考。先看谁进入哪里、保护的是介质、服务器还是设施，再选对策。这样可以把Exercise、Physical Security、Facility、Media、Disaster等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Physical Security",
            "Facility",
            "Media",
            "Disaster"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「入退室」「共連れ」「設備」「災害」「媒体」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、技術的対策の名称問題の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、出入、尾随、设备、灾害、介质是判断词。再判断题目问对象、责任、流程还是效果，并排除技术对策名称题。",
          "commonMistakeJa": "「演習問題」を技術的対策の名称問題と混同すると誤答します。特に施設条件を読まずにネットワーク対策を選ぶ場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和技术对策名称题混淆，尤其是不读设施条件就选择网络对策。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 240,
              "pdfPageEnd": 243,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-3-2 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「入退室」「共連れ」「設備」「災害」「媒体」が判断線です。その語が出たら、まず检查入退室、尾随防止、设备保护和灾害对策能否按场景判断という意味に対応する日本語条件を探します。合わない場合は、技術的対策の名称問題を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把物理安全演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、出入、尾随、设备、灾害、介质是判断词。看到这些线索时，先判断是否符合“检查入退室、尾随防止、设备保护和灾害对策能否按场景判断”；如果不符合，就可能是在让你误选技术对策名称题。",
          "englishTerms": [
            "Exercise",
            "Physical Security",
            "Facility",
            "Media",
            "Disaster"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「入退室」「共連れ」「設備」「災害」「媒体」が判断線ですを文章中から拾い、技術的対策の名称問題ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "物理安全演习问题的判断线索是演习问题、出入、尾随、设备、灾害、介质是判断词，同时确认题干要求的是否是「演習問題」，而不是技术对策名称题。",
          "commonMistakeJa": "演習問題ではなく技術的対策の名称問題の説明を選ぶ誤りに注意します。原因は、施設条件を読まずにネットワーク対策を選ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（物理安全演习问题）和技术对策名称题混淆。错误通常来自不读设施条件就选择网络对策，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 240,
              "pdfPageEnd": 243,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-3-2 演習問題",
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
          "termJa": "Physical Security",
          "termZh": "Physical Security",
          "english": "Physical Security"
        },
        {
          "termJa": "Facility",
          "termZh": "Facility",
          "english": "Facility"
        },
        {
          "termJa": "Media",
          "termZh": "Media",
          "english": "Media"
        },
        {
          "termJa": "Disaster",
          "termZh": "Disaster",
          "english": "Disaster"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と技術的対策の名称問題を混同する",
          "trapZh": "把物理安全演习问题和技术对策名称题混为一谈。"
        },
        {
          "trapJa": "施設条件を読まずにネットワーク対策を選ぶ",
          "trapZh": "不读设施条件就选择网络对策"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0030"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 240,
          "pdfPageEnd": 243,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-3-2 演習問題",
          "anchorTermsJa": [
            "演習問題"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-1",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 11,
      "nativeSectionId": "4-4-1",
      "titleJa": "4-4-1 セキュアプロトコル",
      "titleZh": "4-4-1 安全传输协议详解 (SSL/TLS, HTTPS, SSH, IPsec)",
      "overviewJa": "セキュアプロトコルは、SG通信対策分野でセキュアプロトコルでは、SSL/TLS、HTTPS、SSH、IPsecなどが通信を暗号化し、相手確認や改ざん検知を支えます。どの層で、どの通信を保護するかを分けて読む必要があります。PDF 244-245ページの「セキュアプロトコル」を定位語に、試験では「SSL/TLS」「HTTPS」「SSH」「IPsec」「暗号化」「相手認証」が判断線です。無線LAN設定や利用者認証だけの説明との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "安全协议用于用加密和认证机制保护通信路径上的机密性、完整性和相手确认。本单元依据 PDF 244-245 页的「セキュアプロトコル」定位，重点理解：安全协议通过 SSL/TLS、HTTPS、SSH、IPsec 等保护通信。要看它工作在哪一层、保护网页、远程登录还是 IP 层通信，并区分加密、认证、完整性。考试常用SSL/TLS、HTTPS、SSH、IPsec、加密、对方认证是判断词来换说法；同时要和无线 LAN 配置或单纯用户认证区分。",
      "learningGoalJa": "問題文の条件を読み取り、「セキュアプロトコル」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-4-1 安全传输协议详解 (SSL/TLS, HTTPS, SSH, IPsec)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "セキュアプロトコルを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。セキュアプロトコルでは、SSL/TLS、HTTPS、SSH、IPsecなどが通信を暗号化し、相手確認や改ざん検知を支えます。どの層で、どの通信を保護するかを分けて読む必要があります。この関係を押さえると、セキュアプロトコルは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではSSL/TLS、HTTPS、SSH、IPsec、Encryptionが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习安全协议时，先判断它是在讲对策、法务、审计、服务还是项目管理。安全协议通过 SSL/TLS、HTTPS、SSH、IPsec 等保护通信。要看它工作在哪一层、保护网页、远程登录还是 IP 层通信，并区分加密、认证、完整性。这样可以把SSL/TLS、HTTPS、SSH、IPsec、Encryption等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "SSL/TLS",
            "HTTPS",
            "SSH",
            "IPsec",
            "Encryption"
          ],
          "examFocusJa": "「セキュアプロトコル」の設問では、「SSL/TLS」「HTTPS」「SSH」「IPsec」「暗号化」「相手認証」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、無線LAN設定や利用者認証だけの説明の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「セキュアプロトコル」相关题时，先抓SSL/TLS、HTTPS、SSH、IPsec、加密、对方认证是判断词。再判断题目问对象、责任、流程还是效果，并排除无线 LAN 配置或单纯用户认证。",
          "commonMistakeJa": "「セキュアプロトコル」を無線LAN設定や利用者認証だけの説明と混同すると誤答します。特にHTTPSをHTMLを作る言語と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「セキュアプロトコル」和无线 LAN 配置或单纯用户认证混淆，尤其是把 HTTPS 误认为制作 HTML 的语言。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 244,
              "pdfPageEnd": 245,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-1 セキュアプロトコル",
              "anchorTermsJa": [
                "セキュアプロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、セキュアプロトコルが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「SSL/TLS」「HTTPS」「SSH」「IPsec」「暗号化」「相手認証」が判断線です。その語が出たら、まず用加密和认证机制保护通信路径上的机密性、完整性和相手确认という意味に対応する日本語条件を探します。合わない場合は、無線LAN設定や利用者認証だけの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把安全协议放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。SSL/TLS、HTTPS、SSH、IPsec、加密、对方认证是判断词。看到这些线索时，先判断是否符合“用加密和认证机制保护通信路径上的机密性、完整性和相手确认”；如果不符合，就可能是在让你误选无线 LAN 配置或单纯用户认证。",
          "englishTerms": [
            "SSL/TLS",
            "HTTPS",
            "SSH",
            "IPsec",
            "Encryption"
          ],
          "examFocusJa": "セキュアプロトコルの見分け方は、「SSL/TLS」「HTTPS」「SSH」「IPsec」「暗号化」「相手認証」が判断線ですを文章中から拾い、無線LAN設定や利用者認証だけの説明ではなくセキュアプロトコルを答えるべき条件かを確認することです。",
          "examFocusZh": "安全协议的判断线索是SSL/TLS、HTTPS、SSH、IPsec、加密、对方认证是判断词，同时确认题干要求的是否是「セキュアプロトコル」，而不是无线 LAN 配置或单纯用户认证。",
          "commonMistakeJa": "セキュアプロトコルではなく無線LAN設定や利用者認証だけの説明の説明を選ぶ誤りに注意します。原因は、HTTPSをHTMLを作る言語と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「セキュアプロトコル」（安全协议）和无线 LAN 配置或单纯用户认证混淆。错误通常来自把 HTTPS 误认为制作 HTML 的语言，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 244,
              "pdfPageEnd": 245,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-1 セキュアプロトコル",
              "anchorTermsJa": [
                "セキュアプロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SSL/TLS",
          "termZh": "SSL/TLS",
          "english": "SSL/TLS"
        },
        {
          "termJa": "HTTPS",
          "termZh": "HTTPS",
          "english": "HTTPS"
        },
        {
          "termJa": "SSH",
          "termZh": "SSH",
          "english": "SSH"
        },
        {
          "termJa": "IPsec",
          "termZh": "IPsec",
          "english": "IPsec"
        },
        {
          "termJa": "Encryption",
          "termZh": "Encryption",
          "english": "Encryption"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "セキュアプロトコルと無線LAN設定や利用者認証だけの説明を混同する",
          "trapZh": "把安全协议和无线 LAN 配置或单纯用户认证混为一谈。"
        },
        {
          "trapJa": "HTTPSをHTMLを作る言語と考える",
          "trapZh": "把 HTTPS 误认为制作 HTML 的语言"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0032"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 244,
          "pdfPageEnd": 245,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-1 セキュアプロトコル",
          "anchorTermsJa": [
            "セキュアプロトコル"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-2",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 12,
      "nativeSectionId": "4-4-2",
      "titleJa": "4-4-2 認証技術",
      "titleZh": "认证技术",
      "overviewJa": "認証技術は、SG通信対策分野で認証技術では、ワンタイムパスワード、チャレンジレスポンス、シングルサインオンなどを目的で分けます。本人確認を強めるのか、利便性を高めるのか、パスワード再利用を抑えるのかを読みます。PDF 246-247ページの「認証技術」を定位語に、試験では「ワンタイムパスワード」「チャレンジレスポンス」「SSO」「本人確認」「認証連携」が判断線です。公開鍵基盤やアクセス権限管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "认证技术用于通过一次性密码、挑战响应、SSO 等机制加强本人确认。本单元依据 PDF 246-247 页的「認証技術」定位，重点理解：认证技术要区分 OTP、挑战响应、SSO 等机制。它们可能用于加强本人确认、提高便利性或减少密码重复输入，目的不同。考试常用一次性密码、挑战响应、SSO、本人确认、认证联动是判断词来换说法；同时要和PKI 或访问权限管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「認証技術」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“认证技术”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "認証技術を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。認証技術では、ワンタイムパスワード、チャレンジレスポンス、シングルサインオンなどを目的で分けます。本人確認を強めるのか、利便性を高めるのか、パスワード再利用を抑えるのかを読みます。この関係を押さえると、認証技術は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではOTP、Challenge Response、SSO、Authentication、Federationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习认证技术时，先判断它是在讲对策、法务、审计、服务还是项目管理。认证技术要区分 OTP、挑战响应、SSO 等机制。它们可能用于加强本人确认、提高便利性或减少密码重复输入，目的不同。这样可以把OTP、Challenge Response、SSO、Authentication、Federation等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "OTP",
            "Challenge Response",
            "SSO",
            "Authentication",
            "Federation"
          ],
          "examFocusJa": "「認証技術」の設問では、「ワンタイムパスワード」「チャレンジレスポンス」「SSO」「本人確認」「認証連携」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、公開鍵基盤やアクセス権限管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「認証技術」相关题时，先抓一次性密码、挑战响应、SSO、本人确认、认证联动是判断词。再判断题目问对象、责任、流程还是效果，并排除PKI 或访问权限管理。",
          "commonMistakeJa": "「認証技術」を公開鍵基盤やアクセス権限管理と混同すると誤答します。特にSSOを認可の範囲を自動的に広げる仕組みと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「認証技術」和PKI 或访问权限管理混淆，尤其是误以为 SSO 会自动扩大授权范围。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 246,
              "pdfPageEnd": 247,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-2 認証技術",
              "anchorTermsJa": [
                "認証技術"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、認証技術が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「ワンタイムパスワード」「チャレンジレスポンス」「SSO」「本人確認」「認証連携」が判断線です。その語が出たら、まず通过一次性密码、挑战响应、SSO 等机制加强本人确认という意味に対応する日本語条件を探します。合わない場合は、公開鍵基盤やアクセス権限管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把认证技术放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。一次性密码、挑战响应、SSO、本人确认、认证联动是判断词。看到这些线索时，先判断是否符合“通过一次性密码、挑战响应、SSO 等机制加强本人确认”；如果不符合，就可能是在让你误选PKI 或访问权限管理。",
          "englishTerms": [
            "OTP",
            "Challenge Response",
            "SSO",
            "Authentication",
            "Federation"
          ],
          "examFocusJa": "認証技術の見分け方は、「ワンタイムパスワード」「チャレンジレスポンス」「SSO」「本人確認」「認証連携」が判断線ですを文章中から拾い、公開鍵基盤やアクセス権限管理ではなく認証技術を答えるべき条件かを確認することです。",
          "examFocusZh": "认证技术的判断线索是一次性密码、挑战响应、SSO、本人确认、认证联动是判断词，同时确认题干要求的是否是「認証技術」，而不是PKI 或访问权限管理。",
          "commonMistakeJa": "認証技術ではなく公開鍵基盤やアクセス権限管理の説明を選ぶ誤りに注意します。原因は、SSOを認可の範囲を自動的に広げる仕組みと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「認証技術」（认证技术）和PKI 或访问权限管理混淆。错误通常来自误以为 SSO 会自动扩大授权范围，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 246,
              "pdfPageEnd": 247,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-2 認証技術",
              "anchorTermsJa": [
                "認証技術"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "OTP",
          "termZh": "OTP",
          "english": "OTP"
        },
        {
          "termJa": "Challenge Response",
          "termZh": "Challenge Response",
          "english": "Challenge Response"
        },
        {
          "termJa": "SSO",
          "termZh": "SSO",
          "english": "SSO"
        },
        {
          "termJa": "Authentication",
          "termZh": "Authentication",
          "english": "Authentication"
        },
        {
          "termJa": "Federation",
          "termZh": "Federation",
          "english": "Federation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "認証技術と公開鍵基盤やアクセス権限管理を混同する",
          "trapZh": "把认证技术和PKI 或访问权限管理混为一谈。"
        },
        {
          "trapJa": "SSOを認可の範囲を自動的に広げる仕組みと考える",
          "trapZh": "误以为 SSO 会自动扩大授权范围"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 246,
          "pdfPageEnd": 247,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-2 認証技術",
          "anchorTermsJa": [
            "認証技術"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-3",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 13,
      "nativeSectionId": "4-4-3",
      "titleJa": "4-4-3 ネットワークセキュリティ",
      "titleZh": "网络安全",
      "overviewJa": "ネットワークセキュリティは、SG通信対策分野でネットワークセキュリティでは、ファイアウォール、IDS/IPS、VPN、DMZ、ネットワーク分離、ログ監視を組み合わせます。外部公開領域、内部ネットワーク、遠隔接続のどこを守るかで対策が変わります。PDF 248-251ページの「ネットワークセキュリティ」を定位語に、試験では「VPN」「DMZ」「ファイアウォール」「IDS」「IPS」「ネットワーク分離」が判断線です。セキュアプロトコルやアプリケーション対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "网络安全用于通过分段、过滤、监视和加密连接保护网络区域和通信。本单元依据 PDF 248-251 页的「ネットワークセキュリティ」定位，重点理解：网络安全结合防火墙、IDS/IPS、VPN、DMZ、网络隔离、日志监视。要看保护的是公开区、内部网还是远程连接。考试常用VPN、DMZ、防火墙、IDS、IPS、网络隔离是判断词来换说法；同时要和安全协议或应用安全区分。",
      "learningGoalJa": "問題文の条件を読み取り、「ネットワークセキュリティ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“网络安全”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ネットワークセキュリティを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。ネットワークセキュリティでは、ファイアウォール、IDS/IPS、VPN、DMZ、ネットワーク分離、ログ監視を組み合わせます。外部公開領域、内部ネットワーク、遠隔接続のどこを守るかで対策が変わります。この関係を押さえると、ネットワークセキュリティは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではVPN、DMZ、Firewall、IDS、IPS、Segmentationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习网络安全时，先判断它是在讲对策、法务、审计、服务还是项目管理。网络安全结合防火墙、IDS/IPS、VPN、DMZ、网络隔离、日志监视。要看保护的是公开区、内部网还是远程连接。这样可以把VPN、DMZ、Firewall、IDS、IPS、Segmentation等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "VPN",
            "DMZ",
            "Firewall",
            "IDS",
            "IPS",
            "Segmentation"
          ],
          "examFocusJa": "「ネットワークセキュリティ」の設問では、「VPN」「DMZ」「ファイアウォール」「IDS」「IPS」「ネットワーク分離」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、セキュアプロトコルやアプリケーション対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「ネットワークセキュリティ」相关题时，先抓VPN、DMZ、防火墙、IDS、IPS、网络隔离是判断词。再判断题目问对象、责任、流程还是效果，并排除安全协议或应用安全。",
          "commonMistakeJa": "「ネットワークセキュリティ」をセキュアプロトコルやアプリケーション対策と混同すると誤答します。特にVPNを使えば端末内部のマルウェアも自動的に消えると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「ネットワークセキュリティ」和安全协议或应用安全混淆，尤其是误以为使用 VPN 就会自动清除终端恶意软件。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 248,
              "pdfPageEnd": 251,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-3 ネットワークセキュリティ",
              "anchorTermsJa": [
                "ネットワークセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、ネットワークセキュリティが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「VPN」「DMZ」「ファイアウォール」「IDS」「IPS」「ネットワーク分離」が判断線です。その語が出たら、まず通过分段、过滤、监视和加密连接保护网络区域和通信という意味に対応する日本語条件を探します。合わない場合は、セキュアプロトコルやアプリケーション対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把网络安全放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。VPN、DMZ、防火墙、IDS、IPS、网络隔离是判断词。看到这些线索时，先判断是否符合“通过分段、过滤、监视和加密连接保护网络区域和通信”；如果不符合，就可能是在让你误选安全协议或应用安全。",
          "englishTerms": [
            "VPN",
            "DMZ",
            "Firewall",
            "IDS",
            "IPS",
            "Segmentation"
          ],
          "examFocusJa": "ネットワークセキュリティの見分け方は、「VPN」「DMZ」「ファイアウォール」「IDS」「IPS」「ネットワーク分離」が判断線ですを文章中から拾い、セキュアプロトコルやアプリケーション対策ではなくネットワークセキュリティを答えるべき条件かを確認することです。",
          "examFocusZh": "网络安全的判断线索是VPN、DMZ、防火墙、IDS、IPS、网络隔离是判断词，同时确认题干要求的是否是「ネットワークセキュリティ」，而不是安全协议或应用安全。",
          "commonMistakeJa": "ネットワークセキュリティではなくセキュアプロトコルやアプリケーション対策の説明を選ぶ誤りに注意します。原因は、VPNを使えば端末内部のマルウェアも自動的に消えると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ネットワークセキュリティ」（网络安全）和安全协议或应用安全混淆。错误通常来自误以为使用 VPN 就会自动清除终端恶意软件，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 248,
              "pdfPageEnd": 251,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-3 ネットワークセキュリティ",
              "anchorTermsJa": [
                "ネットワークセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "VPN",
          "termZh": "VPN",
          "english": "VPN"
        },
        {
          "termJa": "DMZ",
          "termZh": "DMZ",
          "english": "DMZ"
        },
        {
          "termJa": "Firewall",
          "termZh": "Firewall",
          "english": "Firewall"
        },
        {
          "termJa": "IDS",
          "termZh": "IDS",
          "english": "IDS"
        },
        {
          "termJa": "IPS",
          "termZh": "IPS",
          "english": "IPS"
        },
        {
          "termJa": "Segmentation",
          "termZh": "Segmentation",
          "english": "Segmentation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ネットワークセキュリティとセキュアプロトコルやアプリケーション対策を混同する",
          "trapZh": "把网络安全和安全协议或应用安全混为一谈。"
        },
        {
          "trapJa": "VPNを使えば端末内部のマルウェアも自動的に消えると考える",
          "trapZh": "误以为使用 VPN 就会自动清除终端恶意软件"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 248,
          "pdfPageEnd": 251,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-3 ネットワークセキュリティ",
          "anchorTermsJa": [
            "ネットワークセキュリティ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-4",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 14,
      "nativeSectionId": "4-4-4",
      "titleJa": "4-4-4 データベースセキュリティ",
      "titleZh": "数据库安全",
      "overviewJa": "データベースセキュリティは、SGデータ保護分野でデータベースセキュリティでは、アクセス権限、ビュー、監査ログ、暗号化、バックアップ、SQLインジェクション対策を組み合わせます。表の中のデータを誰がどの操作で扱えるかを制御する点が重要です。PDF 252-253ページの「データベースセキュリティ」を定位語に、試験では「アクセス権限」「ビュー」「監査ログ」「暗号化」「バックアップ」「SQLインジェクション」が判断線です。ネットワーク境界防御やアプリケーションセキュリティとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据库安全用于通过权限、审计、备份、输入控制保护数据库中的重要信息。本单元依据 PDF 252-253 页的「データベースセキュリティ」定位，重点理解：数据库安全包括访问权限、视图、审计日志、加密、备份和 SQL 注入对策。重点是控制谁能对表中数据做什么操作。考试常用访问权限、视图、审计日志、加密、备份、SQL 注入是判断词来换说法；同时要和网络边界防御或应用安全区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データベースセキュリティ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“数据库安全”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベースセキュリティを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。データベースセキュリティでは、アクセス権限、ビュー、監査ログ、暗号化、バックアップ、SQLインジェクション対策を組み合わせます。表の中のデータを誰がどの操作で扱えるかを制御する点が重要です。この関係を押さえると、データベースセキュリティは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではDatabase Security、Privilege、View、Audit Log、Backup、SQL Injectionが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据库安全时，先判断它是在讲对策、法务、审计、服务还是项目管理。数据库安全包括访问权限、视图、审计日志、加密、备份和 SQL 注入对策。重点是控制谁能对表中数据做什么操作。这样可以把Database Security、Privilege、View、Audit Log、Backup、SQL Injection等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Database Security",
            "Privilege",
            "View",
            "Audit Log",
            "Backup",
            "SQL Injection"
          ],
          "examFocusJa": "「データベースセキュリティ」の設問では、「アクセス権限」「ビュー」「監査ログ」「暗号化」「バックアップ」「SQLインジェクション」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、ネットワーク境界防御やアプリケーションセキュリティの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データベースセキュリティ」相关题时，先抓访问权限、视图、审计日志、加密、备份、SQL 注入是判断词。再判断题目问对象、责任、流程还是效果，并排除网络边界防御或应用安全。",
          "commonMistakeJa": "「データベースセキュリティ」をネットワーク境界防御やアプリケーションセキュリティと混同すると誤答します。特にDBバックアップだけで不正閲覧も防げると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データベースセキュリティ」和网络边界防御或应用安全混淆，尤其是误以为数据库备份能防止非法读取。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 252,
              "pdfPageEnd": 253,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-4 データベースセキュリティ",
              "anchorTermsJa": [
                "データベースセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データベースセキュリティが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「アクセス権限」「ビュー」「監査ログ」「暗号化」「バックアップ」「SQLインジェクション」が判断線です。その語が出たら、まず通过权限、审计、备份、输入控制保护数据库中的重要信息という意味に対応する日本語条件を探します。合わない場合は、ネットワーク境界防御やアプリケーションセキュリティを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把数据库安全放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。访问权限、视图、审计日志、加密、备份、SQL 注入是判断词。看到这些线索时，先判断是否符合“通过权限、审计、备份、输入控制保护数据库中的重要信息”；如果不符合，就可能是在让你误选网络边界防御或应用安全。",
          "englishTerms": [
            "Database Security",
            "Privilege",
            "View",
            "Audit Log",
            "Backup",
            "SQL Injection"
          ],
          "examFocusJa": "データベースセキュリティの見分け方は、「アクセス権限」「ビュー」「監査ログ」「暗号化」「バックアップ」「SQLインジェクション」が判断線ですを文章中から拾い、ネットワーク境界防御やアプリケーションセキュリティではなくデータベースセキュリティを答えるべき条件かを確認することです。",
          "examFocusZh": "数据库安全的判断线索是访问权限、视图、审计日志、加密、备份、SQL 注入是判断词，同时确认题干要求的是否是「データベースセキュリティ」，而不是网络边界防御或应用安全。",
          "commonMistakeJa": "データベースセキュリティではなくネットワーク境界防御やアプリケーションセキュリティの説明を選ぶ誤りに注意します。原因は、DBバックアップだけで不正閲覧も防げると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベースセキュリティ」（数据库安全）和网络边界防御或应用安全混淆。错误通常来自误以为数据库备份能防止非法读取，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 252,
              "pdfPageEnd": 253,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-4 データベースセキュリティ",
              "anchorTermsJa": [
                "データベースセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Database Security",
          "termZh": "Database Security",
          "english": "Database Security"
        },
        {
          "termJa": "Privilege",
          "termZh": "Privilege",
          "english": "Privilege"
        },
        {
          "termJa": "View",
          "termZh": "View",
          "english": "View"
        },
        {
          "termJa": "Audit Log",
          "termZh": "Audit Log",
          "english": "Audit Log"
        },
        {
          "termJa": "Backup",
          "termZh": "Backup",
          "english": "Backup"
        },
        {
          "termJa": "SQL Injection",
          "termZh": "SQL Injection",
          "english": "SQL Injection"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベースセキュリティとネットワーク境界防御やアプリケーションセキュリティを混同する",
          "trapZh": "把数据库安全和网络边界防御或应用安全混为一谈。"
        },
        {
          "trapJa": "DBバックアップだけで不正閲覧も防げると考える",
          "trapZh": "误以为数据库备份能防止非法读取"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 252,
          "pdfPageEnd": 253,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-4 データベースセキュリティ",
          "anchorTermsJa": [
            "データベースセキュリティ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-5",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 15,
      "nativeSectionId": "4-4-5",
      "titleJa": "4-4-5 アプリケーションセキュリティ",
      "titleZh": "アプリケーション安全",
      "overviewJa": "アプリケーションセキュリティは、SGアプリ対策分野でアプリケーションセキュリティでは、入力値検証、エスケープ処理、認証、認可、セッション管理、セキュアコーディングを扱います。利用者から受け取った値をどこで検証し、どの権限で処理するかが重要です。PDF 254-255ページの「アプリケーションセキュリティ」を定位語に、試験では「入力値検証」「エスケープ」「認証」「認可」「セッション管理」「セキュアコーディング」が判断線です。ネットワークセキュリティやデータベース権限との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "应用安全用于在设计、开发、运用中防止输入、认证、会话和权限控制漏洞。本单元依据 PDF 254-255 页的「アプリケーションセキュリティ」定位，重点理解：应用安全关注输入验证、转义、认证、授权、会话管理、安全编码。要看用户输入在哪里被检查、以什么权限处理。考试常用输入验证、转义、认证、授权、会话管理、安全编码是判断词来换说法；同时要和网络安全或数据库权限区分。",
      "learningGoalJa": "問題文の条件を読み取り、「アプリケーションセキュリティ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“アプリケーション安全”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "アプリケーションセキュリティを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。アプリケーションセキュリティでは、入力値検証、エスケープ処理、認証、認可、セッション管理、セキュアコーディングを扱います。利用者から受け取った値をどこで検証し、どの権限で処理するかが重要です。この関係を押さえると、アプリケーションセキュリティは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではInput Validation、Escape、Session、Authorization、Secure Coding、WAFが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习应用安全时，先判断它是在讲对策、法务、审计、服务还是项目管理。应用安全关注输入验证、转义、认证、授权、会话管理、安全编码。要看用户输入在哪里被检查、以什么权限处理。这样可以把Input Validation、Escape、Session、Authorization、Secure Coding、WAF等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Input Validation",
            "Escape",
            "Session",
            "Authorization",
            "Secure Coding",
            "WAF"
          ],
          "examFocusJa": "「アプリケーションセキュリティ」の設問では、「入力値検証」「エスケープ」「認証」「認可」「セッション管理」「セキュアコーディング」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、ネットワークセキュリティやデータベース権限の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「アプリケーションセキュリティ」相关题时，先抓输入验证、转义、认证、授权、会话管理、安全编码是判断词。再判断题目问对象、责任、流程还是效果，并排除网络安全或数据库权限。",
          "commonMistakeJa": "「アプリケーションセキュリティ」をネットワークセキュリティやデータベース権限と混同すると誤答します。特にファイアウォールだけでXSSや認可漏れを解決できると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「アプリケーションセキュリティ」和网络安全或数据库权限混淆，尤其是误以为只靠防火墙就能解决 XSS 或授权漏洞。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 254,
              "pdfPageEnd": 255,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-5 アプリケーションセキュリティ",
              "anchorTermsJa": [
                "アプリケーションセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、アプリケーションセキュリティが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「入力値検証」「エスケープ」「認証」「認可」「セッション管理」「セキュアコーディング」が判断線です。その語が出たら、まず在设计、开发、运用中防止输入、认证、会话和权限控制漏洞という意味に対応する日本語条件を探します。合わない場合は、ネットワークセキュリティやデータベース権限を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把应用安全放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。输入验证、转义、认证、授权、会话管理、安全编码是判断词。看到这些线索时，先判断是否符合“在设计、开发、运用中防止输入、认证、会话和权限控制漏洞”；如果不符合，就可能是在让你误选网络安全或数据库权限。",
          "englishTerms": [
            "Input Validation",
            "Escape",
            "Session",
            "Authorization",
            "Secure Coding",
            "WAF"
          ],
          "examFocusJa": "アプリケーションセキュリティの見分け方は、「入力値検証」「エスケープ」「認証」「認可」「セッション管理」「セキュアコーディング」が判断線ですを文章中から拾い、ネットワークセキュリティやデータベース権限ではなくアプリケーションセキュリティを答えるべき条件かを確認することです。",
          "examFocusZh": "应用安全的判断线索是输入验证、转义、认证、授权、会话管理、安全编码是判断词，同时确认题干要求的是否是「アプリケーションセキュリティ」，而不是网络安全或数据库权限。",
          "commonMistakeJa": "アプリケーションセキュリティではなくネットワークセキュリティやデータベース権限の説明を選ぶ誤りに注意します。原因は、ファイアウォールだけでXSSや認可漏れを解決できると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「アプリケーションセキュリティ」（应用安全）和网络安全或数据库权限混淆。错误通常来自误以为只靠防火墙就能解决 XSS 或授权漏洞，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 254,
              "pdfPageEnd": 255,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-5 アプリケーションセキュリティ",
              "anchorTermsJa": [
                "アプリケーションセキュリティ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Input Validation",
          "termZh": "Input Validation",
          "english": "Input Validation"
        },
        {
          "termJa": "Escape",
          "termZh": "Escape",
          "english": "Escape"
        },
        {
          "termJa": "Session",
          "termZh": "Session",
          "english": "Session"
        },
        {
          "termJa": "Authorization",
          "termZh": "Authorization",
          "english": "Authorization"
        },
        {
          "termJa": "Secure Coding",
          "termZh": "Secure Coding",
          "english": "Secure Coding"
        },
        {
          "termJa": "WAF",
          "termZh": "WAF",
          "english": "WAF"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "アプリケーションセキュリティとネットワークセキュリティやデータベース権限を混同する",
          "trapZh": "把应用安全和网络安全或数据库权限混为一谈。"
        },
        {
          "trapJa": "ファイアウォールだけでXSSや認可漏れを解決できると考える",
          "trapZh": "误以为只靠防火墙就能解决 XSS 或授权漏洞"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 254,
          "pdfPageEnd": 255,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-5 アプリケーションセキュリティ",
          "anchorTermsJa": [
            "アプリケーションセキュリティ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-4-4-6",
      "exam": "sg",
      "chapterId": "sg-ch04",
      "topicId": "technology",
      "order": 16,
      "nativeSectionId": "4-4-6",
      "titleJa": "4-4-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、通信経路、利用者確認、ネットワーク境界、DB権限、アプリ入力処理のどこを守るかが問われます。保護対象と層を対応させることが重要です。PDF 256-259ページの「演習問題」を定位語に、試験では「演習問題」「プロトコル」「認証」「DB」「アプリケーション」「通信経路」が判断線です。単一技術名の暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "安全协议与系统防御演习问题用于检查安全协议、认证、网络、数据库和应用安全的边界是否能按条件判断。本单元依据 PDF 256-259 页的「演習問題」定位，重点理解：本节演习会混合考安全协议、认证、网络、数据库和应用安全。做题时先判断保护对象和层次，再选协议或控制措施。考试常用演习问题、协议、认证、数据库、应用、通信路径是判断词来换说法；同时要和只背单个技术名区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、通信経路、利用者確認、ネットワーク境界、DB権限、アプリ入力処理のどこを守るかが問われます。保護対象と層を対応させることが重要です。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Protocol、Authentication、Database、Applicationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习安全协议与系统防御演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习会混合考安全协议、认证、网络、数据库和应用安全。做题时先判断保护对象和层次，再选协议或控制措施。这样可以把Exercise、Protocol、Authentication、Database、Application等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Protocol",
            "Authentication",
            "Database",
            "Application"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「プロトコル」「認証」「DB」「アプリケーション」「通信経路」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、単一技術名の暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、协议、认证、数据库、应用、通信路径是判断词。再判断题目问对象、责任、流程还是效果，并排除只背单个技术名。",
          "commonMistakeJa": "「演習問題」を単一技術名の暗記と混同すると誤答します。特に守る層を読まずに近い安全用語を選ぶ場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单个技术名混淆，尤其是不读保护层次，只按相近安全术语选择。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 256,
              "pdfPageEnd": 259,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-6 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「プロトコル」「認証」「DB」「アプリケーション」「通信経路」が判断線です。その語が出たら、まず检查安全协议、认证、网络、数据库和应用安全的边界是否能按条件判断という意味に対応する日本語条件を探します。合わない場合は、単一技術名の暗記を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把安全协议与系统防御演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、协议、认证、数据库、应用、通信路径是判断词。看到这些线索时，先判断是否符合“检查安全协议、认证、网络、数据库和应用安全的边界是否能按条件判断”；如果不符合，就可能是在让你误选只背单个技术名。",
          "englishTerms": [
            "Exercise",
            "Protocol",
            "Authentication",
            "Database",
            "Application"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「プロトコル」「認証」「DB」「アプリケーション」「通信経路」が判断線ですを文章中から拾い、単一技術名の暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "安全协议与系统防御演习问题的判断线索是演习问题、协议、认证、数据库、应用、通信路径是判断词，同时确认题干要求的是否是「演習問題」，而不是只背单个技术名。",
          "commonMistakeJa": "演習問題ではなく単一技術名の暗記の説明を選ぶ誤りに注意します。原因は、守る層を読まずに近い安全用語を選ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（安全协议与系统防御演习问题）和只背单个技术名混淆。错误通常来自不读保护层次，只按相近安全术语选择，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 256,
              "pdfPageEnd": 259,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-4-6 演習問題",
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
          "termJa": "Protocol",
          "termZh": "Protocol",
          "english": "Protocol"
        },
        {
          "termJa": "Authentication",
          "termZh": "Authentication",
          "english": "Authentication"
        },
        {
          "termJa": "Database",
          "termZh": "Database",
          "english": "Database"
        },
        {
          "termJa": "Application",
          "termZh": "Application",
          "english": "Application"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と単一技術名の暗記を混同する",
          "trapZh": "把安全协议与系统防御演习问题和只背单个技术名混为一谈。"
        },
        {
          "trapJa": "守る層を読まずに近い安全用語を選ぶ",
          "trapZh": "不读保护层次，只按相近安全术语选择"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 256,
          "pdfPageEnd": 259,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-4-6 演習問題",
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
