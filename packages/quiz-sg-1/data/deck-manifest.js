'use strict';
var meta = require('./meta');
var RENDERABLE_BY_YEAR = { sg_01_aki: 50, sg_05_haru: 15, sg_06_haru: 15, sg_07_haru: 15, sg_28_aki: 50 };
var DECK_MAP = {};
for (var i = 0; i < meta.years.length; i++) {
  var y = meta.years[i];
  var deckId = y.exam + '/' + y.yearId;
  DECK_MAP[deckId] = {
    deckId: deckId,
    course: y.exam,
    yearId: y.yearId,
    yearLabel: y.label,
    rawExpectedCount: y.count,
    renderableExpectedCount: RENDERABLE_BY_YEAR[y.yearId] || y.count,
    sourceType: 'past_exam_japanese'
  };
}
function getDeckInfo(deckId) {
  return DECK_MAP[deckId] || null;
}
function getAllLocalDecks() {
  var result = [];
  for (var key in DECK_MAP) {
    if (Object.prototype.hasOwnProperty.call(DECK_MAP, key)) {
      result.push(DECK_MAP[key]);
    }
  }
  return result;
}
module.exports = {
  getDeckInfo: getDeckInfo,
  getAllLocalDecks: getAllLocalDecks,
  meta: meta
};
