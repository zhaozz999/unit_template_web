const { APP_CONFIG } = require('../../config/app');
const { getBaseUrl, getRuntimeEnv, clearBaseUrlOverride } = require('../../config/env');
const { getUser, isLogin } = require('../../utils/auth');
const { ensureLogin, redirectToLogin } = require('../../utils/guard');
const { applyLayout } = require('../../utils/layout');

Page({
  data: {
    appName: APP_CONFIG.appName,
    navHeight: 96,
    safeBottom: 0,
    dateLabel: '',
    runtimeEnv: 'dev',
    apiBaseUrl: '',
    isLoggedIn: false,
    currentUserName: '',
    featureList: [
      {
        key: 'auth',
        title: 'Login and session',
        desc: 'WeChat login, token persistence, 401 redirect, and user cache.',
      },
      {
        key: 'request',
        title: 'Request wrapper',
        desc: 'Unified request, environment switching, and local API override.',
      },
      {
        key: 'demo',
        title: 'Business demo',
        desc: 'A complete list-create-edit-delete loop to clone for new modules.',
      },
      {
        key: 'layout',
        title: 'Reusable layout',
        desc: 'Shared safe-area calculation and a reusable bottom navigation component.',
      },
    ],
  },

  onLoad() {
    applyLayout(this, {
      dateLabel: this.formatDateLabel(new Date()),
    });
    this.refreshView();
  },

  onShow() {
    this.refreshView();
  },

  refreshView() {
    const user = getUser() || {};
    this.setData({
      runtimeEnv: getRuntimeEnv(),
      apiBaseUrl: getBaseUrl(),
      isLoggedIn: isLogin(),
      currentUserName: user.nickName || user.openId || '',
    });
  },

  formatDateLabel(date) {
    const weekMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${weekMap[date.getDay()]}`;
  },

  goUserDemo() {
    if (!ensureLogin()) {
      return;
    }

    wx.navigateTo({
      url: '/pages/user/list/index',
    });
  },

  goLogin() {
    if (this.data.isLoggedIn) {
      wx.reLaunch({
        url: '/pages/profile/index',
      });
      return;
    }

    redirectToLogin();
  },

  resetApiBaseUrl() {
    clearBaseUrlOverride();
    this.refreshView();
    wx.showToast({
      title: '已恢复默认接口地址',
      icon: 'none',
    });
  },
});
