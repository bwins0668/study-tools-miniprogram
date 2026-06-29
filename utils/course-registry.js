// utils/course-registry.js
// Static course registry for future course center expansion.
// No storage, no progress, no fake content.

var COURSES = [
  {
    id: 'itpass',
    kind: 'exam',
    displayName: 'IT Passport',
    displayNameJa: 'ITパスポート',
    availability: 'available',
    legacyEntryRoute: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass',
    description: 'ITパスポート試験対策 · 按年度模拟练习'
  },
  {
    id: 'sg',
    kind: 'exam',
    displayName: 'SG 信息安全',
    displayNameJa: '情報セキュリティ',
    availability: 'available',
    legacyEntryRoute: '/packages/quiz/pages/exam-menu/exam-menu?exam=sg',
    description: '情報セキュリティマネジメント · 专项强化'
  },
  {
    id: 'mos365',
    kind: 'certification',
    displayName: 'MOS 365',
    displayNameJa: 'MOS 365',
    availability: 'unresolved',
    legacyEntryRoute: null,
    description: 'MOS 365 认证考试 — 入口待确认'
  },
  {
    id: 'python',
    kind: 'language',
    displayName: 'Python',
    availability: 'planned',
    legacyEntryRoute: null,
    description: 'Python 编程学习 — 后续课程'
  },
  {
    id: 'java',
    kind: 'language',
    displayName: 'Java',
    availability: 'planned',
    legacyEntryRoute: null,
    description: 'Java 编程学习 — 后续课程'
  },
  {
    id: 'algorithm',
    kind: 'fundamentals',
    displayName: '算法基础',
    availability: 'planned',
    legacyEntryRoute: null,
    description: '算法与数据结构 — 后续课程'
  }
];

/**
 * Get all registered courses.
 * @returns {Array}
 */
function getAllCourses() {
  return COURSES;
}

/**
 * Get courses filtered by kind.
 * @param {string} kind - 'exam' | 'certification' | 'language' | 'fundamentals'
 * @returns {Array}
 */
function getCoursesByKind(kind) {
  return COURSES.filter(function (c) { return c.kind === kind; });
}

/**
 * Get available courses (not planned/unresolved).
 * @returns {Array}
 */
function getAvailableCourses() {
  return COURSES.filter(function (c) { return c.availability === 'available'; });
}

/**
 * Get a single course by id.
 * @param {string} id
 * @returns {Object|null}
 */
function getCourseById(id) {
  for (var i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === id) return COURSES[i];
  }
  return null;
}

module.exports = {
  COURSES: COURSES,
  getAllCourses: getAllCourses,
  getCoursesByKind: getCoursesByKind,
  getAvailableCourses: getAvailableCourses,
  getCourseById: getCourseById
};
