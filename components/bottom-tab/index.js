Component({
  properties: {
    active: {
      type: String,
      value: 'home',
    },
    safeBottom: {
      type: Number,
      value: 0,
    },
  },

  data: {
    tabs: [
      {
        key: 'home',
        label: '首页',
        url: '/pages/home/index',
        icon: '/assets/tab/home.svg',
        activeIcon: '/assets/tab/home-active.svg',
      },
      {
        key: 'profile',
        label: '我的',
        url: '/pages/profile/index',
        icon: '/assets/tab/profile.svg',
        activeIcon: '/assets/tab/profile-active.svg',
      },
    ],
  },

  methods: {
    onTabTap(event) {
      const key = event.currentTarget.dataset.key;
      if (!key || key === this.properties.active) {
        return;
      }

      const target = this.data.tabs.find((item) => item.key === key);
      if (!target) {
        return;
      }

      wx.reLaunch({
        url: target.url,
      });
    },
  },
});
