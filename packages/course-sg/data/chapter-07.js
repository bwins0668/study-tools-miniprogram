module.exports = {
  "chapter": {
    "id": "sg-ch07",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 7,
    "titleJa": "第7章 テクノロジ",
    "titleZh": "第7章 技术"
  },
  "units": [
    {
      "id": "sg-7-1-1",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "7-1-1",
      "titleJa": "7-1-1 システムの構成",
      "titleZh": "7-1-1 典型计算机构成与多CPU并行系统",
      "overviewJa": "システムの構成は、SGシステム分野でシステム構成では、CPU、主記憶、補助記憶、入出力インターフェースの役割分担と、並列処理、グリッド、デュアルシステム、デュプレックスシステムの高信頼化構成を読みます。処理性能だけでなく、信頼性や可用性の向上策とセットで判断します。PDF 380-388ページの「システムの構成」を定位語に、試験では「CPU」「主記憶」「並列処理」「デュアル」「デュプレックス」「クラスタ」が判断線です。システム評価指標やネットワーク構成との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "系统构成用于理解CPU架构、并行处理、存储层次和系统性能的硬件基础。本单元依据 PDF 380-388 页的「システムの構成」定位，重点理解：系统构成要理解CPU、主存、辅存和I/O的角色分工，以及并行处理、网格、双工冗余等高可靠性构成方式。判断时不能只看处理速度，还要看故障容忍和可用性。考试常用CPU、主存、并行处理、双工、双机热备、集群是判断线索来换说法；同时要和系统评价指标或网络构成区分。",
      "learningGoalJa": "問題文の条件を読み取り、「システムの構成」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-1-1 典型计算机构成与多CPU并行系统”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "システムの構成を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。システム構成では、CPU、主記憶、補助記憶、入出力インターフェースの役割分担と、並列処理、グリッド、デュアルシステム、デュプレックスシステムの高信頼化構成を読みます。処理性能だけでなく、信頼性や可用性の向上策とセットで判断します。この関係を押さえると、システムの構成は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではCPU、Cluster、Dual System、Duplex、Gridが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习系统构成时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。系统构成要理解CPU、主存、辅存和I/O的角色分工，以及并行处理、网格、双工冗余等高可靠性构成方式。判断时不能只看处理速度，还要看故障容忍和可用性。这样可以把CPU、Cluster、Dual System、Duplex、Grid等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "CPU",
            "Cluster",
            "Dual System",
            "Duplex",
            "Grid"
          ],
          "examFocusJa": "「システムの構成」の設問では、「CPU」「主記憶」「並列処理」「デュアル」「デュプレックス」「クラスタ」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、システム評価指標やネットワーク構成の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「システムの構成」相关题时，先抓CPU、主存、并行处理、双工、双机热备、集群是判断线索。再判断题目问对象、条件、机制还是对策，并排除系统评价指标或网络构成。",
          "commonMistakeJa": "「システムの構成」をシステム評価指標やネットワーク構成と混同すると誤答します。特にデュアルシステムとデュプレックスシステムの冗長範囲を混同する場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「システムの構成」和系统评价指标或网络构成混淆，尤其是混淆双工系统和双机热备的冗余范围。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 380,
              "pdfPageEnd": 388,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-1 システムの構成",
              "anchorTermsJa": [
                "システムの構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、システムの構成が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「CPU」「主記憶」「並列処理」「デュアル」「デュプレックス」「クラスタ」が判断線です。その語が出たら、まず理解CPU架构、并行处理、存储层次和系统性能的硬件基础という意味に対応する日本語条件を探します。合わない場合は、システム評価指標やネットワーク構成を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把系统构成放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。CPU、主存、并行处理、双工、双机热备、集群是判断线索。看到这些线索时，先判断是否符合\"理解CPU架构、并行处理、存储层次和系统性能的硬件基础\"；如果不符合，就可能是在让你误选系统评价指标或网络构成。",
          "englishTerms": [
            "CPU",
            "Cluster",
            "Dual System",
            "Duplex",
            "Grid"
          ],
          "examFocusJa": "システムの構成の見分け方は、「CPU」「主記憶」「並列処理」「デュアル」「デュプレックス」「クラスタ」が判断線ですを文章中から拾い、システム評価指標やネットワーク構成ではなくシステムの構成を答えるべき条件かを確認することです。",
          "examFocusZh": "系统构成的判断线索是CPU、主存、并行处理、双工、双机热备、集群是判断线索，同时确认题干要求的是否是「システムの構成」，而不是系统评价指标或网络构成。",
          "commonMistakeJa": "システムの構成ではなくシステム評価指標やネットワーク構成の説明を選ぶ誤りに注意します。原因は、デュアルシステムとデュプレックスシステムの冗長範囲を混同するときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「システムの構成」（系统构成）和系统评价指标或网络构成混淆。错误通常来自混淆双工系统和双机热备的冗余范围，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 380,
              "pdfPageEnd": 388,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-1 システムの構成",
              "anchorTermsJa": [
                "システムの構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "CPU",
          "termZh": "CPU",
          "english": "CPU"
        },
        {
          "termJa": "Cluster",
          "termZh": "Cluster",
          "english": "Cluster"
        },
        {
          "termJa": "Dual System",
          "termZh": "Dual System",
          "english": "Dual System"
        },
        {
          "termJa": "Duplex",
          "termZh": "Duplex",
          "english": "Duplex"
        },
        {
          "termJa": "Grid",
          "termZh": "Grid",
          "english": "Grid"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "システムの構成とシステム評価指標やネットワーク構成を混同する",
          "trapZh": "把系统构成和系统评价指标或网络构成混为一谈。"
        },
        {
          "trapJa": "デュアルシステムとデュプレックスシステムの冗長範囲を混同する",
          "trapZh": "混淆双工系统和双机热备的冗余范围"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0038"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 380,
          "pdfPageEnd": 388,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-1-1 システムの構成",
          "anchorTermsJa": [
            "システムの構成"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-1-2",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "7-1-2",
      "titleJa": "7-1-2 システムの評価指標",
      "titleZh": "系统的评价指標",
      "overviewJa": "システムの評価指標は、SGシステム分野でシステム評価指標では、MTBF、MTTR、稼働率、スループット、応答時間などを扱います。信頼性、可用性、性能を別々の評価軸として読む必要があります。PDF 389-391ページの「システムの評価指標」を定位語に、試験では「MTBF」「MTTR」「稼働率」「スループット」「応答時間」「ベンチマーク」が判断線です。システム構成や障害対策との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "系统评价指标用于用MTBF、MTTR、可用率、性能指标等评价系统的可靠性和处理能力。本单元依据 PDF 389-391 页的「システムの評価指標」定位，重点理解：系统评价指标包括MTBF、MTTR、可用率、吞吐量、响应时间。要把可靠性、可用性和性能当作不同评价轴分开理解。考试常用MTBF、MTTR、可用率、吞吐量、响应时间、基准测试是判断线索来换说法；同时要和系统构成或故障对策区分。",
      "learningGoalJa": "問題文の条件を読み取り、「システムの評価指標」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“系统的评价指標”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "システムの評価指標を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。システム評価指標では、MTBF、MTTR、稼働率、スループット、応答時間などを扱います。信頼性、可用性、性能を別々の評価軸として読む必要があります。この関係を押さえると、システムの評価指標は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではMTBF、MTTR、Availability、Throughput、Response Timeが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习系统评价指标时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。系统评价指标包括MTBF、MTTR、可用率、吞吐量、响应时间。要把可靠性、可用性和性能当作不同评价轴分开理解。这样可以把MTBF、MTTR、Availability、Throughput、Response Time等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "MTBF",
            "MTTR",
            "Availability",
            "Throughput",
            "Response Time"
          ],
          "examFocusJa": "「システムの評価指標」の設問では、「MTBF」「MTTR」「稼働率」「スループット」「応答時間」「ベンチマーク」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、システム構成や障害対策の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「システムの評価指標」相关题时，先抓MTBF、MTTR、可用率、吞吐量、响应时间、基准测试是判断线索。再判断题目问对象、条件、机制还是对策，并排除系统构成或故障对策。",
          "commonMistakeJa": "「システムの評価指標」をシステム構成や障害対策と混同すると誤答します。特に稼働率と性能を同じ指標として扱う場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「システムの評価指標」和系统构成或故障对策混淆，尤其是把可用率和性能当成同一指标。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 389,
              "pdfPageEnd": 391,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-2 システムの評価指標",
              "anchorTermsJa": [
                "システムの評価指標"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、システムの評価指標が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「MTBF」「MTTR」「稼働率」「スループット」「応答時間」「ベンチマーク」が判断線です。その語が出たら、まず用MTBF、MTTR、可用率、性能指标等评价系统的可靠性和处理能力という意味に対応する日本語条件を探します。合わない場合は、システム構成や障害対策を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把系统评价指标放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。MTBF、MTTR、可用率、吞吐量、响应时间、基准测试是判断线索。看到这些线索时，先判断是否符合\"用MTBF、MTTR、可用率、性能指标等评价系统的可靠性和处理能力\"；如果不符合，就可能是在让你误选系统构成或故障对策。",
          "englishTerms": [
            "MTBF",
            "MTTR",
            "Availability",
            "Throughput",
            "Response Time"
          ],
          "examFocusJa": "システムの評価指標の見分け方は、「MTBF」「MTTR」「稼働率」「スループット」「応答時間」「ベンチマーク」が判断線ですを文章中から拾い、システム構成や障害対策ではなくシステムの評価指標を答えるべき条件かを確認することです。",
          "examFocusZh": "系统评价指标的判断线索是MTBF、MTTR、可用率、吞吐量、响应时间、基准测试是判断线索，同时确认题干要求的是否是「システムの評価指標」，而不是系统构成或故障对策。",
          "commonMistakeJa": "システムの評価指標ではなくシステム構成や障害対策の説明を選ぶ誤りに注意します。原因は、稼働率と性能を同じ指標として扱うときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「システムの評価指標」（系统评价指标）和系统构成或故障对策混淆。错误通常来自把可用率和性能当成同一指标，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 389,
              "pdfPageEnd": 391,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-2 システムの評価指標",
              "anchorTermsJa": [
                "システムの評価指標"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "MTBF",
          "termZh": "MTBF",
          "english": "MTBF"
        },
        {
          "termJa": "MTTR",
          "termZh": "MTTR",
          "english": "MTTR"
        },
        {
          "termJa": "Availability",
          "termZh": "Availability",
          "english": "Availability"
        },
        {
          "termJa": "Throughput",
          "termZh": "Throughput",
          "english": "Throughput"
        },
        {
          "termJa": "Response Time",
          "termZh": "Response Time",
          "english": "Response Time"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "システムの評価指標とシステム構成や障害対策を混同する",
          "trapZh": "把系统评价指标和系统构成或故障对策混为一谈。"
        },
        {
          "trapJa": "稼働率と性能を同じ指標として扱う",
          "trapZh": "把可用率和性能当成同一指标"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 389,
          "pdfPageEnd": 391,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-1-2 システムの評価指標",
          "anchorTermsJa": [
            "システムの評価指標"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-1-3",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "7-1-3",
      "titleJa": "7-1-3 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、CPU構成、並列化、高信頼化構成と、MTBF、MTTR、稼働率が混在します。どの条件で、どの構成が、どの指標に影響するかを分けて読みます。PDF 392-396ページの「演習問題」を定位語に、試験では「演習問題」「構成」「高信頼化」「稼働率」「MTBF」が判断線です。用語単体の暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "系统与评价演习问题用于检查系统构成方式和评价指标能否按条件区分。本单元依据 PDF 392-396 页的「演習問題」定位，重点理解：本节演习混合考CPU构成、并行化、高可靠构成与MTBF、MTTR、可用率。要分清什么条件、什么构成影响什么指标。考试常用演习问题、构成、高可靠化、可用率、MTBF是判断词来换说法；同时要和只背单个术语区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。演習問題では、CPU構成、並列化、高信頼化構成と、MTBF、MTTR、稼働率が混在します。どの条件で、どの構成が、どの指標に影響するかを分けて読みます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではExercise、MTBF、Availability、Clusterが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习系统与评价演习问题时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。本节演习混合考CPU构成、并行化、高可靠构成与MTBF、MTTR、可用率。要分清什么条件、什么构成影响什么指标。这样可以把Exercise、MTBF、Availability、Cluster等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "MTBF",
            "Availability",
            "Cluster"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「構成」「高信頼化」「稼働率」「MTBF」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、用語単体の暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、构成、高可靠化、可用率、MTBF是判断词。再判断题目问对象、条件、机制还是对策，并排除只背单个术语。",
          "commonMistakeJa": "「演習問題」を用語単体の暗記と混同すると誤答します。特に指標の名前だけを見て、何を数値化しているかを読まない場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单个术语混淆，尤其是只看指标名，不读它量化的是什么。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 392,
              "pdfPageEnd": 396,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-3 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「演習問題」「構成」「高信頼化」「稼働率」「MTBF」が判断線です。その語が出たら、まず检查系统构成方式和评价指标能否按条件区分という意味に対応する日本語条件を探します。合わない場合は、用語単体の暗記を選ばせるひっかけである可能性があります。特にMTBFや稼働率など数値で判断する指標は、問題文の条件が信頼性か性能かを最初に決めてから読むと誤りが減ります。",
          "explanationZh": "SG题干常把系统与评价演习问题放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。演习问题、构成、高可靠化、可用率、MTBF是判断词。看到这些线索时，先判断是否符合\"检查系统构成方式和评价指标能否按条件区分\"；如果不符合，就可能是在让你误选只背单个术语。",
          "englishTerms": [
            "Exercise",
            "MTBF",
            "Availability",
            "Cluster"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「構成」「高信頼化」「稼働率」「MTBF」が判断線ですを文章中から拾い、用語単体の暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "系统与评价演习问题的判断线索是演习问题、构成、高可靠化、可用率、MTBF是判断词，同时确认题干要求的是否是「演習問題」，而不是只背单个术语。",
          "commonMistakeJa": "演習問題ではなく用語単体の暗記の説明を選ぶ誤りに注意します。原因は、指標の名前だけを見て、何を数値化しているかを読まないときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（系统与评价演习问题）和只背单个术语混淆。错误通常来自只看指标名，不读它量化的是什么，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 392,
              "pdfPageEnd": 396,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-1-3 演習問題",
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
          "termJa": "MTBF",
          "termZh": "MTBF",
          "english": "MTBF"
        },
        {
          "termJa": "Availability",
          "termZh": "Availability",
          "english": "Availability"
        },
        {
          "termJa": "Cluster",
          "termZh": "Cluster",
          "english": "Cluster"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と用語単体の暗記を混同する",
          "trapZh": "把系统与评价演习问题和只背单个术语混为一谈。"
        },
        {
          "trapJa": "指標の名前だけを見て、何を数値化しているかを読まない",
          "trapZh": "只看指标名，不读它量化的是什么"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 392,
          "pdfPageEnd": 396,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-1-3 演習問題",
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
      "id": "sg-7-2-1",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "7-2-1",
      "titleJa": "7-2-1 データベース方式",
      "titleZh": "7-2-1 数据库模式设计 (外模式/概念模式/内模式)",
      "overviewJa": "データベース方式は、SGデータベース分野でデータベース方式では、外部スキーマ、概念スキーマ、内部スキーマの三層スキーマとDBMSの役割を整理します。利用者視点とシステム内部の物理構造を分けて読むことが重要です。PDF 397-398ページの「データベース方式」を定位語に、試験では「三層スキーマ」「外部スキーマ」「概念スキーマ」「内部スキーマ」「DBMS」が判断線です。データベース設計やデータ操作との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据库方式用于理解三层模式架构和DBMS如何分离逻辑结构与物理存储。本单元依据 PDF 397-398 页的「データベース方式」定位，重点理解：数据库方式要理解外模式、概念模式、内模式三层架构和DBMS作用。要把用户视角和系统内部物理结构分开读。考试常用三层模式、外模式、概念模式、内模式、DBMS是判断词来换说法；同时要和数据库设计或数据操作区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データベース方式」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-2-1 数据库模式设计 (外模式/概念模式/内模式)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベース方式を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。データベース方式では、外部スキーマ、概念スキーマ、内部スキーマの三層スキーマとDBMSの役割を整理します。利用者視点とシステム内部の物理構造を分けて読むことが重要です。この関係を押さえると、データベース方式は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではThree-schema Architecture、External Schema、Conceptual Schema、Internal Schema、DBMSが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据库方式时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。数据库方式要理解外模式、概念模式、内模式三层架构和DBMS作用。要把用户视角和系统内部物理结构分开读。这样可以把Three-schema Architecture、External Schema、Conceptual Schema、Internal Schema、DBMS等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Three-schema Architecture",
            "External Schema",
            "Conceptual Schema",
            "Internal Schema",
            "DBMS"
          ],
          "examFocusJa": "「データベース方式」の設問では、「三層スキーマ」「外部スキーマ」「概念スキーマ」「内部スキーマ」「DBMS」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、データベース設計やデータ操作の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データベース方式」相关题时，先抓三层模式、外模式、概念模式、内模式、DBMS是判断词。再判断题目问对象、条件、机制还是对策，并排除数据库设计或数据操作。",
          "commonMistakeJa": "「データベース方式」をデータベース設計やデータ操作と混同すると誤答します。特に三層スキーマの担当領域を逆に理解する場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データベース方式」和数据库设计或数据操作混淆，尤其是把三层模式各自负责的领域读反。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 397,
              "pdfPageEnd": 398,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-1 データベース方式",
              "anchorTermsJa": [
                "データベース方式"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データベース方式が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「三層スキーマ」「外部スキーマ」「概念スキーマ」「内部スキーマ」「DBMS」が判断線です。その語が出たら、まず理解三层模式架构和DBMS如何分离逻辑结构与物理存储という意味に対応する日本語条件を探します。合わない場合は、データベース設計やデータ操作を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据库方式放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。三层模式、外模式、概念模式、内模式、DBMS是判断词。看到这些线索时，先判断是否符合\"理解三层模式架构和DBMS如何分离逻辑结构与物理存储\"；如果不符合，就可能是在让你误选数据库设计或数据操作。",
          "englishTerms": [
            "Three-schema Architecture",
            "External Schema",
            "Conceptual Schema",
            "Internal Schema",
            "DBMS"
          ],
          "examFocusJa": "データベース方式の見分け方は、「三層スキーマ」「外部スキーマ」「概念スキーマ」「内部スキーマ」「DBMS」が判断線ですを文章中から拾い、データベース設計やデータ操作ではなくデータベース方式を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库方式的判断线索是三层模式、外模式、概念模式、内模式、DBMS是判断词，同时确认题干要求的是否是「データベース方式」，而不是数据库设计或数据操作。",
          "commonMistakeJa": "データベース方式ではなくデータベース設計やデータ操作の説明を選ぶ誤りに注意します。原因は、三層スキーマの担当領域を逆に理解するときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベース方式」（数据库方式）和数据库设计或数据操作混淆。错误通常来自把三层模式各自负责的领域读反，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 397,
              "pdfPageEnd": 398,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-1 データベース方式",
              "anchorTermsJa": [
                "データベース方式"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Three-schema Architecture",
          "termZh": "Three-schema Architecture",
          "english": "Three-schema Architecture"
        },
        {
          "termJa": "External Schema",
          "termZh": "External Schema",
          "english": "External Schema"
        },
        {
          "termJa": "Conceptual Schema",
          "termZh": "Conceptual Schema",
          "english": "Conceptual Schema"
        },
        {
          "termJa": "Internal Schema",
          "termZh": "Internal Schema",
          "english": "Internal Schema"
        },
        {
          "termJa": "DBMS",
          "termZh": "DBMS",
          "english": "DBMS"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベース方式とデータベース設計やデータ操作を混同する",
          "trapZh": "把数据库方式和数据库设计或数据操作混为一谈。"
        },
        {
          "trapJa": "三層スキーマの担当領域を逆に理解する",
          "trapZh": "把三层模式各自负责的领域读反"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0039"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 397,
          "pdfPageEnd": 398,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-1 データベース方式",
          "anchorTermsJa": [
            "データベース方式"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-2-2",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "7-2-2",
      "titleJa": "7-2-2 データベース設計",
      "titleZh": "数据库設計",
      "overviewJa": "データベース設計は、SGデータベース分野でデータベース設計では、E-R図、主キー、外部キー、正規化を用いて矛盾のない構造を作ります。業務の実体と関連を整理し、どの属性をどの表に置くかを判断します。PDF 399-400ページの「データベース設計」を定位語に、試験では「E-R図」「主キー」「外部キー」「正規化」「実体」「関連」が判断線です。データベース方式やデータ操作との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据库设计用于用E-R图、主键、外键和规范化设计无矛盾的数据库结构。本单元依据 PDF 399-400 页的「データベース設計」定位，重点理解：数据库设计用E-R图、主键、外键和规范化建立结构。要整理业务实体和关系，判断属性应放在哪张表。考试常用E-R图、主键、外键、规范化、实体、关系是判断词来换说法；同时要和数据库方式或数据操作区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データベース設計」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“数据库設計”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベース設計を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。データベース設計では、E-R図、主キー、外部キー、正規化を用いて矛盾のない構造を作ります。業務の実体と関連を整理し、どの属性をどの表に置くかを判断します。この関係を押さえると、データベース設計は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではER Diagram、Primary Key、Foreign Key、Normalization、Entityが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据库设计时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。数据库设计用E-R图、主键、外键和规范化建立结构。要整理业务实体和关系，判断属性应放在哪张表。这样可以把ER Diagram、Primary Key、Foreign Key、Normalization、Entity等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "ER Diagram",
            "Primary Key",
            "Foreign Key",
            "Normalization",
            "Entity"
          ],
          "examFocusJa": "「データベース設計」の設問では、「E-R図」「主キー」「外部キー」「正規化」「実体」「関連」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、データベース方式やデータ操作の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データベース設計」相关题时，先抓E-R图、主键、外键、规范化、实体、关系是判断词。再判断题目问对象、条件、机制还是对策，并排除数据库方式或数据操作。",
          "commonMistakeJa": "「データベース設計」をデータベース方式やデータ操作と混同すると誤答します。特に正規化を必ず検索性能を上げる処理と考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データベース設計」和数据库方式或数据操作混淆，尤其是误以为规范化一定提高查询性能。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 399,
              "pdfPageEnd": 400,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-2 データベース設計",
              "anchorTermsJa": [
                "データベース設計"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データベース設計が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「E-R図」「主キー」「外部キー」「正規化」「実体」「関連」が判断線です。その語が出たら、まず用E-R图、主键、外键和规范化设计无矛盾的数据库结构という意味に対応する日本語条件を探します。合わない場合は、データベース方式やデータ操作を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据库设计放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。E-R图、主键、外键、规范化、实体、关系是判断词。看到这些线索时，先判断是否符合\"用E-R图、主键、外键和规范化设计无矛盾的数据库结构\"；如果不符合，就可能是在让你误选数据库方式或数据操作。",
          "englishTerms": [
            "ER Diagram",
            "Primary Key",
            "Foreign Key",
            "Normalization",
            "Entity"
          ],
          "examFocusJa": "データベース設計の見分け方は、「E-R図」「主キー」「外部キー」「正規化」「実体」「関連」が判断線ですを文章中から拾い、データベース方式やデータ操作ではなくデータベース設計を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库设计的判断线索是E-R图、主键、外键、规范化、实体、关系是判断词，同时确认题干要求的是否是「データベース設計」，而不是数据库方式或数据操作。",
          "commonMistakeJa": "データベース設計ではなくデータベース方式やデータ操作の説明を選ぶ誤りに注意します。原因は、正規化を必ず検索性能を上げる処理と考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベース設計」（数据库设计）和数据库方式或数据操作混淆。错误通常来自误以为规范化一定提高查询性能，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 399,
              "pdfPageEnd": 400,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-2 データベース設計",
              "anchorTermsJa": [
                "データベース設計"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ER Diagram",
          "termZh": "ER Diagram",
          "english": "ER Diagram"
        },
        {
          "termJa": "Primary Key",
          "termZh": "Primary Key",
          "english": "Primary Key"
        },
        {
          "termJa": "Foreign Key",
          "termZh": "Foreign Key",
          "english": "Foreign Key"
        },
        {
          "termJa": "Normalization",
          "termZh": "Normalization",
          "english": "Normalization"
        },
        {
          "termJa": "Entity",
          "termZh": "Entity",
          "english": "Entity"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベース設計とデータベース方式やデータ操作を混同する",
          "trapZh": "把数据库设计和数据库方式或数据操作混为一谈。"
        },
        {
          "trapJa": "正規化を必ず検索性能を上げる処理と考える",
          "trapZh": "误以为规范化一定提高查询性能"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 399,
          "pdfPageEnd": 400,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-2 データベース設計",
          "anchorTermsJa": [
            "データベース設計"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-2-3",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "7-2-3",
      "titleJa": "7-2-3 データ操作",
      "titleZh": "数据操作",
      "overviewJa": "データ操作は、SGデータベース分野でデータ操作では、SELECT、INSERT、UPDATE、DELETE、結合、副問合せ、ビューなどでデータを扱います。抽出、変更、仮想表と実表の区別を条件に応じて判断します。PDF 401-403ページの「データ操作」を定位語に、試験では「SELECT」「INSERT」「UPDATE」「DELETE」「結合」「副問合せ」「ビュー」が判断線です。データベース設計やトランザクション処理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据操作用于用SQL的SELECT、INSERT、UPDATE、DELETE和连接、子查询操作数据。本单元依据 PDF 401-403 页的「データ操作」定位，重点理解：数据操作包括SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图等。要按条件区分抽取、更改、虚拟表和实表。考试常用SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图是判断词来换说法；同时要和数据库设计或事务处理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データ操作」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“数据操作”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データ操作を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。データ操作では、SELECT、INSERT、UPDATE、DELETE、結合、副問合せ、ビューなどでデータを扱います。抽出、変更、仮想表と実表の区別を条件に応じて判断します。この関係を押さえると、データ操作は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではSQL、SELECT、INSERT、UPDATE、DELETE、Join、Viewが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据操作时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。数据操作包括SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图等。要按条件区分抽取、更改、虚拟表和实表。这样可以把SQL、SELECT、INSERT、UPDATE、DELETE、Join、View等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "SQL",
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE",
            "Join",
            "View"
          ],
          "examFocusJa": "「データ操作」の設問では、「SELECT」「INSERT」「UPDATE」「DELETE」「結合」「副問合せ」「ビュー」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、データベース設計やトランザクション処理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データ操作」相关题时，先抓SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图是判断词。再判断题目问对象、条件、机制还是对策，并排除数据库设计或事务处理。",
          "commonMistakeJa": "「データ操作」をデータベース設計やトランザクション処理と混同すると誤答します。特にビューを実データを保存する表と同じに考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データ操作」和数据库设计或事务处理混淆，尤其是把视图误认为和存储实际数据的表相同。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 401,
              "pdfPageEnd": 403,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-3 データ操作",
              "anchorTermsJa": [
                "データ操作"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データ操作が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「SELECT」「INSERT」「UPDATE」「DELETE」「結合」「副問合せ」「ビュー」が判断線です。その語が出たら、まず用SQL的SELECT、INSERT、UPDATE、DELETE和连接、子查询操作数据という意味に対応する日本語条件を探します。合わない場合は、データベース設計やトランザクション処理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据操作放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图是判断词。看到这些线索时，先判断是否符合\"用SQL的SELECT、INSERT、UPDATE、DELETE和连接、子查询操作数据\"；如果不符合，就可能是在让你误选数据库设计或事务处理。",
          "englishTerms": [
            "SQL",
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE",
            "Join",
            "View"
          ],
          "examFocusJa": "データ操作の見分け方は、「SELECT」「INSERT」「UPDATE」「DELETE」「結合」「副問合せ」「ビュー」が判断線ですを文章中から拾い、データベース設計やトランザクション処理ではなくデータ操作を答えるべき条件かを確認することです。",
          "examFocusZh": "数据操作的判断线索是SELECT、INSERT、UPDATE、DELETE、连接、子查询、视图是判断词，同时确认题干要求的是否是「データ操作」，而不是数据库设计或事务处理。",
          "commonMistakeJa": "データ操作ではなくデータベース設計やトランザクション処理の説明を選ぶ誤りに注意します。原因は、ビューを実データを保存する表と同じに考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データ操作」（数据操作）和数据库设计或事务处理混淆。错误通常来自把视图误认为和存储实际数据的表相同，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 401,
              "pdfPageEnd": 403,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-3 データ操作",
              "anchorTermsJa": [
                "データ操作"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SQL",
          "termZh": "SQL",
          "english": "SQL"
        },
        {
          "termJa": "SELECT",
          "termZh": "SELECT",
          "english": "SELECT"
        },
        {
          "termJa": "INSERT",
          "termZh": "INSERT",
          "english": "INSERT"
        },
        {
          "termJa": "UPDATE",
          "termZh": "UPDATE",
          "english": "UPDATE"
        },
        {
          "termJa": "DELETE",
          "termZh": "DELETE",
          "english": "DELETE"
        },
        {
          "termJa": "Join",
          "termZh": "Join",
          "english": "Join"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データ操作とデータベース設計やトランザクション処理を混同する",
          "trapZh": "把数据操作和数据库设计或事务处理混为一谈。"
        },
        {
          "trapJa": "ビューを実データを保存する表と同じに考える",
          "trapZh": "把视图误认为和存储实际数据的表相同"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 401,
          "pdfPageEnd": 403,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-3 データ操作",
          "anchorTermsJa": [
            "データ操作"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-2-4",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "7-2-4",
      "titleJa": "7-2-4 トランザクション処理",
      "titleZh": "トランザクション処理",
      "overviewJa": "トランザクション処理は、SGデータベース分野でトランザクション処理では、ACID特性とコミット、ロールバック、ロック、排他制御を扱います。複数処理の途中で障害が起きても、全部やり直すか全部確定するかを制御します。PDF 404-408ページの「トランザクション処理」を定位語に、試験では「ACID」「コミット」「ロールバック」「ロック」「排他制御」「同時実行」が判断線です。データ操作やバックアップとの違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "事务处理用于用ACID特性和并发控制保护多步骤更新的正确性。本单元依据 PDF 404-408 页的「トランザクション処理」定位，重点理解：事务处理用ACID特性、Commit、Rollback、锁和排他控制。要理解如何处理多步骤过程中的故障：要么全做、要么全取消。考试常用ACID、Commit、Rollback、锁、排他控制、并发执行是判断线索来换说法；同时要和数据操作或备份区分。",
      "learningGoalJa": "問題文の条件を読み取り、「トランザクション処理」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“トランザクション処理”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "トランザクション処理を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。トランザクション処理では、ACID特性とコミット、ロールバック、ロック、排他制御を扱います。複数処理の途中で障害が起きても、全部やり直すか全部確定するかを制御します。この関係を押さえると、トランザクション処理は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではTransaction、ACID、Commit、Rollback、Lock、Concurrencyが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习事务处理时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。事务处理用ACID特性、Commit、Rollback、锁和排他控制。要理解如何处理多步骤过程中的故障：要么全做、要么全取消。这样可以把Transaction、ACID、Commit、Rollback、Lock、Concurrency等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Transaction",
            "ACID",
            "Commit",
            "Rollback",
            "Lock",
            "Concurrency"
          ],
          "examFocusJa": "「トランザクション処理」の設問では、「ACID」「コミット」「ロールバック」「ロック」「排他制御」「同時実行」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、データ操作やバックアップの説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「トランザクション処理」相关题时，先抓ACID、Commit、Rollback、锁、排他控制、并发执行是判断线索。再判断题目问对象、条件、机制还是对策，并排除数据操作或备份。",
          "commonMistakeJa": "「トランザクション処理」をデータ操作やバックアップと混同すると誤答します。特にコミット前のデータを確定済みと考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「トランザクション処理」和数据操作或备份混淆，尤其是误以为提交前的数据已经确定。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 404,
              "pdfPageEnd": 408,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-4 トランザクション処理",
              "anchorTermsJa": [
                "トランザクション処理"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、トランザクション処理が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「ACID」「コミット」「ロールバック」「ロック」「排他制御」「同時実行」が判断線です。その語が出たら、まず用ACID特性和并发控制保护多步骤更新的正确性という意味に対応する日本語条件を探します。合わない場合は、データ操作やバックアップを選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把事务处理放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。ACID、Commit、Rollback、锁、排他控制、并发执行是判断线索。看到这些线索时，先判断是否符合\"用ACID特性和并发控制保护多步骤更新的正确性\"；如果不符合，就可能是在让你误选数据操作或备份。",
          "englishTerms": [
            "Transaction",
            "ACID",
            "Commit",
            "Rollback",
            "Lock",
            "Concurrency"
          ],
          "examFocusJa": "トランザクション処理の見分け方は、「ACID」「コミット」「ロールバック」「ロック」「排他制御」「同時実行」が判断線ですを文章中から拾い、データ操作やバックアップではなくトランザクション処理を答えるべき条件かを確認することです。",
          "examFocusZh": "事务处理的判断线索是ACID、Commit、Rollback、锁、排他控制、并发执行是判断线索，同时确认题干要求的是否是「トランザクション処理」，而不是数据操作或备份。",
          "commonMistakeJa": "トランザクション処理ではなくデータ操作やバックアップの説明を選ぶ誤りに注意します。原因は、コミット前のデータを確定済みと考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「トランザクション処理」（事务处理）和数据操作或备份混淆。错误通常来自误以为提交前的数据已经确定，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 404,
              "pdfPageEnd": 408,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-4 トランザクション処理",
              "anchorTermsJa": [
                "トランザクション処理"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Transaction",
          "termZh": "Transaction",
          "english": "Transaction"
        },
        {
          "termJa": "ACID",
          "termZh": "ACID",
          "english": "ACID"
        },
        {
          "termJa": "Commit",
          "termZh": "Commit",
          "english": "Commit"
        },
        {
          "termJa": "Rollback",
          "termZh": "Rollback",
          "english": "Rollback"
        },
        {
          "termJa": "Lock",
          "termZh": "Lock",
          "english": "Lock"
        },
        {
          "termJa": "Concurrency",
          "termZh": "Concurrency",
          "english": "Concurrency"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "トランザクション処理とデータ操作やバックアップを混同する",
          "trapZh": "把事务处理和数据操作或备份混为一谈。"
        },
        {
          "trapJa": "コミット前のデータを確定済みと考える",
          "trapZh": "误以为提交前的数据已经确定"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 404,
          "pdfPageEnd": 408,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-4 トランザクション処理",
          "anchorTermsJa": [
            "トランザクション処理"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-2-5",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "7-2-5",
      "titleJa": "7-2-5 データベース応用",
      "titleZh": "数据库応用",
      "overviewJa": "データベース応用は、SGデータベース分野でデータベース応用では、データウェアハウス、データマイニング、分散データベース、ビッグデータなどを扱います。分析目的のDBとトランザクション処理のDBの違いを読みます。PDF 409-410ページの「データベース応用」を定位語に、試験では「データウェアハウス」「データマイニング」「分散データベース」「ビッグデータ」「分析」が判断線です。トランザクション処理や表設計との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据库应用用于理解数据仓库、数据挖掘、分布式数据库和大数据处理。本单元依据 PDF 409-410 页的「データベース応用」定位，重点理解：数据库应用涉及数据仓库、数据挖掘、分布式数据库和大数据。要区分分析型数据库和事务处理型数据库。考试常用数据仓库、数据挖掘、分布式数据库、大数据、分析是判断词来换说法；同时要和事务处理或表设计区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データベース応用」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“数据库応用”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベース応用を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。データベース応用では、データウェアハウス、データマイニング、分散データベース、ビッグデータなどを扱います。分析目的のDBとトランザクション処理のDBの違いを読みます。この関係を押さえると、データベース応用は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではData Warehouse、Data Mining、Distributed Database、Big Dataが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据库应用时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。数据库应用涉及数据仓库、数据挖掘、分布式数据库和大数据。要区分分析型数据库和事务处理型数据库。这样可以把Data Warehouse、Data Mining、Distributed Database、Big Data等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Data Warehouse",
            "Data Mining",
            "Distributed Database",
            "Big Data"
          ],
          "examFocusJa": "「データベース応用」の設問では、「データウェアハウス」「データマイニング」「分散データベース」「ビッグデータ」「分析」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、トランザクション処理や表設計の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データベース応用」相关题时，先抓数据仓库、数据挖掘、分布式数据库、大数据、分析是判断词。再判断题目问对象、条件、机制还是对策，并排除事务处理或表设计。",
          "commonMistakeJa": "「データベース応用」をトランザクション処理や表設計と混同すると誤答します。特にデータウェアハウスを更新頻度が高いシステムと考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データベース応用」和事务处理或表设计混淆，尤其是把数据仓库误认为更新频率很高的系统。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 409,
              "pdfPageEnd": 410,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-5 データベース応用",
              "anchorTermsJa": [
                "データベース応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データベース応用が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「データウェアハウス」「データマイニング」「分散データベース」「ビッグデータ」「分析」が判断線です。その語が出たら、まず理解数据仓库、数据挖掘、分布式数据库和大数据处理という意味に対応する日本語条件を探します。合わない場合は、トランザクション処理や表設計を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据库应用放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。数据仓库、数据挖掘、分布式数据库、大数据、分析是判断词。看到这些线索时，先判断是否符合\"理解数据仓库、数据挖掘、分布式数据库和大数据处理\"；如果不符合，就可能是在让你误选事务处理或表设计。",
          "englishTerms": [
            "Data Warehouse",
            "Data Mining",
            "Distributed Database",
            "Big Data"
          ],
          "examFocusJa": "データベース応用の見分け方は、「データウェアハウス」「データマイニング」「分散データベース」「ビッグデータ」「分析」が判断線ですを文章中から拾い、トランザクション処理や表設計ではなくデータベース応用を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库应用的判断线索是数据仓库、数据挖掘、分布式数据库、大数据、分析是判断词，同时确认题干要求的是否是「データベース応用」，而不是事务处理或表设计。",
          "commonMistakeJa": "データベース応用ではなくトランザクション処理や表設計の説明を選ぶ誤りに注意します。原因は、データウェアハウスを更新頻度が高いシステムと考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベース応用」（数据库应用）和事务处理或表设计混淆。错误通常来自把数据仓库误认为更新频率很高的系统，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 409,
              "pdfPageEnd": 410,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-5 データベース応用",
              "anchorTermsJa": [
                "データベース応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Data Warehouse",
          "termZh": "Data Warehouse",
          "english": "Data Warehouse"
        },
        {
          "termJa": "Data Mining",
          "termZh": "Data Mining",
          "english": "Data Mining"
        },
        {
          "termJa": "Distributed Database",
          "termZh": "Distributed Database",
          "english": "Distributed Database"
        },
        {
          "termJa": "Big Data",
          "termZh": "Big Data",
          "english": "Big Data"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベース応用とトランザクション処理や表設計を混同する",
          "trapZh": "把数据库应用和事务处理或表设计混为一谈。"
        },
        {
          "trapJa": "データウェアハウスを更新頻度が高いシステムと考える",
          "trapZh": "把数据仓库误认为更新频率很高的系统"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 409,
          "pdfPageEnd": 410,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-5 データベース応用",
          "anchorTermsJa": [
            "データベース応用"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-2-6",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 9,
      "nativeSectionId": "7-2-6",
      "titleJa": "7-2-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、DB設計、SQL、ACID、応用技術が混在します。操作対象、一貫性要件、分析か更新かを先に読むことが重要です。PDF 411-414ページの「演習問題」を定位語に、試験では「演習問題」「DB設計」「SQL」「ACID」「データウェアハウス」が判断線です。単一SQL構文の暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据库演习问题用于检查数据库方式、设计、操作、事务处理和应用的适用条件区别。本单元依据 PDF 411-414 页的「演習問題」定位，重点理解：本节演习混合考DB设计、SQL、ACID和应用技术。先判断操作对象、一致性要求和是分析还是更新。考试常用演习问题、DB设计、SQL、ACID、数据仓库是判断词来换说法；同时要和只背单个SQL语法区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。演習問題では、DB設計、SQL、ACID、応用技術が混在します。操作対象、一貫性要件、分析か更新かを先に読むことが重要です。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではExercise、SQL、ACID、Data Warehouseが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据库演习问题时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。本节演习混合考DB设计、SQL、ACID和应用技术。先判断操作对象、一致性要求和是分析还是更新。这样可以把Exercise、SQL、ACID、Data Warehouse等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "SQL",
            "ACID",
            "Data Warehouse"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「DB設計」「SQL」「ACID」「データウェアハウス」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、単一SQL構文の暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、DB设计、SQL、ACID、数据仓库是判断词。再判断题目问对象、条件、机制还是对策，并排除只背单个SQL语法。",
          "commonMistakeJa": "「演習問題」を単一SQL構文の暗記と混同すると誤答します。特に操作の目的を読まずに構文だけを選ぶ場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单个SQL语法混淆，尤其是不读操作目的，只按语法选择。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 411,
              "pdfPageEnd": 414,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-6 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「演習問題」「DB設計」「SQL」「ACID」「データウェアハウス」が判断線です。その語が出たら、まず检查数据库方式、设计、操作、事务处理和应用的适用条件区别という意味に対応する日本語条件を探します。合わない場合は、単一SQL構文の暗記を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据库演习问题放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。演习问题、DB设计、SQL、ACID、数据仓库是判断词。看到这些线索时，先判断是否符合\"检查数据库方式、设计、操作、事务处理和应用的适用条件区别\"；如果不符合，就可能是在让你误选只背单个SQL语法。",
          "englishTerms": [
            "Exercise",
            "SQL",
            "ACID",
            "Data Warehouse"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「DB設計」「SQL」「ACID」「データウェアハウス」が判断線ですを文章中から拾い、単一SQL構文の暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库演习问题的判断线索是演习问题、DB设计、SQL、ACID、数据仓库是判断词，同时确认题干要求的是否是「演習問題」，而不是只背单个SQL语法。",
          "commonMistakeJa": "演習問題ではなく単一SQL構文の暗記の説明を選ぶ誤りに注意します。原因は、操作の目的を読まずに構文だけを選ぶときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（数据库演习问题）和只背单个SQL语法混淆。错误通常来自不读操作目的，只按语法选择，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 411,
              "pdfPageEnd": 414,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-2-6 演習問題",
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
          "termJa": "SQL",
          "termZh": "SQL",
          "english": "SQL"
        },
        {
          "termJa": "ACID",
          "termZh": "ACID",
          "english": "ACID"
        },
        {
          "termJa": "Data Warehouse",
          "termZh": "Data Warehouse",
          "english": "Data Warehouse"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と単一SQL構文の暗記を混同する",
          "trapZh": "把数据库演习问题和只背单个SQL语法混为一谈。"
        },
        {
          "trapJa": "操作の目的を読まずに構文だけを選ぶ",
          "trapZh": "不读操作目的，只按语法选择"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 411,
          "pdfPageEnd": 414,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-2-6 演習問題",
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
      "id": "sg-7-3-1",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 10,
      "nativeSectionId": "7-3-1",
      "titleJa": "7-3-1 ネットワーク方式",
      "titleZh": "7-3-1 计算机网络拓扑与硬件设备 (网卡/路由器/交换机)",
      "overviewJa": "ネットワーク方式は、SGネットワーク分野でネットワーク方式では、LAN、WAN、トポロジー、Ethernet、NIC、リピータ、ブリッジ、ルータ、レイヤ3スイッチなどの機器を扱います。物理的な接続形態とデータリンク層・ネットワーク層の転送を分けて読みます。PDF 415-416ページの「ネットワーク方式」を定位語に、試験では「LAN」「WAN」「Ethernet」「ルータ」「スイッチ」「トポロジー」が判断線です。通信プロトコルやネットワーク管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "网络方式用于理解LAN/WAN拓扑、Ethernet协议和网络连接设备的分层职责。本单元依据 PDF 415-416 页的「ネットワーク方式」定位，重点理解：网络方式要理解LAN/WAN、拓扑、Ethernet和网卡、中继器、桥接器、路由器、三层交换机等设备。把物理连接形态和数据链路层/网络层的转发分开读。考试常用LAN、WAN、Ethernet、路由器、交换机、拓扑是判断词来换说法；同时要和通信协议或网络管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「ネットワーク方式」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-3-1 计算机网络拓扑与硬件设备 (网卡/路由器/交换机)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ネットワーク方式を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。ネットワーク方式では、LAN、WAN、トポロジー、Ethernet、NIC、リピータ、ブリッジ、ルータ、レイヤ3スイッチなどの機器を扱います。物理的な接続形態とデータリンク層・ネットワーク層の転送を分けて読みます。この関係を押さえると、ネットワーク方式は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではLAN、WAN、Ethernet、Router、Switch、Topologyが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习网络方式时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。网络方式要理解LAN/WAN、拓扑、Ethernet和网卡、中继器、桥接器、路由器、三层交换机等设备。把物理连接形态和数据链路层/网络层的转发分开读。这样可以把LAN、WAN、Ethernet、Router、Switch、Topology等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "LAN",
            "WAN",
            "Ethernet",
            "Router",
            "Switch",
            "Topology"
          ],
          "examFocusJa": "「ネットワーク方式」の設問では、「LAN」「WAN」「Ethernet」「ルータ」「スイッチ」「トポロジー」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、通信プロトコルやネットワーク管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「ネットワーク方式」相关题时，先抓LAN、WAN、Ethernet、路由器、交换机、拓扑是判断词。再判断题目问对象、条件、机制还是对策，并排除通信协议或网络管理。",
          "commonMistakeJa": "「ネットワーク方式」を通信プロトコルやネットワーク管理と混同すると誤答します。特にルータがすべての層でパケットを転送すると考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「ネットワーク方式」和通信协议或网络管理混淆，尤其是误以为路由器在所有层都转发数据包。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 415,
              "pdfPageEnd": 416,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-1 ネットワーク方式",
              "anchorTermsJa": [
                "ネットワーク方式"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、ネットワーク方式が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「LAN」「WAN」「Ethernet」「ルータ」「スイッチ」「トポロジー」が判断線です。その語が出たら、まず理解LAN/WAN拓扑、Ethernet协议和网络连接设备的分层职责という意味に対応する日本語条件を探します。合わない場合は、通信プロトコルやネットワーク管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把网络方式放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。LAN、WAN、Ethernet、路由器、交换机、拓扑是判断词。看到这些线索时，先判断是否符合\"理解LAN/WAN拓扑、Ethernet协议和网络连接设备的分层职责\"；如果不符合，就可能是在让你误选通信协议或网络管理。",
          "englishTerms": [
            "LAN",
            "WAN",
            "Ethernet",
            "Router",
            "Switch",
            "Topology"
          ],
          "examFocusJa": "ネットワーク方式の見分け方は、「LAN」「WAN」「Ethernet」「ルータ」「スイッチ」「トポロジー」が判断線ですを文章中から拾い、通信プロトコルやネットワーク管理ではなくネットワーク方式を答えるべき条件かを確認することです。",
          "examFocusZh": "网络方式的判断线索是LAN、WAN、Ethernet、路由器、交换机、拓扑是判断词，同时确认题干要求的是否是「ネットワーク方式」，而不是通信协议或网络管理。",
          "commonMistakeJa": "ネットワーク方式ではなく通信プロトコルやネットワーク管理の説明を選ぶ誤りに注意します。原因は、ルータがすべての層でパケットを転送すると考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ネットワーク方式」（网络方式）和通信协议或网络管理混淆。错误通常来自误以为路由器在所有层都转发数据包，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 415,
              "pdfPageEnd": 416,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-1 ネットワーク方式",
              "anchorTermsJa": [
                "ネットワーク方式"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "LAN",
          "termZh": "LAN",
          "english": "LAN"
        },
        {
          "termJa": "WAN",
          "termZh": "WAN",
          "english": "WAN"
        },
        {
          "termJa": "Ethernet",
          "termZh": "Ethernet",
          "english": "Ethernet"
        },
        {
          "termJa": "Router",
          "termZh": "Router",
          "english": "Router"
        },
        {
          "termJa": "Switch",
          "termZh": "Switch",
          "english": "Switch"
        },
        {
          "termJa": "Topology",
          "termZh": "Topology",
          "english": "Topology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ネットワーク方式と通信プロトコルやネットワーク管理を混同する",
          "trapZh": "把网络方式和通信协议或网络管理混为一谈。"
        },
        {
          "trapJa": "ルータがすべての層でパケットを転送すると考える",
          "trapZh": "误以为路由器在所有层都转发数据包"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0040"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 415,
          "pdfPageEnd": 416,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-1 ネットワーク方式",
          "anchorTermsJa": [
            "ネットワーク方式"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-3-2",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 11,
      "nativeSectionId": "7-3-2",
      "titleJa": "7-3-2 データ通信と制御",
      "titleZh": "数据通信与制御",
      "overviewJa": "データ通信と制御は、SGネットワーク分野でデータ通信と制御では、回線交換、パケット交換、フレームリレー、誤り制御、フロー制御などを扱います。通信路の使い方と、データの正しさを保つ仕組みを分けて読みます。PDF 417-421ページの「データ通信と制御」を定位語に、試験では「回線交換」「パケット交換」「フレームリレー」「誤り制御」「フロー制御」が判断線です。通信プロトコルやネットワーク応用との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "数据通信与控制用于理解线路交换、分组交换、帧中继、差错控制等通信基础技术。本单元依据 PDF 417-421 页的「データ通信と制御」定位，重点理解：数据通信与控制涉及电路交换、分组交换、帧中继、差错控制和流控制。要区分通信路径的使用方式和数据正确性保障机制。考试常用电路交换、分组交换、帧中继、差错控制、流控制是判断词来换说法；同时要和通信协议或网络应用区分。",
      "learningGoalJa": "問題文の条件を読み取り、「データ通信と制御」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“数据通信与制御”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データ通信と制御を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。データ通信と制御では、回線交換、パケット交換、フレームリレー、誤り制御、フロー制御などを扱います。通信路の使い方と、データの正しさを保つ仕組みを分けて読みます。この関係を押さえると、データ通信と制御は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではCircuit Switching、Packet Switching、Frame Relay、Error Control、Flow Controlが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习数据通信与控制时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。数据通信与控制涉及电路交换、分组交换、帧中继、差错控制和流控制。要区分通信路径的使用方式和数据正确性保障机制。这样可以把Circuit Switching、Packet Switching、Frame Relay、Error Control、Flow Control等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Circuit Switching",
            "Packet Switching",
            "Frame Relay",
            "Error Control",
            "Flow Control"
          ],
          "examFocusJa": "「データ通信と制御」の設問では、「回線交換」「パケット交換」「フレームリレー」「誤り制御」「フロー制御」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、通信プロトコルやネットワーク応用の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「データ通信と制御」相关题时，先抓电路交换、分组交换、帧中继、差错控制、流控制是判断词。再判断题目问对象、条件、机制还是对策，并排除通信协议或网络应用。",
          "commonMistakeJa": "「データ通信と制御」を通信プロトコルやネットワーク応用と混同すると誤答します。特にパケット交換を常に回線より遅いと考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「データ通信と制御」和通信协议或网络应用混淆，尤其是误以为分组交换总是比电路慢。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 417,
              "pdfPageEnd": 421,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-2 データ通信と制御",
              "anchorTermsJa": [
                "データ通信と制御"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、データ通信と制御が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「回線交換」「パケット交換」「フレームリレー」「誤り制御」「フロー制御」が判断線です。その語が出たら、まず理解线路交换、分组交换、帧中继、差错控制等通信基础技术という意味に対応する日本語条件を探します。合わない場合は、通信プロトコルやネットワーク応用を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把数据通信与控制放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。电路交换、分组交换、帧中继、差错控制、流控制是判断词。看到这些线索时，先判断是否符合\"理解线路交换、分组交换、帧中继、差错控制等通信基础技术\"；如果不符合，就可能是在让你误选通信协议或网络应用。",
          "englishTerms": [
            "Circuit Switching",
            "Packet Switching",
            "Frame Relay",
            "Error Control",
            "Flow Control"
          ],
          "examFocusJa": "データ通信と制御の見分け方は、「回線交換」「パケット交換」「フレームリレー」「誤り制御」「フロー制御」が判断線ですを文章中から拾い、通信プロトコルやネットワーク応用ではなくデータ通信と制御を答えるべき条件かを確認することです。",
          "examFocusZh": "数据通信与控制的判断线索是电路交换、分组交换、帧中继、差错控制、流控制是判断词，同时确认题干要求的是否是「データ通信と制御」，而不是通信协议或网络应用。",
          "commonMistakeJa": "データ通信と制御ではなく通信プロトコルやネットワーク応用の説明を選ぶ誤りに注意します。原因は、パケット交換を常に回線より遅いと考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データ通信と制御」（数据通信与控制）和通信协议或网络应用混淆。错误通常来自误以为分组交换总是比电路慢，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 417,
              "pdfPageEnd": 421,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-2 データ通信と制御",
              "anchorTermsJa": [
                "データ通信と制御"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Circuit Switching",
          "termZh": "Circuit Switching",
          "english": "Circuit Switching"
        },
        {
          "termJa": "Packet Switching",
          "termZh": "Packet Switching",
          "english": "Packet Switching"
        },
        {
          "termJa": "Frame Relay",
          "termZh": "Frame Relay",
          "english": "Frame Relay"
        },
        {
          "termJa": "Error Control",
          "termZh": "Error Control",
          "english": "Error Control"
        },
        {
          "termJa": "Flow Control",
          "termZh": "Flow Control",
          "english": "Flow Control"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データ通信と制御と通信プロトコルやネットワーク応用を混同する",
          "trapZh": "把数据通信与控制和通信协议或网络应用混为一谈。"
        },
        {
          "trapJa": "パケット交換を常に回線より遅いと考える",
          "trapZh": "误以为分组交换总是比电路慢"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 417,
          "pdfPageEnd": 421,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-2 データ通信と制御",
          "anchorTermsJa": [
            "データ通信と制御"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-3-3",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 12,
      "nativeSectionId": "7-3-3",
      "titleJa": "7-3-3 通信プロトコル",
      "titleZh": "通信プロトコル",
      "overviewJa": "通信プロトコルは、SGネットワーク分野で通信プロトコルでは、OSI基本参照モデルの各層と、TCP、UDP、IP、SMTP、HTTP、FTPなどのプロトコルを役割で分けます。カプセル化、アドレス解決、コネクション確立を各層で読み取ります。PDF 422-428ページの「通信プロトコル」を定位語に、試験では「OSI参照モデル」「TCP」「UDP」「IP」「SMTP」「HTTP」「FTP」が判断線です。ネットワーク方式やデータ通信と制御との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "通信协议用于用OSI基本参照模型和TCP/IP协议族理解分层通信。本单元依据 PDF 422-428 页的「通信プロトコル」定位，重点理解：通信协议涉及OSI模型的各层和TCP、UDP、IP、SMTP、HTTP、FTP等协议。要按封装、地址解析和连接建立来读各层的职责。考试常用OSI参考模型、TCP、UDP、IP、SMTP、HTTP、FTP是判断词来换说法；同时要和网络方式或数据通信与控制区分。",
      "learningGoalJa": "問題文の条件を読み取り、「通信プロトコル」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“通信プロトコル”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "通信プロトコルを学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。通信プロトコルでは、OSI基本参照モデルの各層と、TCP、UDP、IP、SMTP、HTTP、FTPなどのプロトコルを役割で分けます。カプセル化、アドレス解決、コネクション確立を各層で読み取ります。この関係を押さえると、通信プロトコルは単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではOSI Model、TCP、UDP、IP、SMTP、HTTP、FTPが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习通信协议时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。通信协议涉及OSI模型的各层和TCP、UDP、IP、SMTP、HTTP、FTP等协议。要按封装、地址解析和连接建立来读各层的职责。这样可以把OSI Model、TCP、UDP、IP、SMTP、HTTP、FTP等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "OSI Model",
            "TCP",
            "UDP",
            "IP",
            "SMTP",
            "HTTP",
            "FTP"
          ],
          "examFocusJa": "「通信プロトコル」の設問では、「OSI参照モデル」「TCP」「UDP」「IP」「SMTP」「HTTP」「FTP」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、ネットワーク方式やデータ通信と制御の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「通信プロトコル」相关题时，先抓OSI参考模型、TCP、UDP、IP、SMTP、HTTP、FTP是判断词。再判断题目问对象、条件、机制还是对策，并排除网络方式或数据通信与控制。",
          "commonMistakeJa": "「通信プロトコル」をネットワーク方式やデータ通信と制御と混同すると誤答します。特にOSIの層を一つずらしてプロトコルを当てはめる場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「通信プロトコル」和网络方式或数据通信与控制混淆，尤其是把OSI层的对应协议放错一层。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 422,
              "pdfPageEnd": 428,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-3 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、通信プロトコルが単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「OSI参照モデル」「TCP」「UDP」「IP」「SMTP」「HTTP」「FTP」が判断線です。その語が出たら、まず用OSI基本参照模型和TCP/IP协议族理解分层通信という意味に対応する日本語条件を探します。合わない場合は、ネットワーク方式やデータ通信と制御を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把通信协议放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。OSI参考模型、TCP、UDP、IP、SMTP、HTTP、FTP是判断词。看到这些线索时，先判断是否符合\"用OSI基本参照模型和TCP/IP协议族理解分层通信\"；如果不符合，就可能是在让你误选网络方式或数据通信与控制。",
          "englishTerms": [
            "OSI Model",
            "TCP",
            "UDP",
            "IP",
            "SMTP",
            "HTTP",
            "FTP"
          ],
          "examFocusJa": "通信プロトコルの見分け方は、「OSI参照モデル」「TCP」「UDP」「IP」「SMTP」「HTTP」「FTP」が判断線ですを文章中から拾い、ネットワーク方式やデータ通信と制御ではなく通信プロトコルを答えるべき条件かを確認することです。",
          "examFocusZh": "通信协议的判断线索是OSI参考模型、TCP、UDP、IP、SMTP、HTTP、FTP是判断词，同时确认题干要求的是否是「通信プロトコル」，而不是网络方式或数据通信与控制。",
          "commonMistakeJa": "通信プロトコルではなくネットワーク方式やデータ通信と制御の説明を選ぶ誤りに注意します。原因は、OSIの層を一つずらしてプロトコルを当てはめるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「通信プロトコル」（通信协议）和网络方式或数据通信与控制混淆。错误通常来自把OSI层的对应协议放错一层，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 422,
              "pdfPageEnd": 428,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-3 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "OSI Model",
          "termZh": "OSI Model",
          "english": "OSI Model"
        },
        {
          "termJa": "TCP",
          "termZh": "TCP",
          "english": "TCP"
        },
        {
          "termJa": "UDP",
          "termZh": "UDP",
          "english": "UDP"
        },
        {
          "termJa": "IP",
          "termZh": "IP",
          "english": "IP"
        },
        {
          "termJa": "SMTP",
          "termZh": "SMTP",
          "english": "SMTP"
        },
        {
          "termJa": "HTTP",
          "termZh": "HTTP",
          "english": "HTTP"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "通信プロトコルとネットワーク方式やデータ通信と制御を混同する",
          "trapZh": "把通信协议和网络方式或数据通信与控制混为一谈。"
        },
        {
          "trapJa": "OSIの層を一つずらしてプロトコルを当てはめる",
          "trapZh": "把OSI层的对应协议放错一层"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 422,
          "pdfPageEnd": 428,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-3 通信プロトコル",
          "anchorTermsJa": [
            "通信プロトコル"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-3-4",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 13,
      "nativeSectionId": "7-3-4",
      "titleJa": "7-3-4 ネットワーク管理",
      "titleZh": "网络管理",
      "overviewJa": "ネットワーク管理は、SGネットワーク分野でネットワーク管理では、SNMP、MIB、ネットワーク監視、障害管理、性能管理などを扱います。通信を流すこと自体と、ネットワーク機器の状態を管理することを分けて読みます。PDF 429ページの「ネットワーク管理」を定位語に、試験では「SNMP」「MIB」「ネットワーク監視」「障害管理」「性能管理」が判断線です。通信プロトコルやネットワーク応用との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "网络管理用于用SNMP等协议监视网络设备状态、性能和故障，维持网络可用性。本单元依据 PDF 429 页的「ネットワーク管理」定位，重点理解：网络管理涉及SNMP、MIB、网络监视、故障管理和性能管理。要区分传输数据本身和管理网络设备状态。考试常用SNMP、MIB、网络监视、故障管理、性能管理是判断词来换说法；同时要和通信协议或网络应用区分。",
      "learningGoalJa": "問題文の条件を読み取り、「ネットワーク管理」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“网络管理”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ネットワーク管理を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。ネットワーク管理では、SNMP、MIB、ネットワーク監視、障害管理、性能管理などを扱います。通信を流すこと自体と、ネットワーク機器の状態を管理することを分けて読みます。この関係を押さえると、ネットワーク管理は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではSNMP、MIB、Network Monitoring、Fault Management、Performanceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习网络管理时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。网络管理涉及SNMP、MIB、网络监视、故障管理和性能管理。要区分传输数据本身和管理网络设备状态。这样可以把SNMP、MIB、Network Monitoring、Fault Management、Performance等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "SNMP",
            "MIB",
            "Network Monitoring",
            "Fault Management",
            "Performance"
          ],
          "examFocusJa": "「ネットワーク管理」の設問では、「SNMP」「MIB」「ネットワーク監視」「障害管理」「性能管理」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、通信プロトコルやネットワーク応用の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「ネットワーク管理」相关题时，先抓SNMP、MIB、网络监视、故障管理、性能管理是判断词。再判断题目问对象、条件、机制还是对策，并排除通信协议或网络应用。",
          "commonMistakeJa": "「ネットワーク管理」を通信プロトコルやネットワーク応用と混同すると誤答します。特にネットワーク管理を通信を高速化する仕組みと考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「ネットワーク管理」和通信协议或网络应用混淆，尤其是把网络管理误认为加速通信的机制。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 429,
              "pdfPageEnd": 429,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-4 ネットワーク管理",
              "anchorTermsJa": [
                "ネットワーク管理"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、ネットワーク管理が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「SNMP」「MIB」「ネットワーク監視」「障害管理」「性能管理」が判断線です。その語が出たら、まず用SNMP等协议监视网络设备状态、性能和故障，维持网络可用性という意味に対応する日本語条件を探します。合わない場合は、通信プロトコルやネットワーク応用を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把网络管理放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。SNMP、MIB、网络监视、故障管理、性能管理是判断词。看到这些线索时，先判断是否符合\"用SNMP等协议监视网络设备状态、性能和故障，维持网络可用性\"；如果不符合，就可能是在让你误选通信协议或网络应用。",
          "englishTerms": [
            "SNMP",
            "MIB",
            "Network Monitoring",
            "Fault Management",
            "Performance"
          ],
          "examFocusJa": "ネットワーク管理の見分け方は、「SNMP」「MIB」「ネットワーク監視」「障害管理」「性能管理」が判断線ですを文章中から拾い、通信プロトコルやネットワーク応用ではなくネットワーク管理を答えるべき条件かを確認することです。",
          "examFocusZh": "网络管理的判断线索是SNMP、MIB、网络监视、故障管理、性能管理是判断词，同时确认题干要求的是否是「ネットワーク管理」，而不是通信协议或网络应用。",
          "commonMistakeJa": "ネットワーク管理ではなく通信プロトコルやネットワーク応用の説明を選ぶ誤りに注意します。原因は、ネットワーク管理を通信を高速化する仕組みと考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ネットワーク管理」（网络管理）和通信协议或网络应用混淆。错误通常来自把网络管理误认为加速通信的机制，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 429,
              "pdfPageEnd": 429,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-4 ネットワーク管理",
              "anchorTermsJa": [
                "ネットワーク管理"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SNMP",
          "termZh": "SNMP",
          "english": "SNMP"
        },
        {
          "termJa": "MIB",
          "termZh": "MIB",
          "english": "MIB"
        },
        {
          "termJa": "Network Monitoring",
          "termZh": "Network Monitoring",
          "english": "Network Monitoring"
        },
        {
          "termJa": "Fault Management",
          "termZh": "Fault Management",
          "english": "Fault Management"
        },
        {
          "termJa": "Performance",
          "termZh": "Performance",
          "english": "Performance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ネットワーク管理と通信プロトコルやネットワーク応用を混同する",
          "trapZh": "把网络管理和通信协议或网络应用混为一谈。"
        },
        {
          "trapJa": "ネットワーク管理を通信を高速化する仕組みと考える",
          "trapZh": "把网络管理误认为加速通信的机制"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 429,
          "pdfPageEnd": 429,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-4 ネットワーク管理",
          "anchorTermsJa": [
            "ネットワーク管理"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-3-5",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 14,
      "nativeSectionId": "7-3-5",
      "titleJa": "7-3-5 ネットワーク応用",
      "titleZh": "网络応用",
      "overviewJa": "ネットワーク応用は、SGネットワーク分野でネットワーク応用では、WWW、電子メール、FTP、VoIP、ストリーミング、DNSなどを扱います。利用者が使うサービスと、それを支える下位のプロトコルを対応させます。PDF 430-434ページの「ネットワーク応用」を定位語に、試験では「WWW」「電子メール」「FTP」「VoIP」「DNS」「ストリーミング」が判断線です。通信プロトコルやネットワーク管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "网络应用用于理解WWW、电子邮件、文件传输、VoIP、流媒体等网络服务。本单元依据 PDF 430-434 页的「ネットワーク応用」定位，重点理解：网络应用涉及WWW、电子邮件、FTP、VoIP、流媒体、DNS。要把用户使用的服务和支撑它们的下层协议对应起来。考试常用WWW、电子邮件、FTP、VoIP、DNS、流媒体是判断词来换说法；同时要和通信协议或网络管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「ネットワーク応用」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“网络応用”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ネットワーク応用を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。ネットワーク応用では、WWW、電子メール、FTP、VoIP、ストリーミング、DNSなどを扱います。利用者が使うサービスと、それを支える下位のプロトコルを対応させます。この関係を押さえると、ネットワーク応用は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではWWW、Email、FTP、VoIP、DNS、Streamingが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习网络应用时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。网络应用涉及WWW、电子邮件、FTP、VoIP、流媒体、DNS。要把用户使用的服务和支撑它们的下层协议对应起来。这样可以把WWW、Email、FTP、VoIP、DNS、Streaming等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "WWW",
            "Email",
            "FTP",
            "VoIP",
            "DNS",
            "Streaming"
          ],
          "examFocusJa": "「ネットワーク応用」の設問では、「WWW」「電子メール」「FTP」「VoIP」「DNS」「ストリーミング」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、通信プロトコルやネットワーク管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「ネットワーク応用」相关题时，先抓WWW、电子邮件、FTP、VoIP、DNS、流媒体是判断词。再判断题目问对象、条件、机制还是对策，并排除通信协议或网络管理。",
          "commonMistakeJa": "「ネットワーク応用」を通信プロトコルやネットワーク管理と混同すると誤答します。特に電子メールの仕組みをHTTPと同じに考える場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「ネットワーク応用」和通信协议或网络管理混淆，尤其是把电子邮件机制和HTTP当成同一回事。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 430,
              "pdfPageEnd": 434,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-5 ネットワーク応用",
              "anchorTermsJa": [
                "ネットワーク応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、ネットワーク応用が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「WWW」「電子メール」「FTP」「VoIP」「DNS」「ストリーミング」が判断線です。その語が出たら、まず理解WWW、电子邮件、文件传输、VoIP、流媒体等网络服务という意味に対応する日本語条件を探します。合わない場合は、通信プロトコルやネットワーク管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把网络应用放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。WWW、电子邮件、FTP、VoIP、DNS、流媒体是判断词。看到这些线索时，先判断是否符合\"理解WWW、电子邮件、文件传输、VoIP、流媒体等网络服务\"；如果不符合，就可能是在让你误选通信协议或网络管理。",
          "englishTerms": [
            "WWW",
            "Email",
            "FTP",
            "VoIP",
            "DNS",
            "Streaming"
          ],
          "examFocusJa": "ネットワーク応用の見分け方は、「WWW」「電子メール」「FTP」「VoIP」「DNS」「ストリーミング」が判断線ですを文章中から拾い、通信プロトコルやネットワーク管理ではなくネットワーク応用を答えるべき条件かを確認することです。",
          "examFocusZh": "网络应用的判断线索是WWW、电子邮件、FTP、VoIP、DNS、流媒体是判断词，同时确认题干要求的是否是「ネットワーク応用」，而不是通信协议或网络管理。",
          "commonMistakeJa": "ネットワーク応用ではなく通信プロトコルやネットワーク管理の説明を選ぶ誤りに注意します。原因は、電子メールの仕組みをHTTPと同じに考えるときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ネットワーク応用」（网络应用）和通信协议或网络管理混淆。错误通常来自把电子邮件机制和HTTP当成同一回事，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 430,
              "pdfPageEnd": 434,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-5 ネットワーク応用",
              "anchorTermsJa": [
                "ネットワーク応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "WWW",
          "termZh": "WWW",
          "english": "WWW"
        },
        {
          "termJa": "Email",
          "termZh": "Email",
          "english": "Email"
        },
        {
          "termJa": "FTP",
          "termZh": "FTP",
          "english": "FTP"
        },
        {
          "termJa": "VoIP",
          "termZh": "VoIP",
          "english": "VoIP"
        },
        {
          "termJa": "DNS",
          "termZh": "DNS",
          "english": "DNS"
        },
        {
          "termJa": "Streaming",
          "termZh": "Streaming",
          "english": "Streaming"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ネットワーク応用と通信プロトコルやネットワーク管理を混同する",
          "trapZh": "把网络应用和通信协议或网络管理混为一谈。"
        },
        {
          "trapJa": "電子メールの仕組みをHTTPと同じに考える",
          "trapZh": "把电子邮件机制和HTTP当成同一回事"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 430,
          "pdfPageEnd": 434,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-5 ネットワーク応用",
          "anchorTermsJa": [
            "ネットワーク応用"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-7-3-6",
      "exam": "sg",
      "chapterId": "sg-ch07",
      "topicId": "technology",
      "order": 15,
      "nativeSectionId": "7-3-6",
      "titleJa": "7-3-6 演習問題",
      "titleZh": "练习题",
      "overviewJa": "演習問題は、SG演習分野で演習問題では、LAN/WAN、交換方式、プロトコル階層、SNMP、応用サービスが混在します。物理接続、転送方式、通信手順、管理、サービスのどれかを先に決めます。PDF 435-438ページの「演習問題」を定位語に、試験では「演習問題」「LAN」「OSI」「TCP」「DNS」「SNMP」が判断線です。用語の単発暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "网络演习问题用于检查网络方式、数据通信、协议、管理和应用的适用区别。本单元依据 PDF 435-438 页的「演習問題」定位，重点理解：本节演习混合考LAN/WAN、交换方式、协议层次、SNMP、应用服务。先判断题目问物理连接、转发方式、通信步骤、管理还是服务。考试常用演习问题、LAN、OSI、TCP、DNS、SNMP是判断词来换说法；同时要和只背单个术语区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、システム構成、データベース、ネットワーク、経営、戦略、又は試験対策のどこに位置付く単元なのかを先に決めます。演習問題では、LAN/WAN、交換方式、プロトコル階層、SNMP、応用サービスが混在します。物理接続、転送方式、通信手順、管理、サービスのどれかを先に決めます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で条件と対策を結び付ける判断軸になります。英語表記ではExercise、LAN、OSI、TCP/IP、DNS、SNMPが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习网络演习问题时，先判断它属于系统构成、数据库、网络、经营、战略还是考试对策领域。本节演习混合考LAN/WAN、交换方式、协议层次、SNMP、应用服务。先判断题目问物理连接、转发方式、通信步骤、管理还是服务。这样可以把Exercise、LAN、OSI、TCP/IP、DNS、SNMP等术语和具体场景、条件或对策对应起来，做SG案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "LAN",
            "OSI",
            "TCP/IP",
            "DNS",
            "SNMP"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「LAN」「OSI」「TCP」「DNS」「SNMP」が判断線です。まず対象、条件、仕組み、対策のどれを問うているかを確認し、用語の単発暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、LAN、OSI、TCP、DNS、SNMP是判断词。再判断题目问对象、条件、机制还是对策，并排除只背单个术语。",
          "commonMistakeJa": "「演習問題」を用語の単発暗記と混同すると誤答します。特に守る層や目的を読まずにプロトコル名だけで選ぶ場合、事例文の条件、仕組み、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单个术语混淆，尤其是不读保护的层次和目的，只按协议名选择。要回到案例里的条件、机制和对策关系。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 435,
              "pdfPageEnd": 438,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-6 演習問題",
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
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、構成評価、DB設計、通信設定、経営判断、又は試験問題の文脈で出されます。「演習問題」「LAN」「OSI」「TCP」「DNS」「SNMP」が判断線です。その語が出たら、まず检查网络方式、数据通信、协议、管理和应用的适用区别という意味に対応する日本語条件を探します。合わない場合は、用語の単発暗記を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG题干常把网络演习问题放进构成评价、DB设计、通信设定、经营判断或考试题目里，而不是直接问定义。演习问题、LAN、OSI、TCP、DNS、SNMP是判断词。看到这些线索时，先判断是否符合\"检查网络方式、数据通信、协议、管理和应用的适用区别\"；如果不符合，就可能是在让你误选只背单个术语。",
          "englishTerms": [
            "Exercise",
            "LAN",
            "OSI",
            "TCP/IP",
            "DNS",
            "SNMP"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「LAN」「OSI」「TCP」「DNS」「SNMP」が判断線ですを文章中から拾い、用語の単発暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "网络演习问题的判断线索是演习问题、LAN、OSI、TCP、DNS、SNMP是判断词，同时确认题干要求的是否是「演習問題」，而不是只背单个术语。",
          "commonMistakeJa": "演習問題ではなく用語の単発暗記の説明を選ぶ誤りに注意します。原因は、守る層や目的を読まずにプロトコル名だけで選ぶときに、目的、対象、適用条件の違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（网络演习问题）和只背单个术语混淆。错误通常来自不读保护的层次和目的，只按协议名选择，本质是漏读目的、对象或适用条件的差别。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 435,
              "pdfPageEnd": 438,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-3-6 演習問題",
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
          "termJa": "LAN",
          "termZh": "LAN",
          "english": "LAN"
        },
        {
          "termJa": "OSI",
          "termZh": "OSI",
          "english": "OSI"
        },
        {
          "termJa": "TCP/IP",
          "termZh": "TCP/IP",
          "english": "TCP/IP"
        },
        {
          "termJa": "DNS",
          "termZh": "DNS",
          "english": "DNS"
        },
        {
          "termJa": "SNMP",
          "termZh": "SNMP",
          "english": "SNMP"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と用語の単発暗記を混同する",
          "trapZh": "把网络演习问题和只背单个术语混为一谈。"
        },
        {
          "trapJa": "守る層や目的を読まずにプロトコル名だけで選ぶ",
          "trapZh": "不读保护的层次和目的，只按协议名选择"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 435,
          "pdfPageEnd": 438,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-3-6 演習問題",
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
