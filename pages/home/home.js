// pages/home/home.js
var app = getApp();
const {
  getFavoriteTermCount,
  getWrongQuestionCount,
  getQuizStats,
  getLastAttempt,
  getLastAttemptByExam
} = require("../../utils/storage");

/**
 * R3.58 每日学习格言
 */
var DAILY_QUOTES = [
  '学习不怕根底浅，只要迈步就不晚。',
  '每天进步一点点，终有一天会发光。',
  '错题是最好的老师，认真对待每一道错题。',
  '坚持学习 7 天，你会看到明显进步。',
  '术语记忆靠重复，每天复习 5 分钟。',
  '正确率不是唯一目标，理解才是关键。',
  '今天的学习，是明天考试的底气。',
  '与其担心考试，不如现在开始练习。',
  '收藏的术语要定期复习，才能真正记住。',
  '学习 IT 日语，术语是第一步。'
];

function getDailyQuote() {
  var today = new Date();
  var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  var index = dayOfYear % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}

var EXAM_LABELS = {
  itpass: 'IT Passport',
  sg: 'SG 考试'
};
var SOURCE_LABELS = {
  lesson_quiz: '课程练习',
  past_exam_japanese: '日文真题'
};

var homeSessionViewCount = 0;

function formatLastPracticeTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var now = new Date();
  var diffMs = now.getTime() - date.getTime();
  var diffMin = Math.floor(diffMs / 60000);
  var diffHour = Math.floor(diffMs / 3600000);
  var diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return diffMin + '分钟前';
  if (diffHour < 24) return diffHour + '小时前';
  if (diffDay < 7) return diffDay + '天前';

  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

function generateSuggestion(wrongCount, favoriteCount, hasLastAttempt, todayTotal) {
  if (wrongCount > 0) {
    return '有 ' + wrongCount + ' 道错题待复习，建议先去错题本巩固薄弱点';
  }
  if (favoriteCount > 0) {
    return '有 ' + favoriteCount + ' 个收藏术语，建议复习收藏加深记忆';
  }
  if (todayTotal > 0 && hasLastAttempt) {
    return '今天已练习 ' + todayTotal + ' 题，继续保持，也可以浏览术语表';
  }
  return '还没有学习记录，可以从术语表或练习开始，遇到重要术语先收藏再复习';
}

/**
 * R3.51 增强建议生成：返回包含操作信息的对象
 */
function generateEnhancedSuggestion(wrongCount, favoriteCount, hasLastAttempt, todayTotal, streakCount) {
  var result = {
    text: '',
    actionText: '',
    actionPath: ''
  };

  if (wrongCount > 0) {
    result.text = '有 ' + wrongCount + ' 道错题待复习';
    result.actionText = '去复习错题';
    result.actionPath = '/packages/quiz/pages/mistakes/mistakes';
    return result;
  }

  if (favoriteCount > 0) {
    result.text = '已收藏 ' + favoriteCount + ' 个术语';
    result.actionText = '复习收藏';
    result.actionPath = '/packages/glossary/pages/favorite-review/favorite-review';
    return result;
  }

  if (streakCount > 0) {
    result.text = '已连续学习 ' + streakCount + ' 天，继续保持！';
    result.actionText = '继续练习';
    result.actionPath = '/packages/quiz/pages/exam-menu/exam-menu';
    return result;
  }

  if (todayTotal > 0 && hasLastAttempt) {
    result.text = '今天已练习 ' + todayTotal + ' 题';
    result.actionText = '继续练习';
    result.actionPath = '/packages/quiz/pages/exam-menu/exam-menu';
    return result;
  }

  result.text = '开始今日学习之旅吧';
  result.actionText = '开始练习';
  result.actionPath = '/packages/quiz/pages/quiz-menu/quiz-menu';
  return result;
}

/**
 * R3.52 学习时间智能提醒：根据时间和学习状态生成提醒文本
 */
