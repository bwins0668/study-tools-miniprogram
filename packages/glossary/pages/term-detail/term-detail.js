// pages/term-detail/term-detail.js
var glossaryLoader = require('../../data/glossary_loader');
const {
  isFavoriteTerm,
  addFavoriteTerm,
  removeFavoriteTerm
} = require("../../../../utils/storage");

Page({
  data: {
    term: null,
    exampleText: '',
    isFavorite: false,
    // Round 3.23: 收藏操作反馈
    favoriteAction: '',
    // v0.22.0 第三批：术语详情增强
    categoryLabel: '',
    learningTip: ''
  },

  onLoad: function (options) {
    var id = options && options.id !== undefined ? String(options.id) : '';
    var found = glossaryLoader.getTermById(id);
    var exampleText = '';
    if (found) {
      if (typeof found.example === 'string') {
        exampleText = found.example;
      } else if (Array.isArray(found.examples)) {
        exampleText = found.examples.filter(function (item) {
          return typeof item === 'string' && item.trim();
        }).join('\n');
      }
    } else {
      wx.showToast({
        title: '术语不存在',
        icon: 'none'
      });
    }
    // id 已经是 'term-0001' 格式，直接用作 storage key
    var strId = String(id);
    // 学习建议
    var learningTip = this.buildLearningTip(found);
    var categoryLabel = this.getCategoryLabel(found ? found.category : '');

    this.setData({
      term: found,
      exampleText: exampleText,
      isFavorite: found ? isFavoriteTerm(strId) : false,
      learningTip: learningTip,
      categoryLabel: categoryLabel
    });
  },

  getCategoryLabel: function (category) {
    var map = {
      'database': '数据库',
      'network': '网络',
      'security': '信息安全',
      'programming': '编程',
      'system': '系统',
      'management': '项目管理',
      'strategy': 'IT 战略',
      'hardware': '硬件',
      'software': '软件',
      'cloud': '云计算',
      'ai': 'AI/人工智能',
      'data': '数据科学',
      'other': '其他'
    };
    return map[category] || category || '';
  },

  buildLearningTip: function (term) {
    if (!term) return '';
    var tips = {
      'database': '建议结合实际 SQL 练习加深理解，关注 IT Passport 和 SG 中的数据库设计题',
      'network': '重点掌握 OSI 模型和 TCP/IP 协议栈，SG 考试中网络题占比较高',
      'security': '信息安全是 IT Passport 和 SG 的共同重点，建议结合案例理解',
      'programming': '建议动手编写相关代码片段，算法题在 SG 考试中经常出现',
      'system': '关注操作系统和计算机组成原理的基础概念',
      'management': '项目管理的 10 大知识领域需熟记，IT Passport 中常见',
      'strategy': 'IT 战略与业务对齐是 IT Passport 的重要考点',
    };
    var tip = tips[term.category] || '建议结合 IT Passport 或 SG 的对应章节进行系统学习';
    return tip;
  },

  // Round 3.23: 返回术语搜索
  onBackToSearch: function () {
    wx.navigateBack({
      fail: function () {
        // 若无法返回（直接打开详情），跳转到术语表 tab
        wx.switchTab({
          url: '/pages/glossary/glossary'
        });
      }
    });
  },

  onFavorite: function () {
    var term = this.data.term;
    if (!term) return;

    var strId = String(term.id);

    if (this.data.isFavorite) {
      removeFavoriteTerm(strId);
      this.setData({ isFavorite: false, favoriteAction: 'removed' });
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      addFavoriteTerm(strId);
      this.setData({ isFavorite: true, favoriteAction: 'added' });
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 1500
      });
    }
  }
});
