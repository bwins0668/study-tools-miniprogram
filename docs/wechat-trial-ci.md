# 微信小程序体验版 CI/CD 配置手册

> 最后更新：2026-06-30
> 分支：`ai-preview`
> 状态：`CI_READY_WAITING_FOR_SECRETS`

---

## 一、架构概览

```
AI 代码修改 → 推送到 ai-preview 分支
  → GitHub Actions 自动运行
    → miniprogram-ci 上传代码包
      → 微信体验版更新
        → 手机微信扫码验收
```

**不上传条件：**
- `main` / `master` / `release/*` / `feature/*` 推代码 → **不触发**
- `workflow_dispatch` 手动触发 + `dry_run=true` → **不实际上传**

---

## 二、分支策略

| 分支 | 用途 | 自动上传体验版？ |
|------|------|:---:|
| `ai-preview` | AI 改动后的手机体验版预览 | ✅ 是 |
| `main` / `master` | 稳定代码 | ❌ 否 |
| `release/*` | 正式候选 | ❌ 否 |
| `feature/*` | 日常开发 | ❌ 否 |

### 推荐日常流程

1. 在功能 worktree 中开发（`feature/*` 分支）
2. 通过本地门禁（`node tools/run_miniprogram_checks.js`）
3. Cherry-pick 或 merge 到 `ai-preview`
4. 推送 `ai-preview` → GitHub Actions 自动上传体验版
5. 手机微信扫码验收
6. 验收通过后再合并到 `main` / `master`

### 多 Worktree 注意事项

- **不要让多个 worktree 同时直接 push `ai-preview`**，避免体验版覆盖和难以追踪
- 先 `git fetch origin` 确认远端 `ai-preview` 是否有未同步的提交
- 使用 `git push origin ai-preview` 前确保本地已 rebase/fast-forward

---

## 三、新增/修改文件清单

| 文件 | 用途 |
|------|------|
| `.github/workflows/wechat-trial-upload.yml` | GitHub Actions CI 工作流定义 |
| `scripts/wechat-ci-upload.cjs` | miniprogram-ci 上传业务逻辑脚本 |
| `package.json` | 新增 `miniprogram-ci` devDependency 和 CI 脚本 |
| `package-lock.json` | npm 依赖锁定文件（从 .gitignore 中移除后追踪） |
| `.gitignore` | 新增密钥文件保护规则 |
| `docs/wechat-trial-ci.md` | 本文件 |

---

## 四、CI 工作流详情

### 触发条件

```yaml
on:
  push:
    branches:
      - ai-preview       # ← 仅此一个分支！
  workflow_dispatch:      # 手动触发，支持参数
    inputs:
      version:   # 版本号（留空自动生成）
      desc:      # 描述（留空自动生成）
      dry_run:   # DRY RUN 模式（仅检查）
```

### 运行步骤

1. **Checkout** — 检出指定 commit
2. **Setup Node.js 18** — 缓存 npm
3. **npm ci** — 使用 lockfile 安装
4. **代码检查** — `tools/run_miniprogram_checks.js`
5. **Smoke 测试** — `tools/miniprogram_smoke_test.js`
6. **内容合规** — `tools/check_content_compliance.js`
7. **注入私钥** — 从 Secrets 写入临时文件
8. **上传体验版** — 执行 `scripts/wechat-ci-upload.cjs`
9. **清理私钥** — 安全删除临时文件

### 版本号格式

```
YYYYMMDD-HHMMSS-{shortSha}-r{runNumber}
示例: 20260630-124500-10af9d3-r42
```

### 并发控制

```yaml
concurrency:
  group: wechat-trial-upload
  cancel-in-progress: true
```

同一时刻只有一个上传任务运行，新 push 会自动取消旧的。

### 权限

```yaml
permissions:
  contents: read    # 最小权限
```

---

## 五、密钥与安全

### GitHub Secrets 配置

| Secret 名称 | 内容 | 来源 |
|------------|------|------|
| `WECHAT_MINIPROGRAM_APPID` | 小程序 AppID | `project.config.json` → `appid` 字段 |
| `WECHAT_MINIPROGRAM_PRIVATE_KEY` | 代码上传私钥完整内容 | 微信公众平台下载 |

### 私钥保护措施