function generateLearningReminder(streakCount, todayTotal, wrongCount, favoriteCount) {
  var now = new Date();
  var hour = now.getHours();
  var greeting = '';

  // 根据时间段生成问候语
  if (hour >= 5 && hour < 8) {
    greeting = '早起好';
  } else if (hour >= 8 && hour < 11) {
    greeting = '早上好';
  } else if (hour >= 11 && hour < 13) {
    greeting = '中午好';
  } else if (hour >= 13 && hour < 17) {
    greeting = '下午好';
  } else if (hour >= 17 && hour < 20) {
    greeting = '傍晚好';
  } else if (hour >= 20 && hour < 23) {
    greeting = '晚上好';
  } else {
    greeting = '深夜了';
  }

  // 根据学习状态生成提醒
  if (wrongCount > 0 && todayTotal === 0) {
    return greeting + '，今天还没练习，有 ' + wrongCount + ' 道错题待复习';
  }
  if (streakCount > 0 && todayTotal === 0) {
    return greeting + '，已连续学习 ' + streakCount + ' 天，今天继续吗？';
  }
  if (todayTotal > 0 && todayTotal < 10) {
    return greeting + '，今天已练习 ' + todayTotal + ' 题，再练几题吧';
  }
  if (todayTotal >= 10) {
    return greeting + '，今日目标已达成！继续保持';
  }
  if (favoriteCount > 0 && todayTotal === 0) {
    return greeting + '，有 ' + favoriteCount + ' 个收藏术语，复习一下吧';
  }
  return greeting + '，开始今日学习吧';
}

