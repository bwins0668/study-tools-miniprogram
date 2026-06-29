// utils/home-streak.js
// R3.7 Pure date-calculation module for Home streak.
//
// Given a saved streak record and a "now" Date, determines:
//   - current streak count
//   - whether to persist a new record
//   - the next record to persist (if any)
//
// No wx, no storage, no Page, no UI. Just math.
//
// Input contract:
//   saved:  { lastDate: string|null, count: number|null } or null
//   now:    Date instance (current time)
//
// Output contract (stable — same as home.js original behavior):
//   {
//     streakCount: number,
//     shouldWrite: boolean,
//     nextRecord:  { lastDate: string, count: number } | null
//   }
//
// NEVER fixes, optimizes, or changes the original semantics including
// string coercion on count and UTC→local date quirks.

function computeStreak(saved, now) {
  // Default: no streak
  var result = { streakCount: 0, shouldWrite: false, nextRecord: null };

  if (!saved || !saved.lastDate) return result;

  var ld, ldDay;
  try {
    ld = new Date(saved.lastDate);
    if (isNaN(ld.getTime())) return result;
  } catch (e) {
    return result;
  }

  var td = new Date(now.getTime());
  td.setHours(0, 0, 0, 0);
  ldDay = new Date(ld.getFullYear(), ld.getMonth(), ld.getDate());
  var tdDay = new Date(td.getFullYear(), td.getMonth(), td.getDate());
  var diff = Math.floor((tdDay - ldDay) / 86400000);

  if (diff === 0) {
    // Same calendar day — keep existing count
    result.streakCount = (saved.count || 0) || 1;
  } else if (diff === 1) {
    // Next consecutive day — increment and write
    result.streakCount = (saved.count || 0) + 1;
    result.shouldWrite = true;
    result.nextRecord = {
      lastDate: td.toISOString(),
      count: result.streakCount
    };
  }
  // else (diff > 1 or diff < 0): reset to 0, no write

  return result;
}

module.exports = { computeStreak: computeStreak };
