const { APP_CONFIG } = require('./config/app');
const { getToken, getUser } = require('./utils/auth');

App({
  globalData: {
    appName: APP_CONFIG.appName,
    userInfo: null,
    hasLogin: false,
  },

  onLaunch() {
    this.globalData.userInfo = getUser() || null;
    this.globalData.hasLogin = Boolean(getToken());
  },

  syncSession(user) {
    this.globalData.userInfo = user || null;
    this.globalData.hasLogin = Boolean(getToken());
  },
});
