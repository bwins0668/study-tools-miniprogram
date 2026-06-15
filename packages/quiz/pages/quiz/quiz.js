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
    encouragementText: ''
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
    var encouragement = accuracy >= 80
      ? '表现很好，继续保持'
      : (accuracy >= 50 ? '已经有进步，建议复习错题' : '建议先复习术语和错题');

    this.setData({
      isFinished: true,
      showResult: true,
      sessionAccuracy: accuracy,
      encouragementText: encouragement
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
      encouragementText: ''
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
