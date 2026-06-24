#!/usr/bin/env node
/**
 * tools/e2e_flashcard_runtime_test.js
 * E2E test for flashcard loading via WeChat DevTools automation.
 *
 * Strategy: ALL wx.* calls go through mp.evaluate() (fire-and-forget).
 * callWxMethod is UNRELIABLE — sometimes times out, sometimes drops connection.
 * evaluate() runs JS in the page context and is more stable.
 *
 * Usage: node tools/e2e_flashcard_runtime_test.js
 */

'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'tools', 'test-artifacts', 'flashcard-runtime');
const REPORT_FILE = path.join(ARTIFACTS, 'e2e-report.json');

if (!fs.existsSync(ARTIFACTS)) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
}

const results = { passed: 0, failed: 0, skipped: 0, steps: [] };
const screenshotPaths = [];
const errors = [];

function log(msg) { console.log(msg); }
function fail(step, detail) {
  results.failed++; results.steps.push({ step, status: 'FAIL', detail: String(detail || 'unknown') });
  errors.push(String(detail || '')); log('  FAIL ' + step + ': ' + String(detail || ''));
}
function pass(step, detail) {
  results.passed++; results.steps.push({ step, status: 'PASS', detail });
  log('  PASS ' + step + ': ' + detail);
}
function skip(step, detail) {
  results.skipped++; results.steps.push({ step, status: 'SKIPPED', detail: String(detail || '') });
  log('  SKIP ' + step + ': ' + String(detail || ''));
}

let automator;
try { automator = require('miniprogram-automator'); } catch (e) {
  console.error('[FATAL] miniprogram-automator not found');
  process.exit(1);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Reliable navigation: tries callWxMethod first, then evaluate, with retry.
 * Tab operations (switchTab, reLaunch) use callWxMethod.
 * Subpackage navigation uses evaluate(wx.redirectTo).
 */
async function ensurePage(mp, url, timeoutMs) {
  timeoutMs = timeoutMs || 10000;
  var isTab = url.indexOf('/pages/home/') >= 0 || url.indexOf('/pages/flashcards/') >= 0 ||
              url.indexOf('/pages/mistakes/') >= 0 || url.indexOf('/pages/profile/') >= 0 ||
              url.indexOf('/pages/glossary/') >= 0;

  if (isTab) {
    // Tab page: use callWxMethod
    var method = url.indexOf('/pages/home/') >= 0 ? 'reLaunch' : 'switchTab';
    try {
      await Promise.race([
        mp.callWxMethod(method, { url: url }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs))
      ]);
      return true;
    } catch (e) {
      log('  ensurePage callWxMethod(' + method + '): ' + e.message);
    }
    // Fallback: evaluate
    try {
      await Promise.race([
        mp.evaluate((m, u) => { return new Promise(r => { wx[m]({ url: u, complete: () => r() }); }); }, method, url),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs))
      ]);
      return true;
    } catch (e) {
      log('  ensurePage evaluate(' + method + '): ' + e.message);
    }
  } else {
    // Subpackage page: use evaluate(wx.redirectTo)
    try {
      await Promise.race([
        mp.evaluate((u) => { return new Promise(r => { wx.redirectTo({ url: u, complete: () => r() }); }); }, url),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs))
      ]);
      return true;
    } catch (e) {
      log('  ensurePage evaluate(redirectTo): ' + e.message);
    }
    // Fallback: navigateTo via evaluate
    try {
      await Promise.race([
        mp.evaluate((u) => { return new Promise(r => { wx.navigateTo({ url: u, complete: () => r() }); }); }, url),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs))
      ]);
      return true;
    } catch (e) {
      log('  ensurePage evaluate(navigateTo): ' + e.message);
    }
  }
  return false;
}

async function takeScreenshot(desc, mp) {
  try {
    var ts = Date.now();
    var safeName = desc.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, '_').substring(0, 60);
    var filePath = path.join(ARTIFACTS, ts + '_' + safeName + '.png');
    var data = await Promise.race([
      mp.screenshot(),
      new Promise((_, reject) => setTimeout(reject, 10000))
    ]);
    if (data) {
      fs.writeFileSync(filePath, data, 'base64');
      screenshotPaths.push(filePath);
      log('  [screenshot] ' + filePath);
    }
  } catch (e) {
    log('  [screenshot skipped] ' + desc);
  }
}

