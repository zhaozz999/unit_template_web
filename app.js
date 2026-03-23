const { getToken } = require('./utils/auth');

App({
  globalData: {
    userInfo: null,
  },

  onLaunch() {
    const token = getToken();
    if (token) {
      this.globalData.hasLogin = true;
    }
  },
});
