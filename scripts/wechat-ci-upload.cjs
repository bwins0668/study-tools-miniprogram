#!/usr/bin/env node
/**
 * wechat-ci-upload.cjs — 微信小程序体验版自动上传脚本
 *
 * 职责：
 *   1. 解析 GitHub Actions 环境变量
 *   2. 读取 appid 与私钥
 *   3. 自动识别上传根目录
 *   4. 生成安全版本号和描述
 *   5. 支持 --dry-run 模式
 *   6. 校验关键文件存在
 *   7. 调用 miniprogram-ci upload
 *   8. 输出结构化脱敏结果
 *
 * 安全：
 *   - 私钥仅从环境变量 WECHAT_PRIVATE_KEY_PATH 指向的临时文件读取
 *   - 版本号和描述中不包含敏感信息
 *   - dry-run 模式下绝不执行上传
 *   - 退出码：0=成功, 1=前置检查失败, 2=上传失败, 3=参数错误
 *
 * 使用：
 *   node scripts/wechat-ci-upload.cjs                     # 正常上传
 *   node scripts/wechat-ci-upload.cjs --dry-run           # 仅检查不实际上传
 *   DRY_RUN=true node scripts/wechat-ci-upload.cjs        # 环境变量方式
 */

'use strict';

const fs = require('fs');
const path = require('path');
const ci = require('miniprogram-ci');

// ─── 常量 ───────────────────────────────────────────────

const REQUIRED_FILES = [
  'app.json',
  'project.config.json'
];

const REQUIRED_ENV_VARS = [
  'WECHAT_MINIPROGRAM_APPID',
  'WECHAT_PRIVATE_KEY_PATH'
];

// ─── 工具函数 ───────────────────────────────────────────

/**
 * 安全脱敏：只显示 appid 的前4位和后4位
 */
function maskAppId(appid) {
  if (!appid || appid.length < 8) return '***';
  return appid.slice(0, 4) + '****' + appid.slice(-4);
}

/**
 * 获取当前时间戳 (北京时间 ISO 格式)
 */
function getBJTimeISO() {
  const now = new Date();
  // 转为北京时间字符串
  const bj = new Date(now.getTime() + 8 * 3600 * 1000);
  return bj.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
}

/**
 * 获取 CI 运行信息
 */
function getCIInfo() {
  const isGitHubActions = !!process.env.GITHUB_ACTIONS;
  return {
    isCI: isGitHubActions,
    platform: isGitHubActions ? 'GitHub Actions' : (process.env.CI ? 'CI' : 'local'),
    runId: process.env.GITHUB_RUN_ID || 'local',
    runNumber: process.env.GITHUB_RUN_NUMBER || '0',
    sha: process.env.GITHUB_SHA || '',
    shortSha: (process.env.GITHUB_SHA || '').slice(0, 7),
    ref: process.env.GITHUB_REF || '',
    branch: (process.env.GITHUB_REF || '').replace('refs/heads/', ''),
    repo: process.env.GITHUB_REPOSITORY || 'unknown',
    workflow: process.env.GITHUB_WORKFLOW || 'unknown',
    runUrl: isGitHubActions
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : 'N/A (local)'
  };
}

/**
 * 生成上传版本号
 * 格式: YYYYMMDD-HHMMSS-{shortSha}-{runNumber}
 */
function generateVersion(ciInfo) {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 3600 * 1000);
  const dateStr = bj.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = bj.toISOString().slice(11, 19).replace(/:/g, '');
  const sha = ciInfo.shortSha || 'local';
  const run = ciInfo.runNumber || '0';
  return `${dateStr}-${timeStr}-${sha}-r${run}`;
}

/**
 * 生成上传描述
 */
function generateDescription(ciInfo, isAutoPreview) {
  const parts = [];
  parts.push(`branch:${ciInfo.branch || 'unknown'}`);
  parts.push(`commit:${ciInfo.shortSha || 'unknown'}`);
  parts.push(`run:${ciInfo.runNumber || '0'}`);
  parts.push(isAutoPreview ? 'type:auto-trial-upload' : 'type:manual-upload');
  parts.push(`time:${getBJTimeISO()}`);
  return parts.join(' | ');
}

// ─── 参数解析 ───────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
  const customVersion = process.env.INPUT_VERSION || process.env.VERSION || '';
  const customDesc = process.env.INPUT_DESC || process.env.DESC || '';
  return { dryRun, customVersion, customDesc };
}

