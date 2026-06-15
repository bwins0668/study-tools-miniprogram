// pages/profile/profile.js
var app = getApp();
var storage = require("../../utils/storage");

/**
 * 格式化时间戳为可读字符串
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
    learningStatus: ''
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
    if (lastAttempt && lastAttempt.answeredAt) {
      lastTime = formatTime(lastAttempt.answeredAt);
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
      learningStatus: statusText
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
            learningStatus: getLearningStatus(0, 0)
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
              if (lastAttempt && lastAttempt.answeredAt) {
                lastTime = formatTime(lastAttempt.answeredAt);
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
                learningStatus: statusText
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
            learningStatus: getLearningStatus(0, 0)
          });
        }
      }
    });
  }
});
