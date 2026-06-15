// pages/profile/profile.js
var app = getApp();
var storage = require("../../utils/storage");

/**
 * 格式化时间戳为可读字符串（用于最近练习时间）
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  var d = new Date(timestamp);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  if (minute < 10) minute = '0' + minute;
  return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
}

/**
 * 格式化时间戳为相对时间或简短日期（用于时间线条目）
 * 今天 → "今天 HH:mm"
 * 昨天 → "昨天 HH:mm"
 * 更早 → "YYYY/MM/DD HH:mm"
 * 非法时间 → "时间未记录"
 */
function formatTimelineTime(timestamp) {
  if (!timestamp) return '时间未记录';
  var d;
  try {
    d = new Date(timestamp);
    if (isNaN(d.getTime())) return '时间未记录';
  } catch (e) {
    return '时间未记录';
  }
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  var yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  var hour = d.getHours();
  var minute = d.getMinutes();
  if (minute < 10) minute = '0' + minute;
  var timeStr = hour + ':' + minute;
  if (timestamp >= todayStart) {
    return '今天 ' + timeStr;
  }
  if (timestamp >= yesterdayStart) {
    return '昨天 ' + timeStr;
  }
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  if (month < 10) month = '0' + month;
  var day = d.getDate();
  if (day < 10) day = '0' + day;
  return year + '/' + month + '/' + day + ' ' + timeStr;
}

/**
 * exam 标签映射（安全降级）
 */
function getExamLabel(exam) {
  var map = {
    itpass: 'IT Passport',
    sg: 'SG'
  };
  return map[exam] || (exam || '未知');
}

/**
 * sourceType 标签映射（安全降级）
 */
function getSourceLabel(sourceType) {
  var map = {
    lesson_quiz: '课程练习',
    past_exam_japanese: '日文真题',
    wrong_only: '错题重练'
  };
  return map[sourceType] || (sourceType || '练习');
}

/**
 * 根据正确率和是否有记录生成学习状态鼓励文案
 */
function getLearningStatus(accuracy, totalAttempts) {
  if (totalAttempts === 0) return '还没有学习记录，开始第一次练习吧';
  if (accuracy >= 80) return '状态很好，继续保持！';
  if (accuracy >= 60) return '基础不错，建议复盘错题';
  return '建议先从错题和术语复习开始';
}