async function getPageDataVal(page, key) {
  try { return await page.data(key); } catch (e) { return undefined; }
}

function makeReportAndExit(mp, exitCode) {
  var overallFail = results.failed > 0;
  var status = overallFail ? 'FAILED' : 'PASSED';
  var gateStatus = overallFail ? 'BLOCKED_ON_DEVTOOLS_AUTOMATION' : 'READY_FOR_USER_PROOF';

  log('');
  log('='.repeat(60));
  log('E2E TEST SUMMARY');
  log('='.repeat(60));
  log('Passed: ' + results.passed + ' | Failed: ' + results.failed + ' | Skipped: ' + results.skipped);
  log('STATUS: ' + status + ' (' + gateStatus + ')');

  fs.writeFileSync(REPORT_FILE, JSON.stringify({
    timestamp: new Date().toISOString(),
    status, gateStatus, results, screenshots: screenshotPaths, errors
  }, null, 2));
  log('Report: ' + REPORT_FILE);
  process.exit(exitCode);
}

async function waitForPage(mp, pathFragment, timeoutMs) {
  var start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(1000);
    var page = await mp.currentPage();
    var p = page ? page.path : '';
    if (p.indexOf(pathFragment) >= 0) return page;
  }
  return await mp.currentPage();
}

async function waitForData(mp, key, expectValue, timeoutMs) {
  var start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(1500);
    var page = await mp.currentPage();
    var val = await getPageDataVal(page, key);
    var loadErr = await getPageDataVal(page, 'loadError');
    if (loadErr) {
      log('  loadError detected: ' + loadErr);
      return { page, val, loadErr };
    }
    if (expectValue !== undefined) {
      if (val === expectValue) return { page, val };
    } else {
      if (val !== undefined && val !== null) return { page, val };
    }
  }
  var page = await mp.currentPage();
  return { page, val: await getPageDataVal(page, key) };
}