// ─── 验证函数 ───────────────────────────────────────────

/**
 * 验证上传目录是否完整
 */
function validateProjectRoot(projectRoot) {
  const missing = [];
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `关键文件缺失: ${missing.join(', ')}。` +
      `上传根目录: ${projectRoot}。` +
      `请确认 projectRoot 设置正确。`
    );
  }
  console.log(`✓ 关键文件验证通过: ${REQUIRED_FILES.join(', ')}`);
}

/**
 * 验证分包配置
 */
function validateSubpackages(projectRoot) {
  const appJsonPath = path.join(projectRoot, 'app.json');
  let appJson;
  try {
    appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
  } catch (e) {
    console.warn(`⚠ 无法解析 app.json: ${e.message}`);
    return;
  }

  const subpackages = appJson.subpackages || [];
  console.log(`✓ 检测到 ${subpackages.length} 个分包`);

  // 验证每个分包根目录存在
  const missing = [];
  for (const sub of subpackages) {
    const subRoot = path.join(projectRoot, sub.root);
    if (!fs.existsSync(subRoot)) {
      missing.push(sub.root);
    }
  }
  if (missing.length > 0) {
    console.warn(`⚠ 分包目录缺失: ${missing.join(', ')}（可能不影响上传）`);
  }

  return subpackages;
}

/**
 * 验证 appid 格式
 */
function validateAppId(appid) {
  if (!appid || typeof appid !== 'string') {
    throw new Error('appid 无效：未设置或格式错误');
  }
  if (!/^wx[0-9a-f]{16}$/.test(appid)) {
    throw new Error(`appid 格式不正确（应以 'wx' 开头，后跟 16 个十六进制字符）: ${maskAppId(appid)}`);
  }
}

