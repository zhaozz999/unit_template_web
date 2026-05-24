const { fetchCurrentUser } = require('../../api/auth');
const { APP_CONFIG } = require('../../config/app');
const { getBaseUrl, getBaseUrlOverride, getRuntimeEnv } = require('../../config/env');
const { getUser, isLogin, setUser } = require('../../utils/auth');
const { ensureLogin, logout, redirectToLogin } = require('../../utils/guard');
const { applyLayout } = require('../../utils/layout');

Page({
  data: {
    appName: APP_CONFIG.appName,
    navHeight: 96,
    safeBottom: 0,
    runtimeEnv: 'dev',
    apiBaseUrl: '',
    usingCustomApi: false,
    sessionLabel: 'Not logged in',
    user: null,
    avatarText: 'T',
  },

  onLoad() {
    applyLayout(this);
  },

  onShow() {
    this.refreshProfile();
  },

  async refreshProfile() {
    const loggedIn = isLogin();
    const localUser = getUser() || null;

    this.setData({
      runtimeEnv: getRuntimeEnv(),
      apiBaseUrl: getBaseUrl(),
      usingCustomApi: Boolean(getBaseUrlOverride()),
      sessionLabel: loggedIn ? 'Active session' : 'Not logged in',
      user: localUser,
      avatarText: this.getAvatarText(localUser),
    });

    if (!loggedIn) {
      return;
    }

    try {
      const result = await fetchCurrentUser();
      const currentUser = result.data ? result.data.user : null;
      if (currentUser) {
        setUser(currentUser);
        const app = getApp();
        if (app && typeof app.syncSession === 'function') {
          app.syncSession(currentUser);
        }
        this.setData({
          user: currentUser,
          avatarText: this.getAvatarText(currentUser),
        });
      }
    } catch (error) {
      this.setData({
        sessionLabel: error.message || 'Profile refresh failed',
      });
    }
  },

  getAvatarText(user) {
    const name = user && (user.nickName || user.openId);
    if (!name) {
      return 'T';
    }
    return String(name).charAt(0).toUpperCase();
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
    if (isLogin()) {
      wx.showToast({
        title: '当前已登录',
        icon: 'none',
      });
      return;
    }

    redirectToLogin();
  },

  onLogout() {
    logout();
  },
});
