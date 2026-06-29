var manifest = require('./manifest');

function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'itpass-ch01': return require('./itpass/chapter-01.js');
    case 'itpass-ch02': return require('./itpass/chapter-02.js');
    case 'itpass-ch03': return require('./itpass/chapter-03.js');
    case 'itpass-ch04': return require('./itpass/chapter-04.js');
    case 'itpass-ch05': return require('./itpass/chapter-05.js');
    case 'itpass-ch06': return require('./itpass/chapter-06.js');
    case 'itpass-ch07': return require('./itpass/chapter-07.js');
    case 'itpass-ch08': return require('./itpass/chapter-08.js');
    case 'itpass-ch09': return require('./itpass/chapter-09.js');
    case 'itpass-ch10': return require('./itpass/chapter-10.js');
    case 'sg-ch01': return require('./sg/chapter-01.js');
    case 'sg-ch02': return require('./sg/chapter-02.js');
    case 'sg-ch03': return require('./sg/chapter-03.js');
    case 'sg-ch04': return require('./sg/chapter-04.js');
    case 'sg-ch05': return require('./sg/chapter-05.js');
    case 'sg-ch06': return require('./sg/chapter-06.js');
    case 'sg-ch07': return require('./sg/chapter-07.js');
    case 'sg-ch08': return require('./sg/chapter-08.js');
    case 'sg-ch09': return require('./sg/chapter-09.js');
    default: return null;
  }
}

function getUnitById(courseId, unitId) {
  var summary = manifest.getUnitSummary(courseId, unitId);
  if (!summary) return null;
  var chapterModule = getChapterModule(summary.chapterId);
  if (!chapterModule) return null;
  var units = chapterModule.units || [];
  for (var i = 0; i < units.length; i++) {
    if (units[i].id === unitId) return units[i];
  }
  return null;
}

function formatPrimarySource(unit) {
  if (!unit || !unit.sourceRefs || !unit.sourceRefs.length) return '';
  var ref = unit.sourceRefs[0];
  var source = manifest.getSourceById(ref.sourceId);
  var title = source ? source.displayTitleJa : ref.sourceId;
  var range = ref.pdfPageEnd > ref.pdfPageStart ? ('PDF 第 ' + ref.pdfPageStart + ' - ' + ref.pdfPageEnd + ' 页') : ('PDF 第 ' + ref.pdfPageStart + ' 页');
  return '原书定位：' + title + ' · ' + range + ' / 纸质页未验证';
}

module.exports = {
  getChapterModule: getChapterModule,
  getUnitById: getUnitById,
  formatPrimarySource: formatPrimarySource
};
