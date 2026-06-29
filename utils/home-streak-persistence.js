// utils/home-streak-persistence.js
// R3.7 Narrow persistence adapter for the Home streak key.
//
// Reads/writes ONLY the single fixed key "study-tools-mini-streak-v1".
// No dynamic keys. No generic storage method. No removeStorageSync.
// Delegates pure calculation to utils/home-streak.js.
//
// Returns the streakCount value that the Page needs for setData.
// Keep try/catch semantics identical to original home.js code.

var streak = require('./home-streak');

var KEY = 'study-tools-mini-streak-v1';

function getStreakCount() {
  var streakCount = 0;
  try {
    var sd = wx.getStorageSync(KEY);
    var now = new Date();
    var result = streak.computeStreak(sd, now);
    streakCount = result.streakCount;

    if (result.shouldWrite && result.nextRecord) {
      wx.setStorageSync(KEY, result.nextRecord);
    }
  } catch (e) {
    streakCount = 0;
  }
  return streakCount;
}

module.exports = { getStreakCount: getStreakCount };
