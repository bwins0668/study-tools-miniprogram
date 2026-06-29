// tools/check_home_streak_contract.js
// R3.7 Home Streak characterization test.
// Executes REAL pages/home/home.js in a controlled sandbox.
// Uses real Date (no mock) — controls "now" via fixed mockNow timestamp
// and a thin Date wrapper that returns it for no-arg calls.
// PASS=0 / FAIL=1.

var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(id, detail) { failures.push({ id: id, detail: detail }); }

// ---- Mock infrastructure ----
var mockStorage = null;
var mockSetStorageCalls = [];
var mockSetDataCalls = [];
var mockNowTs = Date.now(); // will be set per scenario
var cachedPageConfig = null;

global.wx = {
  getStorageSync: function (key) {
    if (key === 'study-tools-mini-streak-v1') return mockStorage;
    return null;
  },
  setStorageSync: function (key, value) {
    if (key === 'study-tools-mini-streak-v1') {
      mockSetStorageCalls.push({ key: key, value: JSON.parse(JSON.stringify(value)) });
      mockStorage = value;
    }
  },
  showToast: function () {},
  getMenuButtonBoundingClientRect: function () { return null; },
  getWindowInfo: function () { return { statusBarHeight: 20 }; },
  getSystemInfoSync: function () { return { statusBarHeight: 20 }; },
  switchTab: function () {}, navigateTo: function () {},
  pageScrollTo: function () {}, stopPullDownRefresh: function () {}
};
global.getApp = function () { return { globalData: { themeDark: false } }; };

// Thin Date wrapper: only overrides no-arg constructor to return fixed time
var OrigDate = Date;
global.Date = function () {
  if (arguments.length === 0) return new OrigDate(mockNowTs);
  // Forward all other constructor calls to real Date
  switch (arguments.length) {
    case 1: return new OrigDate(arguments[0]);
    case 2: return new OrigDate(arguments[0], arguments[1]);
    case 3: return new OrigDate(arguments[0], arguments[1], arguments[2]);
    case 4: return new OrigDate(arguments[0], arguments[1], arguments[2], arguments[3]);
    case 5: return new OrigDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    case 6: return new OrigDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    default: return new OrigDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
  }
};
global.Date.now = function () { return mockNowTs; };
global.Date.parse = OrigDate.parse;
global.Date.UTC = OrigDate.UTC;

global.Page = function (config) { cachedPageConfig = config; };

// Pre-populate require cache for dependencies
var storagePath = path.join(ROOT, 'utils', 'storage.js');
require.cache[storagePath] = { id: storagePath, filename: storagePath, loaded: true,
  exports: { getLastAttempt: function () { return null; } } };
var navPath = path.join(ROOT, 'utils', 'navigation.js');
require.cache[navPath] = { id: navPath, filename: navPath, loaded: true,
  exports: { TAB: {}, LEGACY: {}, goCourseTab: function () {}, goPracticeTab: function () {},
    goReviewTab: function () {}, goCoursePractice: function () {} } };
var regPath = path.join(ROOT, 'utils', 'course-registry.js');
require.cache[regPath] = { id: regPath, filename: regPath, loaded: true,
  exports: { getCoursesByKind: function () { return []; }, getCourseById: function () { return null; } } };

// Load real home.js
var homePath = path.join(ROOT, 'pages', 'home', 'home.js');
delete require.cache[require.resolve(homePath)];
try { require(homePath); } catch (e) { console.log('FATAL: ' + e.message + '\n' + e.stack); process.exit(1); }
if (!cachedPageConfig) { console.log('FATAL: Page() never called'); process.exit(1); }

var origSetData = cachedPageConfig.setData;
cachedPageConfig.setData = function (data) {
  mockSetDataCalls.push(JSON.parse(JSON.stringify(data)));
  if (origSetData) origSetData.call(this, data);
};

// ---- Helpers ----
function reset() { mockStorage = null; mockSetStorageCalls = []; mockSetDataCalls = []; }
function setNowISO(isoStr) { mockNowTs = new OrigDate(isoStr).getTime(); }
function getStreak() { for (var i = mockSetDataCalls.length - 1; i >= 0; i--) { if ('streakCount' in mockSetDataCalls[i]) return mockSetDataCalls[i].streakCount; } return undefined; }
function lastWrite() { return mockSetStorageCalls.length > 0 ? mockSetStorageCalls[mockSetStorageCalls.length - 1] : null; }

function run(id, desc, storage, nowISO) {
  reset();
  setNowISO(nowISO);
  mockStorage = storage;
  try { cachedPageConfig._loadState(); } catch (e) { fail(id, 'threw: ' + e.message); return null; }
  return { streak: getStreak(), writes: mockSetStorageCalls.length, lastWrite: lastWrite() };
}

console.log('=== Home Streak Characterization Test (R3.7) ===');
console.log('Executing REAL pages/home/home.js in sandbox (real Date, fixed now)\n');

// Helper: create streak record with ISO string for a specific UTC date
function record(y, m, d, h, min, count) {
  return {
    lastDate: new OrigDate(Date.UTC(y, m, d, h || 0, min || 0, 0)).toISOString(),
    count: count
  };
}