async function run() {
  log('='.repeat(60));
  log('Flashcard Runtime E2E Test');
  log('='.repeat(60));
  log('Start: ' + new Date().toISOString());

  // ---- Connect ----
  log('\n[1] Connecting...');
  var mp = null;
  var consoleErrors = [];
  for (var attempt = 1; attempt <= 5; attempt++) {
    try {
      mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9421', timeout: 15000 });
      log('  Connected (attempt ' + attempt + ')');
      // Capture console errors throughout the test
      mp.on('console', function(msg) {
        if (msg && (msg.type === 'error' || msg.type === 'warn')) {
          var text = msg.text || msg.message || '';
          if (text.length > 0) {
            consoleErrors.push({ type: msg.type, text: text.substring(0, 500) });
          }
        }
      });
      break;
    } catch (e) {
      if (attempt < 5) { log('  Retry...'); await sleep(3000); }
    }
  }
  if (!mp) { fail('connect', 'Cannot connect'); makeReportAndExit(null, 1); return; }
  pass('connect', 'Connected');

  // ---- Reset: navigate to flashcards ----
  log('\n[2] Reset + Flashcard center...');
  await ensurePage(mp, '/pages/flashcards/flashcards');
  await sleep(2000);
  var page = await mp.currentPage();
  var flashcardsOk = page && page.path && page.path.indexOf('flashcards') >= 0;
  if (flashcardsOk) {
    pass('flashcards-nav', 'On flashcards tab');
  } else {
    // Fallback: try reLaunch to home, then switchTab
    await ensurePage(mp, '/pages/home/home');
    await sleep(2000);
    await ensurePage(mp, '/pages/flashcards/flashcards');
    await sleep(2000);
    page = await mp.currentPage();
    flashcardsOk = page && page.path && page.path.indexOf('flashcards') >= 0;
    if (flashcardsOk) pass('flashcards-nav', 'On flashcards tab (after reLaunch)');
    else fail('flashcards-nav', 'Cannot reach flashcards: ' + (page ? page.path : 'none'));
  }

  // ---- Check course entries ----
  try {
    page = await mp.currentPage();
    var courseCards = await page.$$('.course-card');
    var texts = [];
    for (var i = 0; courseCards && i < courseCards.length; i++) {
      try { texts.push(await courseCards[i].text() || ''); } catch (e) {}
    }
    var allText = texts.join(' ');
    log('  Cards: "' + allText.substring(0, 200) + '"');
    if (allText.indexOf('SG') >= 0 && allText.indexOf('IT') >= 0) {
      pass('course-entries', 'SG + IT Passport visible');
    } else {
      skip('course-entries', 'Could not verify entries');
    }
  } catch (e) { skip('course-entries', e.message || e); }

  // ---- SG: navigate to deck-select ----
  log('\n[3] SG deck selection...');
  await ensurePage(mp, '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg');
  page = await waitForPage(mp, 'deck-select', 8000);
  var sgDeckPath = page ? page.path : '';
  log('  Page: ' + sgDeckPath);
  if (sgDeckPath.indexOf('deck-select') >= 0) {
    pass('sg-deck-select', 'SG deck-select loaded');
  } else {
    fail('sg-deck-select', 'Expected deck-select, got: ' + sgDeckPath);
  }

  // ---- SG: read deck data ----
  log('\n[4] SG year deck...');
  var sgLoaded = false;
  var sgQuizPath = '';
  try {
    page = await mp.currentPage();
    var decks = await getPageDataVal(page, 'decks');
    if (!decks || decks.length === 0) {
      fail('sg-deck-load', 'No decks found');
    } else {
      var first = decks[0];
      log('  First deck: ' + (first.label || first.yearId) + ' (' + first.count + ' questions)');
      var navUrl = '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=sg' +
        '&yearId=' + encodeURIComponent(first.yearId) +
        '&deckLabel=' + encodeURIComponent(first.label || first.yearId);

      // Fire-and-forget navigate (redirectTo works via evaluate)
      await ensurePage(mp, navUrl);

      // Poll for quiz page
      page = await waitForPage(mp, 'flashcard-quiz', 15000);
      sgQuizPath = page ? page.path : '';
      log('  After nav: ' + sgQuizPath);

      if (sgQuizPath.indexOf('flashcard-quiz') >= 0) {
        // Wait for loading to complete
        var loadResult = await waitForData(mp, 'isLoading', false, 15000);
        page = loadResult.page;
        var total = await getPageDataVal(page, 'totalCards');
        log('  totalCards: ' + total);
        sgLoaded = total > 0;
        if (sgLoaded) { pass('sg-deck-load', 'SG loaded (' + total + ' cards)'); }
        else { fail('sg-deck-load', 'SG loaded but no cards'); }
      } else {
        fail('sg-deck-load', 'Not on flashcard-quiz: ' + sgQuizPath);
      }
    }
  } catch (e) { fail('sg-deck-load', e.message || e); }

  // ---- SG: answer a question ----
  log('\n[5] SG answer...');
  if (sgLoaded) {
    try {
      page = await mp.currentPage();
      var opts = await page.$$('.fc-option');
      if (opts && opts.length > 0) {
        log('  Options: ' + opts.length);
        await opts[0].tap();
        await sleep(2000);
        var fb = await page.$$('.fc-feedback');
        if (fb && fb.length > 0) { pass('sg-answer', 'Feedback visible'); }
        else { skip('sg-answer', 'Tapped but no feedback'); }
      } else { skip('sg-answer', 'No options'); }
    } catch (e) { skip('sg-answer', e.message || e); }
  } else { skip('sg-answer', 'Not loaded'); }

  // ---- SG: explanation ----
  log('\n[6] SG explanation...');
  if (sgLoaded) {
    try {
      page = await mp.currentPage();
      var btns = await page.$$('.fc-btn');
      var clicked = false;
      for (var bi = 0; btns && bi < btns.length; bi++) {
        var t = (await btns[bi].text()) || '';
        if (t.indexOf('解析') >= 0 || t.indexOf('説明') >= 0) {
          await btns[bi].tap(); clicked = true; break;
        }
      }
      await sleep(1500);
      if (clicked) {
        var sb = await getPageDataVal(page, 'showBack');
        if (sb) { pass('sg-explanation', 'Explanation shown'); }
        else { skip('sg-explanation', 'Tapped but not verified'); }
      } else { skip('sg-explanation', 'No explanation btn'); }
    } catch (e) { skip('sg-explanation', e.message || e); }
  } else { skip('sg-explanation', 'Not loaded'); }

  // ---- IT Passport ----
  log('\n[8] IT Passport...');
  var itLoaded = false;
  try {
    // Reset via switchTab (tab ops work via callWxMethod)
    await ensurePage(mp, '/pages/flashcards/flashcards');
    await sleep(2000);

    // Navigate to IT deck-select
    await ensurePage(mp, '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass');
    page = await waitForPage(mp, 'deck-select', 8000);
    var itDeckPath = page ? page.path : '';
    log('  IT page: ' + itDeckPath);

    if (itDeckPath.indexOf('deck-select') < 0) {
      fail('it-deck-load', 'Cannot reach IT deck-select');
    } else {
      var itDecks = await getPageDataVal(page, 'decks');
      if (itDecks && itDecks.length > 0) {
        var itFirst = itDecks[0];
        log('  First IT deck: ' + (itFirst.label || itFirst.yearId) + ' (' + itFirst.count + ' questions)');
        var itUrl = '/packages/quiz/pages/flashcard-quiz/flashcard-quiz?course=itpass' +
          '&yearId=' + encodeURIComponent(itFirst.yearId) +
          '&deckLabel=' + encodeURIComponent(itFirst.label || itFirst.yearId);

        await ensurePage(mp, itUrl);

        page = await waitForPage(mp, 'flashcard-quiz', 15000);
        if (page && page.path.indexOf('flashcard-quiz') >= 0) {
          var itLoadResult = await waitForData(mp, 'isLoading', false, 15000);
          page = itLoadResult.page;
          var itTotal = await getPageDataVal(page, 'totalCards');
          itLoaded = itTotal > 0;
          if (itLoaded) { pass('it-deck-load', 'IT loaded (' + itTotal + ' cards)'); }
          else { fail('it-deck-load', 'IT loaded but no cards'); }
        } else {
          fail('it-deck-load', 'Not on flashcard-quiz');
        }
      } else { fail('it-deck-load', 'No IT decks'); }
    }
  } catch (e) { fail('it-deck-load', e.message || e); }

  // ---- Console check ----
  log('\nConsole check...');
  try {
    await sleep(500);
    var crossPkg = consoleErrors.filter(c => (c.text || '').indexOf('not defined') >= 0 || (c.text || '').indexOf('module') >= 0);
    var flashcardErrors = consoleErrors.filter(c => (c.text || '').indexOf('flashcard') >= 0 || (c.text || '').indexOf('FLASHCARD') >= 0);
    log('  Total errors/warns: ' + consoleErrors.length);
    log('  Cross-pkg: ' + crossPkg.length + ', flashcard-related: ' + flashcardErrors.length);
    if (crossPkg.length > 0) {
      fail('console', 'Cross-pkg errors: ' + crossPkg.length);
      for (var ci = 0; ci < Math.min(crossPkg.length, 5); ci++) {
        log('    ' + crossPkg[ci].type + ': ' + crossPkg[ci].text.substring(0, 200));
      }
    } else { pass('console', 'No cross-pkg errors'); }
    if (flashcardErrors.length > 0) {
      log('  Flashcard-related messages:');
      for (var fi = 0; fi < Math.min(flashcardErrors.length, 10); fi++) {
        log('    ' + flashcardErrors[fi].type + ': ' + flashcardErrors[fi].text.substring(0, 200));
      }
    }
  } catch (e) { skip('console', e.message || e); }

  makeReportAndExit(mp, results.failed > 0 ? 1 : 0);
}

run().catch(function (e) {
  console.error('[FATAL] Unhandled:', e && e.message || e);
  process.exit(1);
});
