# Study Tools 小程序 50 轮后维护说明

适用版本：v0.23.0

适用范围：微信小程序原生版 `study-tools-miniprogram`。本文只记录小程序仓库的维护边界，不适用于 Windows 完整版或 Web 公开版。

## 当前维护目标

Round Mini 3.32 到 3.81 已完成一批连续小步迭代，Round Mini 3.82 已完成稳定性总审计和 smoke test 补强。后续维护应优先保持小范围、可验证、低风险：

- 优先补测试和文档，再做小型代码整理。
- 优先维护本地学习体验，不扩展平台能力。
- 优先保持现有数据结构稳定，不改变用户已有学习记录。
- 每次修改后运行 smoke test 和 JS 语法检查。

## 本地数据边界

当前小程序以本地学习记录为主，不依赖远端服务。维护时应保持以下边界：

- 不加入网络接口调用。
- 不加入云开发配置。
- 不加入账号、支付、广告、会员或订阅能力。
- 不写入真实平台标识、私密凭据或个人身份信息。
- 不修改 `project.private.config.json`。

## Storage Key 清单

核心学习数据 key：

- `study-tools-mini-favorite-terms-v1`：收藏术语。
- `study-tools-mini-wrong-questions-v1`：错题本。
- `study-tools-mini-quiz-attempts-v1`：答题记录。

辅助体验 key：

- `term-search-history`：术语搜索历史。
- `study-tools-mini-streak-v1`：首页连续学习天数。

维护要求：

- 不重命名既有 key。
- 不删除既有 key。
- 不把临时 UI 状态写成新的持久化 key。
- 新增 key 必须先说明用途、生命周期和是否进入备份。

## 备份 / 恢复兼容性

`exportLocalBackup` 的结构应保持稳定：

- `version`
- `exportedAt`
- `data.favoriteTerms`
- `data.wrongQuestions`
- `data.quizAttempts`

`importLocalBackup` 只恢复以上三类学习数据。搜索历史、连续学习天数、页面访问次数等体验型状态不应进入备份结构。

维护要求：

- 不改变备份字段名称。
- 不改变备份数据层级。
- 不把临时 UI 状态加入备份。
- 修改备份逻辑时必须同步更新 smoke test。

## 测试体系维护

`tools/miniprogram_smoke_test.js` 是当前自动验证入口。后续每轮维护建议至少覆盖：

- 页面注册和文件存在性。
- 版本号一致性。
- storage key 稳定性。
- 备份 / 恢复结构稳定性。
- 危险能力零新增。
- 用户可见占位文本扫描。
- WXSS 括号平衡。
- 新增文档或维护说明存在性。

如果新增页面、数据 key、备份字段或入口按钮，必须补对应 smoke 断言。

## 代码质量维护建议

优先处理以下低风险事项：

- 提取重复的只读扫描 helper。
- 合并重复的断言文案。
- 删除无用调试输出。
- 修复空数组、无记录、异常数据时的轻微展示问题。
- 统一页面空状态文案。

避免以下高风险事项：

- 大范围格式化。
- 大规模 UI 重写。
- 修改题库内容或术语数据。
- 改动备份 / 恢复格式。
- 引入第三方 SDK、WASM 或图表库。

## 提交流程

推荐流程：

1. `git status --short --branch`
2. `node tools/miniprogram_smoke_test.js`
3. 全量 JS 语法检查。
4. 危险能力和敏感词扫描。
5. 精确路径 `git add`。
6. `git commit`
7. `git push`

注意：不要使用 `git add .` 或 `git add -A`。如果存在 `.workbuddy/`，记录即可，不删除、不清理、不提交。

## 新设备开发注意事项

在新的开发设备上首次打开微信开发者工具时，工具可能自动改动以下文件：

- `project.config.json`
- `project.private.config.json`

常见自动变化包括：

- `libVersion` 字段变化（如 `trial` → 具体版本号）
- `projectname` 字段变化
- 新增 `condition` 字段
- `setting` 字段顺序重排
- 开发者工具本地配置自动重排

默认处理原则：

- 不要提交 `project.private.config.json`。
- 不要随意提交 `project.config.json`，除非确实需要更新项目配置。
- 每次 commit 前必须执行 `git status --short`，确认改动范围。
- 如果只是本地环境变化，用 `git restore` 恢复。
- 如果确实需要提交 `project.config.json`，必须在提交说明中写明原因。

## WXSS 防回归

不允许在 `.wxss` 文件中出现字面量 `\n`（反斜杠 + n 两个字符）。这会导致微信开发者工具 WXSS 编译报 `Unknown word` 错误，页面白屏。

smoke test 已覆盖此检查（Round Mini 3.84-Guardrail）。如果新增或修改 WXSS 文件，确保使用真实换行而非字面量 `\n`。

## 内容合规扫描

运行方式：

```
node tools/check_content_compliance.js
```

该脚本扫描项目中的文档、页面和配置文件，检查是否出现营销承诺类敏感表达。具体禁用词列表见 `tools/check_content_compliance.js` 中的 `FORBIDDEN_WORDS` 数组。

脚本默认排除以下位置，避免误报：

- `tools/` 目录下的工具脚本（包含违禁词黑名单定义）
- `packages/glossary/data` 和 `packages/quiz/data`（IT 术语数据中可能包含技术性子串匹配）

每轮提交前建议执行：

```
node tools/miniprogram_smoke_test.js
node tools/check_content_compliance.js
```

## 一键验证入口

推荐每轮修改前后执行：

```
node tools/run_miniprogram_checks.js
```

该脚本会顺序执行以下四项检查：

1. Smoke test（`tools/miniprogram_smoke_test.js`）
2. 内容合规扫描（`tools/check_content_compliance.js`）
3. JS 语法检查（全项目 `.js` 文件 `node --check`）
4. WXSS 字面量 `\n` 防回归扫描

每个步骤均输出单步耗时（如 `PASS (xxx ms)` 或 `FAIL (xxx ms)`），便于定位耗时异常的步骤。总耗时显示在末尾 Summary 中，可用于观察验证速度随项目规模的变化趋势。

若一键脚本失败，优先查看 Failed step 输出及对应单步耗时，定位失败步骤和耗时异常。修复后重新执行：

```
node tools/run_miniprogram_checks.js
```

脚本会输出 Node 版本、当前工作目录和每步耗时，便于排查环境问题。

单独执行各检查命令仍然可用：

- `node tools/miniprogram_smoke_test.js`
- `node tools/check_content_compliance.js`
