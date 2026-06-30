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
      "overviewJa": "パスワードに関する攻撃は、SG攻撃手法分野でパスワード攻撃では、総当たり攻撃、辞書攻撃、パスワードリスト攻撃など、試行方法と前提となる情報が異なります。多要素認証、ロックアウト、複雑性、使い回し防止が対策として対応します。PDF 70-71ページの「パスワードに関する攻撃」を定位語に、試験では「総当たり」「辞書攻撃」「パスワードリスト」「多要素認証」「ロックアウト」が判断線です。利用者認証技術やWeb攻撃との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "密码攻击用于识别暴力破解、字典攻击、密码列表攻击等针对认证秘密的攻击。本单元依据 PDF 70-71 页的「パスワードに関する攻撃」定位，重点理解：密码攻击要看攻击者如何尝试密码：暴力破解全组合，字典攻击用常见词，列表攻击利用泄露组合。对策包括 MFA、锁定、复杂度和禁止重复使用。考试常用暴力、字典、密码列表、多因素认证、锁定是判断线索来换说法；同时要和用户认证技术或 Web 攻击区分。",
      "learningGoalJa": "問題文の条件を読み取り、「パスワードに関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "パスワードに関する攻撃を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。パスワード攻撃では、総当たり攻撃、辞書攻撃、パスワードリスト攻撃など、試行方法と前提となる情報が異なります。多要素認証、ロックアウト、複雑性、使い回し防止が対策として対応します。この関係を押さえると、パスワードに関する攻撃は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではBrute Force、Dictionary Attack、Password List Attack、MFA、Lockoutが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习密码攻击时，先判断它是在讲攻击、资产、管理还是评价。密码攻击要看攻击者如何尝试密码：暴力破解全组合，字典攻击用常见词，列表攻击利用泄露组合。对策包括 MFA、锁定、复杂度和禁止重复使用。这样可以把Brute Force、Dictionary Attack、Password List Attack、MFA、Lockout等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Brute Force",
            "Dictionary Attack",
            "Password List Attack",
            "MFA",
            "Lockout"
          ],
          "examFocusJa": "「パスワードに関する攻撃」の設問では、「総当たり」「辞書攻撃」「パスワードリスト」「多要素認証」「ロックアウト」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、利用者認証技術やWeb攻撃の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「パスワードに関する攻撃」相关题时，先抓暴力、字典、密码列表、多因素认证、锁定是判断线索。再判断题目问对象、原因、影响还是对策，并排除用户认证技术或 Web 攻击。",
          "commonMistakeJa": "「パスワードに関する攻撃」を利用者認証技術やWeb攻撃と混同すると誤答します。特に強いパスワードだけでリスト攻撃を完全に防げると考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「パスワードに関する攻撃」和用户认证技术或 Web 攻击混淆，尤其是误以为只要密码复杂就能完全防住泄露列表攻击。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、パスワードに関する攻撃が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「総当たり」「辞書攻撃」「パスワードリスト」「多要素認証」「ロックアウト」が判断線です。その語が出たら、まず识别暴力破解、字典攻击、密码列表攻击等针对认证秘密的攻击という意味に対応する日本語条件を探します。合わない場合は、利用者認証技術やWeb攻撃を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把密码攻击放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。暴力、字典、密码列表、多因素认证、锁定是判断线索。看到这些线索时，先判断是否符合“识别暴力破解、字典攻击、密码列表攻击等针对认证秘密的攻击”；如果不符合，就可能是在让你误选用户认证技术或 Web 攻击。",
          "englishTerms": [
            "Brute Force",
            "Dictionary Attack",
            "Password List Attack",
            "MFA",
            "Lockout"
          ],
          "examFocusJa": "パスワードに関する攻撃の見分け方は、「総当たり」「辞書攻撃」「パスワードリスト」「多要素認証」「ロックアウト」が判断線ですを文章中から拾い、利用者認証技術やWeb攻撃ではなくパスワードに関する攻撃を答えるべき条件かを確認することです。",
          "examFocusZh": "密码攻击的判断线索是暴力、字典、密码列表、多因素认证、锁定是判断线索，同时确认题干要求的是否是「パスワードに関する攻撃」，而不是用户认证技术或 Web 攻击。",
          "commonMistakeJa": "パスワードに関する攻撃ではなく利用者認証技術やWeb攻撃の説明を選ぶ誤りに注意します。原因は、強いパスワードだけでリスト攻撃を完全に防げると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「パスワードに関する攻撃」（密码攻击）和用户认证技术或 Web 攻击混淆。错误通常来自误以为只要密码复杂就能完全防住泄露列表攻击，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Brute Force",
          "termZh": "Brute Force",
          "english": "Brute Force"
        },
        {
          "termJa": "Dictionary Attack",
          "termZh": "Dictionary Attack",
          "english": "Dictionary Attack"
        },
        {
          "termJa": "Password List Attack",
          "termZh": "Password List Attack",
          "english": "Password List Attack"
        },
        {
          "termJa": "MFA",
          "termZh": "MFA",
          "english": "MFA"
        },
        {
          "termJa": "Lockout",
          "termZh": "Lockout",
          "english": "Lockout"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "パスワードに関する攻撃と利用者認証技術やWeb攻撃を混同する",
          "trapZh": "把密码攻击和用户认证技术或 Web 攻击混为一谈。"
        },
        {
          "trapJa": "強いパスワードだけでリスト攻撃を完全に防げると考える",
          "trapZh": "误以为只要密码复杂就能完全防住泄露列表攻击"
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
      "overviewJa": "Webサイトに関する攻撃は、SG攻撃手法分野でWeb攻撃では、入力値を検証せずSQL文やスクリプト、OSコマンドとして解釈してしまう弱点が狙われます。SQLインジェクションはDB操作、XSSは利用者ブラウザでのスクリプト実行、コマンドインジェクションはOS命令実行が焦点です。PDF 72-75ページの「Webサイトに関する攻撃」を定位語に、試験では「SQLインジェクション」「XSS」「コマンドインジェクション」「入力値検証」「エスケープ」が判断線です。通信に関する攻撃やパスワード攻撃との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "Web 站点攻击用于区分 SQL 注入、XSS、命令注入等利用输入处理弱点的攻击。本单元依据 PDF 72-75 页的「Webサイトに関する攻撃」定位，重点理解：Web 攻击常利用输入检查不足。SQL 注入操纵数据库，XSS 让脚本在用户浏览器执行，命令注入让服务器执行 OS 命令。要从“输入被当成什么执行”来区分。考试常用SQL 注入、XSS、命令注入、输入验证、转义是判断词来换说法；同时要和通信攻击或密码攻击区分。",
      "learningGoalJa": "問題文の条件を読み取り、「Webサイトに関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "Webサイトに関する攻撃を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。Web攻撃では、入力値を検証せずSQL文やスクリプト、OSコマンドとして解釈してしまう弱点が狙われます。SQLインジェクションはDB操作、XSSは利用者ブラウザでのスクリプト実行、コマンドインジェクションはOS命令実行が焦点です。この関係を押さえると、Webサイトに関する攻撃は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではSQL Injection、XSS、Command Injection、Input Validation、Escapeが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习Web 站点攻击时，先判断它是在讲攻击、资产、管理还是评价。Web 攻击常利用输入检查不足。SQL 注入操纵数据库，XSS 让脚本在用户浏览器执行，命令注入让服务器执行 OS 命令。要从“输入被当成什么执行”来区分。这样可以把SQL Injection、XSS、Command Injection、Input Validation、Escape等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "SQL Injection",
            "XSS",
            "Command Injection",
            "Input Validation",
            "Escape"
          ],
          "examFocusJa": "「Webサイトに関する攻撃」の設問では、「SQLインジェクション」「XSS」「コマンドインジェクション」「入力値検証」「エスケープ」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、通信に関する攻撃やパスワード攻撃の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「Webサイトに関する攻撃」相关题时，先抓SQL 注入、XSS、命令注入、输入验证、转义是判断词。再判断题目问对象、原因、影响还是对策，并排除通信攻击或密码攻击。",
          "commonMistakeJa": "「Webサイトに関する攻撃」を通信に関する攻撃やパスワード攻撃と混同すると誤答します。特にXSSをサーバDBだけを直接改ざんする攻撃と考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「Webサイトに関する攻撃」和通信攻击或密码攻击混淆，尤其是把 XSS 误认为直接篡改服务器数据库的攻击。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、Webサイトに関する攻撃が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「SQLインジェクション」「XSS」「コマンドインジェクション」「入力値検証」「エスケープ」が判断線です。その語が出たら、まず区分 SQL 注入、XSS、命令注入等利用输入处理弱点的攻击という意味に対応する日本語条件を探します。合わない場合は、通信に関する攻撃やパスワード攻撃を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把Web 站点攻击放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。SQL 注入、XSS、命令注入、输入验证、转义是判断词。看到这些线索时，先判断是否符合“区分 SQL 注入、XSS、命令注入等利用输入处理弱点的攻击”；如果不符合，就可能是在让你误选通信攻击或密码攻击。",
          "englishTerms": [
            "SQL Injection",
            "XSS",
            "Command Injection",
            "Input Validation",
            "Escape"
          ],
          "examFocusJa": "Webサイトに関する攻撃の見分け方は、「SQLインジェクション」「XSS」「コマンドインジェクション」「入力値検証」「エスケープ」が判断線ですを文章中から拾い、通信に関する攻撃やパスワード攻撃ではなくWebサイトに関する攻撃を答えるべき条件かを確認することです。",
          "examFocusZh": "Web 站点攻击的判断线索是SQL 注入、XSS、命令注入、输入验证、转义是判断词，同时确认题干要求的是否是「Webサイトに関する攻撃」，而不是通信攻击或密码攻击。",
          "commonMistakeJa": "Webサイトに関する攻撃ではなく通信に関する攻撃やパスワード攻撃の説明を選ぶ誤りに注意します。原因は、XSSをサーバDBだけを直接改ざんする攻撃と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「Webサイトに関する攻撃」（Web 站点攻击）和通信攻击或密码攻击混淆。错误通常来自把 XSS 误认为直接篡改服务器数据库的攻击，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "SQL Injection",
          "termZh": "SQL Injection",
          "english": "SQL Injection"
        },
        {
          "termJa": "XSS",
          "termZh": "XSS",
          "english": "XSS"
        },
        {
          "termJa": "Command Injection",
          "termZh": "Command Injection",
          "english": "Command Injection"
        },
        {
          "termJa": "Input Validation",
          "termZh": "Input Validation",
          "english": "Input Validation"
        },
        {
          "termJa": "Escape",
          "termZh": "Escape",
          "english": "Escape"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "Webサイトに関する攻撃と通信に関する攻撃やパスワード攻撃を混同する",
          "trapZh": "把Web 站点攻击和通信攻击或密码攻击混为一谈。"
        },
        {
          "trapJa": "XSSをサーバDBだけを直接改ざんする攻撃と考える",
          "trapZh": "把 XSS 误认为直接篡改服务器数据库的攻击"
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
      "overviewJa": "通信に関する攻撃は、SG攻撃手法分野で通信に関する攻撃では、盗聴は通信内容をのぞく攻撃、改ざんや中間者攻撃は経路上で内容や相手を偽る攻撃、DoS/DDoSは大量通信でサービスを妨害する攻撃です。機密性、完全性、可用性のどれを狙うかで分けます。PDF 76-79ページの「通信に関する攻撃」を定位語に、試験では「盗聴」「中間者攻撃」「DoS」「DDoS」「改ざん」「通信経路」が判断線です。Web入力攻撃やマルウェア感染との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "通信攻击用于理解窃听、DoS/DDoS、中间人攻击等针对通信路径或服务可用性的攻击。本单元依据 PDF 76-79 页的「通信に関する攻撃」定位，重点理解：通信攻击要看目标：窃听损害机密性，中间人可能破坏完整性和真实性，DoS/DDoS 主要破坏可用性。判断时要把攻击方式和 CIA 影响对应起来。考试常用窃听、中间人、DoS、DDoS、篡改、通信路径是判断线索来换说法；同时要和Web 输入攻击或恶意软件感染区分。",
      "learningGoalJa": "問題文の条件を読み取り、「通信に関する攻撃」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "通信に関する攻撃を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。通信に関する攻撃では、盗聴は通信内容をのぞく攻撃、改ざんや中間者攻撃は経路上で内容や相手を偽る攻撃、DoS/DDoSは大量通信でサービスを妨害する攻撃です。機密性、完全性、可用性のどれを狙うかで分けます。この関係を押さえると、通信に関する攻撃は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではEavesdropping、Man-in-the-middle、DoS、DDoS、Tamperingが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习通信攻击时，先判断它是在讲攻击、资产、管理还是评价。通信攻击要看目标：窃听损害机密性，中间人可能破坏完整性和真实性，DoS/DDoS 主要破坏可用性。判断时要把攻击方式和 CIA 影响对应起来。这样可以把Eavesdropping、Man-in-the-middle、DoS、DDoS、Tampering等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Eavesdropping",
            "Man-in-the-middle",
            "DoS",
            "DDoS",
            "Tampering"
          ],
          "examFocusJa": "「通信に関する攻撃」の設問では、「盗聴」「中間者攻撃」「DoS」「DDoS」「改ざん」「通信経路」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、Web入力攻撃やマルウェア感染の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「通信に関する攻撃」相关题时，先抓窃听、中间人、DoS、DDoS、篡改、通信路径是判断线索。再判断题目问对象、原因、影响还是对策，并排除Web 输入攻击或恶意软件感染。",
          "commonMistakeJa": "「通信に関する攻撃」をWeb入力攻撃やマルウェア感染と混同すると誤答します。特にDoSを情報を盗み出す攻撃と考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「通信に関する攻撃」和Web 输入攻击或恶意软件感染混淆，尤其是把 DoS 误认为窃取信息的攻击。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、通信に関する攻撃が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「盗聴」「中間者攻撃」「DoS」「DDoS」「改ざん」「通信経路」が判断線です。その語が出たら、まず理解窃听、DoS/DDoS、中间人攻击等针对通信路径或服务可用性的攻击という意味に対応する日本語条件を探します。合わない場合は、Web入力攻撃やマルウェア感染を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把通信攻击放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。窃听、中间人、DoS、DDoS、篡改、通信路径是判断线索。看到这些线索时，先判断是否符合“理解窃听、DoS/DDoS、中间人攻击等针对通信路径或服务可用性的攻击”；如果不符合，就可能是在让你误选Web 输入攻击或恶意软件感染。",
          "englishTerms": [
            "Eavesdropping",
            "Man-in-the-middle",
            "DoS",
            "DDoS",
            "Tampering"
          ],
          "examFocusJa": "通信に関する攻撃の見分け方は、「盗聴」「中間者攻撃」「DoS」「DDoS」「改ざん」「通信経路」が判断線ですを文章中から拾い、Web入力攻撃やマルウェア感染ではなく通信に関する攻撃を答えるべき条件かを確認することです。",
          "examFocusZh": "通信攻击的判断线索是窃听、中间人、DoS、DDoS、篡改、通信路径是判断线索，同时确认题干要求的是否是「通信に関する攻撃」，而不是Web 输入攻击或恶意软件感染。",
          "commonMistakeJa": "通信に関する攻撃ではなくWeb入力攻撃やマルウェア感染の説明を選ぶ誤りに注意します。原因は、DoSを情報を盗み出す攻撃と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「通信に関する攻撃」（通信攻击）和Web 输入攻击或恶意软件感染混淆。错误通常来自把 DoS 误认为窃取信息的攻击，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Eavesdropping",
          "termZh": "Eavesdropping",
          "english": "Eavesdropping"
        },
        {
          "termJa": "Man-in-the-middle",
          "termZh": "Man-in-the-middle",
          "english": "Man-in-the-middle"
        },
        {
          "termJa": "DoS",
          "termZh": "DoS",
          "english": "DoS"
        },
        {
          "termJa": "DDoS",
          "termZh": "DDoS",
          "english": "DDoS"
        },
        {
          "termJa": "Tampering",
          "termZh": "Tampering",
          "english": "Tampering"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "通信に関する攻撃とWeb入力攻撃やマルウェア感染を混同する",
          "trapZh": "把通信攻击和Web 输入攻击或恶意软件感染混为一谈。"
        },
        {
          "trapJa": "DoSを情報を盗み出す攻撃と考える",
          "trapZh": "把 DoS 误认为窃取信息的攻击"
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
      "overviewJa": "標的型攻撃・その他は、SG攻撃手法分野で標的型攻撃は、特定の組織や人物を調べ、メール、添付ファイル、脆弱性、内部侵入後の横展開を組み合わせます。その他の攻撃も、技術だけでなく人の心理や運用の弱点を使う点を読む必要があります。PDF 80-84ページの「標的型攻撃」を定位語に、試験では「標的型攻撃」「ソーシャルエンジニアリング」「ゼロデイ」「なりすまし」「情報収集」が判断線です。一般的なマルウェア分類や通信攻撃との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "定向攻击与其他攻击用于理解特定组织を狙う攻撃、ソーシャルエンジニアリング、ゼロデイなど複合的な手口。本单元依据 PDF 80-84 页的「標的型攻撃」定位，重点理解：定向攻击会调查特定组织或个人，把邮件、附件、漏洞利用、入侵后的横向移动组合起来。其他攻击也常利用人的心理和运用弱点，不只是技术漏洞。考试常用定向攻击、社会工程、零日、冒充、信息收集是判断词来换说法；同时要和普通恶意软件分类或通信攻击区分。",
      "learningGoalJa": "問題文の条件を読み取り、「標的型攻撃・その他」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“標的型攻撃、そ的他”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "標的型攻撃・その他を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。標的型攻撃は、特定の組織や人物を調べ、メール、添付ファイル、脆弱性、内部侵入後の横展開を組み合わせます。その他の攻撃も、技術だけでなく人の心理や運用の弱点を使う点を読む必要があります。この関係を押さえると、標的型攻撃・その他は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではTargeted Attack、Social Engineering、Zero-day、Spoofing、Reconnaissanceが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习定向攻击与其他攻击时，先判断它是在讲攻击、资产、管理还是评价。定向攻击会调查特定组织或个人，把邮件、附件、漏洞利用、入侵后的横向移动组合起来。其他攻击也常利用人的心理和运用弱点，不只是技术漏洞。这样可以把Targeted Attack、Social Engineering、Zero-day、Spoofing、Reconnaissance等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Targeted Attack",
            "Social Engineering",
            "Zero-day",
            "Spoofing",
            "Reconnaissance"
          ],
          "examFocusJa": "「標的型攻撃・その他」の設問では、「標的型攻撃」「ソーシャルエンジニアリング」「ゼロデイ」「なりすまし」「情報収集」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、一般的なマルウェア分類や通信攻撃の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「標的型攻撃・その他」相关题时，先抓定向攻击、社会工程、零日、冒充、信息收集是判断词。再判断题目问对象、原因、影响还是对策，并排除普通恶意软件分类或通信攻击。",
          "commonMistakeJa": "「標的型攻撃・その他」を一般的なマルウェア分類や通信攻撃と混同すると誤答します。特に標的型攻撃を不特定多数への単純なばらまきメールと考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「標的型攻撃・その他」和普通恶意软件分类或通信攻击混淆，尤其是把定向攻击误解成面向不特定多数的普通群发邮件。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、標的型攻撃・その他が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「標的型攻撃」「ソーシャルエンジニアリング」「ゼロデイ」「なりすまし」「情報収集」が判断線です。その語が出たら、まず理解特定组织を狙う攻撃、ソーシャルエンジニアリング、ゼロデイなど複合的な手口という意味に対応する日本語条件を探します。合わない場合は、一般的なマルウェア分類や通信攻撃を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把定向攻击与其他攻击放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。定向攻击、社会工程、零日、冒充、信息收集是判断词。看到这些线索时，先判断是否符合“理解特定组织を狙う攻撃、ソーシャルエンジニアリング、ゼロデイなど複合的な手口”；如果不符合，就可能是在让你误选普通恶意软件分类或通信攻击。",
          "englishTerms": [
            "Targeted Attack",
            "Social Engineering",
            "Zero-day",
            "Spoofing",
            "Reconnaissance"
          ],
          "examFocusJa": "標的型攻撃・その他の見分け方は、「標的型攻撃」「ソーシャルエンジニアリング」「ゼロデイ」「なりすまし」「情報収集」が判断線ですを文章中から拾い、一般的なマルウェア分類や通信攻撃ではなく標的型攻撃・その他を答えるべき条件かを確認することです。",
          "examFocusZh": "定向攻击与其他攻击的判断线索是定向攻击、社会工程、零日、冒充、信息收集是判断词，同时确认题干要求的是否是「標的型攻撃・その他」，而不是普通恶意软件分类或通信攻击。",
          "commonMistakeJa": "標的型攻撃・その他ではなく一般的なマルウェア分類や通信攻撃の説明を選ぶ誤りに注意します。原因は、標的型攻撃を不特定多数への単純なばらまきメールと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「標的型攻撃・その他」（定向攻击与其他攻击）和普通恶意软件分类或通信攻击混淆。错误通常来自把定向攻击误解成面向不特定多数的普通群发邮件，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Targeted Attack",
          "termZh": "Targeted Attack",
          "english": "Targeted Attack"
        },
        {
          "termJa": "Social Engineering",
          "termZh": "Social Engineering",
          "english": "Social Engineering"
        },
        {
          "termJa": "Zero-day",
          "termZh": "Zero-day",
          "english": "Zero-day"
        },
        {
          "termJa": "Spoofing",
          "termZh": "Spoofing",
          "english": "Spoofing"
        },
        {
          "termJa": "Reconnaissance",
          "termZh": "Reconnaissance",
          "english": "Reconnaissance"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "標的型攻撃・その他と一般的なマルウェア分類や通信攻撃を混同する",
          "trapZh": "把定向攻击与其他攻击和普通恶意软件分类或通信攻击混为一谈。"
        },
        {
          "trapJa": "標的型攻撃を不特定多数への単純なばらまきメールと考える",
          "trapZh": "把定向攻击误解成面向不特定多数的普通群发邮件"
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
      "overviewJa": "演習問題は、SG演習分野で演習問題では、攻撃名と被害だけでなく、入口、対象、利用された弱点、CIAへの影響が問われます。選択肢を読むときは、攻撃が認証情報、Web入力、通信経路、組織特定のどこを狙うかを分けます。PDF 85-93ページの「演習問題」を定位語に、試験では「演習問題」「攻撃手法」「入口」「弱点」「CIA」「対策」が判断線です。単一攻撃名の丸暗記との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "攻击手法演习问题用于用题目检查密码、Web、通信、定向攻击的区分是否能按条件判断。本单元依据 PDF 85-93 页的「演習問題」定位，重点理解：本节演习把密码攻击、Web 攻击、通信攻击、定向攻击混在一起考。做题时先看入口和目标，再看利用的是密码、输入栏、通信路径还是组织情报。考试常用演习问题、攻击手法、入口、弱点、CIA、对策是判断线索来换说法；同时要和只背单个攻击名称区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。演習問題では、攻撃名と被害だけでなく、入口、対象、利用された弱点、CIAへの影響が問われます。選択肢を読むときは、攻撃が認証情報、Web入力、通信経路、組織特定のどこを狙うかを分けます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではExercise、Attack Vector、CIA、Vulnerability、Controlが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习攻击手法演习问题时，先判断它是在讲攻击、资产、管理还是评价。本节演习把密码攻击、Web 攻击、通信攻击、定向攻击混在一起考。做题时先看入口和目标，再看利用的是密码、输入栏、通信路径还是组织情报。这样可以把Exercise、Attack Vector、CIA、Vulnerability、Control等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Attack Vector",
            "CIA",
            "Vulnerability",
            "Control"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「攻撃手法」「入口」「弱点」「CIA」「対策」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、単一攻撃名の丸暗記の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、攻击手法、入口、弱点、CIA、对策是判断线索。再判断题目问对象、原因、影响还是对策，并排除只背单个攻击名称。",
          "commonMistakeJa": "「演習問題」を単一攻撃名の丸暗記と混同すると誤答します。特に攻撃名だけを見て、問題文の侵入口を読まない場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和只背单个攻击名称混淆，尤其是只看攻击名称，不读题干中的侵入口。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「演習問題」「攻撃手法」「入口」「弱点」「CIA」「対策」が判断線です。その語が出たら、まず用题目检查密码、Web、通信、定向攻击的区分是否能按条件判断という意味に対応する日本語条件を探します。合わない場合は、単一攻撃名の丸暗記を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把攻击手法演习问题放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。演习问题、攻击手法、入口、弱点、CIA、对策是判断线索。看到这些线索时，先判断是否符合“用题目检查密码、Web、通信、定向攻击的区分是否能按条件判断”；如果不符合，就可能是在让你误选只背单个攻击名称。",
          "englishTerms": [
            "Exercise",
            "Attack Vector",
            "CIA",
            "Vulnerability",
            "Control"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「攻撃手法」「入口」「弱点」「CIA」「対策」が判断線ですを文章中から拾い、単一攻撃名の丸暗記ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "攻击手法演习问题的判断线索是演习问题、攻击手法、入口、弱点、CIA、对策是判断线索，同时确认题干要求的是否是「演習問題」，而不是只背单个攻击名称。",
          "commonMistakeJa": "演習問題ではなく単一攻撃名の丸暗記の説明を選ぶ誤りに注意します。原因は、攻撃名だけを見て、問題文の侵入口を読まないときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（攻击手法演习问题）和只背单个攻击名称混淆。错误通常来自只看攻击名称，不读题干中的侵入口，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Exercise",
          "termZh": "Exercise",
          "english": "Exercise"
        },
        {
          "termJa": "Attack Vector",
          "termZh": "Attack Vector",
          "english": "Attack Vector"
        },
        {
          "termJa": "CIA",
          "termZh": "CIA",
          "english": "CIA"
        },
        {
          "termJa": "Vulnerability",
          "termZh": "Vulnerability",
          "english": "Vulnerability"
        },
        {
          "termJa": "Control",
          "termZh": "Control",
          "english": "Control"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と単一攻撃名の丸暗記を混同する",
          "trapZh": "把攻击手法演习问题和只背单个攻击名称混为一谈。"
        },
        {
          "trapJa": "攻撃名だけを見て、問題文の侵入口を読まない",
          "trapZh": "只看攻击名称，不读题干中的侵入口"
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
      "overviewJa": "暗号化技術は、SG対策技術分野で暗号化技術では、共通鍵暗号方式、公開鍵暗号方式、ハッシュ関数を目的で分けます。共通鍵は高速だが鍵配送が課題、公開鍵は鍵配送を容易にし、ハッシュは復号ではなく改ざん検知に使います。PDF 94-103ページの「暗号化技術」を定位語に、試験では「共通鍵」「公開鍵」「秘密鍵」「ハッシュ」「復号」「鍵配送」が判断線です。認証技術やデジタル署名との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "加密技术用于用共通鍵、公開鍵、ハッシュ等机制保护机密性和完整性。本单元依据 PDF 94-103 页的「暗号化技術」定位，重点理解：加密技术要按目的区分：对称加密快但密钥分发困难，公开密钥加密便于分发，Hash 不用于解密而用于完整性确认。考试常用对称密钥、公钥、私钥、Hash、解密、密钥分发是判断词来换说法；同时要和认证技术或数字签名区分。",
      "learningGoalJa": "問題文の条件を読み取り、「暗号化技術」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "暗号化技術を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。暗号化技術では、共通鍵暗号方式、公開鍵暗号方式、ハッシュ関数を目的で分けます。共通鍵は高速だが鍵配送が課題、公開鍵は鍵配送を容易にし、ハッシュは復号ではなく改ざん検知に使います。この関係を押さえると、暗号化技術は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではAES、RSA、Public Key、Private Key、Hash、Encryptionが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习加密技术时，先判断它是在讲攻击、资产、管理还是评价。加密技术要按目的区分：对称加密快但密钥分发困难，公开密钥加密便于分发，Hash 不用于解密而用于完整性确认。这样可以把AES、RSA、Public Key、Private Key、Hash、Encryption等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "AES",
            "RSA",
            "Public Key",
            "Private Key",
            "Hash",
            "Encryption"
          ],
          "examFocusJa": "「暗号化技術」の設問では、「共通鍵」「公開鍵」「秘密鍵」「ハッシュ」「復号」「鍵配送」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、認証技術やデジタル署名の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「暗号化技術」相关题时，先抓对称密钥、公钥、私钥、Hash、解密、密钥分发是判断词。再判断题目问对象、原因、影响还是对策，并排除认证技术或数字签名。",
          "commonMistakeJa": "「暗号化技術」を認証技術やデジタル署名と混同すると誤答します。特にハッシュ値を復号できる暗号文と考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「暗号化技術」和认证技术或数字签名混淆，尤其是把 Hash 值误认为可解密的密文。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、暗号化技術が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「共通鍵」「公開鍵」「秘密鍵」「ハッシュ」「復号」「鍵配送」が判断線です。その語が出たら、まず用共通鍵、公開鍵、ハッシュ等机制保护机密性和完整性という意味に対応する日本語条件を探します。合わない場合は、認証技術やデジタル署名を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把加密技术放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。对称密钥、公钥、私钥、Hash、解密、密钥分发是判断词。看到这些线索时，先判断是否符合“用共通鍵、公開鍵、ハッシュ等机制保护机密性和完整性”；如果不符合，就可能是在让你误选认证技术或数字签名。",
          "englishTerms": [
            "AES",
            "RSA",
            "Public Key",
            "Private Key",
            "Hash",
            "Encryption"
          ],
          "examFocusJa": "暗号化技術の見分け方は、「共通鍵」「公開鍵」「秘密鍵」「ハッシュ」「復号」「鍵配送」が判断線ですを文章中から拾い、認証技術やデジタル署名ではなく暗号化技術を答えるべき条件かを確認することです。",
          "examFocusZh": "加密技术的判断线索是对称密钥、公钥、私钥、Hash、解密、密钥分发是判断词，同时确认题干要求的是否是「暗号化技術」，而不是认证技术或数字签名。",
          "commonMistakeJa": "暗号化技術ではなく認証技術やデジタル署名の説明を選ぶ誤りに注意します。原因は、ハッシュ値を復号できる暗号文と考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「暗号化技術」（加密技术）和认证技术或数字签名混淆。错误通常来自把 Hash 值误认为可解密的密文，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "AES",
          "termZh": "AES",
          "english": "AES"
        },
        {
          "termJa": "RSA",
          "termZh": "RSA",
          "english": "RSA"
        },
        {
          "termJa": "Public Key",
          "termZh": "Public Key",
          "english": "Public Key"
        },
        {
          "termJa": "Private Key",
          "termZh": "Private Key",
          "english": "Private Key"
        },
        {
          "termJa": "Hash",
          "termZh": "Hash",
          "english": "Hash"
        },
        {
          "termJa": "Encryption",
          "termZh": "Encryption",
          "english": "Encryption"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "暗号化技術と認証技術やデジタル署名を混同する",
          "trapZh": "把加密技术和认证技术或数字签名混为一谈。"
        },
        {
          "trapJa": "ハッシュ値を復号できる暗号文と考える",
          "trapZh": "把 Hash 值误认为可解密的密文"
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
      "overviewJa": "認証技術は、SG対策技術分野で認証技術では、利用者認証、メッセージ認証、デジタル署名などを目的で分けます。本人確認、改ざん検知、送信者の否認防止は似ていますが、使う技術と証明したい内容が異なります。PDF 104-109ページの「認証技術」を定位語に、試験では「認証」「メッセージ認証」「デジタル署名」「改ざん検知」「否認防止」が判断線です。暗号化技術や利用者認証だけの説明との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "认证技术用于确认通信相手、利用者、消息是否真实，并支撑改ざん検知和否認防止。本单元依据 PDF 104-109 页的「認証技術」定位，重点理解：认证技术要区分用户认证、消息认证、数字签名。本人确认、篡改检测、抗抵赖看起来相近，但使用技术和要证明的对象不同。考试常用认证、消息认证、数字签名、篡改检测、抗抵赖是判断词来换说法；同时要和加密技术或单纯用户认证区分。",
      "learningGoalJa": "問題文の条件を読み取り、「認証技術」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "認証技術を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。認証技術では、利用者認証、メッセージ認証、デジタル署名などを目的で分けます。本人確認、改ざん検知、送信者の否認防止は似ていますが、使う技術と証明したい内容が異なります。この関係を押さえると、認証技術は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではAuthentication、Message Authentication、Digital Signature、MAC、Non-repudiationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习认证技术时，先判断它是在讲攻击、资产、管理还是评价。认证技术要区分用户认证、消息认证、数字签名。本人确认、篡改检测、抗抵赖看起来相近，但使用技术和要证明的对象不同。这样可以把Authentication、Message Authentication、Digital Signature、MAC、Non-repudiation等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Authentication",
            "Message Authentication",
            "Digital Signature",
            "MAC",
            "Non-repudiation"
          ],
          "examFocusJa": "「認証技術」の設問では、「認証」「メッセージ認証」「デジタル署名」「改ざん検知」「否認防止」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、暗号化技術や利用者認証だけの説明の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「認証技術」相关题时，先抓认证、消息认证、数字签名、篡改检测、抗抵赖是判断词。再判断题目问对象、原因、影响还是对策，并排除加密技术或单纯用户认证。",
          "commonMistakeJa": "「認証技術」を暗号化技術や利用者認証だけの説明と混同すると誤答します。特に暗号化できれば相手の本人性も常に確認できると考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「認証技術」和加密技术或单纯用户认证混淆，尤其是误以为能加密就一定能确认对方身份。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、認証技術が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「認証」「メッセージ認証」「デジタル署名」「改ざん検知」「否認防止」が判断線です。その語が出たら、まず确认通信相手、利用者、消息是否真实，并支撑改ざん検知和否認防止という意味に対応する日本語条件を探します。合わない場合は、暗号化技術や利用者認証だけの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把认证技术放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。认证、消息认证、数字签名、篡改检测、抗抵赖是判断词。看到这些线索时，先判断是否符合“确认通信相手、利用者、消息是否真实，并支撑改ざん検知和否認防止”；如果不符合，就可能是在让你误选加密技术或单纯用户认证。",
          "englishTerms": [
            "Authentication",
            "Message Authentication",
            "Digital Signature",
            "MAC",
            "Non-repudiation"
          ],
          "examFocusJa": "認証技術の見分け方は、「認証」「メッセージ認証」「デジタル署名」「改ざん検知」「否認防止」が判断線ですを文章中から拾い、暗号化技術や利用者認証だけの説明ではなく認証技術を答えるべき条件かを確認することです。",
          "examFocusZh": "认证技术的判断线索是认证、消息认证、数字签名、篡改检测、抗抵赖是判断词，同时确认题干要求的是否是「認証技術」，而不是加密技术或单纯用户认证。",
          "commonMistakeJa": "認証技術ではなく暗号化技術や利用者認証だけの説明の説明を選ぶ誤りに注意します。原因は、暗号化できれば相手の本人性も常に確認できると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「認証技術」（认证技术）和加密技术或单纯用户认证混淆。错误通常来自误以为能加密就一定能确认对方身份，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Authentication",
          "termZh": "Authentication",
          "english": "Authentication"
        },
        {
          "termJa": "Message Authentication",
          "termZh": "Message Authentication",
          "english": "Message Authentication"
        },
        {
          "termJa": "Digital Signature",
          "termZh": "Digital Signature",
          "english": "Digital Signature"
        },
        {
          "termJa": "MAC",
          "termZh": "MAC",
          "english": "MAC"
        },
        {
          "termJa": "Non-repudiation",
          "termZh": "Non-repudiation",
          "english": "Non-repudiation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "認証技術と暗号化技術や利用者認証だけの説明を混同する",
          "trapZh": "把认证技术和加密技术或单纯用户认证混为一谈。"
        },
        {
          "trapJa": "暗号化できれば相手の本人性も常に確認できると考える",
          "trapZh": "误以为能加密就一定能确认对方身份"
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
      "overviewJa": "利用者認証・生体認証は、SG対策技術分野で利用者認証は、知識情報、所持情報、生体情報を組み合わせます。生体認証は便利ですが、本人拒否率や他人受入率、登録データの保護を考える必要があります。多要素認証は異なる要素を組み合わせる点が重要です。PDF 110-116ページの「利用者認証」を定位語に、試験では「知識情報」「所持情報」「生体情報」「多要素認証」「本人拒否率」「他人受入率」が判断線です。認可やアクセス権限管理との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "用户认证与生物识别用于通过知识、持有物、生体特征等要素确认使用者本人。本单元依据 PDF 110-116 页的「利用者認証」定位，重点理解：用户认证用知识、持有物、生物特征确认本人。生物识别便利，但要看本人拒绝率、他人接受率和模板数据保护。多因素认证必须组合不同类别的要素。考试常用知识要素、持有物、生物要素、多因素、本人拒绝率、他人接受率是判断词来换说法；同时要和授权或访问权限管理区分。",
      "learningGoalJa": "問題文の条件を読み取り、「利用者認証・生体認証」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "利用者認証・生体認証を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。利用者認証は、知識情報、所持情報、生体情報を組み合わせます。生体認証は便利ですが、本人拒否率や他人受入率、登録データの保護を考える必要があります。多要素認証は異なる要素を組み合わせる点が重要です。この関係を押さえると、利用者認証・生体認証は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではMFA、Biometrics、FRR、FAR、Password、Tokenが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习用户认证与生物识别时，先判断它是在讲攻击、资产、管理还是评价。用户认证用知识、持有物、生物特征确认本人。生物识别便利，但要看本人拒绝率、他人接受率和模板数据保护。多因素认证必须组合不同类别的要素。这样可以把MFA、Biometrics、FRR、FAR、Password、Token等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "MFA",
            "Biometrics",
            "FRR",
            "FAR",
            "Password",
            "Token"
          ],
          "examFocusJa": "「利用者認証・生体認証」の設問では、「知識情報」「所持情報」「生体情報」「多要素認証」「本人拒否率」「他人受入率」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、認可やアクセス権限管理の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「利用者認証・生体認証」相关题时，先抓知识要素、持有物、生物要素、多因素、本人拒绝率、他人接受率是判断词。再判断题目问对象、原因、影响还是对策，并排除授权或访问权限管理。",
          "commonMistakeJa": "「利用者認証・生体認証」を認可やアクセス権限管理と混同すると誤答します。特に認証が成功すれば全権限を与えてよいと考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「利用者認証・生体認証」和授权或访问权限管理混淆，尤其是误以为认证成功就可以给全部权限。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、利用者認証・生体認証が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「知識情報」「所持情報」「生体情報」「多要素認証」「本人拒否率」「他人受入率」が判断線です。その語が出たら、まず通过知识、持有物、生体特征等要素确认使用者本人という意味に対応する日本語条件を探します。合わない場合は、認可やアクセス権限管理を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把用户认证与生物识别放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。知识要素、持有物、生物要素、多因素、本人拒绝率、他人接受率是判断词。看到这些线索时，先判断是否符合“通过知识、持有物、生体特征等要素确认使用者本人”；如果不符合，就可能是在让你误选授权或访问权限管理。",
          "englishTerms": [
            "MFA",
            "Biometrics",
            "FRR",
            "FAR",
            "Password",
            "Token"
          ],
          "examFocusJa": "利用者認証・生体認証の見分け方は、「知識情報」「所持情報」「生体情報」「多要素認証」「本人拒否率」「他人受入率」が判断線ですを文章中から拾い、認可やアクセス権限管理ではなく利用者認証・生体認証を答えるべき条件かを確認することです。",
          "examFocusZh": "用户认证与生物识别的判断线索是知识要素、持有物、生物要素、多因素、本人拒绝率、他人接受率是判断词，同时确认题干要求的是否是「利用者認証・生体認証」，而不是授权或访问权限管理。",
          "commonMistakeJa": "利用者認証・生体認証ではなく認可やアクセス権限管理の説明を選ぶ誤りに注意します。原因は、認証が成功すれば全権限を与えてよいと考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「利用者認証・生体認証」（用户认证与生物识别）和授权或访问权限管理混淆。错误通常来自误以为认证成功就可以给全部权限，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "MFA",
          "termZh": "MFA",
          "english": "MFA"
        },
        {
          "termJa": "Biometrics",
          "termZh": "Biometrics",
          "english": "Biometrics"
        },
        {
          "termJa": "FRR",
          "termZh": "FRR",
          "english": "FRR"
        },
        {
          "termJa": "FAR",
          "termZh": "FAR",
          "english": "FAR"
        },
        {
          "termJa": "Password",
          "termZh": "Password",
          "english": "Password"
        },
        {
          "termJa": "Token",
          "termZh": "Token",
          "english": "Token"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "利用者認証・生体認証と認可やアクセス権限管理を混同する",
          "trapZh": "把用户认证与生物识别和授权或访问权限管理混为一谈。"
        },
        {
          "trapJa": "認証が成功すれば全権限を与えてよいと考える",
          "trapZh": "误以为认证成功就可以给全部权限"
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
      "overviewJa": "公開鍵基盤は、SG対策技術分野で公開鍵基盤では、認証局が公開鍵証明書を発行し、公開鍵と所有者の対応を信頼できる形にします。利用者は証明書の有効性を確認し、デジタル署名やHTTPSなどで相手確認や安全な通信に使います。PDF 117-121ページの「公開鍵基盤」を定位語に、試験では「認証局」「公開鍵証明書」「PKI」「証明書失効」「デジタル署名」「HTTPS」が判断線です。暗号化技術単体や利用者認証との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "公钥基础设施用于用 CA、数字证书和公开密钥体系确认公开密钥属于谁。本单元依据 PDF 117-121 页的「公開鍵基盤」定位，重点理解：PKI 通过 CA 发行数字证书，把公开密钥和所有者绑定。使用者要验证证书有效性，再在数字签名、HTTPS 等场景中确认对方或建立安全通信。考试常用CA、公开密钥证书、PKI、证书失效、数字签名、HTTPS 是判断词来换说法；同时要和单纯加密技术或用户认证区分。",
      "learningGoalJa": "問題文の条件を読み取り、「公開鍵基盤」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "公開鍵基盤を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。公開鍵基盤では、認証局が公開鍵証明書を発行し、公開鍵と所有者の対応を信頼できる形にします。利用者は証明書の有効性を確認し、デジタル署名やHTTPSなどで相手確認や安全な通信に使います。この関係を押さえると、公開鍵基盤は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではPKI、CA、Certificate、CRL、Digital Signature、HTTPSが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习公钥基础设施时，先判断它是在讲攻击、资产、管理还是评价。PKI 通过 CA 发行数字证书，把公开密钥和所有者绑定。使用者要验证证书有效性，再在数字签名、HTTPS 等场景中确认对方或建立安全通信。这样可以把PKI、CA、Certificate、CRL、Digital Signature、HTTPS等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "PKI",
            "CA",
            "Certificate",
            "CRL",
            "Digital Signature",
            "HTTPS"
          ],
          "examFocusJa": "「公開鍵基盤」の設問では、「認証局」「公開鍵証明書」「PKI」「証明書失効」「デジタル署名」「HTTPS」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、暗号化技術単体や利用者認証の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「公開鍵基盤」相关题时，先抓CA、公开密钥证书、PKI、证书失效、数字签名、HTTPS 是判断词。再判断题目问对象、原因、影响还是对策，并排除单纯加密技术或用户认证。",
          "commonMistakeJa": "「公開鍵基盤」を暗号化技術単体や利用者認証と混同すると誤答します。特にCAが通信内容そのものの正しさを証明すると考える場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「公開鍵基盤」和单纯加密技术或用户认证混淆，尤其是误以为 CA 证明通信内容本身正确。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、公開鍵基盤が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「認証局」「公開鍵証明書」「PKI」「証明書失効」「デジタル署名」「HTTPS」が判断線です。その語が出たら、まず用 CA、数字证书和公开密钥体系确认公开密钥属于谁という意味に対応する日本語条件を探します。合わない場合は、暗号化技術単体や利用者認証を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把公钥基础设施放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。CA、公开密钥证书、PKI、证书失效、数字签名、HTTPS 是判断词。看到这些线索时，先判断是否符合“用 CA、数字证书和公开密钥体系确认公开密钥属于谁”；如果不符合，就可能是在让你误选单纯加密技术或用户认证。",
          "englishTerms": [
            "PKI",
            "CA",
            "Certificate",
            "CRL",
            "Digital Signature",
            "HTTPS"
          ],
          "examFocusJa": "公開鍵基盤の見分け方は、「認証局」「公開鍵証明書」「PKI」「証明書失効」「デジタル署名」「HTTPS」が判断線ですを文章中から拾い、暗号化技術単体や利用者認証ではなく公開鍵基盤を答えるべき条件かを確認することです。",
          "examFocusZh": "公钥基础设施的判断线索是CA、公开密钥证书、PKI、证书失效、数字签名、HTTPS 是判断词，同时确认题干要求的是否是「公開鍵基盤」，而不是单纯加密技术或用户认证。",
          "commonMistakeJa": "公開鍵基盤ではなく暗号化技術単体や利用者認証の説明を選ぶ誤りに注意します。原因は、CAが通信内容そのものの正しさを証明すると考えるときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「公開鍵基盤」（公钥基础设施）和单纯加密技术或用户认证混淆。错误通常来自误以为 CA 证明通信内容本身正确，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "PKI",
          "termZh": "PKI",
          "english": "PKI"
        },
        {
          "termJa": "CA",
          "termZh": "CA",
          "english": "CA"
        },
        {
          "termJa": "Certificate",
          "termZh": "Certificate",
          "english": "Certificate"
        },
        {
          "termJa": "CRL",
          "termZh": "CRL",
          "english": "CRL"
        },
        {
          "termJa": "Digital Signature",
          "termZh": "Digital Signature",
          "english": "Digital Signature"
        },
        {
          "termJa": "HTTPS",
          "termZh": "HTTPS",
          "english": "HTTPS"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "公開鍵基盤と暗号化技術単体や利用者認証を混同する",
          "trapZh": "把公钥基础设施和单纯加密技术或用户认证混为一谈。"
        },
        {
          "trapJa": "CAが通信内容そのものの正しさを証明すると考える",
          "trapZh": "误以为 CA 证明通信内容本身正确"
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
      "overviewJa": "演習問題は、SG演習分野で演習問題では、暗号化、認証、署名、証明書を組み合わせて問われます。どの技術が機密性、完全性、本人確認、否認防止のどれを支えるかを整理してから選択肢を読みます。PDF 122-125ページの「演習問題」を定位語に、試験では「演習問題」「暗号化」「認証」「証明書」「公開鍵」「否認防止」が判断線です。攻撃手法の名称問題との違いを押さえると、SGの事例問題でも条件から判断できます。",
      "overviewZh": "密码与认证演习问题用于检查加密、认证、生物识别、PKI 的目的和使用条件是否能区分。本单元依据 PDF 122-125 页的「演習問題」定位，重点理解：本节演习会把加密、认证、签名、证书放在一起考。先判断题目要保护机密性、完整性、本人性还是抗抵赖，再选择对应技术。考试常用演习问题、加密、认证、证书、公钥、抗抵赖是判断线索来换说法；同时要和攻击手法名称题区分。",
      "learningGoalJa": "問題文の条件を読み取り、「演習問題」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“练习题”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "演習問題を学ぶときは、攻撃、資産、管理、又は評価のどこに位置付く単元なのかを先に決めます。演習問題では、暗号化、認証、署名、証明書を組み合わせて問われます。どの技術が機密性、完全性、本人確認、否認防止のどれを支えるかを整理してから選択肢を読みます。この関係を押さえると、演習問題は単なる用語ではなく、SGの事例文で原因、影響、対策を結び付けるための判断軸になります。英語表記ではExercise、Encryption、Authentication、Certificate、Public Key、Non-repudiationが出やすいため、略語と役割を対応させます。",
          "explanationZh": "学习密码与认证演习问题时，先判断它是在讲攻击、资产、管理还是评价。本节演习会把加密、认证、签名、证书放在一起考。先判断题目要保护机密性、完整性、本人性还是抗抵赖，再选择对应技术。这样可以把Exercise、Encryption、Authentication、Certificate、Public Key、Non-repudiation等术语和具体职责、影响或对策对应起来，遇到 SG 案例题时不会只按词面选择。",
          "englishTerms": [
            "Exercise",
            "Encryption",
            "Authentication",
            "Certificate",
            "Public Key",
            "Non-repudiation"
          ],
          "examFocusJa": "「演習問題」の設問では、「演習問題」「暗号化」「認証」「証明書」「公開鍵」「否認防止」が判断線です。まず対象、原因、影響、対策のどれを問うているかを確認し、攻撃手法の名称問題の説明と混ぜないことが判断線です。",
          "examFocusZh": "看到「演習問題」相关题时，先抓演习问题、加密、认证、证书、公钥、抗抵赖是判断线索。再判断题目问对象、原因、影响还是对策，并排除攻击手法名称题。",
          "commonMistakeJa": "「演習問題」を攻撃手法の名称問題と混同すると誤答します。特に技術名だけで目的を読まずに選ぶ場合、事例文の被害、原因、対策の対応関係を読み落とします。",
          "commonMistakeZh": "常见错误是把「演習問題」和攻击手法名称题混淆，尤其是只看技术名，不判断它要达成的安全目的。要回到案例里的受害对象、原因和对策。",
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
          "headingJa": "事例問題での切り分け",
          "headingZh": "案例题中的区分方法",
          "explanationJa": "SGでは、演習問題が単独の定義ではなく、事故報告、規程、リスク評価、又は対策選定の文脈で出されます。「演習問題」「暗号化」「認証」「証明書」「公開鍵」「否認防止」が判断線です。その語が出たら、まず检查加密、认证、生物识别、PKI 的目的和使用条件是否能区分という意味に対応する日本語条件を探します。合わない場合は、攻撃手法の名称問題を選ばせるひっかけである可能性があります。",
          "explanationZh": "SG 题干常把密码与认证演习问题放进事故报告、规程、风险评估或对策选择里，而不是直接问定义。演习问题、加密、认证、证书、公钥、抗抵赖是判断线索。看到这些线索时，先判断是否符合“检查加密、认证、生物识别、PKI 的目的和使用条件是否能区分”；如果不符合，就可能是在让你误选攻击手法名称题。",
          "englishTerms": [
            "Exercise",
            "Encryption",
            "Authentication",
            "Certificate",
            "Public Key",
            "Non-repudiation"
          ],
          "examFocusJa": "演習問題の見分け方は、「演習問題」「暗号化」「認証」「証明書」「公開鍵」「否認防止」が判断線ですを文章中から拾い、攻撃手法の名称問題ではなく演習問題を答えるべき条件かを確認することです。",
          "examFocusZh": "密码与认证演习问题的判断线索是演习问题、加密、认证、证书、公钥、抗抵赖是判断线索，同时确认题干要求的是否是「演習問題」，而不是攻击手法名称题。",
          "commonMistakeJa": "演習問題ではなく攻撃手法の名称問題の説明を選ぶ誤りに注意します。原因は、技術名だけで目的を読まずに選ぶときに、目的、対象、発生タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「演習問題」（密码与认证演习问题）和攻击手法名称题混淆。错误通常来自只看技术名，不判断它要达成的安全目的，本质是漏读目的、对象或发生时机的差别。",
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
          "termJa": "Exercise",
          "termZh": "Exercise",
          "english": "Exercise"
        },
        {
          "termJa": "Encryption",
          "termZh": "Encryption",
          "english": "Encryption"
        },
        {
          "termJa": "Authentication",
          "termZh": "Authentication",
          "english": "Authentication"
        },
        {
          "termJa": "Certificate",
          "termZh": "Certificate",
          "english": "Certificate"
        },
        {
          "termJa": "Public Key",
          "termZh": "Public Key",
          "english": "Public Key"
        },
        {
          "termJa": "Non-repudiation",
          "termZh": "Non-repudiation",
          "english": "Non-repudiation"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "演習問題と攻撃手法の名称問題を混同する",
          "trapZh": "把密码与认证演习问题和攻击手法名称题混为一谈。"
        },
        {
          "trapJa": "技術名だけで目的を読まずに選ぶ",
          "trapZh": "只看技术名，不判断它要达成的安全目的"
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
