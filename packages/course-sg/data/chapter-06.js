module.exports = {
  "chapter": {
    "id": "sg-ch06",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 6,
    "titleJa": "第6章 マネジメント",
    "titleZh": "第6章 管理"
  },
  "units": [
    {
      "id": "sg-6-1-1",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 1,
      "nativeSectionId": "6-1-1",
      "titleJa": "6-1-1 システム監査",
      "titleZh": "6-1-1 系统审计的目的、审计流程与第三方评估原则",
      "overviewJa": "システム監査は、SG監査分野でシステム監査では、監査計画、予備調査、本調査、評価、監査報告の流れで、信頼性、安全性、効率性、内部統制を確認します。監査人は証拠に基づいて評価し、直接運用を修正する立場ではありません。PDF 308-315ページの「システム監査」を定位語に、試験では「監査計画」「監査証拠」「監査報告」「独立性」「内部統制」「改善勧告」が判断線です。内部統制の運用やサービスマネジメントとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "系统审计用于以独立立场评价系统控制是否有效，并提出改进建议。本单元依据 PDF 308-315 页的「システム監査」定位，重点理解：系统审计按审计计划、预备调查、正式调查、评价、报告的流程确认可靠性、安全性、效率和内部控制。审计人员基于证据评价，不是直接替运维修复。考试常用审计计划、审计证据、审计报告、独立性、内部控制、改善建议是判断词来换说法；同时要和内部控制执行或服务管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「システム監査」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-1-1 系统审计的目的、审计流程与第三方评估原则”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "システム監査を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。システム監査では、監査計画、予備調査、本調査、評価、監査報告の流れで、信頼性、安全性、効率性、内部統制を確認します。監査人は証拠に基づいて評価し、直接運用を修正する立場ではありません。この関係を押さえると、システム監査は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではSystem Audit、Audit Evidence、Independence、Internal Control、Audit Reportが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习系统审计时，先判断它是在讲对策、法务、审计、服务还是项目管理。系统审计按审计计划、预备调查、正式调查、评价、报告的流程确认可靠性、安全性、效率和内部控制。审计人员基于证据评价，不是直接替运维修复。这样可以把System Audit、Audit Evidence、Independence、Internal Control、Audit Report等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "System Audit",
            "Audit Evidence",
            "Independence",
            "Internal Control",
            "Audit Report"
          ],
          "examFocusJa": "「システム監査」の設問では、「監査計画」「監査証拠」「監査報告」「独立性」「内部統制」「改善勧告」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、内部統制の運用やサービスマネジメントの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「システム監査」相关题时，先抓审计计划、审计证据、审计报告、独立性、内部控制、改善建议是判断词。再判断题目问对象、责任、流程还是效果，并排除内部控制执行或服务管理。",
          "commonMistakeJa": "「システム監査」を内部統制の運用やサービスマネジメントと混同すると誤答します。特に監査人が自ら対策を実装してよいと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「システム監査」和内部控制执行或服务管理混淆，尤其是误以为审计人员可以亲自实施对策。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 308,
              "pdfPageEnd": 315,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-1 システム監査",
              "anchorTermsJa": [
                "システム監査"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、システム監査が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「監査計画」「監査証拠」「監査報告」「独立性」「内部統制」「改善勧告」が判断線です。その語が出たら、まず以独立立场评价系统控制是否有效，并提出改进建议という意味に対応する日本語条件を探します。合わない場合は、内部統制の運用やサービスマネジメントを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把系统审计放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。审计计划、审计证据、审计报告、独立性、内部控制、改善建议是判断词。看到这些线索时，先判断是否符合“以独立立场评价系统控制是否有效，并提出改进建议”；如果不符合，就可能是在让你误选内部控制执行或服务管理。",
          "englishTerms": [
            "System Audit",
            "Audit Evidence",
            "Independence",
            "Internal Control",
            "Audit Report"
          ],
          "examFocusJa": "システム監査の見分け方は、「監査計画」「監査証拠」「監査報告」「独立性」「内部統制」「改善勧告」が判断線ですを文章中から拾い、内部統制の運用やサービスマネジメントではなくシステム監査を答えるべき条件かを確認することです。",
          "examFocusZh": "系统审计的判断线索是审计计划、审计证据、审计报告、独立性、内部控制、改善建议是判断词，同时确认题干要求的是否是「システム監査」，而不是内部控制执行或服务管理。",
          "commonMistakeJa": "システム監査ではなく内部統制の運用やサービスマネジメントの説明を選ぶ誤りに注意します。原因は、監査人が自ら対策を実装してよいと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「システム監査」（系统审计）和内部控制执行或服务管理混淆。错误通常来自误以为审计人员可以亲自实施对策，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 308,
              "pdfPageEnd": 315,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-1 システム監査",
              "anchorTermsJa": [
                "システム監査"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "System Audit",
          "termZh": "System Audit",
          "english": "System Audit"
        },
        {
          "termJa": "Audit Evidence",
          "termZh": "Audit Evidence",
          "english": "Audit Evidence"
        },
        {
          "termJa": "Independence",
          "termZh": "Independence",
          "english": "Independence"
        },
        {
          "termJa": "Internal Control",
          "termZh": "Internal Control",
          "english": "Internal Control"
        },
        {
          "termJa": "Audit Report",
          "termZh": "Audit Report",
          "english": "Audit Report"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "システム監査と内部統制の運用やサービスマネジメントを混同する",
          "trapZh": "把系统审计和内部控制执行或服务管理混为一谈。"
        },
        {
          "trapJa": "監査人が自ら対策を実装してよいと考える",
          "trapZh": "误以为审计人员可以亲自实施对策"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0035"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 308,
          "pdfPageEnd": 315,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-1-1 システム監査",
          "anchorTermsJa": [
            "システム監査"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-1-2",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 2,
      "nativeSectionId": "6-1-2",
      "titleJa": "6-1-2 内部統制",
      "titleZh": "内部控制",
      "overviewJa": "内部統制は、SG監査分野で内部統制は、業務の有効性、財務報告の信頼性、法令遵守、資産保全を目的として業務プロセスに組み込まれる仕組みです。承認、照合、職務分掌、アクセス制御などが具体例になります。PDF 316-318ページの「内部統制」を定位語に、試験では「内部統制」「承認」「照合」「職務分掌」「資産保全」「法令遵守」が判断線です。システム監査やセキュリティ管理規程との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "内部控制用于通过业务流程中的控制降低错误、不正、资产损失和报告不可靠风险。本单元依据 PDF 316-318 页的「内部統制」定位，重点理解：内部控制嵌入业务流程，用于保证业务有效、报告可靠、合规和资产保护。审批、核对、职责分离、访问控制都是控制活动例子。考试常用内部控制、审批、核对、职责分离、资产保护、合规是判断词来换说法；同时要和系统审计或安全管理规程区分。",
      "learningGoalJa": "問題文の条件を読み取り、「内部統制」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“内部控制”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "内部統制を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。内部統制は、業務の有効性、財務報告の信頼性、法令遵守、資産保全を目的として業務プロセスに組み込まれる仕組みです。承認、照合、職務分掌、アクセス制御などが具体例になります。この関係を押さえると、内部統制は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではInternal Control、Approval、Reconciliation、Segregation of Duties、Complianceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习内部控制时，先判断它是在讲对策、法务、审计、服务还是项目管理。内部控制嵌入业务流程，用于保证业务有效、报告可靠、合规和资产保护。审批、核对、职责分离、访问控制都是控制活动例子。这样可以把Internal Control、Approval、Reconciliation、Segregation of Duties、Compliance等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Internal Control",
            "Approval",
            "Reconciliation",
            "Segregation of Duties",
            "Compliance"
          ],
          "examFocusJa": "「内部統制」の設問では、「内部統制」「承認」「照合」「職務分掌」「資産保全」「法令遵守」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、システム監査やセキュリティ管理規程の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「内部統制」相关题时，先抓内部控制、审批、核对、职责分离、资产保护、合规是判断词。再判断题目问对象、责任、流程还是效果，并排除系统审计或安全管理规程。",
          "commonMistakeJa": "「内部統制」をシステム監査やセキュリティ管理規程と混同すると誤答します。特に内部統制を監査報告そのものと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「内部統制」和系统审计或安全管理规程混淆，尤其是把内部控制误认为审计报告本身。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 316,
              "pdfPageEnd": 318,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-2 内部統制",
              "anchorTermsJa": [
                "内部統制"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、内部統制が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「内部統制」「承認」「照合」「職務分掌」「資産保全」「法令遵守」が判断線です。その語が出たら、まず通过业务流程中的控制降低错误、不正、资产损失和报告不可靠风险という意味に対応する日本語条件を探します。合わない場合は、システム監査やセキュリティ管理規程を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把内部控制放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。内部控制、审批、核对、职责分离、资产保护、合规是判断词。看到这些线索时，先判断是否符合“通过业务流程中的控制降低错误、不正、资产损失和报告不可靠风险”；如果不符合，就可能是在让你误选系统审计或安全管理规程。",
          "englishTerms": [
            "Internal Control",
            "Approval",
            "Reconciliation",
            "Segregation of Duties",
            "Compliance"
          ],
          "examFocusJa": "内部統制の見分け方は、「内部統制」「承認」「照合」「職務分掌」「資産保全」「法令遵守」が判断線ですを文章中から拾い、システム監査やセキュリティ管理規程ではなく内部統制を答えるべき条件かを確認することです。",
          "examFocusZh": "内部控制的判断线索是内部控制、审批、核对、职责分离、资产保护、合规是判断词，同时确认题干要求的是否是「内部統制」，而不是系统审计或安全管理规程。",
          "commonMistakeJa": "内部統制ではなくシステム監査やセキュリティ管理規程の説明を選ぶ誤りに注意します。原因は、内部統制を監査報告そのものと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「内部統制」（内部控制）和系统审计或安全管理规程混淆。错误通常来自把内部控制误认为审计报告本身，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 316,
              "pdfPageEnd": 318,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-2 内部統制",
              "anchorTermsJa": [
                "内部統制"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Internal Control",
          "termZh": "Internal Control",
          "english": "Internal Control"
        },
        {
          "termJa": "Approval",
          "termZh": "Approval",
          "english": "Approval"
        },
        {
          "termJa": "Reconciliation",
          "termZh": "Reconciliation",
          "english": "Reconciliation"
        },
        {
          "termJa": "Segregation of Duties",
          "termZh": "Segregation of Duties",
          "english": "Segregation of Duties"
        },
        {
          "termJa": "Compliance",
          "termZh": "Compliance",
          "english": "Compliance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "内部統制とシステム監査やセキュリティ管理規程を混同する",
          "trapZh": "把内部控制和系统审计或安全管理规程混为一谈。"
        },
        {
          "trapJa": "内部統制を監査報告そのものと考える",
          "trapZh": "把内部控制误认为审计报告本身"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 316,
          "pdfPageEnd": 318,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-1-2 内部統制",
          "anchorTermsJa": [
            "内部統制"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-1-3",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 3,
      "nativeSectionId": "6-1-3",
      "titleJa": "6-1-3 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、監査人の独立性、監査証拠、内部統制の目的、改善勧告の位置付けが問われます。誰が評価し、誰が実施するかを分けます。PDF 319-328ページの「演習問題」を定位語に、試験では「演習問題」「監査」「内部統制」「証拠」「独立性」「改善」が判断線です。サービスマネジメントやプロジェクト管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "审计与内部控制演习问题用于检查系统审计和内部控制在目的、主体、证据和改善建议上的区别。本单元依据 PDF 319-328 页的「演習問題」定位，重点理解：本节演习考审计和内部控制的边界。要分清谁评价、谁执行、证据是什么、改善建议如何处理。考试常用演习问题、审计、内部控制、证据、独立性、改进是判断词来换说法；同时要和服务管理或项目管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、監査人の独立性、監査証拠、内部統制の目的、改善勧告の位置付けが問われます。誰が評価し、誰が実施するかを分けます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Audit、Internal Control、Evidence、Independenceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习审计与内部控制演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习考审计和内部控制的边界。要分清谁评价、谁执行、证据是什么、改善建议如何处理。这样可以把Exercise、Audit、Internal Control、Evidence、Independence等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Audit",
            "Internal Control",
            "Evidence",
            "Independence"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「監査」「内部統制」「証拠」「独立性」「改善」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、サービスマネジメントやプロジェクト管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、审计、内部控制、证据、独立性、改进是判断词。再判断题目问对象、责任、流程还是效果，并排除服务管理或项目管理。",
          "commonMistakeJa": "「演習問題」をサービスマネジメントやプロジェクト管理と混同すると誤答します。特に評価者と実施者の役割を混同する場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和服务管理或项目管理混淆，尤其是混淆评价者和执行者职责。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 319,
              "pdfPageEnd": 328,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-3 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「監査」「内部統制」「証拠」「独立性」「改善」が判断線です。その語が出たら、まず检查系统审计和内部控制在目的、主体、证据和改善建议上的区别という意味に対応する日本語条件を探します。合わない場合は、サービスマネジメントやプロジェクト管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把审计与内部控制演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、审计、内部控制、证据、独立性、改进是判断词。看到这些线索时，先判断是否符合“检查系统审计和内部控制在目的、主体、证据和改善建议上的区别”；如果不符合，就可能是在让你误选服务管理或项目管理。",
          "englishTerms": [
            "Exercise",
            "Audit",
            "Internal Control",
            "Evidence",
            "Independence"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「監査」「内部統制」「証拠」「独立性」「改善」が判断線ですを文章中から拾い、サービスマネジメントやプロジェクト管理ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "审计与内部控制演习问题的判断线索是演习问题、审计、内部控制、证据、独立性、改进是判断词，同时确认题干要求的是否是「演習問題」，而不是服务管理或项目管理。",
          "commonMistakeJa": "演習問題ではなくサービスマネジメントやプロジェクト管理の説明を選ぶ誤りに注意します。原因は、評価者と実施者の役割を混同するときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（审计与内部控制演习问题）和服务管理或项目管理混淆。错误通常来自混淆评价者和执行者职责，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 319,
              "pdfPageEnd": 328,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-1-3 演習問題",
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
          "termJa": "Audit",
          "termZh": "Audit",
          "english": "Audit"
        },
        {
          "termJa": "Internal Control",
          "termZh": "Internal Control",
          "english": "Internal Control"
        },
        {
          "termJa": "Evidence",
          "termZh": "Evidence",
          "english": "Evidence"
        },
        {
          "termJa": "Independence",
          "termZh": "Independence",
          "english": "Independence"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題とサービスマネジメントやプロジェクト管理を混同する",
          "trapZh": "把审计与内部控制演习问题和服务管理或项目管理混为一谈。"
        },
        {
          "trapJa": "評価者と実施者の役割を混同する",
          "trapZh": "混淆评价者和执行者职责"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 319,
          "pdfPageEnd": 328,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-1-3 演習問題",
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
      "id": "sg-6-2-1",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 4,
      "nativeSectionId": "6-2-1",
      "titleJa": "6-2-1 サービスマネジメント",
      "titleZh": "6-2-1 IT 服务管理的金科玉律 (ITIL框架与SLA协议指标)",
      "overviewJa": "サービスマネジメントは、SGサービス管理分野でサービスマネジメントでは、利用者に価値を提供するITサービスを、SLA、インシデント管理、問題管理、変更管理、構成管理で支えます。プロジェクトの完了ではなく、稼働中サービスの品質維持が中心です。PDF 329-332ページの「サービスマネジメント」を定位語に、試験では「SLA」「インシデント」「問題管理」「変更管理」「構成管理」「サービス価値」が判断線です。プロジェクトマネジメントやシステム監査との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "服务管理用于稳定提供 IT 服务并用 SLA、事件、问题、变更管理维持服务价值。本单元依据 PDF 329-332 页的「サービスマネジメント」定位，重点理解：服务管理关注运行中 IT 服务的价值，用 SLA、事件管理、问题管理、变更管理、配置管理维持质量。它不是项目结束，而是服务持续运营。考试常用SLA、事件、问题管理、变更管理、配置管理、服务价值是判断词来换说法；同时要和项目管理或系统审计区分。",
      "learningGoalJa": "問題文の条件を読み取り、「サービスマネジメント」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-2-1 IT 服务管理的金科玉律 (ITIL框架与SLA协议指标)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "サービスマネジメントを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。サービスマネジメントでは、利用者に価値を提供するITサービスを、SLA、インシデント管理、問題管理、変更管理、構成管理で支えます。プロジェクトの完了ではなく、稼働中サービスの品質維持が中心です。この関係を押さえると、サービスマネジメントは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではITIL、SLA、Incident、Problem Management、Change Management、Configurationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习服务管理时，先判断它是在讲对策、法务、审计、服务还是项目管理。服务管理关注运行中 IT 服务的价值，用 SLA、事件管理、问题管理、变更管理、配置管理维持质量。它不是项目结束，而是服务持续运营。这样可以把ITIL、SLA、Incident、Problem Management、Change Management、Configuration等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "ITIL",
            "SLA",
            "Incident",
            "Problem Management",
            "Change Management",
            "Configuration"
          ],
          "examFocusJa": "「サービスマネジメント」の設問では、「SLA」「インシデント」「問題管理」「変更管理」「構成管理」「サービス価値」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、プロジェクトマネジメントやシステム監査の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「サービスマネジメント」相关题时，先抓SLA、事件、问题管理、变更管理、配置管理、服务价值是判断词。再判断题目问对象、责任、流程还是效果，并排除项目管理或系统审计。",
          "commonMistakeJa": "「サービスマネジメント」をプロジェクトマネジメントやシステム監査と混同すると誤答します。特にインシデント管理と問題管理を同じ意味として扱う場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「サービスマネジメント」和项目管理或系统审计混淆，尤其是把事件管理和问题管理当成同一件事。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 329,
              "pdfPageEnd": 332,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-1 サービスマネジメント",
              "anchorTermsJa": [
                "サービスマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、サービスマネジメントが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「SLA」「インシデント」「問題管理」「変更管理」「構成管理」「サービス価値」が判断線です。その語が出たら、まず稳定提供 IT 服务并用 SLA、事件、问题、变更管理维持服务价值という意味に対応する日本語条件を探します。合わない場合は、プロジェクトマネジメントやシステム監査を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把服务管理放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。SLA、事件、问题管理、变更管理、配置管理、服务价值是判断词。看到这些线索时，先判断是否符合“稳定提供 IT 服务并用 SLA、事件、问题、变更管理维持服务价值”；如果不符合，就可能是在让你误选项目管理或系统审计。",
          "englishTerms": [
            "ITIL",
            "SLA",
            "Incident",
            "Problem Management",
            "Change Management",
            "Configuration"
          ],
          "examFocusJa": "サービスマネジメントの見分け方は、「SLA」「インシデント」「問題管理」「変更管理」「構成管理」「サービス価値」が判断線ですを文章中から拾い、プロジェクトマネジメントやシステム監査ではなくサービスマネジメントを答えるべき条件かを確認することです。",
          "examFocusZh": "服务管理的判断线索是SLA、事件、问题管理、变更管理、配置管理、服务价值是判断词，同时确认题干要求的是否是「サービスマネジメント」，而不是项目管理或系统审计。",
          "commonMistakeJa": "サービスマネジメントではなくプロジェクトマネジメントやシステム監査の説明を選ぶ誤りに注意します。原因は、インシデント管理と問題管理を同じ意味として扱うときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「サービスマネジメント」（服务管理）和项目管理或系统审计混淆。错误通常来自把事件管理和问题管理当成同一件事，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 329,
              "pdfPageEnd": 332,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-1 サービスマネジメント",
              "anchorTermsJa": [
                "サービスマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ITIL",
          "termZh": "ITIL",
          "english": "ITIL"
        },
        {
          "termJa": "SLA",
          "termZh": "SLA",
          "english": "SLA"
        },
        {
          "termJa": "Incident",
          "termZh": "Incident",
          "english": "Incident"
        },
        {
          "termJa": "Problem Management",
          "termZh": "Problem Management",
          "english": "Problem Management"
        },
        {
          "termJa": "Change Management",
          "termZh": "Change Management",
          "english": "Change Management"
        },
        {
          "termJa": "Configuration",
          "termZh": "Configuration",
          "english": "Configuration"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "サービスマネジメントとプロジェクトマネジメントやシステム監査を混同する",
          "trapZh": "把服务管理和项目管理或系统审计混为一谈。"
        },
        {
          "trapJa": "インシデント管理と問題管理を同じ意味として扱う",
          "trapZh": "把事件管理和问题管理当成同一件事"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0036"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 329,
          "pdfPageEnd": 332,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-1 サービスマネジメント",
          "anchorTermsJa": [
            "サービスマネジメント"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-2-2",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 5,
      "nativeSectionId": "6-2-2",
      "titleJa": "6-2-2 サービスマネジメントシステムの計画及び運用",
      "titleZh": "服务管理系统的計画及び運用",
      "overviewJa": "サービスマネジメントシステムの計画及び運用は、SGサービス管理分野でサービスマネジメントシステムでは、方針、目標、プロセス、役割、記録、評価を整備し、サービス提供を計画的に運用します。単発の障害対応ではなく、継続して管理する仕組みとして読みます。PDF 333-339ページの「サービスマネジメントシステムの計画及び運用」を定位語に、試験では「サービス管理方針」「計画」「プロセス」「役割」「記録」「運用」が判断線です。個別のインシデント対応やプロジェクト計画との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "服务管理系统的计划与运用用于建立服务管理方针、计划、流程和运行机制，持续提供服务。本单元依据 PDF 333-339 页的「サービスマネジメントシステムの計画及び運用」定位，重点理解：服务管理系统要建立方针、目标、流程、角色、记录和评价，按计划运行服务。它不是一次故障处理，而是持续管理机制。考试常用服务管理方针、计划、流程、角色、记录、运用是判断词来换说法；同时要和单个事件处理或项目计划区分。",
      "learningGoalJa": "問題文の条件を読み取り、「サービスマネジメントシステムの計画及び運用」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“服务管理系统的計画及び運用”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "サービスマネジメントシステムの計画及び運用を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。サービスマネジメントシステムでは、方針、目標、プロセス、役割、記録、評価を整備し、サービス提供を計画的に運用します。単発の障害対応ではなく、継続して管理する仕組みとして読みます。この関係を押さえると、サービスマネジメントシステムの計画及び運用は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではSMS、Service Management System、Plan、Operation、Recordが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习服务管理系统的计划与运用时，先判断它是在讲对策、法务、审计、服务还是项目管理。服务管理系统要建立方针、目标、流程、角色、记录和评价，按计划运行服务。它不是一次故障处理，而是持续管理机制。这样可以把SMS、Service Management System、Plan、Operation、Record等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "SMS",
            "Service Management System",
            "Plan",
            "Operation",
            "Record"
          ],
          "examFocusJa": "「サービスマネジメントシステムの計画及び運用」の設問では、「サービス管理方針」「計画」「プロセス」「役割」「記録」「運用」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、個別のインシデント対応やプロジェクト計画の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「サービスマネジメントシステムの計画及び運用」相关题时，先抓服务管理方针、计划、流程、角色、记录、运用是判断词。再判断题目问对象、责任、流程还是效果，并排除单个事件处理或项目计划。",
          "commonMistakeJa": "「サービスマネジメントシステムの計画及び運用」を個別のインシデント対応やプロジェクト計画と混同すると誤答します。特に計画を作れば運用評価は不要と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「サービスマネジメントシステムの計画及び運用」和单个事件处理或项目计划混淆，尤其是误以为有计划后就不需要运行评价。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 333,
              "pdfPageEnd": 339,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-2 サービスマネジメントシステムの計画及び運用",
              "anchorTermsJa": [
                "サービスマネジメントシステムの計画及び運用"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、サービスマネジメントシステムの計画及び運用が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「サービス管理方針」「計画」「プロセス」「役割」「記録」「運用」が判断線です。その語が出たら、まず建立服务管理方针、计划、流程和运行机制，持续提供服务という意味に対応する日本語条件を探します。合わない場合は、個別のインシデント対応やプロジェクト計画を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把服务管理系统的计划与运用放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。服务管理方针、计划、流程、角色、记录、运用是判断词。看到这些线索时，先判断是否符合“建立服务管理方针、计划、流程和运行机制，持续提供服务”；如果不符合，就可能是在让你误选单个事件处理或项目计划。",
          "englishTerms": [
            "SMS",
            "Service Management System",
            "Plan",
            "Operation",
            "Record"
          ],
          "examFocusJa": "サービスマネジメントシステムの計画及び運用の見分け方は、「サービス管理方針」「計画」「プロセス」「役割」「記録」「運用」が判断線ですを文章中から拾い、個別のインシデント対応やプロジェクト計画ではなくサービスマネジメントシステムの計画及び運用を答えるべき条件かを確認することです。",
          "examFocusZh": "服务管理系统的计划与运用的判断线索是服务管理方针、计划、流程、角色、记录、运用是判断词，同时确认题干要求的是否是「サービスマネジメントシステムの計画及び運用」，而不是单个事件处理或项目计划。",
          "commonMistakeJa": "サービスマネジメントシステムの計画及び運用ではなく個別のインシデント対応やプロジェクト計画の説明を選ぶ誤りに注意します。原因は、計画を作れば運用評価は不要と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「サービスマネジメントシステムの計画及び運用」（服务管理系统的计划与运用）和单个事件处理或项目计划混淆。错误通常来自误以为有计划后就不需要运行评价，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 333,
              "pdfPageEnd": 339,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-2 サービスマネジメントシステムの計画及び運用",
              "anchorTermsJa": [
                "サービスマネジメントシステムの計画及び運用"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SMS",
          "termZh": "SMS",
          "english": "SMS"
        },
        {
          "termJa": "Service Management System",
          "termZh": "Service Management System",
          "english": "Service Management System"
        },
        {
          "termJa": "Plan",
          "termZh": "Plan",
          "english": "Plan"
        },
        {
          "termJa": "Operation",
          "termZh": "Operation",
          "english": "Operation"
        },
        {
          "termJa": "Record",
          "termZh": "Record",
          "english": "Record"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "サービスマネジメントシステムの計画及び運用と個別のインシデント対応やプロジェクト計画を混同する",
          "trapZh": "把服务管理系统的计划与运用和单个事件处理或项目计划混为一谈。"
        },
        {
          "trapJa": "計画を作れば運用評価は不要と考える",
          "trapZh": "误以为有计划后就不需要运行评价"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 333,
          "pdfPageEnd": 339,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-2 サービスマネジメントシステムの計画及び運用",
          "anchorTermsJa": [
            "サービスマネジメントシステムの計画及び運用"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-2-3",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 6,
      "nativeSectionId": "6-2-3",
      "titleJa": "6-2-3 パフォーマンス評価及び改善",
      "titleZh": "パフォーマンス评价及び改善",
      "overviewJa": "パフォーマンス評価及び改善は、SGサービス管理分野でパフォーマンス評価では、サービスレベル、可用性、処理時間、障害件数、利用者満足度などを測定し、改善策につなげます。測定だけで終わらず、原因分析と改善実施まで含めて考えます。PDF 340-341ページの「パフォーマンス評価及び改善」を定位語に、試験では「サービスレベル」「可用性」「測定」「改善」「KPI」「利用者満足度」が判断線です。サービスの運用や監査との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "性能评价与改善用于用指标监控服务绩效并持续改进质量、效率和可用性。本单元依据 PDF 340-341 页的「パフォーマンス評価及び改善」定位，重点理解：性能评价通过服务水平、可用性、处理时间、故障件数、用户满意度等指标监控服务，并连接到原因分析和改进措施。考试常用服务水平、可用性、测定、改进、KPI、用户满意度是判断词来换说法；同时要和服务运行或审计区分。",
      "learningGoalJa": "問題文の条件を読み取り、「パフォーマンス評価及び改善」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“パフォーマンス评价及び改善”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "パフォーマンス評価及び改善を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。パフォーマンス評価では、サービスレベル、可用性、処理時間、障害件数、利用者満足度などを測定し、改善策につなげます。測定だけで終わらず、原因分析と改善実施まで含めて考えます。この関係を押さえると、パフォーマンス評価及び改善は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではKPI、Performance Evaluation、Availability、Continual Improvementが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习性能评价与改善时，先判断它是在讲对策、法务、审计、服务还是项目管理。性能评价通过服务水平、可用性、处理时间、故障件数、用户满意度等指标监控服务，并连接到原因分析和改进措施。这样可以把KPI、Performance Evaluation、Availability、Continual Improvement等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "KPI",
            "Performance Evaluation",
            "Availability",
            "Continual Improvement"
          ],
          "examFocusJa": "「パフォーマンス評価及び改善」の設問では、「サービスレベル」「可用性」「測定」「改善」「KPI」「利用者満足度」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、サービスの運用や監査の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「パフォーマンス評価及び改善」相关题时，先抓服务水平、可用性、测定、改进、KPI、用户满意度是判断词。再判断题目问对象、责任、流程还是效果，并排除服务运行或审计。",
          "commonMistakeJa": "「パフォーマンス評価及び改善」をサービスの運用や監査と混同すると誤答します。特に数値を集めれば自動的に改善されると考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「パフォーマンス評価及び改善」和服务运行或审计混淆，尤其是误以为收集指标就会自动改进。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 340,
              "pdfPageEnd": 341,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-3 パフォーマンス評価及び改善",
              "anchorTermsJa": [
                "パフォーマンス評価及び改善"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、パフォーマンス評価及び改善が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「サービスレベル」「可用性」「測定」「改善」「KPI」「利用者満足度」が判断線です。その語が出たら、まず用指标监控服务绩效并持续改进质量、效率和可用性という意味に対応する日本語条件を探します。合わない場合は、サービスの運用や監査を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把性能评价与改善放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。服务水平、可用性、测定、改进、KPI、用户满意度是判断词。看到这些线索时，先判断是否符合“用指标监控服务绩效并持续改进质量、效率和可用性”；如果不符合，就可能是在让你误选服务运行或审计。",
          "englishTerms": [
            "KPI",
            "Performance Evaluation",
            "Availability",
            "Continual Improvement"
          ],
          "examFocusJa": "パフォーマンス評価及び改善の見分け方は、「サービスレベル」「可用性」「測定」「改善」「KPI」「利用者満足度」が判断線ですを文章中から拾い、サービスの運用や監査ではなくパフォーマンス評価及び改善を答えるべき条件かを確認することです。",
          "examFocusZh": "性能评价与改善的判断线索是服务水平、可用性、测定、改进、KPI、用户满意度是判断词，同时确认题干要求的是否是「パフォーマンス評価及び改善」，而不是服务运行或审计。",
          "commonMistakeJa": "パフォーマンス評価及び改善ではなくサービスの運用や監査の説明を選ぶ誤りに注意します。原因は、数値を集めれば自動的に改善されると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「パフォーマンス評価及び改善」（性能评价与改善）和服务运行或审计混淆。错误通常来自误以为收集指标就会自动改进，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 340,
              "pdfPageEnd": 341,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-3 パフォーマンス評価及び改善",
              "anchorTermsJa": [
                "パフォーマンス評価及び改善"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "KPI",
          "termZh": "KPI",
          "english": "KPI"
        },
        {
          "termJa": "Performance Evaluation",
          "termZh": "Performance Evaluation",
          "english": "Performance Evaluation"
        },
        {
          "termJa": "Availability",
          "termZh": "Availability",
          "english": "Availability"
        },
        {
          "termJa": "Continual Improvement",
          "termZh": "Continual Improvement",
          "english": "Continual Improvement"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "パフォーマンス評価及び改善とサービスの運用や監査を混同する",
          "trapZh": "把性能评价与改善和服务运行或审计混为一谈。"
        },
        {
          "trapJa": "数値を集めれば自動的に改善されると考える",
          "trapZh": "误以为收集指标就会自动改进"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 340,
          "pdfPageEnd": 341,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-3 パフォーマンス評価及び改善",
          "anchorTermsJa": [
            "パフォーマンス評価及び改善"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-2-4",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 7,
      "nativeSectionId": "6-2-4",
      "titleJa": "6-2-4 サービスの運用",
      "titleZh": "服务的運用",
      "overviewJa": "サービスの運用は、SGサービス管理分野でサービスの運用では、サービスデスク、運用監視、ジョブ管理、インシデント対応、要求対応を通じて日常サービスを維持します。障害が起きたときの復旧と、通常時の安定運用を分けて読みます。PDF 342-344ページの「サービスの運用」を定位語に、試験では「サービスデスク」「運用監視」「ジョブ管理」「インシデント」「要求対応」が判断線です。サービス計画やパフォーマンス改善との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "服务运行用于在日常运行中处理请求、事件、作业和监视，维持服务稳定。本单元依据 PDF 342-344 页的「サービスの運用」定位，重点理解：服务运行包括服务台、运行监视、作业管理、事件处理、请求处理，用于维持日常服务稳定。要区分故障恢复和通常运行。考试常用服务台、运行监视、作业管理、事件、请求处理是判断词来换说法；同时要和服务计划或性能改善区分。",
      "learningGoalJa": "問題文の条件を読み取り、「サービスの運用」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“服务的運用”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "サービスの運用を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。サービスの運用では、サービスデスク、運用監視、ジョブ管理、インシデント対応、要求対応を通じて日常サービスを維持します。障害が起きたときの復旧と、通常時の安定運用を分けて読みます。この関係を押さえると、サービスの運用は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではService Desk、Operation Monitoring、Job Management、Incident、Requestが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习服务运行时，先判断它是在讲对策、法务、审计、服务还是项目管理。服务运行包括服务台、运行监视、作业管理、事件处理、请求处理，用于维持日常服务稳定。要区分故障恢复和通常运行。这样可以把Service Desk、Operation Monitoring、Job Management、Incident、Request等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Service Desk",
            "Operation Monitoring",
            "Job Management",
            "Incident",
            "Request"
          ],
          "examFocusJa": "「サービスの運用」の設問では、「サービスデスク」「運用監視」「ジョブ管理」「インシデント」「要求対応」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、サービス計画やパフォーマンス改善の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「サービスの運用」相关题时，先抓服务台、运行监视、作业管理、事件、请求处理是判断词。再判断题目问对象、责任、流程还是效果，并排除服务计划或性能改善。",
          "commonMistakeJa": "「サービスの運用」をサービス計画やパフォーマンス改善と混同すると誤答します。特に運用を単なる障害発生後の復旧だけと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「サービスの運用」和服务计划或性能改善混淆，尤其是把服务运行只理解为故障后的恢复。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 342,
              "pdfPageEnd": 344,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-4 サービスの運用",
              "anchorTermsJa": [
                "サービスの運用"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、サービスの運用が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「サービスデスク」「運用監視」「ジョブ管理」「インシデント」「要求対応」が判断線です。その語が出たら、まず在日常运行中处理请求、事件、作业和监视，维持服务稳定という意味に対応する日本語条件を探します。合わない場合は、サービス計画やパフォーマンス改善を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把服务运行放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。服务台、运行监视、作业管理、事件、请求处理是判断词。看到这些线索时，先判断是否符合“在日常运行中处理请求、事件、作业和监视，维持服务稳定”；如果不符合，就可能是在让你误选服务计划或性能改善。",
          "englishTerms": [
            "Service Desk",
            "Operation Monitoring",
            "Job Management",
            "Incident",
            "Request"
          ],
          "examFocusJa": "サービスの運用の見分け方は、「サービスデスク」「運用監視」「ジョブ管理」「インシデント」「要求対応」が判断線ですを文章中から拾い、サービス計画やパフォーマンス改善ではなくサービスの運用を答えるべき条件かを確認することです。",
          "examFocusZh": "服务运行的判断线索是服务台、运行监视、作业管理、事件、请求处理是判断词，同时确认题干要求的是否是「サービスの運用」，而不是服务计划或性能改善。",
          "commonMistakeJa": "サービスの運用ではなくサービス計画やパフォーマンス改善の説明を選ぶ誤りに注意します。原因は、運用を単なる障害発生後の復旧だけと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「サービスの運用」（服务运行）和服务计划或性能改善混淆。错误通常来自把服务运行只理解为故障后的恢复，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 342,
              "pdfPageEnd": 344,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-4 サービスの運用",
              "anchorTermsJa": [
                "サービスの運用"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Service Desk",
          "termZh": "Service Desk",
          "english": "Service Desk"
        },
        {
          "termJa": "Operation Monitoring",
          "termZh": "Operation Monitoring",
          "english": "Operation Monitoring"
        },
        {
          "termJa": "Job Management",
          "termZh": "Job Management",
          "english": "Job Management"
        },
        {
          "termJa": "Incident",
          "termZh": "Incident",
          "english": "Incident"
        },
        {
          "termJa": "Request",
          "termZh": "Request",
          "english": "Request"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "サービスの運用とサービス計画やパフォーマンス改善を混同する",
          "trapZh": "把服务运行和服务计划或性能改善混为一谈。"
        },
        {
          "trapJa": "運用を単なる障害発生後の復旧だけと考える",
          "trapZh": "把服务运行只理解为故障后的恢复"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 342,
          "pdfPageEnd": 344,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-4 サービスの運用",
          "anchorTermsJa": [
            "サービスの運用"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-2-5",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 8,
      "nativeSectionId": "6-2-5",
      "titleJa": "6-2-5 ファシリティマネジメント",
      "titleZh": "ファシリティ管理",
      "overviewJa": "ファシリティマネジメントは、SGサービス管理分野でファシリティマネジメントでは、建物、サーバ室、電源、空調、入退室、防火、防水、耐震などを管理します。ITサービスの可用性はシステムだけでなく、設備環境にも左右されます。PDF 345ページの「ファシリティマネジメント」を定位語に、試験では「サーバ室」「電源」「空調」「防火」「入退室」「設備環境」が判断線です。ネットワークセキュリティや人的対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "设施管理用于管理机房、电源、空调、防灾和物理环境，支撑 IT 服务运行。本单元依据 PDF 345 页的「ファシリティマネジメント」定位，重点理解：设施管理管理建筑、服务器房、电源、空调、出入、防火、防水、防震等。IT 服务可用性不仅取决于系统，也取决于设备环境。考试常用服务器房、电源、空调、防火、出入、设备环境是判断词来换说法；同时要和网络安全或人的对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「ファシリティマネジメント」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“ファシリティ管理”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ファシリティマネジメントを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。ファシリティマネジメントでは、建物、サーバ室、電源、空調、入退室、防火、防水、耐震などを管理します。ITサービスの可用性はシステムだけでなく、設備環境にも左右されます。この関係を押さえると、ファシリティマネジメントは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではFacility Management、Server Room、Power Supply、Air Conditioning、Disaster Preventionが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习设施管理时，先判断它是在讲对策、法务、审计、服务还是项目管理。设施管理管理建筑、服务器房、电源、空调、出入、防火、防水、防震等。IT 服务可用性不仅取决于系统，也取决于设备环境。这样可以把Facility Management、Server Room、Power Supply、Air Conditioning、Disaster Prevention等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Facility Management",
            "Server Room",
            "Power Supply",
            "Air Conditioning",
            "Disaster Prevention"
          ],
          "examFocusJa": "「ファシリティマネジメント」の設問では、「サーバ室」「電源」「空調」「防火」「入退室」「設備環境」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、ネットワークセキュリティや人的対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「ファシリティマネジメント」相关题时，先抓服务器房、电源、空调、防火、出入、设备环境是判断词。再判断题目问对象、责任、流程还是效果，并排除网络安全或人的对策。",
          "commonMistakeJa": "「ファシリティマネジメント」をネットワークセキュリティや人的対策と混同すると誤答します。特にファシリティをソフトウェア設定だけの管理と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「ファシリティマネジメント」和网络安全或人的对策混淆，尤其是把设施管理误解成软件设置管理。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 345,
              "pdfPageEnd": 345,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-5 ファシリティマネジメント",
              "anchorTermsJa": [
                "ファシリティマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、ファシリティマネジメントが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「サーバ室」「電源」「空調」「防火」「入退室」「設備環境」が判断線です。その語が出たら、まず管理机房、电源、空调、防灾和物理环境，支撑 IT 服务运行という意味に対応する日本語条件を探します。合わない場合は、ネットワークセキュリティや人的対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把设施管理放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。服务器房、电源、空调、防火、出入、设备环境是判断词。看到这些线索时，先判断是否符合“管理机房、电源、空调、防灾和物理环境，支撑 IT 服务运行”；如果不符合，就可能是在让你误选网络安全或人的对策。",
          "englishTerms": [
            "Facility Management",
            "Server Room",
            "Power Supply",
            "Air Conditioning",
            "Disaster Prevention"
          ],
          "examFocusJa": "ファシリティマネジメントの見分け方は、「サーバ室」「電源」「空調」「防火」「入退室」「設備環境」が判断線ですを文章中から拾い、ネットワークセキュリティや人的対策ではなくファシリティマネジメントを答えるべき条件かを確認することです。",
          "examFocusZh": "设施管理的判断线索是服务器房、电源、空调、防火、出入、设备环境是判断词，同时确认题干要求的是否是「ファシリティマネジメント」，而不是网络安全或人的对策。",
          "commonMistakeJa": "ファシリティマネジメントではなくネットワークセキュリティや人的対策の説明を選ぶ誤りに注意します。原因は、ファシリティをソフトウェア設定だけの管理と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ファシリティマネジメント」（设施管理）和网络安全或人的对策混淆。错误通常来自把设施管理误解成软件设置管理，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 345,
              "pdfPageEnd": 345,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-5 ファシリティマネジメント",
              "anchorTermsJa": [
                "ファシリティマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Facility Management",
          "termZh": "Facility Management",
          "english": "Facility Management"
        },
        {
          "termJa": "Server Room",
          "termZh": "Server Room",
          "english": "Server Room"
        },
        {
          "termJa": "Power Supply",
          "termZh": "Power Supply",
          "english": "Power Supply"
        },
        {
          "termJa": "Air Conditioning",
          "termZh": "Air Conditioning",
          "english": "Air Conditioning"
        },
        {
          "termJa": "Disaster Prevention",
          "termZh": "Disaster Prevention",
          "english": "Disaster Prevention"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ファシリティマネジメントとネットワークセキュリティや人的対策を混同する",
          "trapZh": "把设施管理和网络安全或人的对策混为一谈。"
        },
        {
          "trapJa": "ファシリティをソフトウェア設定だけの管理と考える",
          "trapZh": "把设施管理误解成软件设置管理"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 345,
          "pdfPageEnd": 345,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-5 ファシリティマネジメント",
          "anchorTermsJa": [
            "ファシリティマネジメント"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-2-6",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 9,
      "nativeSectionId": "6-2-6",
      "titleJa": "6-2-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、SLA、インシデント、運用監視、改善指標、設備環境が混在します。利用者サービス、運用プロセス、物理設備のどれを問うかを分けます。PDF 346-352ページの「演習問題」を定位語に、試験では「演習問題」「SLA」「インシデント」「運用」「改善」「ファシリティ」が判断線です。プロジェクト管理や監査との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "服务管理演习问题用于检查服务管理、服务管理系统、性能评价、运行和设施管理的职责区分。本单元依据 PDF 346-352 页的「演習問題」定位，重点理解：本节演习把 SLA、事件、运行监视、改进指标、设施环境混在一起考。先判断题目问用户服务、运行流程还是物理设备。考试常用演习问题、SLA、事件、运行、改进、设施是判断词来换说法；同时要和项目管理或审计区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、SLA、インシデント、運用監視、改善指標、設備環境が混在します。利用者サービス、運用プロセス、物理設備のどれを問うかを分けます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、SLA、Incident、Operation、Facilityが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习服务管理演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习把 SLA、事件、运行监视、改进指标、设施环境混在一起考。先判断题目问用户服务、运行流程还是物理设备。这样可以把Exercise、SLA、Incident、Operation、Facility等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "SLA",
            "Incident",
            "Operation",
            "Facility"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「SLA」「インシデント」「運用」「改善」「ファシリティ」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、プロジェクト管理や監査の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、SLA、事件、运行、改进、设施是判断词。再判断题目问对象、责任、流程还是效果，并排除项目管理或审计。",
          "commonMistakeJa": "「演習問題」をプロジェクト管理や監査と混同すると誤答します。特にサービス運用とプロジェクト作業を混同する場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和项目管理或审计混淆，尤其是混淆服务运行和项目作业。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 346,
              "pdfPageEnd": 352,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-6 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「SLA」「インシデント」「運用」「改善」「ファシリティ」が判断線です。その語が出たら、まず检查服务管理、服务管理系统、性能评价、运行和设施管理的职责区分という意味に対応する日本語条件を探します。合わない場合は、プロジェクト管理や監査を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把服务管理演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、SLA、事件、运行、改进、设施是判断词。看到这些线索时，先判断是否符合“检查服务管理、服务管理系统、性能评价、运行和设施管理的职责区分”；如果不符合，就可能是在让你误选项目管理或审计。",
          "englishTerms": [
            "Exercise",
            "SLA",
            "Incident",
            "Operation",
            "Facility"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「SLA」「インシデント」「運用」「改善」「ファシリティ」が判断線ですを文章中から拾い、プロジェクト管理や監査ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "服务管理演习问题的判断线索是演习问题、SLA、事件、运行、改进、设施是判断词，同时确认题干要求的是否是「演習問題」，而不是项目管理或审计。",
          "commonMistakeJa": "演習問題ではなくプロジェクト管理や監査の説明を選ぶ誤りに注意します。原因は、サービス運用とプロジェクト作業を混同するときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（服务管理演习问题）和项目管理或审计混淆。错误通常来自混淆服务运行和项目作业，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 346,
              "pdfPageEnd": 352,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-2-6 演習問題",
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
          "termJa": "SLA",
          "termZh": "SLA",
          "english": "SLA"
        },
        {
          "termJa": "Incident",
          "termZh": "Incident",
          "english": "Incident"
        },
        {
          "termJa": "Operation",
          "termZh": "Operation",
          "english": "Operation"
        },
        {
          "termJa": "Facility",
          "termZh": "Facility",
          "english": "Facility"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題とプロジェクト管理や監査を混同する",
          "trapZh": "把服务管理演习问题和项目管理或审计混为一谈。"
        },
        {
          "trapJa": "サービス運用とプロジェクト作業を混同する",
          "trapZh": "混淆服务运行和项目作业"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 346,
          "pdfPageEnd": 352,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-2-6 演習問題",
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
      "id": "sg-6-3-1",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 10,
      "nativeSectionId": "6-3-1",
      "titleJa": "6-3-1 プロジェクトマネジメント",
      "titleZh": "6-3-1 项目管理核心：PMBOK 九大知识领域概述",
      "overviewJa": "プロジェクトマネジメントは、SGプロジェクト管理分野でプロジェクトマネジメントでは、統合、スコープ、時間、コスト、品質、資源、リスク、調達、コミュニケーション、ステークホルダを総合的に管理します。定常運用ではなく、一時的な目標達成活動として読みます。PDF 353-356ページの「プロジェクトマネジメント」を定位語に、試験では「プロジェクト」「スコープ」「時間」「コスト」「品質」「リスク」「ステークホルダ」が判断線です。サービスマネジメントや通常業務との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目管理用于在限定期限内协调范围、成本、质量、风险和沟通，达成项目目标。本单元依据 PDF 353-356 页的「プロジェクトマネジメント」定位，重点理解：项目管理综合管理整合、范围、时间、成本、质量、资源、风险、采购、沟通和干系人。它不是日常运维，而是在限定期间内达成目标的活动。考试常用项目、范围、时间、成本、质量、风险、干系人是判断词来换说法；同时要和服务管理或日常业务区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトマネジメント」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-3-1 项目管理核心：PMBOK 九大知识领域概述”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトマネジメントを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。プロジェクトマネジメントでは、統合、スコープ、時間、コスト、品質、資源、リスク、調達、コミュニケーション、ステークホルダを総合的に管理します。定常運用ではなく、一時的な目標達成活動として読みます。この関係を押さえると、プロジェクトマネジメントは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではProject Management、Scope、Time、Cost、Quality、Risk、Stakeholderが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目管理时，先判断它是在讲对策、法务、审计、服务还是项目管理。项目管理综合管理整合、范围、时间、成本、质量、资源、风险、采购、沟通和干系人。它不是日常运维，而是在限定期间内达成目标的活动。这样可以把Project Management、Scope、Time、Cost、Quality、Risk、Stakeholder等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Project Management",
            "Scope",
            "Time",
            "Cost",
            "Quality",
            "Risk",
            "Stakeholder"
          ],
          "examFocusJa": "「プロジェクトマネジメント」の設問では、「プロジェクト」「スコープ」「時間」「コスト」「品質」「リスク」「ステークホルダ」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、サービスマネジメントや通常業務の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトマネジメント」相关题时，先抓项目、范围、时间、成本、质量、风险、干系人是判断词。再判断题目问对象、责任、流程还是效果，并排除服务管理或日常业务。",
          "commonMistakeJa": "「プロジェクトマネジメント」をサービスマネジメントや通常業務と混同すると誤答します。特にプロジェクトを継続的な運用業務と同じに扱う場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトマネジメント」和服务管理或日常业务混淆，尤其是把项目当成持续运行业务。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 353,
              "pdfPageEnd": 356,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-1 プロジェクトマネジメント",
              "anchorTermsJa": [
                "プロジェクトマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトマネジメントが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「プロジェクト」「スコープ」「時間」「コスト」「品質」「リスク」「ステークホルダ」が判断線です。その語が出たら、まず在限定期限内协调范围、成本、质量、风险和沟通，达成项目目标という意味に対応する日本語条件を探します。合わない場合は、サービスマネジメントや通常業務を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目管理放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。项目、范围、时间、成本、质量、风险、干系人是判断词。看到这些线索时，先判断是否符合“在限定期限内协调范围、成本、质量、风险和沟通，达成项目目标”；如果不符合，就可能是在让你误选服务管理或日常业务。",
          "englishTerms": [
            "Project Management",
            "Scope",
            "Time",
            "Cost",
            "Quality",
            "Risk",
            "Stakeholder"
          ],
          "examFocusJa": "プロジェクトマネジメントの見分け方は、「プロジェクト」「スコープ」「時間」「コスト」「品質」「リスク」「ステークホルダ」が判断線ですを文章中から拾い、サービスマネジメントや通常業務ではなくプロジェクトマネジメントを答えるべき条件かを確認することです。",
          "examFocusZh": "项目管理的判断线索是项目、范围、时间、成本、质量、风险、干系人是判断词，同时确认题干要求的是否是「プロジェクトマネジメント」，而不是服务管理或日常业务。",
          "commonMistakeJa": "プロジェクトマネジメントではなくサービスマネジメントや通常業務の説明を選ぶ誤りに注意します。原因は、プロジェクトを継続的な運用業務と同じに扱うときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトマネジメント」（项目管理）和服务管理或日常业务混淆。错误通常来自把项目当成持续运行业务，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 353,
              "pdfPageEnd": 356,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-1 プロジェクトマネジメント",
              "anchorTermsJa": [
                "プロジェクトマネジメント"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Project Management",
          "termZh": "Project Management",
          "english": "Project Management"
        },
        {
          "termJa": "Scope",
          "termZh": "Scope",
          "english": "Scope"
        },
        {
          "termJa": "Time",
          "termZh": "Time",
          "english": "Time"
        },
        {
          "termJa": "Cost",
          "termZh": "Cost",
          "english": "Cost"
        },
        {
          "termJa": "Quality",
          "termZh": "Quality",
          "english": "Quality"
        },
        {
          "termJa": "Risk",
          "termZh": "Risk",
          "english": "Risk"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトマネジメントとサービスマネジメントや通常業務を混同する",
          "trapZh": "把项目管理和服务管理或日常业务混为一谈。"
        },
        {
          "trapJa": "プロジェクトを継続的な運用業務と同じに扱う",
          "trapZh": "把项目当成持续运行业务"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0037"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 353,
          "pdfPageEnd": 356,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-1 プロジェクトマネジメント",
          "anchorTermsJa": [
            "プロジェクトマネジメント"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-2",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 11,
      "nativeSectionId": "6-3-2",
      "titleJa": "6-3-2 プロジェクトの統合",
      "titleZh": "项目的統合",
      "overviewJa": "プロジェクトの統合は、SGプロジェクト管理分野で統合管理では、計画、実行、変更、終結を全体として調整します。個別領域の最適化ではなく、プロジェクト全体の整合性を保つことが目的です。PDF 357ページの「プロジェクトの統合」を定位語に、試験では「統合」「プロジェクト計画」「変更管理」「全体調整」「終結」が判断線です。個別領域の管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目整合用于围绕项目整合管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 357 页的「プロジェクトの統合」定位，重点理解：整合管理协调计划、执行、变更和收尾。重点不是单个领域最优，而是保持项目整体一致。考试常用整合、项目计划、变更管理、整体协调、收尾是判断词来换说法；同时要和单个领域管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトの統合」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的統合”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトの統合を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。統合管理では、計画、実行、変更、終結を全体として調整します。個別領域の最適化ではなく、プロジェクト全体の整合性を保つことが目的です。この関係を押さえると、プロジェクトの統合は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではIntegration、Change Control、Project Planが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目整合时，先判断它是在讲对策、法务、审计、服务还是项目管理。整合管理协调计划、执行、变更和收尾。重点不是单个领域最优，而是保持项目整体一致。这样可以把Integration、Change Control、Project Plan等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Integration",
            "Change Control",
            "Project Plan"
          ],
          "examFocusJa": "「プロジェクトの統合」の設問では、「統合」「プロジェクト計画」「変更管理」「全体調整」「終結」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、個別領域の管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトの統合」相关题时，先抓整合、项目计划、变更管理、整体协调、收尾是判断词。再判断题目问对象、责任、流程还是效果，并排除单个领域管理。",
          "commonMistakeJa": "「プロジェクトの統合」を個別領域の管理と混同すると誤答します。特に変更を各担当者が自由に処理してよいと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトの統合」和单个领域管理混淆，尤其是误以为变更可由各负责人自由处理。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 357,
              "pdfPageEnd": 357,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-2 プロジェクトの統合",
              "anchorTermsJa": [
                "プロジェクトの統合"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトの統合が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「統合」「プロジェクト計画」「変更管理」「全体調整」「終結」が判断線です。その語が出たら、まず围绕项目整合管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、個別領域の管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目整合放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。整合、项目计划、变更管理、整体协调、收尾是判断词。看到这些线索时，先判断是否符合“围绕项目整合管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选单个领域管理。",
          "englishTerms": [
            "Integration",
            "Change Control",
            "Project Plan"
          ],
          "examFocusJa": "プロジェクトの統合の見分け方は、「統合」「プロジェクト計画」「変更管理」「全体調整」「終結」が判断線ですを文章中から拾い、個別領域の管理ではなくプロジェクトの統合を答えるべき条件かを確認することです。",
          "examFocusZh": "项目整合的判断线索是整合、项目计划、变更管理、整体协调、收尾是判断词，同时确认题干要求的是否是「プロジェクトの統合」，而不是单个领域管理。",
          "commonMistakeJa": "プロジェクトの統合ではなく個別領域の管理の説明を選ぶ誤りに注意します。原因は、変更を各担当者が自由に処理してよいと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトの統合」（项目整合）和单个领域管理混淆。错误通常来自误以为变更可由各负责人自由处理，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 357,
              "pdfPageEnd": 357,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-2 プロジェクトの統合",
              "anchorTermsJa": [
                "プロジェクトの統合"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Integration",
          "termZh": "Integration",
          "english": "Integration"
        },
        {
          "termJa": "Change Control",
          "termZh": "Change Control",
          "english": "Change Control"
        },
        {
          "termJa": "Project Plan",
          "termZh": "Project Plan",
          "english": "Project Plan"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトの統合と個別領域の管理を混同する",
          "trapZh": "把项目整合和单个领域管理混为一谈。"
        },
        {
          "trapJa": "変更を各担当者が自由に処理してよいと考える",
          "trapZh": "误以为变更可由各负责人自由处理"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 357,
          "pdfPageEnd": 357,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-2 プロジェクトの統合",
          "anchorTermsJa": [
            "プロジェクトの統合"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-3",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 12,
      "nativeSectionId": "6-3-3",
      "titleJa": "6-3-3 プロジェクトのステークホルダ",
      "titleZh": "项目的ステークホルダ",
      "overviewJa": "プロジェクトのステークホルダは、SGプロジェクト管理分野でステークホルダ管理では、利害関係者を識別し、期待、影響度、関与方法を整理します。誰の承認や合意が必要かを読むことが重要です。PDF 358ページの「プロジェクトのステークホルダ」を定位語に、試験では「ステークホルダ」「利害関係者」「期待」「影響度」「合意」が判断線です。コミュニケーション管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目干系人用于围绕项目干系人管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 358 页的「プロジェクトのステークホルダ」定位，重点理解：干系人管理识别利害关系者，整理期待、影响度和参与方式。要看谁需要批准、谁会受影响。考试常用干系人、利害关系者、期待、影响度、合意是判断词来换说法；同时要和沟通管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトのステークホルダ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的ステークホルダ”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトのステークホルダを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。ステークホルダ管理では、利害関係者を識別し、期待、影響度、関与方法を整理します。誰の承認や合意が必要かを読むことが重要です。この関係を押さえると、プロジェクトのステークホルダは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではStakeholder、Engagement、Influenceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目干系人时，先判断它是在讲对策、法务、审计、服务还是项目管理。干系人管理识别利害关系者，整理期待、影响度和参与方式。要看谁需要批准、谁会受影响。这样可以把Stakeholder、Engagement、Influence等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Stakeholder",
            "Engagement",
            "Influence"
          ],
          "examFocusJa": "「プロジェクトのステークホルダ」の設問では、「ステークホルダ」「利害関係者」「期待」「影響度」「合意」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、コミュニケーション管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトのステークホルダ」相关题时，先抓干系人、利害关系者、期待、影响度、合意是判断词。再判断题目问对象、责任、流程还是效果，并排除沟通管理。",
          "commonMistakeJa": "「プロジェクトのステークホルダ」をコミュニケーション管理と混同すると誤答します。特に利用者だけがステークホルダだと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトのステークホルダ」和沟通管理混淆，尤其是误以为只有用户才是干系人。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 358,
              "pdfPageEnd": 358,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-3 プロジェクトのステークホルダ",
              "anchorTermsJa": [
                "プロジェクトのステークホルダ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトのステークホルダが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「ステークホルダ」「利害関係者」「期待」「影響度」「合意」が判断線です。その語が出たら、まず围绕项目干系人管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、コミュニケーション管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目干系人放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。干系人、利害关系者、期待、影响度、合意是判断词。看到这些线索时，先判断是否符合“围绕项目干系人管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选沟通管理。",
          "englishTerms": [
            "Stakeholder",
            "Engagement",
            "Influence"
          ],
          "examFocusJa": "プロジェクトのステークホルダの見分け方は、「ステークホルダ」「利害関係者」「期待」「影響度」「合意」が判断線ですを文章中から拾い、コミュニケーション管理ではなくプロジェクトのステークホルダを答えるべき条件かを確認することです。",
          "examFocusZh": "项目干系人的判断线索是干系人、利害关系者、期待、影响度、合意是判断词，同时确认题干要求的是否是「プロジェクトのステークホルダ」，而不是沟通管理。",
          "commonMistakeJa": "プロジェクトのステークホルダではなくコミュニケーション管理の説明を選ぶ誤りに注意します。原因は、利用者だけがステークホルダだと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトのステークホルダ」（项目干系人）和沟通管理混淆。错误通常来自误以为只有用户才是干系人，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 358,
              "pdfPageEnd": 358,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-3 プロジェクトのステークホルダ",
              "anchorTermsJa": [
                "プロジェクトのステークホルダ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Stakeholder",
          "termZh": "Stakeholder",
          "english": "Stakeholder"
        },
        {
          "termJa": "Engagement",
          "termZh": "Engagement",
          "english": "Engagement"
        },
        {
          "termJa": "Influence",
          "termZh": "Influence",
          "english": "Influence"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトのステークホルダとコミュニケーション管理を混同する",
          "trapZh": "把项目干系人和沟通管理混为一谈。"
        },
        {
          "trapJa": "利用者だけがステークホルダだと考える",
          "trapZh": "误以为只有用户才是干系人"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 358,
          "pdfPageEnd": 358,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-3 プロジェクトのステークホルダ",
          "anchorTermsJa": [
            "プロジェクトのステークホルダ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-4",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 13,
      "nativeSectionId": "6-3-4",
      "titleJa": "6-3-4 プロジェクトのスコープ",
      "titleZh": "项目的スコープ",
      "overviewJa": "プロジェクトのスコープは、SGプロジェクト管理分野でスコープ管理では、成果物と作業範囲を定義し、範囲外の要求や変更を管理します。WBSは作業分解の重要な道具です。PDF 359-360ページの「プロジェクトのスコープ」を定位語に、試験では「スコープ」「成果物」「WBS」「範囲変更」「要求」が判断線です。時間管理やコスト管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目范围用于围绕项目范围管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 359-360 页的「プロジェクトのスコープ」定位，重点理解：范围管理定义成果物和工作范围，并管理范围外需求或变更。WBS 是拆解工作的核心工具。考试常用范围、成果物、WBS、范围变更、需求是判断词来换说法；同时要和时间管理或成本管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトのスコープ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的スコープ”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトのスコープを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。スコープ管理では、成果物と作業範囲を定義し、範囲外の要求や変更を管理します。WBSは作業分解の重要な道具です。この関係を押さえると、プロジェクトのスコープは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではScope、WBS、Deliverable、Scope Changeが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目范围时，先判断它是在讲对策、法务、审计、服务还是项目管理。范围管理定义成果物和工作范围，并管理范围外需求或变更。WBS 是拆解工作的核心工具。这样可以把Scope、WBS、Deliverable、Scope Change等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Scope",
            "WBS",
            "Deliverable",
            "Scope Change"
          ],
          "examFocusJa": "「プロジェクトのスコープ」の設問では、「スコープ」「成果物」「WBS」「範囲変更」「要求」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、時間管理やコスト管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトのスコープ」相关题时，先抓范围、成果物、WBS、范围变更、需求是判断词。再判断题目问对象、责任、流程还是效果，并排除时间管理或成本管理。",
          "commonMistakeJa": "「プロジェクトのスコープ」を時間管理やコスト管理と混同すると誤答します。特に追加要求をすべて無条件に受ける場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトのスコープ」和时间管理或成本管理混淆，尤其是无条件接受所有追加需求。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 359,
              "pdfPageEnd": 360,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-4 プロジェクトのスコープ",
              "anchorTermsJa": [
                "プロジェクトのスコープ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトのスコープが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「スコープ」「成果物」「WBS」「範囲変更」「要求」が判断線です。その語が出たら、まず围绕项目范围管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、時間管理やコスト管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目范围放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。范围、成果物、WBS、范围变更、需求是判断词。看到这些线索时，先判断是否符合“围绕项目范围管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选时间管理或成本管理。",
          "englishTerms": [
            "Scope",
            "WBS",
            "Deliverable",
            "Scope Change"
          ],
          "examFocusJa": "プロジェクトのスコープの見分け方は、「スコープ」「成果物」「WBS」「範囲変更」「要求」が判断線ですを文章中から拾い、時間管理やコスト管理ではなくプロジェクトのスコープを答えるべき条件かを確認することです。",
          "examFocusZh": "项目范围的判断线索是范围、成果物、WBS、范围变更、需求是判断词，同时确认题干要求的是否是「プロジェクトのスコープ」，而不是时间管理或成本管理。",
          "commonMistakeJa": "プロジェクトのスコープではなく時間管理やコスト管理の説明を選ぶ誤りに注意します。原因は、追加要求をすべて無条件に受けるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトのスコープ」（项目范围）和时间管理或成本管理混淆。错误通常来自无条件接受所有追加需求，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 359,
              "pdfPageEnd": 360,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-4 プロジェクトのスコープ",
              "anchorTermsJa": [
                "プロジェクトのスコープ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Scope",
          "termZh": "Scope",
          "english": "Scope"
        },
        {
          "termJa": "WBS",
          "termZh": "WBS",
          "english": "WBS"
        },
        {
          "termJa": "Deliverable",
          "termZh": "Deliverable",
          "english": "Deliverable"
        },
        {
          "termJa": "Scope Change",
          "termZh": "Scope Change",
          "english": "Scope Change"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトのスコープと時間管理やコスト管理を混同する",
          "trapZh": "把项目范围和时间管理或成本管理混为一谈。"
        },
        {
          "trapJa": "追加要求をすべて無条件に受ける",
          "trapZh": "无条件接受所有追加需求"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 359,
          "pdfPageEnd": 360,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-4 プロジェクトのスコープ",
          "anchorTermsJa": [
            "プロジェクトのスコープ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-5",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 14,
      "nativeSectionId": "6-3-5",
      "titleJa": "6-3-5 プロジェクトの資源",
      "titleZh": "项目的資源",
      "overviewJa": "プロジェクトの資源は、SGプロジェクト管理分野で資源管理では、人員、設備、材料、スキルを計画し、必要な時期に確保します。担当割当と能力の不足を管理します。PDF 361ページの「プロジェクトの資源」を定位語に、試験では「資源」「要員」「スキル」「設備」「割当」が判断線です。調達管理やコスト管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目资源用于围绕项目资源管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 361 页的「プロジェクトの資源」定位，重点理解：资源管理计划人员、设备、材料和技能，并在需要时 확보。要管理分工和能力不足。考试常用资源、人员、技能、设备、分配是判断词来换说法；同时要和采购管理或成本管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトの資源」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的資源”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトの資源を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。資源管理では、人員、設備、材料、スキルを計画し、必要な時期に確保します。担当割当と能力の不足を管理します。この関係を押さえると、プロジェクトの資源は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではResource、Team、Skill、Assignmentが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目资源时，先判断它是在讲对策、法务、审计、服务还是项目管理。资源管理计划人员、设备、材料和技能，并在需要时 확보。要管理分工和能力不足。这样可以把Resource、Team、Skill、Assignment等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Resource",
            "Team",
            "Skill",
            "Assignment"
          ],
          "examFocusJa": "「プロジェクトの資源」の設問では、「資源」「要員」「スキル」「設備」「割当」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、調達管理やコスト管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトの資源」相关题时，先抓资源、人员、技能、设备、分配是判断词。再判断题目问对象、责任、流程还是效果，并排除采购管理或成本管理。",
          "commonMistakeJa": "「プロジェクトの資源」を調達管理やコスト管理と混同すると誤答します。特に資源を費用だけの問題と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトの資源」和采购管理或成本管理混淆，尤其是把资源只理解成费用问题。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 361,
              "pdfPageEnd": 361,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-5 プロジェクトの資源",
              "anchorTermsJa": [
                "プロジェクトの資源"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトの資源が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「資源」「要員」「スキル」「設備」「割当」が判断線です。その語が出たら、まず围绕项目资源管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、調達管理やコスト管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目资源放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。资源、人员、技能、设备、分配是判断词。看到这些线索时，先判断是否符合“围绕项目资源管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选采购管理或成本管理。",
          "englishTerms": [
            "Resource",
            "Team",
            "Skill",
            "Assignment"
          ],
          "examFocusJa": "プロジェクトの資源の見分け方は、「資源」「要員」「スキル」「設備」「割当」が判断線ですを文章中から拾い、調達管理やコスト管理ではなくプロジェクトの資源を答えるべき条件かを確認することです。",
          "examFocusZh": "项目资源的判断线索是资源、人员、技能、设备、分配是判断词，同时确认题干要求的是否是「プロジェクトの資源」，而不是采购管理或成本管理。",
          "commonMistakeJa": "プロジェクトの資源ではなく調達管理やコスト管理の説明を選ぶ誤りに注意します。原因は、資源を費用だけの問題と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトの資源」（项目资源）和采购管理或成本管理混淆。错误通常来自把资源只理解成费用问题，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 361,
              "pdfPageEnd": 361,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-5 プロジェクトの資源",
              "anchorTermsJa": [
                "プロジェクトの資源"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Resource",
          "termZh": "Resource",
          "english": "Resource"
        },
        {
          "termJa": "Team",
          "termZh": "Team",
          "english": "Team"
        },
        {
          "termJa": "Skill",
          "termZh": "Skill",
          "english": "Skill"
        },
        {
          "termJa": "Assignment",
          "termZh": "Assignment",
          "english": "Assignment"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトの資源と調達管理やコスト管理を混同する",
          "trapZh": "把项目资源和采购管理或成本管理混为一谈。"
        },
        {
          "trapJa": "資源を費用だけの問題と考える",
          "trapZh": "把资源只理解成费用问题"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 361,
          "pdfPageEnd": 361,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-5 プロジェクトの資源",
          "anchorTermsJa": [
            "プロジェクトの資源"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-6",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 15,
      "nativeSectionId": "6-3-6",
      "titleJa": "6-3-6 プロジェクトの時間",
      "titleZh": "项目的時間",
      "overviewJa": "プロジェクトの時間は、SGプロジェクト管理分野で時間管理では、作業順序、所要期間、日程、クリティカルパスを管理します。納期へ影響する遅延を早く見つけることが重要です。PDF 362-364ページの「プロジェクトの時間」を定位語に、試験では「日程」「作業順序」「所要期間」「クリティカルパス」「遅延」が判断線です。スコープ管理やコスト管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目时间用于围绕项目时间管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 362-364 页的「プロジェクトの時間」定位，重点理解：时间管理负责作业顺序、所需期间、日程和关键路径。关键是尽早发现影响交付的延误。考试常用日程、作业顺序、所需期间、关键路径、延误是判断词来换说法；同时要和范围管理或成本管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトの時間」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的時間”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトの時間を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。時間管理では、作業順序、所要期間、日程、クリティカルパスを管理します。納期へ影響する遅延を早く見つけることが重要です。この関係を押さえると、プロジェクトの時間は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではSchedule、Critical Path、Duration、Delayが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目时间时，先判断它是在讲对策、法务、审计、服务还是项目管理。时间管理负责作业顺序、所需期间、日程和关键路径。关键是尽早发现影响交付的延误。这样可以把Schedule、Critical Path、Duration、Delay等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Schedule",
            "Critical Path",
            "Duration",
            "Delay"
          ],
          "examFocusJa": "「プロジェクトの時間」の設問では、「日程」「作業順序」「所要期間」「クリティカルパス」「遅延」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、スコープ管理やコスト管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトの時間」相关题时，先抓日程、作业顺序、所需期间、关键路径、延误是判断词。再判断题目问对象、责任、流程还是效果，并排除范围管理或成本管理。",
          "commonMistakeJa": "「プロジェクトの時間」をスコープ管理やコスト管理と混同すると誤答します。特にクリティカルパスを最短作業列と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトの時間」和范围管理或成本管理混淆，尤其是把关键路径误认为最短作业链。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 362,
              "pdfPageEnd": 364,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-6 プロジェクトの時間",
              "anchorTermsJa": [
                "プロジェクトの時間"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトの時間が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「日程」「作業順序」「所要期間」「クリティカルパス」「遅延」が判断線です。その語が出たら、まず围绕项目时间管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、スコープ管理やコスト管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目时间放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。日程、作业顺序、所需期间、关键路径、延误是判断词。看到这些线索时，先判断是否符合“围绕项目时间管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选范围管理或成本管理。",
          "englishTerms": [
            "Schedule",
            "Critical Path",
            "Duration",
            "Delay"
          ],
          "examFocusJa": "プロジェクトの時間の見分け方は、「日程」「作業順序」「所要期間」「クリティカルパス」「遅延」が判断線ですを文章中から拾い、スコープ管理やコスト管理ではなくプロジェクトの時間を答えるべき条件かを確認することです。",
          "examFocusZh": "项目时间的判断线索是日程、作业顺序、所需期间、关键路径、延误是判断词，同时确认题干要求的是否是「プロジェクトの時間」，而不是范围管理或成本管理。",
          "commonMistakeJa": "プロジェクトの時間ではなくスコープ管理やコスト管理の説明を選ぶ誤りに注意します。原因は、クリティカルパスを最短作業列と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトの時間」（项目时间）和范围管理或成本管理混淆。错误通常来自把关键路径误认为最短作业链，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 362,
              "pdfPageEnd": 364,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-6 プロジェクトの時間",
              "anchorTermsJa": [
                "プロジェクトの時間"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Schedule",
          "termZh": "Schedule",
          "english": "Schedule"
        },
        {
          "termJa": "Critical Path",
          "termZh": "Critical Path",
          "english": "Critical Path"
        },
        {
          "termJa": "Duration",
          "termZh": "Duration",
          "english": "Duration"
        },
        {
          "termJa": "Delay",
          "termZh": "Delay",
          "english": "Delay"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトの時間とスコープ管理やコスト管理を混同する",
          "trapZh": "把项目时间和范围管理或成本管理混为一谈。"
        },
        {
          "trapJa": "クリティカルパスを最短作業列と考える",
          "trapZh": "把关键路径误认为最短作业链"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 362,
          "pdfPageEnd": 364,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-6 プロジェクトの時間",
          "anchorTermsJa": [
            "プロジェクトの時間"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-7",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 16,
      "nativeSectionId": "6-3-7",
      "titleJa": "6-3-7 プロジェクトのコスト",
      "titleZh": "项目的コスト",
      "overviewJa": "プロジェクトのコストは、SGプロジェクト管理分野でコスト管理では、見積り、予算化、実績管理、差異分析を行います。費用超過の兆候を早く捉え、変更や範囲と連動して判断します。PDF 365-366ページの「プロジェクトのコスト」を定位語に、試験では「見積り」「予算」「実績」「差異」「費用超過」が判断線です。時間管理や調達管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目成本用于围绕项目成本管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 365-366 页的「プロジェクトのコスト」定位，重点理解：成本管理包括估算、预算化、实绩管理和差异分析。要尽早发现超支迹象，并和变更、范围联动判断。考试常用估算、预算、实绩、差异、超支是判断词来换说法；同时要和时间管理或采购管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトのコスト」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的コスト”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトのコストを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。コスト管理では、見積り、予算化、実績管理、差異分析を行います。費用超過の兆候を早く捉え、変更や範囲と連動して判断します。この関係を押さえると、プロジェクトのコストは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではCost、Budget、Estimate、Varianceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目成本时，先判断它是在讲对策、法务、审计、服务还是项目管理。成本管理包括估算、预算化、实绩管理和差异分析。要尽早发现超支迹象，并和变更、范围联动判断。这样可以把Cost、Budget、Estimate、Variance等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Cost",
            "Budget",
            "Estimate",
            "Variance"
          ],
          "examFocusJa": "「プロジェクトのコスト」の設問では、「見積り」「予算」「実績」「差異」「費用超過」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、時間管理や調達管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトのコスト」相关题时，先抓估算、预算、实绩、差异、超支是判断词。再判断题目问对象、责任、流程还是效果，并排除时间管理或采购管理。",
          "commonMistakeJa": "「プロジェクトのコスト」を時間管理や調達管理と混同すると誤答します。特に安い選択肢が常に最適と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトのコスト」和时间管理或采购管理混淆，尤其是误以为最便宜就一定最优。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 365,
              "pdfPageEnd": 366,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-7 プロジェクトのコスト",
              "anchorTermsJa": [
                "プロジェクトのコスト"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトのコストが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「見積り」「予算」「実績」「差異」「費用超過」が判断線です。その語が出たら、まず围绕项目成本管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、時間管理や調達管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目成本放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。估算、预算、实绩、差异、超支是判断词。看到这些线索时，先判断是否符合“围绕项目成本管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选时间管理或采购管理。",
          "englishTerms": [
            "Cost",
            "Budget",
            "Estimate",
            "Variance"
          ],
          "examFocusJa": "プロジェクトのコストの見分け方は、「見積り」「予算」「実績」「差異」「費用超過」が判断線ですを文章中から拾い、時間管理や調達管理ではなくプロジェクトのコストを答えるべき条件かを確認することです。",
          "examFocusZh": "项目成本的判断线索是估算、预算、实绩、差异、超支是判断词，同时确认题干要求的是否是「プロジェクトのコスト」，而不是时间管理或采购管理。",
          "commonMistakeJa": "プロジェクトのコストではなく時間管理や調達管理の説明を選ぶ誤りに注意します。原因は、安い選択肢が常に最適と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトのコスト」（项目成本）和时间管理或采购管理混淆。错误通常来自误以为最便宜就一定最优，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 365,
              "pdfPageEnd": 366,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-7 プロジェクトのコスト",
              "anchorTermsJa": [
                "プロジェクトのコスト"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Cost",
          "termZh": "Cost",
          "english": "Cost"
        },
        {
          "termJa": "Budget",
          "termZh": "Budget",
          "english": "Budget"
        },
        {
          "termJa": "Estimate",
          "termZh": "Estimate",
          "english": "Estimate"
        },
        {
          "termJa": "Variance",
          "termZh": "Variance",
          "english": "Variance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトのコストと時間管理や調達管理を混同する",
          "trapZh": "把项目成本和时间管理或采购管理混为一谈。"
        },
        {
          "trapJa": "安い選択肢が常に最適と考える",
          "trapZh": "误以为最便宜就一定最优"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 365,
          "pdfPageEnd": 366,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-7 プロジェクトのコスト",
          "anchorTermsJa": [
            "プロジェクトのコスト"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-8",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 17,
      "nativeSectionId": "6-3-8",
      "titleJa": "6-3-8 プロジェクトのリスク",
      "titleZh": "项目的风险",
      "overviewJa": "プロジェクトのリスクは、SGプロジェクト管理分野でリスク管理では、不確実な事象を識別し、発生可能性と影響を評価し、対応策を準備します。問題が起きてからの対応だけではありません。PDF 367-368ページの「プロジェクトのリスク」を定位語に、試験では「リスク」「発生可能性」「影響」「回避」「低減」「移転」が判断線です。品質管理や課題管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目风险用于围绕项目风险管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 367-368 页的「プロジェクトのリスク」定位，重点理解：风险管理识别不确定事件，评价发生可能性和影响，并准备应对措施。它不是问题发生后才处理。考试常用风险、发生可能性、影响、回避、降低、转移是判断词来换说法；同时要和质量管理或课题管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトのリスク」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的风险”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトのリスクを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。リスク管理では、不確実な事象を識別し、発生可能性と影響を評価し、対応策を準備します。問題が起きてからの対応だけではありません。この関係を押さえると、プロジェクトのリスクは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではRisk、Likelihood、Impact、Mitigationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目风险时，先判断它是在讲对策、法务、审计、服务还是项目管理。风险管理识别不确定事件，评价发生可能性和影响，并准备应对措施。它不是问题发生后才处理。这样可以把Risk、Likelihood、Impact、Mitigation等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Risk",
            "Likelihood",
            "Impact",
            "Mitigation"
          ],
          "examFocusJa": "「プロジェクトのリスク」の設問では、「リスク」「発生可能性」「影響」「回避」「低減」「移転」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、品質管理や課題管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトのリスク」相关题时，先抓风险、发生可能性、影响、回避、降低、转移是判断词。再判断题目问对象、责任、流程还是效果，并排除质量管理或课题管理。",
          "commonMistakeJa": "「プロジェクトのリスク」を品質管理や課題管理と混同すると誤答します。特に発生済みの問題だけをリスクと呼ぶ場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトのリスク」和质量管理或课题管理混淆，尤其是把已经发生的问题才叫风险。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 367,
              "pdfPageEnd": 368,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-8 プロジェクトのリスク",
              "anchorTermsJa": [
                "プロジェクトのリスク"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトのリスクが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「リスク」「発生可能性」「影響」「回避」「低減」「移転」が判断線です。その語が出たら、まず围绕项目风险管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、品質管理や課題管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目风险放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。风险、发生可能性、影响、回避、降低、转移是判断词。看到这些线索时，先判断是否符合“围绕项目风险管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选质量管理或课题管理。",
          "englishTerms": [
            "Risk",
            "Likelihood",
            "Impact",
            "Mitigation"
          ],
          "examFocusJa": "プロジェクトのリスクの見分け方は、「リスク」「発生可能性」「影響」「回避」「低減」「移転」が判断線ですを文章中から拾い、品質管理や課題管理ではなくプロジェクトのリスクを答えるべき条件かを確認することです。",
          "examFocusZh": "项目风险的判断线索是风险、发生可能性、影响、回避、降低、转移是判断词，同时确认题干要求的是否是「プロジェクトのリスク」，而不是质量管理或课题管理。",
          "commonMistakeJa": "プロジェクトのリスクではなく品質管理や課題管理の説明を選ぶ誤りに注意します。原因は、発生済みの問題だけをリスクと呼ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトのリスク」（项目风险）和质量管理或课题管理混淆。错误通常来自把已经发生的问题才叫风险，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 367,
              "pdfPageEnd": 368,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-8 プロジェクトのリスク",
              "anchorTermsJa": [
                "プロジェクトのリスク"
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
          "termJa": "Likelihood",
          "termZh": "Likelihood",
          "english": "Likelihood"
        },
        {
          "termJa": "Impact",
          "termZh": "Impact",
          "english": "Impact"
        },
        {
          "termJa": "Mitigation",
          "termZh": "Mitigation",
          "english": "Mitigation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトのリスクと品質管理や課題管理を混同する",
          "trapZh": "把项目风险和质量管理或课题管理混为一谈。"
        },
        {
          "trapJa": "発生済みの問題だけをリスクと呼ぶ",
          "trapZh": "把已经发生的问题才叫风险"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 367,
          "pdfPageEnd": 368,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-8 プロジェクトのリスク",
          "anchorTermsJa": [
            "プロジェクトのリスク"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-9",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 18,
      "nativeSectionId": "6-3-9",
      "titleJa": "6-3-9 プロジェクトの品質",
      "titleZh": "项目的品質",
      "overviewJa": "プロジェクトの品質は、SGプロジェクト管理分野で品質管理では、成果物が要求を満たすか、プロセスが適切かを確認します。検査だけでなく品質計画と予防も含みます。PDF 369-370ページの「プロジェクトの品質」を定位語に、試験では「品質」「要求適合」「レビュー」「検査」「品質保証」が判断線です。スコープ管理やテスト工程との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目质量用于围绕项目质量管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 369-370 页的「プロジェクトの品質」定位，重点理解：质量管理确认成果物是否满足需求、过程是否适当。不只是检查，还包括质量计划和预防。考试常用质量、需求符合、评审、检查、质量保证是判断词来换说法；同时要和范围管理或测试工程区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトの品質」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的品質”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトの品質を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。品質管理では、成果物が要求を満たすか、プロセスが適切かを確認します。検査だけでなく品質計画と予防も含みます。この関係を押さえると、プロジェクトの品質は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではQuality、Review、Inspection、Quality Assuranceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目质量时，先判断它是在讲对策、法务、审计、服务还是项目管理。质量管理确认成果物是否满足需求、过程是否适当。不只是检查，还包括质量计划和预防。这样可以把Quality、Review、Inspection、Quality Assurance等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Quality",
            "Review",
            "Inspection",
            "Quality Assurance"
          ],
          "examFocusJa": "「プロジェクトの品質」の設問では、「品質」「要求適合」「レビュー」「検査」「品質保証」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、スコープ管理やテスト工程の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトの品質」相关题时，先抓质量、需求符合、评审、检查、质量保证是判断词。再判断题目问对象、责任、流程还是效果，并排除范围管理或测试工程。",
          "commonMistakeJa": "「プロジェクトの品質」をスコープ管理やテスト工程と混同すると誤答します。特に品質をバグ件数だけで判断する場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトの品質」和范围管理或测试工程混淆，尤其是只用缺陷数量判断质量。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 369,
              "pdfPageEnd": 370,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-9 プロジェクトの品質",
              "anchorTermsJa": [
                "プロジェクトの品質"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトの品質が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「品質」「要求適合」「レビュー」「検査」「品質保証」が判断線です。その語が出たら、まず围绕项目质量管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、スコープ管理やテスト工程を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目质量放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。质量、需求符合、评审、检查、质量保证是判断词。看到这些线索时，先判断是否符合“围绕项目质量管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选范围管理或测试工程。",
          "englishTerms": [
            "Quality",
            "Review",
            "Inspection",
            "Quality Assurance"
          ],
          "examFocusJa": "プロジェクトの品質の見分け方は、「品質」「要求適合」「レビュー」「検査」「品質保証」が判断線ですを文章中から拾い、スコープ管理やテスト工程ではなくプロジェクトの品質を答えるべき条件かを確認することです。",
          "examFocusZh": "项目质量的判断线索是质量、需求符合、评审、检查、质量保证是判断词，同时确认题干要求的是否是「プロジェクトの品質」，而不是范围管理或测试工程。",
          "commonMistakeJa": "プロジェクトの品質ではなくスコープ管理やテスト工程の説明を選ぶ誤りに注意します。原因は、品質をバグ件数だけで判断するときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトの品質」（项目质量）和范围管理或测试工程混淆。错误通常来自只用缺陷数量判断质量，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 369,
              "pdfPageEnd": 370,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-9 プロジェクトの品質",
              "anchorTermsJa": [
                "プロジェクトの品質"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Quality",
          "termZh": "Quality",
          "english": "Quality"
        },
        {
          "termJa": "Review",
          "termZh": "Review",
          "english": "Review"
        },
        {
          "termJa": "Inspection",
          "termZh": "Inspection",
          "english": "Inspection"
        },
        {
          "termJa": "Quality Assurance",
          "termZh": "Quality Assurance",
          "english": "Quality Assurance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトの品質とスコープ管理やテスト工程を混同する",
          "trapZh": "把项目质量和范围管理或测试工程混为一谈。"
        },
        {
          "trapJa": "品質をバグ件数だけで判断する",
          "trapZh": "只用缺陷数量判断质量"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 369,
          "pdfPageEnd": 370,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-9 プロジェクトの品質",
          "anchorTermsJa": [
            "プロジェクトの品質"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-10",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 19,
      "nativeSectionId": "6-3-10",
      "titleJa": "6-3-10 プロジェクトの調達",
      "titleZh": "项目的調達",
      "overviewJa": "プロジェクトの調達は、SGプロジェクト管理分野で調達管理では、外部から製品やサービスを取得するため、契約、発注、納品、検収を管理します。自社作業と外部委託を分けて読みます。PDF 371ページの「プロジェクトの調達」を定位語に、試験では「調達」「契約」「発注」「納品」「検収」「委託先」が判断線です。資源管理やコスト管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目采购用于围绕项目采购管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 371 页的「プロジェクトの調達」定位，重点理解：采购管理负责从外部取得产品或服务，包括合同、发包、交付和验收。要区分内部作业和外部委托。考试常用采购、合同、发包、交付、验收、委托方是判断词来换说法；同时要和资源管理或成本管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトの調達」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的調達”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトの調達を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。調達管理では、外部から製品やサービスを取得するため、契約、発注、納品、検収を管理します。自社作業と外部委託を分けて読みます。この関係を押さえると、プロジェクトの調達は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではProcurement、Contract、Supplier、Acceptanceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目采购时，先判断它是在讲对策、法务、审计、服务还是项目管理。采购管理负责从外部取得产品或服务，包括合同、发包、交付和验收。要区分内部作业和外部委托。这样可以把Procurement、Contract、Supplier、Acceptance等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Procurement",
            "Contract",
            "Supplier",
            "Acceptance"
          ],
          "examFocusJa": "「プロジェクトの調達」の設問では、「調達」「契約」「発注」「納品」「検収」「委託先」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、資源管理やコスト管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトの調達」相关题时，先抓采购、合同、发包、交付、验收、委托方是判断词。再判断题目问对象、责任、流程还是效果，并排除资源管理或成本管理。",
          "commonMistakeJa": "「プロジェクトの調達」を資源管理やコスト管理と混同すると誤答します。特に調達を単なる購入価格の比較と考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトの調達」和资源管理或成本管理混淆，尤其是把采购只理解成比较购买价格。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 371,
              "pdfPageEnd": 371,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-10 プロジェクトの調達",
              "anchorTermsJa": [
                "プロジェクトの調達"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトの調達が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「調達」「契約」「発注」「納品」「検収」「委託先」が判断線です。その語が出たら、まず围绕项目采购管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、資源管理やコスト管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目采购放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。采购、合同、发包、交付、验收、委托方是判断词。看到这些线索时，先判断是否符合“围绕项目采购管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选资源管理或成本管理。",
          "englishTerms": [
            "Procurement",
            "Contract",
            "Supplier",
            "Acceptance"
          ],
          "examFocusJa": "プロジェクトの調達の見分け方は、「調達」「契約」「発注」「納品」「検収」「委託先」が判断線ですを文章中から拾い、資源管理やコスト管理ではなくプロジェクトの調達を答えるべき条件かを確認することです。",
          "examFocusZh": "项目采购的判断线索是采购、合同、发包、交付、验收、委托方是判断词，同时确认题干要求的是否是「プロジェクトの調達」，而不是资源管理或成本管理。",
          "commonMistakeJa": "プロジェクトの調達ではなく資源管理やコスト管理の説明を選ぶ誤りに注意します。原因は、調達を単なる購入価格の比較と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトの調達」（项目采购）和资源管理或成本管理混淆。错误通常来自把采购只理解成比较购买价格，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 371,
              "pdfPageEnd": 371,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-10 プロジェクトの調達",
              "anchorTermsJa": [
                "プロジェクトの調達"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Procurement",
          "termZh": "Procurement",
          "english": "Procurement"
        },
        {
          "termJa": "Contract",
          "termZh": "Contract",
          "english": "Contract"
        },
        {
          "termJa": "Supplier",
          "termZh": "Supplier",
          "english": "Supplier"
        },
        {
          "termJa": "Acceptance",
          "termZh": "Acceptance",
          "english": "Acceptance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトの調達と資源管理やコスト管理を混同する",
          "trapZh": "把项目采购和资源管理或成本管理混为一谈。"
        },
        {
          "trapJa": "調達を単なる購入価格の比較と考える",
          "trapZh": "把采购只理解成比较购买价格"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 371,
          "pdfPageEnd": 371,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-10 プロジェクトの調達",
          "anchorTermsJa": [
            "プロジェクトの調達"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-11",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 20,
      "nativeSectionId": "6-3-11",
      "titleJa": "6-3-11 プロジェクトのコミュニケーション",
      "titleZh": "项目的コミュニケーション",
      "overviewJa": "プロジェクトのコミュニケーションは、SGプロジェクト管理分野でコミュニケーション管理では、誰に、何を、いつ、どの形式で伝えるかを計画し、情報共有の漏れを防ぎます。会議だけでなく報告経路も含みます。PDF 372ページの「プロジェクトのコミュニケーション」を定位語に、試験では「コミュニケーション」「報告」「会議」「情報共有」「連絡経路」が判断線です。ステークホルダ管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目沟通用于围绕项目沟通管理项目条件，确保项目目标在限定条件内实现。本单元依据 PDF 372 页的「プロジェクトのコミュニケーション」定位，重点理解：沟通管理规划向谁、传达什么、何时、用什么形式，防止信息共享遗漏。不只是开会，也包括报告路径。考试常用沟通、报告、会议、信息共享、联络路径是判断词来换说法；同时要和干系人管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「プロジェクトのコミュニケーション」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“项目的コミュニケーション”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プロジェクトのコミュニケーションを学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。コミュニケーション管理では、誰に、何を、いつ、どの形式で伝えるかを計画し、情報共有の漏れを防ぎます。会議だけでなく報告経路も含みます。この関係を押さえると、プロジェクトのコミュニケーションは単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではCommunication、Report、Meeting、Information Sharingが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目沟通时，先判断它是在讲对策、法务、审计、服务还是项目管理。沟通管理规划向谁、传达什么、何时、用什么形式，防止信息共享遗漏。不只是开会，也包括报告路径。这样可以把Communication、Report、Meeting、Information Sharing等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Communication",
            "Report",
            "Meeting",
            "Information Sharing"
          ],
          "examFocusJa": "「プロジェクトのコミュニケーション」の設問では、「コミュニケーション」「報告」「会議」「情報共有」「連絡経路」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、ステークホルダ管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「プロジェクトのコミュニケーション」相关题时，先抓沟通、报告、会议、信息共享、联络路径是判断词。再判断题目问对象、责任、流程还是效果，并排除干系人管理。",
          "commonMistakeJa": "「プロジェクトのコミュニケーション」をステークホルダ管理と混同すると誤答します。特に全員に同じ詳細情報を送ればよいと考える場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「プロジェクトのコミュニケーション」和干系人管理混淆，尤其是误以为给所有人发送同样详细信息就是好沟通。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 372,
              "pdfPageEnd": 372,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-11 プロジェクトのコミュニケーション",
              "anchorTermsJa": [
                "プロジェクトのコミュニケーション"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、プロジェクトのコミュニケーションが単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「コミュニケーション」「報告」「会議」「情報共有」「連絡経路」が判断線です。その語が出たら、まず围绕项目沟通管理项目条件，确保项目目标在限定条件内实现という意味に対応する日本語条件を探します。合わない場合は、ステークホルダ管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目沟通放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。沟通、报告、会议、信息共享、联络路径是判断词。看到这些线索时，先判断是否符合“围绕项目沟通管理项目条件，确保项目目标在限定条件内实现”；如果不符合，就可能是在让你误选干系人管理。",
          "englishTerms": [
            "Communication",
            "Report",
            "Meeting",
            "Information Sharing"
          ],
          "examFocusJa": "プロジェクトのコミュニケーションの見分け方は、「コミュニケーション」「報告」「会議」「情報共有」「連絡経路」が判断線ですを文章中から拾い、ステークホルダ管理ではなくプロジェクトのコミュニケーションを答えるべき条件かを確認することです。",
          "examFocusZh": "项目沟通的判断线索是沟通、报告、会议、信息共享、联络路径是判断词，同时确认题干要求的是否是「プロジェクトのコミュニケーション」，而不是干系人管理。",
          "commonMistakeJa": "プロジェクトのコミュニケーションではなくステークホルダ管理の説明を選ぶ誤りに注意します。原因は、全員に同じ詳細情報を送ればよいと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プロジェクトのコミュニケーション」（项目沟通）和干系人管理混淆。错误通常来自误以为给所有人发送同样详细信息就是好沟通，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 372,
              "pdfPageEnd": 372,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-11 プロジェクトのコミュニケーション",
              "anchorTermsJa": [
                "プロジェクトのコミュニケーション"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Communication",
          "termZh": "Communication",
          "english": "Communication"
        },
        {
          "termJa": "Report",
          "termZh": "Report",
          "english": "Report"
        },
        {
          "termJa": "Meeting",
          "termZh": "Meeting",
          "english": "Meeting"
        },
        {
          "termJa": "Information Sharing",
          "termZh": "Information Sharing",
          "english": "Information Sharing"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プロジェクトのコミュニケーションとステークホルダ管理を混同する",
          "trapZh": "把项目沟通和干系人管理混为一谈。"
        },
        {
          "trapJa": "全員に同じ詳細情報を送ればよいと考える",
          "trapZh": "误以为给所有人发送同样详细信息就是好沟通"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 372,
          "pdfPageEnd": 372,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-11 プロジェクトのコミュニケーション",
          "anchorTermsJa": [
            "プロジェクトのコミュニケーション"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-6-3-12",
      "exam": "sg",
      "chapterId": "sg-ch06",
      "topicId": "management",
      "order": 21,
      "nativeSectionId": "6-3-12",
      "titleJa": "6-3-12 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、統合、ステークホルダ、スコープ、資源、時間、コスト、リスク、品質、調達、コミュニケーションが混在します。問題文の管理対象が何かを先に読むことが重要です。PDF 373-376ページの「演習問題」を定位語に、試験では「演習問題」「スコープ」「時間」「コスト」「リスク」「品質」「調達」が判断線です。サービスマネジメントや通常運用との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "项目管理演习问题用于检查项目管理各知识领域在范围、时间、成本、质量、风险等条件下的区别。本单元依据 PDF 373-376 页的「演習問題」定位，重点理解：本节演习把整合、干系人、范围、资源、时间、成本、风险、质量、采购、沟通混合考。先判断题目管理对象是什么，再选对应知识领域。考试常用演习问题、范围、时间、成本、风险、质量、采购是判断词来换说法；同时要和服务管理或日常运行区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、対策、法務、監査、サービス、又はプロジェクト管理のどこに位置付く単元なのかを先に決めます。演習問題では、統合、ステークホルダ、スコープ、資源、時間、コスト、リスク、品質、調達、コミュニケーションが混在します。問題文の管理対象が何かを先に読むことが重要です。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で責任、手順、対策を結び付ける判断軸になります。英語表記ではExercise、Project Management、Scope、Time、Cost、Risk、Qualityが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习项目管理演习问题时，先判断它是在讲对策、法务、审计、服务还是项目管理。本节演习把整合、干系人、范围、资源、时间、成本、风险、质量、采购、沟通混合考。先判断题目管理对象是什么，再选对应知识领域。这样可以把Exercise、Project Management、Scope、Time、Cost、Risk、Quality等术语和具体职责、流程或控制措施对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Project Management",
            "Scope",
            "Time",
            "Cost",
            "Risk",
            "Quality"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「スコープ」「時間」「コスト」「リスク」「品質」「調達」が判断線です。まず対象、責任、手順、効果のどれを問うているかを確認し、サービスマネジメントや通常運用の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、范围、时间、成本、风险、质量、采购是判断词。再判断题目问对象、责任、流程还是效果，并排除服务管理或日常运行。",
          "commonMistakeJa": "「演習問題」をサービスマネジメントや通常運用と混同すると誤答します。特に知識領域名だけを見て管理対象を読まない場合、事例文の責任、対象、手順の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和服务管理或日常运行混淆，尤其是只看知识领域名称，不读管理对象。要回到案例里的责任主体、对象和流程。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 373,
              "pdfPageEnd": 376,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-12 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故対応、法令遵守、監査証拠、サービス運用、又はプロジェクト条件の文脈で出されます。「演習問題」「スコープ」「時間」「コスト」「リスク」「品質」「調達」が判断線です。その語が出たら、まず检查项目管理各知识领域在范围、时间、成本、质量、风险等条件下的区别という意味に対応する日本語条件を探します。合わない場合は、サービスマネジメントや通常運用を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把项目管理演习问题放进事故处理、合规、审计证据、服务运行或项目条件里，而不是直接问定义。演习问题、范围、时间、成本、风险、质量、采购是判断词。看到这些线索时，先判断是否符合“检查项目管理各知识领域在范围、时间、成本、质量、风险等条件下的区别”；如果不符合，就可能是在让你误选服务管理或日常运行。",
          "englishTerms": [
            "Exercise",
            "Project Management",
            "Scope",
            "Time",
            "Cost",
            "Risk",
            "Quality"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「スコープ」「時間」「コスト」「リスク」「品質」「調達」が判断線ですを文章中から拾い、サービスマネジメントや通常運用ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "项目管理演习问题的判断线索是演习问题、范围、时间、成本、风险、质量、采购是判断词，同时确认题干要求的是否是「演習問題」，而不是服务管理或日常运行。",
          "commonMistakeJa": "演習問題ではなくサービスマネジメントや通常運用の説明を選ぶ誤りに注意します。原因は、知識領域名だけを見て管理対象を読まないときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（项目管理演习问题）和服务管理或日常运行混淆。错误通常来自只看知识领域名称，不读管理对象，本质是漏读目的、对象或发生时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 373,
              "pdfPageEnd": 376,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-3-12 演習問題",
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
          "termJa": "Project Management",
          "termZh": "Project Management",
          "english": "Project Management"
        },
        {
          "termJa": "Scope",
          "termZh": "Scope",
          "english": "Scope"
        },
        {
          "termJa": "Time",
          "termZh": "Time",
          "english": "Time"
        },
        {
          "termJa": "Cost",
          "termZh": "Cost",
          "english": "Cost"
        },
        {
          "termJa": "Risk",
          "termZh": "Risk",
          "english": "Risk"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題とサービスマネジメントや通常運用を混同する",
          "trapZh": "把项目管理演习问题和服务管理或日常运行混为一谈。"
        },
        {
          "trapJa": "知識領域名だけを見て管理対象を読まない",
          "trapZh": "只看知识领域名称，不读管理对象"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 373,
          "pdfPageEnd": 376,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-3-12 演習問題",
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
