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
    insightHint: ''
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
    var modeLabel = sourceType === 'past_exam_japanese' ? '日文题练习' : '课程练习';
    var allQuestions = questionsModule.questions.filter(function (question) {
      return question.exam === exam && question.sourceType === sourceType;
    });

    if (allQuestions.length > 0) {
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel,
        questions: allQuestions,
        totalQuestions: allQuestions.length,
        currentQuestion: allQuestions[0],
        currentIndex: 0,
        selectedAnswer: '',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false
      });
    } else {
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel,
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0
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

    this.setData({
      selectedAnswer: key,
      hasAnswered: true,
      isCorrect: isCorrect,
      sessionTotal: sessionTotal,
      sessionCorrect: sessionCorrect,
      sessionWrong: sessionWrong,
      sessionAccuracy: Math.round(sessionCorrect / sessionTotal * 100)
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
      selectedAnswer: '',
      hasAnswered: false,
      isCorrect: false
    });
  },

  showPracticeResult: function () {
    var accuracy = this.data.sessionTotal > 0
      ? Math.round(this.data.sessionCorrect / this.data.sessionTotal * 100)
      : 0;

    // 3级学习洞察
    var accuracyLevel = '';
    var encouragement = '';
    var insightHint = '';
    if (this.data.sessionTotal === 0) {
      encouragement = '本次无答题记录';
      accuracyLevel = 'none';
    } else if (accuracy >= 85) {
      accuracyLevel = 'good';
      encouragement = '掌握较好';
      insightHint = '继续保持练习节奏，可以尝试其他考试方向';
    } else if (accuracy >= 60) {
      accuracyLevel = 'moderate';
      encouragement = '建议继续巩固';
      insightHint = '建议再练一组巩固薄弱知识点';
    } else {
      accuracyLevel = 'low';
      encouragement = '建议复盘错题';
      insightHint = '建议先到错题本复习相关题目';
    }

    this.setData({
      isFinished: true,
      showResult: true,
      sessionAccuracy: accuracy,
      encouragementText: encouragement,
      accuracyLevel: accuracyLevel,
      insightHint: insightHint
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
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: matched,
        totalQuestions: matched.length,
        currentQuestion: matched[0],
        currentIndex: 0,
        selectedAnswer: '',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false
      });
    } else {
      this.setData({
        exam: 'wrong_only',
        examTitle: '错题练习',
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0
      });
    }
  }
});
