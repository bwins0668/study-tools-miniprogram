module.exports = {
  "chapter": {
    "id": "sg-ch02",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 2,
    "titleJa": "第2章 情報セキュリティ技術",
    "titleZh": "第2章 信息安全技术"
  },
  "units": [
    {
      "id": "sg-2-1-1",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "2-1-1",
      "titleJa": "2-1-1 パスワードに関する攻撃",
      "titleZh": "2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)",
      "overviewJa": "2-1-1 パスワードに関する攻撃では、教材の該当ページに沿って「パスワードに関する攻撃」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「パスワードに関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "パスワードに関する攻撃を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 70,
              "pdfPageEnd": 71,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-1 パスワードに関する攻撃",
              "anchorTermsJa": [
                "パスワードに関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-1-1 パスワードに関する攻撃の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 70,
              "pdfPageEnd": 71,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-1 パスワードに関する攻撃",
              "anchorTermsJa": [
                "パスワードに関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "パスワードに関する攻撃",
          "termZh": "パスワードに関する攻撃",
          "english": "IT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0007"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 70,
          "pdfPageEnd": 71,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-1-1 パスワードに関する攻撃",
          "anchorTermsJa": [
            "パスワードに関する攻撃"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-1-2",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "2-1-2",
      "titleJa": "2-1-2 Webサイトに関する攻撃",
      "titleZh": "2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)",
      "overviewJa": "2-1-2 Webサイトに関する攻撃では、教材の該当ページに沿って「Webサイトに関する攻撃」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「Webサイトに関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "Webサイトに関する攻撃を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にWebのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 Web 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "Web"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 72,
              "pdfPageEnd": 75,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-2 Webサイトに関する攻撃",
              "anchorTermsJa": [
                "Webサイトに関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-1-2 Webサイトに関する攻撃の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、Webを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)”拆成对象、动作、结果三层，再把 Web 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "Web"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 72,
              "pdfPageEnd": 75,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-2 Webサイトに関する攻撃",
              "anchorTermsJa": [
                "Webサイトに関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Webサイトに関する攻撃",
          "termZh": "Webサイトに関する攻撃",
          "english": "Web"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0008"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 72,
          "pdfPageEnd": 75,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-1-2 Webサイトに関する攻撃",
          "anchorTermsJa": [
            "Webサイトに関する攻撃"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-1-3",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "2-1-3",
      "titleJa": "2-1-3 通信に関する攻撃",
      "titleZh": "2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)",
      "overviewJa": "2-1-3 通信に関する攻撃では、教材の該当ページに沿って「通信に関する攻撃」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「通信に関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "通信に関する攻撃を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 76,
              "pdfPageEnd": 79,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-3 通信に関する攻撃",
              "anchorTermsJa": [
                "通信に関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-1-3 通信に関する攻撃の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 76,
              "pdfPageEnd": 79,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-3 通信に関する攻撃",
              "anchorTermsJa": [
                "通信に関する攻撃"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "通信に関する攻撃",
          "termZh": "通信に関する攻撃",
          "english": "IT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0009"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 76,
          "pdfPageEnd": 79,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-1-3 通信に関する攻撃",
          "anchorTermsJa": [
            "通信に関する攻撃"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-1-4",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "2-1-4",
      "titleJa": "2-1-4 標的型攻撃・その他",
      "titleZh": "標的型攻撃、そ的他",
      "overviewJa": "2-1-4 標的型攻撃・その他では、教材の該当ページに沿って「標的型攻撃・その他」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“標的型攻撃、そ的他”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「標的型攻撃・その他」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“標的型攻撃、そ的他”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "標的型攻撃・その他を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“標的型攻撃、そ的他”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 80,
              "pdfPageEnd": 84,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-4 標的型攻撃・その他",
              "anchorTermsJa": [
                "標的型攻撃",
                "その他"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-1-4 標的型攻撃・その他の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“標的型攻撃、そ的他”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 80,
              "pdfPageEnd": 84,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-4 標的型攻撃・その他",
              "anchorTermsJa": [
                "標的型攻撃",
                "その他"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "標的型攻撃",
          "termZh": "標的型攻撃",
          "english": "IT"
        },
        {
          "termJa": "その他",
          "termZh": "そ的他",
          "english": ""
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 80,
          "pdfPageEnd": 84,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-1-4 標的型攻撃・その他",
          "anchorTermsJa": [
            "標的型攻撃",
            "その他"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-1-5",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "2-1-5",
      "titleJa": "2-1-5 演習問題",
      "titleZh": "练习题",
      "overviewJa": "2-1-5 演習問題では、教材の該当ページに沿って「演習問題」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“练习题”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "演習問題を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“练习题”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 85,
              "pdfPageEnd": 93,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-5 演習問題",
              "anchorTermsJa": [
                "演習問題"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-1-5 演習問題の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“练习题”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 85,
              "pdfPageEnd": 93,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-1-5 演習問題",
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
          "termJa": "演習問題",
          "termZh": "练习题",
          "english": "IT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 85,
          "pdfPageEnd": 93,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-1-5 演習問題",
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
      "id": "sg-2-2-1",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "2-2-1",
      "titleJa": "2-2-1 暗号化技術",
      "titleZh": "2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)",
      "overviewJa": "2-2-1 暗号化技術では、教材の該当ページに沿って「暗号化技術」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「暗号化技術」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "暗号化技術を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にEncryptionのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 Encryption 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "Encryption"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 94,
              "pdfPageEnd": 103,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-1 暗号化技術",
              "anchorTermsJa": [
                "暗号化技術"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-2-1 暗号化技術の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、Encryptionを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)”拆成对象、动作、结果三层，再把 Encryption 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "Encryption"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 94,
              "pdfPageEnd": 103,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-1 暗号化技術",
              "anchorTermsJa": [
                "暗号化技術"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "暗号化技術",
          "termZh": "加密技术",
          "english": "Encryption"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0010"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 94,
          "pdfPageEnd": 103,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-2-1 暗号化技術",
          "anchorTermsJa": [
            "暗号化技術"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-2-2",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "2-2-2",
      "titleJa": "2-2-2 認証技術",
      "titleZh": "2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)",
      "overviewJa": "2-2-2 認証技術では、教材の該当ページに沿って「認証技術」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「認証技術」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "認証技術を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にAuthenticationのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 Authentication 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "Authentication"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 104,
              "pdfPageEnd": 109,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-2 認証技術",
              "anchorTermsJa": [
                "認証技術"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-2-2 認証技術の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、Authenticationを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)”拆成对象、动作、结果三层，再把 Authentication 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "Authentication"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 104,
              "pdfPageEnd": 109,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-2 認証技術",
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
          "termJa": "認証技術",
          "termZh": "认证技术",
          "english": "Authentication"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0011"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 104,
          "pdfPageEnd": 109,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-2-2 認証技術",
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
      "id": "sg-2-2-3",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "2-2-3",
      "titleJa": "2-2-3 利用者認証・生体認証",
      "titleZh": "2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)",
      "overviewJa": "2-2-3 利用者認証・生体認証では、教材の該当ページに沿って「利用者認証・生体認証」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「利用者認証・生体認証」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "利用者認証・生体認証を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にAuthenticationのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 Authentication 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "Authentication"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 110,
              "pdfPageEnd": 116,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-3 利用者認証・生体認証",
              "anchorTermsJa": [
                "利用者認証",
                "生体認証"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-2-3 利用者認証・生体認証の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、Authenticationを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)”拆成对象、动作、结果三层，再把 Authentication 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "Authentication"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 110,
              "pdfPageEnd": 116,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-3 利用者認証・生体認証",
              "anchorTermsJa": [
                "利用者認証",
                "生体認証"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "利用者認証",
          "termZh": "利用者认证",
          "english": "Authentication"
        },
        {
          "termJa": "生体認証",
          "termZh": "生体认证",
          "english": ""
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0012"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 110,
          "pdfPageEnd": 116,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-2-3 利用者認証・生体認証",
          "anchorTermsJa": [
            "利用者認証",
            "生体認証"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-2-4",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 9,
      "nativeSectionId": "2-2-4",
      "titleJa": "2-2-4 公開鍵基盤",
      "titleZh": "2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)",
      "overviewJa": "2-2-4 公開鍵基盤では、教材の該当ページに沿って「公開鍵基盤」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「公開鍵基盤」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "公開鍵基盤を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 117,
              "pdfPageEnd": 121,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-4 公開鍵基盤",
              "anchorTermsJa": [
                "公開鍵基盤"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-2-4 公開鍵基盤の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 117,
              "pdfPageEnd": 121,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-4 公開鍵基盤",
              "anchorTermsJa": [
                "公開鍵基盤"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "公開鍵基盤",
          "termZh": "公开密钥基础设施",
          "english": "IT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-sg-lesson-0013"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 117,
          "pdfPageEnd": 121,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-2-4 公開鍵基盤",
          "anchorTermsJa": [
            "公開鍵基盤"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "sg-2-2-5",
      "exam": "sg",
      "chapterId": "sg-ch02",
      "topicId": "technology",
      "order": 10,
      "nativeSectionId": "2-2-5",
      "titleJa": "2-2-5 演習問題",
      "titleZh": "练习题",
      "overviewJa": "2-2-5 演習問題では、教材の該当ページに沿って「演習問題」の目的、対象、使われる場面を整理します。SG 情報セキュリティマネジメントの問題では、用語を暗記するだけでなく、問題文が示す状況から正しい概念を選ぶ力が求められます。",
      "overviewZh": "本单元围绕“练习题”建立考试向理解。重点不是背标题，而是分清它解决什么问题、适用于什么场景、容易和哪些相近概念混淆。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "演習問題を学ぶときは、定義語を一つだけ覚えるのではなく、何を対象にして、どのような効果やリスクを扱うのかを結び付けます。特にITのような英語略語や技術語は、正式な日本語表現とセットで確認すると、選択肢の言い換えに対応しやすくなります。",
          "explanationZh": "理解“练习题”时，先抓对象和目的，再看它带来的效果、限制或风险。遇到 IT 这类英文术语时，不要只记缩写，要能把它和日文正式说法、中文含义以及实际场景对应起来。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "出題では、名称そのものよりも「どの目的で使うか」「何を防ぐか」「どの指標を改善するか」が問われやすい。",
          "examFocusZh": "考试常把同类概念放在选项里，关键是看目的、防护对象、评价指标或处理流程是否匹配题干。",
          "commonMistakeJa": "似た語を語感だけで選ぶと誤答しやすい。原因、対象、結果の三点を問題文から拾って判断する。",
          "commonMistakeZh": "不要凭词面感觉选答案；先看题干说的是原因、对象还是结果，再和本单元概念对应。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 122,
              "pdfPageEnd": 125,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-5 演習問題",
              "anchorTermsJa": [
                "演習問題"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "2-2-5 演習問題の設問では、用語の一部だけが示される場合や、具体例から概念名を選ばせる場合があります。教材ページの見出し語と周辺語を手掛かりに、ITを中心とした関係を整理しておくと、未知の表現にも対応できます。",
          "explanationZh": "这类题常用具体场景来考术语。复习时把“练习题”拆成对象、动作、结果三层，再把 IT 作为核心英文术语连接起来，遇到换一种说法的题干也能判断。",
          "englishTerms": [
            "IT"
          ],
          "examFocusJa": "選択肢を読むときは、対象が人・データ・システム・組織のどれかを先に決める。",
          "examFocusZh": "读选项时先判断对象是人、数据、系统还是组织，再判断处理方式是否正确。",
          "commonMistakeJa": "関連語をすべて同じ意味として扱うと、効果や責任範囲を取り違える。",
          "commonMistakeZh": "把相关词都当成同义词会混淆效果、责任范围或适用条件。",
          "sourceRefs": [
            {
              "sourceId": "sg_security_textbook",
              "pdfPageStart": 122,
              "pdfPageEnd": 125,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-2-5 演習問題",
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
          "termJa": "演習問題",
          "termZh": "练习题",
          "english": "IT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [],
      "practiceStatus": "no_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "sg_security_textbook",
          "pdfPageStart": 122,
          "pdfPageEnd": 125,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-2-5 演習問題",
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