// We need ISO strings where parsing them in the test's timezone gives the
// expected local date. Since we can't control Node's timezone easily,
// we use ISO strings at UTC noon so they map to the same date in most zones.

function noonISO(y, m, d) {
  // UTC noon = stays on same day in all timezones from -12 to +12
  return new OrigDate(Date.UTC(y, m, d, 12, 0, 0)).toISOString();
}

// Scenarios below use "now" at local noon June 29.
// ISO lastDate values are at UTC noon so they parse to the same calendar day
// everywhere (UTC±12 range).

// === A1: Missing streak data ===
var r = run('A1', 'missing data', null, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A1: missing → streak=0 writes=0');
else fail('A1', 'got ' + JSON.stringify(r));

// === A2: Same day reopen ===
r = run('A2', 'same day', record(2026, 5, 29, 12, 0, 5), '2026-06-29T18:00:00+09:00');
if (r && r.streak === 5 && r.writes === 0) console.log('  PASS A2: same day → streak=5 writes=0');
else fail('A2', 'got ' + JSON.stringify(r));

// === A3: Next local day ===
r = run('A3', 'next day', record(2026, 5, 28, 12, 0, 3), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 4 && r.writes === 1) {
  console.log('  PASS A3: next day → streak=4 writes=1');
  var lw = r.lastWrite;
  if (lw) console.log('         write: count=' + lw.value.count + ' lastDate=' + lw.value.lastDate);
} else fail('A3', 'got ' + JSON.stringify(r));

// === A4: Two day gap → reset ===
r = run('A4', '2-day gap', record(2026, 5, 27, 12, 0, 7), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A4: gap=2 → streak=0 writes=0');
else fail('A4', 'got ' + JSON.stringify(r));

// === A5: Large gap → reset ===
r = run('A5', 'large gap', record(2026, 5, 20, 12, 0, 10), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A5: gap≥2 → streak=0 writes=0');
else fail('A5', 'got ' + JSON.stringify(r));

// === A6: No lastDate field ===
r = run('A6', 'no lastDate', { count: 5 }, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A6: no lastDate → streak=0 writes=0');
else fail('A6', 'got ' + JSON.stringify(r));

// === A7: Invalid lastDate ===
r = run('A7', 'bad lastDate', { lastDate: 'not-a-date', count: 2 }, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A7: bad date → streak=0 writes=0');
else fail('A7', 'got ' + JSON.stringify(r));

// === A8: Missing count, next day ===
r = run('A8', 'no count next day', record(2026, 5, 28, 12, 0), '2026-06-29T12:00:00+09:00');
// record() sets count=undefined. (sd.count || 0) + 1 = 0+1 = 1
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS A8: no count next day → streak=1 writes=1');
else fail('A8', 'got ' + JSON.stringify(r));

// === A9: count=0, next day ===
r = run('A9', 'count=0 next day', record(2026, 5, 28, 12, 0, 0), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS A9: count=0 next day → streak=1 writes=1');
else fail('A9', 'got ' + JSON.stringify(r));

// === A10: count="abc", next day (observed behavior) ===
r = run('A10', 'count=string', record(2026, 5, 28, 12, 0, 'abc'), '2026-06-29T12:00:00+09:00');
if (r) console.log('  OBSERVE A10: count=string → streak=' + r.streak + ' writes=' + r.writes + ' (string coercion)');

// === A11: Clock backward ===
r = run('A11', 'backward', record(2026, 5, 30, 12, 0, 5), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS A11: backward → streak=0 writes=0');
else fail('A11', 'got ' + JSON.stringify(r));

// === A12: UTC evening → Tokyo next day ===
r = run('A12', 'UTC evening', { lastDate: '2026-06-28T16:00:00.000Z', count: 4 }, '2026-06-29T12:00:00+09:00');
if (r) console.log('  OBSERVE A12: 16:00Z→Tokyo → streak=' + r.streak + ' writes=' + r.writes);

// === A13: Repeated onShow ===
reset(); setNowISO('2026-06-28T12:00:00+09:00');
mockStorage = record(2026, 5, 27, 12, 0, 2);
cachedPageConfig._loadState();
var s1 = getStreak(), w1 = mockSetStorageCalls.length;
cachedPageConfig._loadState();
var s2 = getStreak(), w2 = mockSetStorageCalls.length;
if (s1 === s2 && w1 === 1 && w2 === 1)
  console.log('  PASS A13: repeat onShow s1=' + s1 + ' s2=' + s2 + ' w1=' + w1 + ' w2=' + w2 + ' (stable)');
else
  console.log('  OBSERVE A13: repeat onShow s1=' + s1 + ' s2=' + s2 + ' w1=' + w1 + ' w2=' + w2);

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) {
  console.log('ALL SCENARIOS PASS — streak behavior frozen');
  console.log('PASS');
  process.exit(0);
}
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].id + '] ' + failures[fi].detail);
console.log('\nFAIL');
process.exit(1);
