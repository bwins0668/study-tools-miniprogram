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

/**
 * 格式化备份导出时间为可读字符串
 */
function formatBackupTime(timestamp) {
  if (!timestamp) return '未知';
  var d;
  try {
    d = new Date(timestamp);
    if (isNaN(d.getTime())) return '未知';
  } catch (e) {
    return '未知';
  }
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  if (minute < 10) minute = '0' + minute;
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
}

/**
 * 构建备份数据摘要对象（用于 UI 展示和恢复确认弹窗）
 */
function buildBackupSummary() {
  var favCount = storage.getFavoriteTermCount ? storage.getFavoriteTermCount() : 0;
  var wrongCount = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0;
  var quizCount = storage.getQuizAttemptCount ? storage.getQuizAttemptCount() : 0;
  var backup = storage.exportLocalBackup ? storage.exportLocalBackup() : null;
  var backupVersion = (backup && backup.version) ? backup.version : '未知';
  var backupTime = (backup && backup.exportedAt) ? formatBackupTime(backup.exportedAt) : '未知';
  return {
    favoriteCount: favCount || 0,
    wrongQuestionCount: wrongCount || 0,
    quizAttemptCount: quizCount || 0,
    backupVersion: backupVersion,
    backupTime: backupTime,
    hasData: (favCount > 0 || wrongCount > 0 || quizCount > 0)
  };
}

/**
 * 构建从指定备份数据中提取的摘要（用于恢复确认弹窗）
 */
