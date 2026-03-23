const { clearToken, clearUser } = require('../../utils/auth');

Page({
  data: {
    safeBottom: 0,
    navHeight: 96,
    profile: {
      nickname: 'Developer',
      accountId: 'ID: 8888-9999'
    },
    groups: [
      {
        key: 'basic',
        items: [
          { key: 'info', label: '个人资料' },
          { key: 'message', label: '我的消息' },
          { key: 'security', label: '安全中心' }
        ]
      },
      {
        key: 'system',
        items: [
          { key: 'about', label: '关于系统', value: 'v1.0.0' },
          { key: 'logout', label: '退出登录', danger: true }
        ]
      }
    ],
    tabActive: 'profile'
  },

  onLoad() {
    this.initLayout();
  },

  initLayout() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const menuRect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    const statusBarHeight = sys.statusBarHeight || 20;

    let navHeight = statusBarHeight + 44;
    if (menuRect && menuRect.top) {
      navHeight = menuRect.bottom + menuRect.top - statusBarHeight;
    }

    let safeBottom = 0;
    if (sys.safeArea && sys.windowHeight) {
      safeBottom = Math.max(0, sys.windowHeight - sys.safeArea.bottom);
    }

    this.setData({
      navHeight,
      safeBottom
    });
  },

  onItemTap(event) {
    const item = event.currentTarget.dataset.item;
    if (!item) {
      return;
    }

    if (item.key === 'logout') {
      clearToken();
      clearUser();
      wx.showToast({
        title: '已退出登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/index'
        });
      }, 300);
      return;
    }

    wx.showToast({
      title: `${item.label} 暂不跳转`,
      icon: 'none'
    });
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key;
    if (key === this.data.tabActive) {
      return;
    }

    if (key === 'home') {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.redirectTo({
          url: '/pages/home/index'
        });
      }
    }
  }
});