// ─── 主流程 ─────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  微信小程序 CI 体验版上传脚本');
  console.log('═══════════════════════════════════════════');

  // 1. 解析参数
  const { dryRun, customVersion, customDesc } = parseArgs();
  const ciInfo = getCIInfo();

  console.log(`\n📋 运行环境:`);
  console.log(`   平台:       ${ciInfo.platform}`);
  console.log(`   分支:       ${ciInfo.branch}`);
  console.log(`   Commit:     ${ciInfo.shortSha}`);
  console.log(`   Run ID:     ${ciInfo.runId}`);
  console.log(`   模式:       ${dryRun ? '🔒 DRY RUN（不实际上传）' : '🚀 正式上传'}`);

  // 2. 读取环境变量
  const appid = process.env.WECHAT_MINIPROGRAM_APPID;
  const privateKeyPath = process.env.WECHAT_PRIVATE_KEY_PATH;

  if (!appid) {
    console.error('\n❌ 缺少环境变量: WECHAT_MINIPROGRAM_APPID');
    console.error('   请在 GitHub Secrets 中配置，或设置本地环境变量。');
    process.exit(3);
  }
  if (!privateKeyPath) {
    console.error('\n❌ 缺少环境变量: WECHAT_PRIVATE_KEY_PATH');
    console.error('   请确保 workflow 已将私钥写入临时文件并设置此变量。');
    process.exit(3);
  }

  validateAppId(appid);
  console.log(`\n✓ AppID: ${maskAppId(appid)}`);

  // 3. 验证私钥文件
  if (!fs.existsSync(privateKeyPath)) {
    console.error(`\n❌ 私钥文件不存在: ${privateKeyPath}`);
    process.exit(1);
  }
  const keyStats = fs.statSync(privateKeyPath);
  if (keyStats.size === 0) {
    console.error(`\n❌ 私钥文件为空: ${privateKeyPath}`);
    process.exit(1);
  }
  console.log(`✓ 私钥文件就绪 (${keyStats.size} bytes)`);

  // 4. 确定上传根目录 (projectRoot)
  //    优先级: 环境变量 > 当前工作目录
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  console.log(`\n📁 上传根目录: ${projectRoot}`);

  // 5. 验证项目结构
  validateProjectRoot(projectRoot);
  validateSubpackages(projectRoot);

  // 6. 生成版本号和描述
  const version = customVersion || generateVersion(ciInfo);
  const desc = customDesc || generateDescription(ciInfo, true);

  console.log(`\n📦 上传参数:`);
  console.log(`   版本号:     ${version}`);
  console.log(`   描述:       ${desc}`);

  // 7. Dry run 分支
  if (dryRun) {
    console.log(`\n🔒 DRY RUN 模式 — 跳过实际上传`);
    console.log(`\n✅ DRY RUN 检查全部通过`);
    console.log(`   AppID:      ${maskAppId(appid)}`);
    console.log(`   版本号:     ${version}`);
    console.log(`   根目录:     ${projectRoot}`);
    console.log(`   分支:       ${ciInfo.branch}`);
    console.log(`   Commit:     ${ciInfo.shortSha}`);
    console.log(`   时间:       ${getBJTimeISO()}`);
    console.log(`   Run URL:    ${ciInfo.runUrl}`);

    // 输出 GitHub Actions 可用的 summary
    if (ciInfo.isCI) {
      console.log(`\n::notice title=WeChat Trial Upload (DRY RUN)::Dry run passed. Version: ${version}`);
    }
    return { dryRun: true, success: true, version, appid, projectRoot };
  }

  // 8. 创建 CI 项目实例并上传
  console.log(`\n📤 开始上传...`);
  const startTime = Date.now();

  try {
    const project = new ci.Project({
      appid: appid,
      type: 'miniProgram',
      projectPath: projectRoot,
      privateKeyPath: privateKeyPath,
      ignores: [
        'node_modules/**',
        '.git/**',
        '.github/**',
        'tools/**',
        'scripts/**',
        'docs/**',
        '*.md',
        'package.json',
        'package-lock.json',
        '.gitignore',
        '.workbuddy/**',
        'artifacts/**',
        'scratch/**'
      ]
    });

    const uploadResult = await ci.upload({
      project,
      version: version,
      desc: desc,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: false,
        autoPrefixWXSS: true
      },
      onProgressUpdate: (progress) => {
        // 进度回调 — 仅在上传阶段有意义输出
        if (progress && progress.status === 'uploading') {
          // 静默进度，避免刷屏
        }
      }
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ 上传成功！耗时: ${elapsed}s`);

    // 9. 输出结构化结果（脱敏）
    const result = {
      success: true,
      dryRun: false,
      appid: maskAppId(appid),
      version: version,
      desc: desc,
      branch: ciInfo.branch,
      commitSha: ciInfo.shortSha,
      fullSha: ciInfo.sha,
      runUrl: ciInfo.runUrl,
      runId: ciInfo.runId,
      runNumber: ciInfo.runNumber,
      uploadTime: getBJTimeISO(),
      elapsedSeconds: parseFloat(elapsed),
      projectRoot: projectRoot
    };

    console.log(`\n📊 上传结果:`);
    console.log(JSON.stringify(result, null, 2));

    // GitHub Actions Summary
    if (ciInfo.isCI) {
      console.log(`\n::notice title=WeChat Trial Upload Success::Version ${version} uploaded successfully. Run: ${ciInfo.runUrl}`);
    }

    return result;

  } catch (uploadError) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`\n❌ 上传失败！耗时: ${elapsed}s`);
    console.error(`   错误类型: ${uploadError.name}`);
    console.error(`   错误信息: ${uploadError.message}`);

    if (uploadError.message && uploadError.message.includes('private_key')) {
      console.error(`\n💡 私钥问题排查:`);
      console.error(`   1. 确认在微信公众平台下载的是「代码上传密钥」（不是 API 密钥）`);
      console.error(`   2. 确认已将完整密钥内容（含 -----BEGIN PRIVATE KEY----- 头尾）填入 GitHub Secret`);
      console.error(`   3. 确认没有多余的换行、空格、BOM`);
    }

    if (uploadError.message && uploadError.message.includes('IP')) {
      console.error(`\n💡 IP 白名单问题排查:`);
      console.error(`   1. 登录微信公众平台 → 开发 → 开发管理 → 开发设置`);
      console.error(`   2. 在「小程序代码上传」中添加 GitHub Actions 的出口 IP`);
      console.error(`   3. 或关闭 IP 白名单（不推荐用于生产环境）`);
    }

    if (ciInfo.isCI) {
      console.log(`\n::error title=WeChat Trial Upload Failed::${uploadError.message}`);
    }
    process.exit(2);
  }
}

// ─── 执行 ───────────────────────────────────────────────

main().catch((err) => {
  console.error(`\n💥 未预期的错误:`);
  console.error(err);
  process.exit(2);
});