Page({
  data: {
    favoriteCount: 0,
    wrongQuestionCount: 0,
    todayTotal: 0,
    accuracy: 0,
    hasLastAttempt: false,
    lastExamLabel: '',
    lastSourceLabel: '',
    lastExam: '',
    lastSourceType: '',
    suggestion: '',
    nextActionHint: '',
    suggestionActionText: '',
    suggestionActionPath: '',
    lastPracticeTimeText: '',
    sectionTitle: '快速开始',
    itpassTotal: 0,
    itpassAccuracy: 0,
    sgTotal: 0,
    sgAccuracy: 0,
    itpassStatusText: '未练习',
    sgStatusText: '未练习',
    itpassLastTime: '',
    sgLastTime: '',
    itpassWeak: false,
    sgWeak: false,
    // v0.21.0 第四批：继续练习入口增强
    lastAttemptAccuracy: 0,
    continueSuggestion: '',
    // R3.42 学习 streak
    streakCount: 0,
    streakText: '',
    // R3.44 今日练习进度
    dailyGoal: 10,
    goalProgress: 0,
    goalText: '',
    showGoalReminder: false,
    // R3.47 学习成就系统
    achievements: [],
    showAchievements: false,
    // R3.52 学习时间智能提醒
    learningReminder: '',
    // R3.58 每日学习格言
    dailyQuote: '',
    // R3.61 练习提醒
    practiceReminder: '',
    // R3.63 练习提醒关闭
    reminderDismissed: false,
    // R3.72 返回顶部按钮
    showBackToTop: false,
    // R3.77 页面浏览次数
    viewCount: 0,
    version: '',
    // R3.79 最近更新提示
    showUpdateBanner: true,
    updateText: '最近更新：新增返回顶部按钮、页面浏览次数统计、最近更新提示',
    isNavigating: false,
    navigationTarget: ''
  },

  onShow: function () {
    this._clearNavigationLock();
    // R3.77 页面浏览次数统计
    homeSessionViewCount += 1;
    var viewCount = homeSessionViewCount;

    // R4: 加载间隔复习摘要
    var reviewDueCount = 0;
    var adaptiveRec = null;
    try {
      var sr = require('../../utils/spaced-repetition/index');
      var s = sr.review.getTodayReviewSummary();
      reviewDueCount = s.dueCount;
      // R6: Adaptive learning recommendation
      adaptiveRec = sr.adaptive.getLearningRecommendation();
    } catch (e) { /* SR module not available */ }

    var favoriteCount = getFavoriteTermCount ? getFavoriteTermCount() : 0;
    var wrongQuestionCount = getWrongQuestionCount ? getWrongQuestionCount() : 0;
    var stats = getQuizStats ? getQuizStats() : { total: 0, correct: 0, wrong: 0, accuracy: 0, todayTotal: 0 };
    var totalAttempts = stats.total || 0;

    // 最近练习
    var lastAttempt = getLastAttempt ? getLastAttempt() : null;
    var hasLastAttempt = !!lastAttempt;
    var lastExamLabel = '';
    var lastSourceLabel = '';
    var lastExam = '';
    var lastSourceType = '';
    var lastPracticeTimeText = '';
    var sectionTitle = '快速开始';

    if (lastAttempt) {
      if (lastAttempt.sourceType === 'wrong_only') {
        lastExamLabel = '错题练习';
        lastSourceLabel = '错题重练';
        lastExam = 'wrong_only';
        lastSourceType = 'wrong_only';
      } else {
        lastExamLabel = EXAM_LABELS[lastAttempt.exam] || lastAttempt.exam;
        lastSourceLabel = SOURCE_LABELS[lastAttempt.sourceType] || lastAttempt.sourceType;
        lastExam = lastAttempt.exam || '';
        lastSourceType = lastAttempt.sourceType || '';
      }
      lastPracticeTimeText = formatLastPracticeTime(lastAttempt.answeredAt);
      sectionTitle = '继续学习';
    }

    // 按考试方向统计
    var byExam = stats.byExam || {};
    var itpassStats = byExam.itpass || { total: 0, accuracy: 0 };
    var sgStats = byExam.sg || { total: 0, accuracy: 0 };
    var itpassTotal = itpassStats.total || 0;
    var itpassAccuracy = itpassStats.accuracy || 0;
    var sgTotal = sgStats.total || 0;
    var sgAccuracy = sgStats.accuracy || 0;

    // 练习状态文案
    function getStatusText(total, accuracy) {
      if (total === 0) return '未练习';
      if (accuracy >= 80) return '继续练习';
      if (accuracy < 60 && total > 0) return '复习错题';
      return '继续练习';
    }
    var itpassStatusText = getStatusText(itpassTotal, itpassAccuracy);
    var sgStatusText = getStatusText(sgTotal, sgAccuracy);

    // 各考试方向最近练习时间
    var itpassLastTs = getLastAttemptByExam('itpass');
    var sgLastTs = getLastAttemptByExam('sg');
    var itpassLastTime = itpassLastTs ? formatLastPracticeTime(itpassLastTs) : '';
    var sgLastTime = sgLastTs ? formatLastPracticeTime(sgLastTs) : '';

    // 弱项检测：两个方向正确率差距 >= 20% 且较低者 < 70% 标记为弱项
    var itpassWeak = false;
    var sgWeak = false;
    if (itpassTotal > 0 && sgTotal > 0) {
      var gap = Math.abs(itpassAccuracy - sgAccuracy);
      if (gap >= 20) {
        if (itpassAccuracy < sgAccuracy && itpassAccuracy < 70) {
          itpassWeak = true;
        } else if (sgAccuracy < itpassAccuracy && sgAccuracy < 70) {
          sgWeak = true;
        }
      }
    }

    // 生成建议
    var suggestion = generateSuggestion(wrongQuestionCount, favoriteCount, hasLastAttempt, stats.todayTotal || 0);

    // R3.51 生成增强建议（包含操作按钮）
    var enhancedSuggestion = generateEnhancedSuggestion(wrongQuestionCount, favoriteCount, hasLastAttempt, stats.todayTotal || 0, streakCount);
    var suggestionActionText = enhancedSuggestion.actionText || '';
    var suggestionActionPath = enhancedSuggestion.actionPath || '';

    // R3.52 生成学习提醒（初步，streakCount 可能在下方重新计算）
    var learningReminder = generateLearningReminder(streakCount, stats.todayTotal || 0, wrongQuestionCount, favoriteCount);

    // R3.58 生成每日格言
    var dailyQuote = getDailyQuote();

    // R3.61 生成练习提醒
    var practiceReminder = '';
    if (lastPracticeTimeText) {
      if (lastPracticeTimeText.indexOf('天前') >= 0) {
        var daysMatch = lastPracticeTimeText.match(/^(\d+)天前$/);
        if (daysMatch && parseInt(daysMatch[1]) >= 2) {
          practiceReminder = '距离上次练习已经 ' + daysMatch[1] + ' 天了，今天继续吗？';
        }
      }
    }

    // 生成下一步行动提示
    var nextActionHint = '';
    if (wrongQuestionCount > 0) {
      nextActionHint = '去错题本 →';
    } else if (favoriteCount > 0) {
      nextActionHint = '复习收藏 →';
    } else if (hasLastAttempt) {
      nextActionHint = '继续练习 →';
    } else {
      nextActionHint = '开始学习 →';
    }

    // 继续练习入口增强：上次练习方向准确率 + 建议
    var lastAttemptAccuracy = 0;
    var continueSuggestion = '';
    if (lastAttempt && lastAttempt.exam && lastAttempt.sourceType !== 'wrong_only') {
      var examStats = byExam[lastAttempt.exam];
      if (examStats && examStats.total > 0) {
        lastAttemptAccuracy = examStats.accuracy || 0;
      }
    }
    if (lastAttemptAccuracy > 0) {
      if (lastAttemptAccuracy >= 80) {
        continueSuggestion = '上次表现不错，继续保持节奏';
      } else if (lastAttemptAccuracy >= 60) {
        continueSuggestion = '上次正确率一般，建议再练一组巩固';
      } else {
        continueSuggestion = '上次正确率较低，建议先复盘错题';
      }
    }

    // R3.42 学习 streak 计算 (R3.45 优化: 减少不必要的 storage 写入)
    var streakCount = 0;
    var streakText = '';
    try {
      var streakData = wx.getStorageSync('study-tools-mini-streak-v1');
      if (streakData && streakData.lastDate) {
        var lastDate = new Date(streakData.lastDate);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        var todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var diffDays = Math.floor((todayDay - lastDay) / 86400000);
        if (diffDays === 0) {
          // 今天已练习，streak 保持 (不需要写入 storage)
          streakCount = streakData.count || 1;
        } else if (diffDays === 1) {
          // 昨天练习了，streak +1 并写入 storage
          streakCount = (streakData.count || 0) + 1;
          wx.setStorageSync('study-tools-mini-streak-v1', {
            lastDate: today.toISOString(),
            count: streakCount
          });
        } else {
          // 超过 1 天没练习，streak 重置为 0 (不需要写入 storage)
          streakCount = 0;
        }
      }
      if (streakCount > 0) {
        streakText = '已连续学习 ' + streakCount + ' 天';
      }
    } catch (e) {
      streakCount = 0;
      streakText = '';
    }

    // R3.52 重新计算学习提醒（使用最新的streakCount值）
    learningReminder = generateLearningReminder(streakCount, stats.todayTotal || 0, wrongQuestionCount, favoriteCount);

    // R3.47 学习成就系统计算
    var achievements = [];
    try {
      var totalAttemptsCount = totalAttempts || 0;
      var accuracyRate = stats.accuracy || 0;
      var streakDays = streakCount || 0;

      // 成就 1: 初次答题 (累计答题数 >= 1)
      if (totalAttemptsCount >= 1) {
        achievements.push({
          id: 'first_quiz',
          name: '初次答题',
          description: '完成第一道题',
          icon: '🎯',
          unlocked: true
        });
      }

      // 成就 2: 答题达人 (累计答题数 >= 50)
      if (totalAttemptsCount >= 50) {
        achievements.push({
          id: 'quiz_master',
          name: '答题达人',
          description: '累计答题 50 道',
          icon: '🏆',
          unlocked: true
        });
      }

      // 成就 3: 刷题王者 (累计答题数 >= 200)
      if (totalAttemptsCount >= 200) {
        achievements.push({
          id: 'quiz_king',
          name: '刷题王者',
          description: '累计答题 200 道',
          icon: '👑',
          unlocked: true
        });
      }

      // 成就 4: 连续学习 3 天
      if (streakDays >= 3) {
        achievements.push({
          id: 'streak_3',
          name: '坚持学习',
          description: '连续学习 3 天',
          icon: '🔥',
          unlocked: true
        });
      }

      // 成就 5: 连续学习 7 天
      if (streakDays >= 7) {
        achievements.push({
          id: 'streak_7',
          name: '学习达人',
          description: '连续学习 7 天',
          icon: '⭐',
          unlocked: true
        });
      }

      // 成就 6: 正确率高手 (正确率 >= 80%)
      if (accuracyRate >= 80 && totalAttemptsCount >= 10) {
        achievements.push({
          id: 'high_accuracy',
          name: '正确率高手',
          description: '正确率超过 80%',
          icon: '💯',
          unlocked: true
        });
      }
    } catch (e) {
      achievements = [];
    }
    var showAchievements = achievements.length > 0;

    // R3.44 今日练习进度 (R3.45 优化: 缓存 todayTotal)
    var dailyGoal = 10;
    var todayCount = stats.todayTotal || 0; // R3.45 缓存计算结果
    var goalProgress = todayCount >= dailyGoal ? 100 : Math.round(todayCount / dailyGoal * 100);
    var goalText = todayCount >= dailyGoal ? '🎉 今日目标已达成！' : '今日进度 ' + todayCount + '/' + dailyGoal + ' 题';
    var showGoalReminder = todayCount === 0;

    this.setData({
      favoriteCount: favoriteCount,
      wrongQuestionCount: wrongQuestionCount,
      todayTotal: stats.todayTotal || 0,
      accuracy: stats.accuracy || 0,
      totalAttempts: totalAttempts,
      hasLastAttempt: hasLastAttempt,
      lastExamLabel: lastExamLabel,
      lastSourceLabel: lastSourceLabel,
      lastExam: lastExam,
      lastSourceType: lastSourceType,
      lastPracticeTimeText: lastPracticeTimeText,
      suggestion: suggestion,
      nextActionHint: nextActionHint,
      sectionTitle: sectionTitle,
      itpassTotal: itpassTotal,
      itpassAccuracy: itpassAccuracy,
      sgTotal: sgTotal,
      sgAccuracy: sgAccuracy,
      itpassStatusText: itpassStatusText,
      sgStatusText: sgStatusText,
      itpassLastTime: itpassLastTime,
      sgLastTime: sgLastTime,
      itpassWeak: itpassWeak,
      sgWeak: sgWeak,
      lastAttemptAccuracy: lastAttemptAccuracy,
      continueSuggestion: continueSuggestion,
      streakCount: streakCount,
      streakText: streakText,
      // R3.44 今日练习进度
      dailyGoal: dailyGoal,
      goalProgress: goalProgress,
      goalText: goalText,
      showGoalReminder: showGoalReminder,
      // R3.47 学习成就系统
      achievements: achievements,
      showAchievements: showAchievements,
      // R3.51 增强建议操作
      suggestionActionText: suggestionActionText,
      suggestionActionPath: suggestionActionPath,
      // R3.52 学习时间智能提醒
      learningReminder: learningReminder,
      // R3.61 练习提醒
      practiceReminder: practiceReminder,
      // R3.58 每日学习格言
      dailyQuote: dailyQuote,
      // R4 间隔复习摘要
      reviewDueCount: reviewDueCount,
      // R6 自适应学习推荐
      adaptiveRec: adaptiveRec,
      // R3.77 页面浏览次数统计
      viewCount: viewCount,
      version: app.globalData.version
    });
  },

  onHide: function () {
    this._clearNavigationLock();
  },

  onUnload: function () {
    this._clearNavigationLock();
  },

  _clearNavigationLock: function () {
    if (this._navigationUnlockTimer) {
      clearTimeout(this._navigationUnlockTimer);
      this._navigationUnlockTimer = null;
    }
    if (this.data.isNavigating || this.data.navigationTarget) {
      this.setData({ isNavigating: false, navigationTarget: '' });
    }
  },

  _releaseNavigationSoon: function () {
    var self = this;
    if (self._navigationUnlockTimer) clearTimeout(self._navigationUnlockTimer);
    self._navigationUnlockTimer = setTimeout(function () {
      self._clearNavigationLock();
    }, 600);
  },

  _navigateOnce: function (method, url, target) {
    if (this.data.isNavigating) return;
    var self = this;
    var navigate = wx[method];
    if (typeof navigate !== 'function') return;
    self.setData({ isNavigating: true, navigationTarget: target || '' });
    navigate({
      url: url,
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (error) {
        console.error('[home] navigation failed:', error);
        self._clearNavigationLock();
        wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
      }
    });
  },

  continueLearning: function () {
    var exam = this.data.lastExam;
    var sourceType = this.data.lastSourceType;
    if (exam && sourceType) {
      this._navigateOnce('navigateTo', '/packages/quiz/pages/quiz/quiz?exam=' + exam + '&sourceType=' + sourceType, 'continue');
    }
  },

  // R3.51 建议卡片操作按钮点击事件
  suggestionActionTap: function () {
    var path = this.data.suggestionActionPath || '';
    if (path) this._navigateOnce('navigateTo', path);
  },

  goToGlossary: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/term-search/term-search', 'glossary');
  },

  openReviewCenter: function () {
    this._navigateOnce('navigateTo', '/pages/review-center/review-center', 'review');
  },

  // R6: Navigate to weak deck for focused practice
  openWeakDeck: function (e) {
    var course = e.currentTarget.dataset.course;
    var deckId = e.currentTarget.dataset.deckId;
    if (!course || !deckId) return;
    this._navigateOnce('navigateTo',
      '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + encodeURIComponent(course),
      'weakdeck');
  },

  // R6: Start new learning — go to flashcard center
  startNewLearning: function (e) {
    this._navigateOnce('switchTab', '/pages/flashcards/flashcards', 'newlearn');
  },

  goToMistakes: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/mistakes/mistakes', 'mistakes');
  },

  goToItPassport: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass', 'itpass');
  },

  goToSG: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/exam-menu/exam-menu?exam=sg', 'sg');
  },

  goToFavoriteReview: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/favorite-review/favorite-review');
  },

  goToAnki: function () {
    this._navigateOnce('navigateTo', '/packages/glossary/pages/anki-player/anki-player?from=home', 'anki');
  },

  quickStart: function () {
    this._navigateOnce('navigateTo', '/packages/quiz/pages/quiz/quiz?exam=itpass&sourceType=lesson_quiz', 'itpass');
  },

  goToProfile: function () {
    this._navigateOnce('switchTab', '/pages/profile/profile', 'profile');
  },

  // R3.63 关闭练习提醒
  dismissReminder: function () {
    this.setData({
      reminderDismissed: true,
      practiceReminder: ''
    });
  },

  // R3.55 首页分享 streak
  onShareAppMessage: function () {
    var streakCount = this.data.streakCount || 0;
    var title = 'Study Tools 学习打卡';
    if (streakCount > 0) {
      title = '我已在 Study Tools 连续学习 ' + streakCount + ' 天，一起来学习吧！';
    }
    return {
      title: title,
      path: '/pages/home/home',
      imageUrl: ''
    };
  },

  // R3.65 下拉刷新
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  // R3.72 返回顶部按钮
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop || 0;
    var showBackToTop = scrollTop > 500;
    if (showBackToTop !== this.data.showBackToTop) {
      this.setData({
        showBackToTop: showBackToTop
      });
    }
  },

  scrollToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  // R3.79 关闭最近更新提示
  dismissUpdateBanner: function () {
    this.setData({
      showUpdateBanner: false
    });
  }
});
