var sources = require('./sources').sources;
var chapters = require('./manifest').chapters;
var chapterModules = [
  require('./itpass/chapter-01.js'),
  require('./itpass/chapter-02.js'),
  require('./itpass/chapter-03.js'),
  require('./itpass/chapter-04.js'),
  require('./itpass/chapter-05.js'),
  require('./itpass/chapter-06.js'),
  require('./itpass/chapter-07.js'),
  require('./itpass/chapter-08.js'),
  require('./itpass/chapter-09.js'),
  require('./itpass/chapter-10.js'),
  require('./sg/chapter-01.js'),
  require('./sg/chapter-02.js'),
  require('./sg/chapter-03.js'),
  require('./sg/chapter-04.js'),
  require('./sg/chapter-05.js'),
  require('./sg/chapter-06.js'),
  require('./sg/chapter-07.js'),
  require('./sg/chapter-08.js'),
  require('./sg/chapter-09.js')
];
var units = [];
chapterModules.forEach(function (chapter) {
  units = units.concat(chapter.units || []);
});
module.exports = { sources: sources, chapters: chapters, units: units };