- ✅ 私钥通过 GitHub Secrets 注入，不进入仓库
- ✅ 写入 runner 临时目录 (`${{ runner.temp }}`)
- ✅ 严格文件权限 `chmod 600`
- ✅ 使用 `::add-mask::` 防止日志泄露
- ✅ 上传完成后自动 `shred -u` 安全删除
- ✅ `.gitignore` 已添加 `*.key`/`*.pem` 规则
- ✅ 仓库中搜索无泄露

### 绝不执行的操作

- ❌ 自动提交审核
- ❌ 自动发布正式版
- ❌ 触碰生产环境
- ❌ 将密钥写入仓库
- ❌ 在日志中打印密钥

---

## 六、环境隔离

当前项目：
- ❌ 无云开发（`cloudfunctionRoot` 不存在）
- ❌ 无 `wx.cloud.init()` 调用
- ✅ 无需环境变量隔离

**如果未来接入云开发**，使用以下变量：
- `WECHAT_CLOUD_ENV_TEST` — 体验版/develop 环境
- `WECHAT_CLOUD_ENV_PROD` — 正式版/生产环境（**CI 永不使用**）

---

## 七、微信公众平台手工配置

### 7.1 下载代码上传密钥

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入：**开发** → **开发管理** → **开发设置**
3. 找到「小程序代码上传」
4. 点击「生成」或「下载」代码上传密钥
5. 下载的文件为 `.key` 格式，内容类似：
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhki...
   -----END PRIVATE KEY-----
   ```

### 7.2 配置 IP 白名单（如需）

1. 同一页面找到「IP 白名单」
2. 添加 GitHub Actions 的出口 IP（可选，若不配置则不限制）
3. GitHub Actions IP 范围文档：https://api.github.com/meta

### 7.3 添加体验者

1. 进入：**管理** → **成员管理** → **体验成员**
2. 点击「添加」→ 输入微信号
3. 体验者可扫码打开最新体验版

### 7.4 查看最新上传版本

1. 进入：**管理** → **版本管理** → **开发版本**
2. 查看「体验版」标签下的最新版本号和上传时间

### 7.5 手机上确认体验版更新

1. 打开微信 → 发现 → 小程序
2. 搜索小程序名称或扫描体验版二维码
3. 打开小程序后，点击右上角 `⋯` → 查看「关于」
4. 确认版本号与 CI 上传的一致

---

## 八、回滚方案

### 8.1 暂停自动上传

在 GitHub 仓库页面：
**Actions** → 找到 `WeChat Trial Upload` workflow → 点击 `...` → **Disable workflow**

### 8.2 回退 ai-preview 到上一个稳定 commit

```bash
cd <ai-preview worktree>
git log --oneline -5                    # 找到上一个稳定 commit
git reset --hard <stable_commit_sha>    # 本地回退
git push origin ai-preview --force      # 强制推送（需确认！）
```

### 8.3 不影响正式版

- CI workflow **仅监听** `ai-preview` 分支
- `main`/`master`/`release/*` 分支 **永不触发上传**
- **无自动提交审核或发布逻辑**

---

## 九、当前缺失的门禁

基于 `master` 基线（`ai-preview` 分支的基础），以下门禁缺失：

| 门禁 | 状态 |
|------|:---:|
| `tools/run_miniprogram_checks.js` | ✅ 4/4 PASS |
| `tools/miniprogram_smoke_test.js` | ✅ 已包含 |
| `tools/check_content_compliance.js` | ✅ 已包含 |
| P0 release dependency closure | ❌ 不在 master 基线 |
| Flashcard deck integrity | ❌ 不在 master 基线 |
| Subpackage registry check | ❌ 不在 master 基线 |
| Package size audit | ❌ 不在 master 基线 |
| JS syntax check | ✅ 已有（内嵌在 run_miniprogram_checks） |
| Bilingual integrity | ❌ 不在 master 基线 |
| Design tokens check | ❌ 不在 master 基线 |
| Theme coverage | ❌ 不在 master 基线 |
| Minium 运行时测试 | ❌ 需要微信开发者工具 + Python |

**说明：** `ai-preview` 基于 `master` 创建，`master` 分支是简化基线。当 `feature/*` 代码合并到 `ai-preview` 时，相关检查工具会自动生效。

---

## 十、本地 dry run 验证

```bash
# 设置环境变量（使用假 appid）
export WECHAT_MINIPROGRAM_APPID="wx0000000000000000"
export WECHAT_PRIVATE_KEY_PATH="/tmp/fake-key.pem"
echo "fake" > /tmp/fake-key.pem

# 运行 dry run
DRY_RUN=true node scripts/wechat-ci-upload.cjs
```
