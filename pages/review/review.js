// pages/review/review.js
// Review tab — entry overview for flashcards, mistakes, and term review.
// Does not create fake SRS counts or progress data.
var nav = require('../../utils/navigation');

Page({
  data: {},

  goFlashcards: function () {
    nav.goFlashcards();
  },

  goMistakes: function () {
    nav.goMistakes();
  },

  goTermReview: function () {
    nav.goFavoriteReview();
  }
});
