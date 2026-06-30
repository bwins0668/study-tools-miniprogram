// R6.1 custom tabbar — runtime shared navigation loaded by app.json tabBar.custom:true
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '课程', icon: 'home' },
      { pagePath: '/pages/practice/practice', text: '刷题', icon: 'drill' },
      { pagePath: '/pages/review/review', text: '复习', icon: 'review' },
      { pagePath: '/pages/glossary/glossary', text: '术语', icon: 'glossary' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: 'profile' }
    ]
  },
  methods: {
    switchTab: function (e) {
      var data = e.currentTarget.dataset;
      var url = data.path;
      if (url) {
        wx.switchTab({ url: url });
      }
    }
  }
});