function buildRestoreSummary(backup) {
  if (!backup || !backup.data) return null;
  var favCount = Array.isArray(backup.data.favoriteTerms) ? backup.data.favoriteTerms.length : 0;
  var wrongCount = Array.isArray(backup.data.wrongQuestions) ? backup.data.wrongQuestions.length : 0;
  var quizCount = Array.isArray(backup.data.quizAttempts) ? backup.data.quizAttempts.length : 0;
  var backupVersion = backup.version || '未知';
  var backupTime = backup.exportedAt ? formatBackupTime(backup.exportedAt) : '未知';
  return {
    favoriteCount: favCount,
    wrongQuestionCount: wrongCount,
    quizAttemptCount: quizCount,
    backupVersion: backupVersion,
    backupTime: backupTime
  };
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
    consecutiveDays: 0,
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
    },
    // 备份数据摘要
    backupSummary: {
      favoriteCount: 0,
      wrongQuestionCount: 0,
      quizAttemptCount: 0,
      backupVersion: '',
      backupTime: '',
      hasData: false
    },
    // Round 3.21: 复习建议列表
    reviewHints: [],
    // Round 3.21: 科目对比洞察
    subjectComparison: { text: '', hasData: false, weaker: '' },
    // Round 3.21: 是否为新用户（零练习记录）
    isNewUser: true
  },

  onLoad: function () {
    this.setData({
      version: app.globalData.version
    });
  },

  onShow: function () {
    this.refreshAllData();
  },

  /**
   * 统一刷新页面所有数据（统计、时间线、备份摘要）
   */
  refreshAllData: function () {
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
      var lastTs = lastAttempt.answeredAt || 0;
      var sessionWindow = 30 * 60 * 1000;
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

    // 连续学习天数
    var consecutiveDays = storage.getConsecutiveLearningDays ? storage.getConsecutiveLearningDays() : 0;

    // 备份数据摘要
    var backupSummary = buildBackupSummary();

    // Round 3.21: 复习建议
    var reviewHints = [];
    if (wrongQuestionCount > 0) {
      reviewHints.push({ text: '当前有 ' + wrongQuestionCount + ' 道错题待复习，建议优先复盘错题', type: 'wrong' });
    }
    if (favoriteCount > 0) {
      reviewHints.push({ text: '收藏了 ' + favoriteCount + ' 个术语，可以安排一次收藏复习', type: 'favorite' });
    }
    if (reviewHints.length === 0) {
      reviewHints.push({ text: '开始练习后这里会显示个性化复习建议', type: 'empty' });
    }

    // Round 3.21: 科目对比洞察
    var subjectComparison = { text: '', hasData: false, weaker: '' };
    var itpassAcc = (stats.byExam && stats.byExam.itpass) ? (stats.byExam.itpass.accuracy || 0) : 0;
    var sgAcc = (stats.byExam && stats.byExam.sg) ? (stats.byExam.sg.accuracy || 0) : 0;
    var itpassTotal = (stats.byExam && stats.byExam.itpass) ? (stats.byExam.itpass.total || 0) : 0;
    var sgTotal = (stats.byExam && stats.byExam.sg) ? (stats.byExam.sg.total || 0) : 0;
    if (itpassTotal > 0 && sgTotal > 0) {
      subjectComparison.hasData = true;
      if (itpassAcc > sgAcc) {
        subjectComparison.text = 'IT Passport 正确率 ' + itpassAcc + '% 高于 SG ' + sgAcc + '%，建议多关注 SG 复习';
        subjectComparison.weaker = 'sg';
      } else if (sgAcc > itpassAcc) {
        subjectComparison.text = 'SG 正确率 ' + sgAcc + '% 高于 IT Passport ' + itpassAcc + '%，建议多关注 IT Passport 复习';
        subjectComparison.weaker = 'itpass';
      } else {
        subjectComparison.text = 'IT Passport 和 SG 正确率均为 ' + itpassAcc + '%，可以均衡复习';
        subjectComparison.weaker = 'both';
      }
    } else if (itpassTotal > 0) {
      subjectComparison.hasData = true;
      subjectComparison.text = 'IT Passport 正确率 ' + itpassAcc + '%，还没有 SG 练习记录';
      subjectComparison.weaker = 'sg';
    } else if (sgTotal > 0) {
      subjectComparison.hasData = true;
      subjectComparison.text = 'SG 正确率 ' + sgAcc + '%，还没有 IT Passport 练习记录';
      subjectComparison.weaker = 'itpass';
    } else {
      subjectComparison.text = '完成练习后会显示各科目正确率对比';
    }

    // Round 3.21: 新用户判断
    var isNewUser = (stats.total || 0) === 0;

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      totalAttempts: stats.total || 0,
      correctCount: stats.correct || 0,
      wrongCount: stats.wrong || 0,
      accuracy: stats.accuracy || 0,
      todayTotal: stats.todayTotal || 0,
      consecutiveDays: consecutiveDays,
      itpassAccuracy: (stats.byExam && stats.byExam.itpass) ? stats.byExam.itpass.accuracy : 0,
      sgAccuracy: (stats.byExam && stats.byExam.sg) ? stats.byExam.sg.accuracy : 0,
      lessonAccuracy: (stats.bySourceType && stats.bySourceType.lesson_quiz) ? stats.bySourceType.lesson_quiz.accuracy : 0,
      pastExamAccuracy: (stats.bySourceType && stats.bySourceType.past_exam_japanese) ? stats.bySourceType.past_exam_japanese.accuracy : 0,
      lastPracticeTime: lastTime,
      learningStatus: statusText,
      recentAttempts: timelineItems,
      hasRecentAttempts: timelineItems.length > 0,
      lastPracticeSummary: lastSummary,
      backupSummary: backupSummary,
      reviewHints: reviewHints,
      subjectComparison: subjectComparison,
      isNewUser: isNewUser
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
          that.refreshAllData();
        }
      }
    });
  },

  copyBackup: function () {
    var that = this;
    var summary = buildBackupSummary();
    // 构建确认说明文字
    var descParts = [];
    if (summary.favoriteCount > 0) descParts.push('收藏术语 ' + summary.favoriteCount + ' 条');
    if (summary.wrongQuestionCount > 0) descParts.push('错题 ' + summary.wrongQuestionCount + ' 条');
    if (summary.quizAttemptCount > 0) descParts.push('学习记录 ' + summary.quizAttemptCount + ' 条');
    var descText = descParts.length > 0 ? '当前备份包含：' + descParts.join('、') : '当前没有本地学习数据';
    descText += '\n\n数据仅保存在本机，建议复制后粘贴保存到安全位置。';

    wx.showModal({
      title: '复制备份',
      content: descText,
      confirmText: '复制到剪贴板',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          var backup = storage.exportLocalBackup();
          var jsonStr = JSON.stringify(backup, null, 2);
          wx.setClipboardData({
            data: jsonStr,
            success: function () {
              wx.showToast({
                title: '备份数据已复制到剪贴板，请粘贴保存到安全位置',
                icon: 'none',
                duration: 2000
              });
            },
            fail: function () {
              wx.showToast({
                title: '复制失败，请重试',
                icon: 'none',
                duration: 1500
              });
            }
          });
        }
      }
    });
  },

  restoreFromClipboard: function () {
    var that = this;
    wx.showModal({
      title: '从剪贴板恢复',
      content: '将从剪贴板读取备份数据，恢复会覆盖当前收藏、错题和学习记录，是否继续？',
      confirmText: '读取剪贴板',
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
                  title: '备份数据格式无效，请确认复制的是本小程序导出的备份内容',
                  icon: 'none',
                  duration: 2000
                });
                return;
              }
              if (!storage.validateLocalBackup(parsed)) {
                wx.showToast({
                  title: '备份数据格式无效，请确认复制的是本小程序导出的备份内容',
                  icon: 'none',
                  duration: 2000
                });
                return;
              }

              // 构建恢复数据摘要，在二次确认弹窗中展示
              var rs = buildRestoreSummary(parsed);
              var confirmContent = '即将恢复以下数据，这会覆盖当前本地数据：\n\n';
              confirmContent += '收藏术语：' + (rs.favoriteCount || 0) + ' 条\n';
              confirmContent += '错题：' + (rs.wrongQuestionCount || 0) + ' 条\n';
              confirmContent += '学习记录：' + (rs.quizAttemptCount || 0) + ' 条\n';
              confirmContent += '备份版本：' + rs.backupVersion + '\n';
              confirmContent += '备份时间：' + rs.backupTime + '\n\n';
              confirmContent += '恢复会覆盖当前本地数据，确定继续？';

              wx.showModal({
                title: '确认恢复',
                content: confirmContent,
                confirmText: '确认恢复',
                cancelText: '取消',
                success: function (res2) {
                  if (res2.confirm) {
                    storage.importLocalBackup(parsed);
                    wx.showToast({
                      title: '恢复成功',
                      icon: 'none',
                      duration: 1500
                    });
                    // 统一刷新页面数据（统计、时间线、备份摘要）
                    that.refreshAllData();
                  }
                }
              });
            },
            fail: function () {
              wx.showToast({
                title: '读取剪贴板失败，请确认已复制备份数据',
                icon: 'none',
                duration: 2000
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
          that.refreshAllData();
        }
      }
    });
  }
});