Page({
  data: {
    version: '',
    favoriteCount: 0,
    wrongQuestionCount: 0,
    totalAttempts: 0,
    correctCount: 0,
    wrongCount: 0,
    accuracy: 0,
    todayTotal: 0,
    itpassAccuracy: 0,
    sgAccuracy: 0,
    lessonAccuracy: 0,
    pastExamAccuracy: 0,
    lastPracticeTime: '',
    learningStatus: '',
    // 最近练习时间线
    recentAttempts: [],
    hasRecentAttempts: false,
    // 最近一次练习摘要
    lastPracticeSummary: {
      examLabel: '',
      sourceLabel: '',
      accuracy: 0,
      correct: 0,
      wrong: 0,
      total: 0
    }
  },

  onLoad: function () {
    this.setData({
      version: app.globalData.version
    });
  },

  onShow: function () {
    var favoriteCount = storage.getFavoriteTermCount ? storage.getFavoriteTermCount() : 0;
    var wrongQuestionCount = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0;
    var stats = storage.getQuizStats ? storage.getQuizStats() : { total: 0, correct: 0, wrong: 0, accuracy: 0, todayTotal: 0, byExam: { itpass: { accuracy: 0 }, sg: { accuracy: 0 } }, bySourceType: { lesson_quiz: { accuracy: 0 }, past_exam_japanese: { accuracy: 0 } } };

    // 最近练习时间
    var lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
    var lastTime = '';
    var lastSummary = { examLabel: '', sourceLabel: '', accuracy: 0, correct: 0, wrong: 0, total: 0 };
    if (lastAttempt && lastAttempt.answeredAt) {
      lastTime = formatTime(lastAttempt.answeredAt);
    }

    // 最近练习摘要：从最近 20 条 attempt 中推断最近一次"练习会话"
    var recentForSummary = storage.getRecentAttempts ? storage.getRecentAttempts(20) : [];
    if (recentForSummary.length > 0 && lastAttempt) {
      // 找到与 lastAttempt 相近时间（30分钟内）且同一 exam 的 attempt 作为一次 session
      var lastTs = lastAttempt.answeredAt || 0;
      var sessionWindow = 30 * 60 * 1000; // 30分钟
      var sessionCorrect = 0;
      var sessionTotal = 0;
      for (var i = 0; i < recentForSummary.length; i++) {
        var a = recentForSummary[i];
        var aTs = a.answeredAt || 0;
        if (Math.abs(lastTs - aTs) <= sessionWindow && a.exam === lastAttempt.exam) {
          sessionTotal++;
          if (a.isCorrect) sessionCorrect++;
        }
      }
      lastSummary = {
        examLabel: getExamLabel(lastAttempt.exam),
        sourceLabel: getSourceLabel(lastAttempt.sourceType),
        accuracy: sessionTotal > 0 ? Math.round(sessionCorrect / sessionTotal * 100) : 0,
        correct: sessionCorrect || 0,
        wrong: sessionTotal - sessionCorrect || 0,
        total: sessionTotal || 0
      };
    }

    // 最近练习时间线（最多 10 条）
    var recentAttempts = storage.getRecentAttempts ? storage.getRecentAttempts(10) : [];
    var timelineItems = [];
    for (var r = 0; r < recentAttempts.length; r++) {
      var ra = recentAttempts[r];
      var isCorrect = ra.isCorrect === true;
      timelineItems.push({
        time: formatTimelineTime(ra.answeredAt),
        examLabel: getExamLabel(ra.exam),
        sourceLabel: getSourceLabel(ra.sourceType),
        isCorrect: isCorrect,
        status: isCorrect ? '正确' : '错误'
      });
    }

    // 学习状态文案
    var statusText = getLearningStatus(stats.accuracy || 0, stats.total || 0);

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      totalAttempts: stats.total || 0,
      correctCount: stats.correct || 0,
      wrongCount: stats.wrong || 0,
      accuracy: stats.accuracy || 0,
      todayTotal: stats.todayTotal || 0,
      itpassAccuracy: (stats.byExam && stats.byExam.itpass) ? stats.byExam.itpass.accuracy : 0,
      sgAccuracy: (stats.byExam && stats.byExam.sg) ? stats.byExam.sg.accuracy : 0,
      lessonAccuracy: (stats.bySourceType && stats.bySourceType.lesson_quiz) ? stats.bySourceType.lesson_quiz.accuracy : 0,
      pastExamAccuracy: (stats.bySourceType && stats.bySourceType.past_exam_japanese) ? stats.bySourceType.past_exam_japanese.accuracy : 0,
      lastPracticeTime: lastTime,
      learningStatus: statusText,
      recentAttempts: timelineItems,
      hasRecentAttempts: timelineItems.length > 0,
      lastPracticeSummary: lastSummary
    });
  },

  clearAttempts: function () {
    var that = this;
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有学习记录吗？收藏和错题本不受影响。',
      confirmText: '确认清空',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          storage.clearQuizAttempts();
          wx.showToast({
            title: '学习记录已清空',
            icon: 'none',
            duration: 1500
          });
          // 刷新页面
          var stats = storage.getQuizStats();
          that.setData({
            totalAttempts: stats.total,
            correctCount: stats.correct,
            wrongCount: stats.wrong,
            accuracy: stats.accuracy,
            todayTotal: stats.todayTotal,
            itpassAccuracy: stats.byExam.itpass.accuracy,
            sgAccuracy: stats.byExam.sg.accuracy,
            lessonAccuracy: stats.bySourceType.lesson_quiz.accuracy,
            pastExamAccuracy: stats.bySourceType.past_exam_japanese.accuracy,
            lastPracticeTime: '',
            learningStatus: getLearningStatus(0, 0),
            recentAttempts: [],
            hasRecentAttempts: false,
            lastPracticeSummary: { examLabel: '', sourceLabel: '', accuracy: 0, correct: 0, wrong: 0, total: 0 }
          });
        }
      }
    });
  },

  copyBackup: function () {
    var backup = storage.exportLocalBackup();
    var jsonStr = JSON.stringify(backup, null, 2);
    wx.setClipboardData({
      data: jsonStr,
      success: function () {
        wx.showToast({
          title: '备份数据已复制',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },

  restoreFromClipboard: function () {
    var that = this;
    wx.showModal({
      title: '确认恢复',
      content: '恢复会覆盖当前收藏、错题和学习记录，是否继续？',
      confirmText: '确认恢复',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.getClipboardData({
            success: function (clipRes) {
              var text = clipRes.data || '';
              var parsed = null;
              try {
                parsed = JSON.parse(text);
              } catch (e) {
                wx.showToast({
                  title: '备份数据无效',
                  icon: 'none',
                  duration: 1500
                });
                return;
              }
              if (!storage.validateLocalBackup(parsed)) {
                wx.showToast({
                  title: '备份数据无效',
                  icon: 'none',
                  duration: 1500
                });
                return;
              }
              storage.importLocalBackup(parsed);
              wx.showToast({
                title: '恢复成功',
                icon: 'none',
                duration: 1500
              });
              // 刷新页面统计
              var favoriteCount = storage.getFavoriteTermCount();
              var wrongQuestionCount = storage.getWrongQuestionCount();
              var stats = storage.getQuizStats();
              var lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
              var lastTime = '';
              var lastSummary = { examLabel: '', sourceLabel: '', accuracy: 0, correct: 0, wrong: 0, total: 0 };
              if (lastAttempt && lastAttempt.answeredAt) {
                lastTime = formatTime(lastAttempt.answeredAt);
              }
              // 最近练习摘要
              var rfs = storage.getRecentAttempts ? storage.getRecentAttempts(20) : [];
              if (rfs.length > 0 && lastAttempt) {
                var lastTs = lastAttempt.answeredAt || 0;
                var sessionWindow = 30 * 60 * 1000;
                var sCorrect = 0, sTotal = 0;
                for (var ri = 0; ri < rfs.length; ri++) {
                  var aa = rfs[ri];
                  if (Math.abs(lastTs - (aa.answeredAt || 0)) <= sessionWindow && aa.exam === lastAttempt.exam) {
                    sTotal++;
                    if (aa.isCorrect) sCorrect++;
                  }
                }
                lastSummary = {
                  examLabel: getExamLabel(lastAttempt.exam),
                  sourceLabel: getSourceLabel(lastAttempt.sourceType),
                  accuracy: sTotal > 0 ? Math.round(sCorrect / sTotal * 100) : 0,
                  correct: sCorrect || 0,
                  wrong: sTotal - sCorrect || 0,
                  total: sTotal || 0
                };
              }
              // 最近练习时间线
              var ra = storage.getRecentAttempts ? storage.getRecentAttempts(10) : [];
              var tlItems = [];
              for (var tj = 0; tj < ra.length; tj++) {
                var rb = ra[tj];
                var ic = rb.isCorrect === true;
                tlItems.push({
                  time: formatTimelineTime(rb.answeredAt),
                  examLabel: getExamLabel(rb.exam),
                  sourceLabel: getSourceLabel(rb.sourceType),
                  isCorrect: ic,
                  status: ic ? '正确' : '错误'
                });
              }
              var statusText = getLearningStatus(stats.accuracy || 0, stats.total || 0);
              that.setData({
                favoriteCount: favoriteCount,
                wrongQuestionCount: wrongQuestionCount,
                totalAttempts: stats.total || 0,
                correctCount: stats.correct || 0,
                wrongCount: stats.wrong || 0,
                accuracy: stats.accuracy || 0,
                todayTotal: stats.todayTotal || 0,
                itpassAccuracy: (stats.byExam && stats.byExam.itpass) ? stats.byExam.itpass.accuracy : 0,
                sgAccuracy: (stats.byExam && stats.byExam.sg) ? stats.byExam.sg.accuracy : 0,
                lessonAccuracy: (stats.bySourceType && stats.bySourceType.lesson_quiz) ? stats.bySourceType.lesson_quiz.accuracy : 0,
                pastExamAccuracy: (stats.bySourceType && stats.bySourceType.past_exam_japanese) ? stats.bySourceType.past_exam_japanese.accuracy : 0,
                lastPracticeTime: lastTime,
                learningStatus: statusText,
                recentAttempts: tlItems,
                hasRecentAttempts: tlItems.length > 0,
                lastPracticeSummary: lastSummary
              });
            }
          });
        }
      }
    });
  },

  clearAllData: function () {
    var that = this;
    wx.showModal({
      title: '确认清空全部数据',
      content: '这会清空收藏、错题本和学习记录，无法撤销。',
      confirmText: '确认清空',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          storage.clearAllLocalUserData();
          wx.showToast({
            title: '本地数据已清空',
            icon: 'none',
            duration: 1500
          });
          // 刷新页面
          that.setData({
            favoriteCount: 0,
            wrongQuestionCount: 0,
            totalAttempts: 0,
            correctCount: 0,
            wrongCount: 0,
            accuracy: 0,
            todayTotal: 0,
            itpassAccuracy: 0,
            sgAccuracy: 0,
            lessonAccuracy: 0,
            pastExamAccuracy: 0,
            lastPracticeTime: '',
            learningStatus: getLearningStatus(0, 0),
            recentAttempts: [],
            hasRecentAttempts: false,
            lastPracticeSummary: { examLabel: '', sourceLabel: '', accuracy: 0, correct: 0, wrong: 0, total: 0 }
          });
        }
      }
    });
  }
});
