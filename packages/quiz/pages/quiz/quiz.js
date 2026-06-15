// pages/quiz/quiz.js
var questionsModule = require('../../data/questions');
var storage = require('../../../../utils/storage');

Page({
  data: {
    exam: '',
    sourceType: 'lesson_quiz',
    modeLabel: '课程练习',
    examTitle: '',
    resultModeLabel: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswer: '',
    hasAnswered: false,
    isCorrect: false,
    isFinished: false,
    showResult: false,
    totalQuestions: 0,
    sessionTotal: 0,
    sessionCorrect: 0,
    sessionWrong: 0,
    sessionAccuracy: 0,
    encouragementText: '',
    // v0.21.0 第四批：结果页轻量洞察
    accuracyLevel: '',
    insightHint: '',
    // v0.22.0 第一批：答题页体验增强
    examBadge: '',
    progressPercent: 0,
    feedbackTip: '',
    showFeedbackTip: false,
    // v0.22.0 第二批：结果页复盘增强
    nextAction: '',
    hasWrongQuestions: false,
    // R3.43 答题记录追踪
    answeredList: [],
    showReview: false,
    // R3.50 重练错题功能
    wrongQuestionIds: [],
    // R3.60 答题提示按钮
    showHint: false
  },

  onLoad: function (options) {
    var exam = options.exam || 'itpass';
    var sourceType = options.sourceType || 'lesson_quiz';

    if (sourceType === 'wrong_only') {
      this.loadWrongQuestions();
      return;
    }

    this.loadPracticeQuestions(exam, sourceType);
  },

  loadPracticeQuestions: function (exam, sourceType) {
    var examTitle = exam === 'sg' ? 'SG 考试' : 'IT Passport';
    var examBadge = exam === 'sg' ? 'SG' : 'IT';
    var modeLabel = sourceType === 'past_exam_japanese' ? '日文题练习' : '课程练习';
    var allQuestions = questionsModule.questions.filter(function (question) {
      return question.exam === exam && question.sourceType === sourceType;
    });

    if (allQuestions.length > 0) {
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel,
        examBadge: examBadge,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel,
        questions: allQuestions,
        totalQuestions: allQuestions.length,
        currentQuestion: allQuestions[0],
        currentIndex: 0,
        progressPercent: Math.round(1 / allQuestions.length * 100) || 0,
        selectedAnswer: '',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false,
        showFeedbackTip: false
      });
    } else {
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel,
        examBadge: examBadge,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel,
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0,
        showFeedbackTip: false
      });
    }
  },

  selectAnswer: function (event) {
    if (this.data.hasAnswered || !this.data.currentQuestion) return;

    var key = event.currentTarget.dataset.key;
    var correctAnswer = this.data.currentQuestion.answer;
    var isCorrect = key === correctAnswer;
    var attemptExam = this.data.sourceType === 'wrong_only'
      ? (this.data.currentQuestion.exam || this.data.exam)
      : this.data.exam;

    if (!isCorrect) {
      storage.addWrongQuestion(
        this.data.currentQuestion.id,
        attemptExam,
        key
      );
    }

    storage.addQuizAttempt({
      questionId: this.data.currentQuestion.id,
      exam: attemptExam,
      sourceType: this.data.sourceType,
      selectedAnswer: key,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    });

    var sessionTotal = this.data.sessionTotal + 1;
    var sessionCorrect = this.data.sessionCorrect + (isCorrect ? 1 : 0);
    var sessionWrong = this.data.sessionWrong + (isCorrect ? 0 : 1);

    // R3.43 追踪答题记录
    var answeredList = this.data.answeredList.slice();
    answeredList.push({
      questionId: this.data.currentQuestion.id,
      selectedAnswer: key,
      isCorrect: isCorrect
    });

    // R3.50 记录错题 ID
    var wrongQuestionIds = this.data.wrongQuestionIds.slice();
    if (!isCorrect) {
      wrongQuestionIds.push(this.data.currentQuestion.id);
    }

    // 答题反馈提示语
    var feedbackTip = '';
    if (isCorrect) {
      var tips = ['继续保持！', '回答正确，理解得不错！', '很好，这道题掌握了！', '不错哦！'];
      feedbackTip = tips[Math.floor(Math.random() * tips.length)];
    } else {
      feedbackTip = '正确答案是 ' + correctAnswer + '，建议结合解释理解知识点';
    }

    this.setData({
      selectedAnswer: key,
      hasAnswered: true,
      isCorrect: isCorrect,
      sessionTotal: sessionTotal,
      sessionCorrect: sessionCorrect,
      sessionWrong: sessionWrong,
      sessionAccuracy: Math.round(sessionCorrect / sessionTotal * 100),
      feedbackTip: feedbackTip,
      showFeedbackTip: true
    });
  },

  nextQuestion: function () {
    var nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.questions.length) {
      this.showPracticeResult();
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      progressPercent: Math.round((nextIndex + 1) / this.data.totalQuestions * 100) || 0,
      selectedAnswer: '',
      hasAnswered: false,
      isCorrect: false,
      showFeedbackTip: false,
      feedbackTip: ''
    });
  },

  showPracticeResult: function () {
    var accuracy = this.data.sessionTotal > 0
      ? Math.round(this.data.sessionCorrect / this.data.sessionTotal * 100)
      : 0;

    // 3级学习洞察 + 下一步建议
    var accuracyLevel = '';
    var encouragement = '';
    var insightHint = '';
    var nextAction = '';
    var hasWrongQuestions = this.data.sessionWrong > 0;

    if (this.data.sessionTotal === 0) {
      encouragement = '本次无答题记录';
      accuracyLevel = 'none';
      nextAction = '尝试开始一组新的练习';
    } else if (accuracy >= 85) {
      accuracyLevel = 'good';
      encouragement = '掌握较好';
      insightHint = '继续保持练习节奏，可以尝试其他考试方向';
      nextAction = '建议尝试其他考试方向或日文题练习';
    } else if (accuracy >= 60) {
      accuracyLevel = 'moderate';
      encouragement = '建议继续巩固';
      insightHint = '建议再练一组巩固薄弱知识点';
      nextAction = hasWrongQuestions ? '建议再练一次，并回顾本次错题' : '建议再来一组巩固练习';
    } else {
      accuracyLevel = 'low';
      encouragement = '建议复盘错题';
      insightHint = '建议先到错题本复习相关题目';
      nextAction = '建议先复习本次错题，理解后再重新练习';
    }

    this.setData({
      isFinished: true,
      showResult: true,
      sessionAccuracy: accuracy,
      encouragementText: encouragement,
      accuracyLevel: accuracyLevel,
      insightHint: insightHint,
      nextAction: nextAction,
      hasWrongQuestions: hasWrongQuestions,
      // R3.43 准备答题回顾数据（包含题目文本和正确答案）
      reviewList: (function () {
        var questions = self.data.questions;
        var answered = self.data.answeredList;
        var result = [];
        for (var i = 0; i < answered.length; i++) {
          var item = answered[i];
          var question = null;
          for (var j = 0; j < questions.length; j++) {
            if (String(questions[j].id) === String(item.questionId)) {
              question = questions[j];
              break;
            }
          }
          if (question) {
            result.push({
              questionId: item.questionId,
              selectedAnswer: item.selectedAnswer,
              isCorrect: item.isCorrect,
              questionZh: question.questionZh || '',
              correctAnswer: question.answer || '',
              // R3.48 添加错题解析
              hint: question.shared_hint || ''
            });
          }
        }
        return result;
      })()
    });
  },

  // R3.60 切换提示显示
  toggleHint: function () {
    var showHint = !this.data.showHint;
    this.setData({
      showHint: showHint
    });
  },

  resetSession: function () {
    this.setData({
      currentIndex: 0,
      currentQuestion: null,
      selectedAnswer: '',
      hasAnswered: false,
      isCorrect: false,
      isFinished: false,
      showResult: false,
      sessionTotal: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionAccuracy: 0,
      encouragementText: '',
      accuracyLevel: '',
      insightHint: ''
    });
  },

  restartPractice: function () {
    var exam = this.data.exam;
    var sourceType = this.data.sourceType;
    this.resetSession();

    if (sourceType === 'wrong_only') {
      this.loadWrongQuestions();
    } else {
      this.loadPracticeQuestions(exam, sourceType);
    }
  },

  goMistakes: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  finishQuiz: function () {
    wx.navigateBack();
  },

  // R3.43 切换答题回顾显示
  toggleReview: function () {
    this.setData({
      showReview: !this.data.showReview
    });
  },

  loadWrongQuestions: function () {
    var wrongQuestions = storage.getWrongQuestions();
    var allQuestions = questionsModule.questions;
    var matched = [];

    for (var i = 0; i < allQuestions.length; i++) {
      var question = allQuestions[i];
      for (var j = 0; j < wrongQuestions.length; j++) {
        if (wrongQuestions[j].id === question.id) {
          matched.push(question);
          break;
        }
      }
    }

    if (matched.length > 0) {
      this.setData({
        exam: 'wrong_only',
        examTitle: '错题练习',
        examBadge: '错题',
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: matched,
        totalQuestions: matched.length,
        currentQuestion: matched[0],
        currentIndex: 0,
        progressPercent: Math.round(1 / matched.length * 100) || 0,
        selectedAnswer: '',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false,
        showFeedbackTip: false
      });
    } else {
      this.setData({
        exam: 'wrong_only',
        examTitle: '错题练习',
        examBadge: '错题',
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0,
        showFeedbackTip: false
      });
    }
  },

  // R3.46 答题结果页分享功能
  onShareAppMessage: function () {
    var title = 'Study Tools 刷题';
    if (this.data.showResult) {
      var accuracy = this.data.sessionAccuracy || 0;
      var total = this.data.sessionTotal || 0;
      title = '我在 Study Tools 刷题，正确率 ' + accuracy + '%，共 ' + total + ' 题，来挑战吧！';
    }
    return {
      title: title,
      path: '/packages/quiz/pages/quiz-menu/quiz-menu',
      imageUrl: ''
    };
  },

  // R3.50 重练本次错题
  retryWrongQuestions: function () {
    var wrongIds = this.data.wrongQuestionIds || [];
    if (wrongIds.length === 0) {
      wx.showToast({ title: '本次没有错题', icon: 'none' });
      return;
    }

    // 从当前题目中过滤出错题
    var allQuestions = this.data.questions;
    var wrongQuestions = [];
    for (var i = 0; i < allQuestions.length; i++) {
      for (var j = 0; j < wrongIds.length; j++) {
        if (String(allQuestions[i].id) === String(wrongIds[j])) {
          wrongQuestions.push(allQuestions[i]);
          break;
        }
      }
    }

    if (wrongQuestions.length === 0) {
      wx.showToast({ title: '未找到错题', icon: 'none' });
      return;
    }

    // 重置会话，但保留exam和sourceType
    this.setData({
      questions: wrongQuestions,
      totalQuestions: wrongQuestions.length,
      currentIndex: 0,
      currentQuestion: wrongQuestions[0],
      progressPercent: Math.round(1 / wrongQuestions.length * 100) || 0,
      selectedAnswer: '',
      hasAnswered: false,
      isCorrect: false,
      isFinished: false,
      showResult: false,
      sessionTotal: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionAccuracy: 0,
      encouragementText: '',
      accuracyLevel: '',
      insightHint: '',
      wrongQuestionIds: [],
      answeredList: [],
      showReview: false,
      showFeedbackTip: false
    });
  }
});
