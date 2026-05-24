const { miniLogin } = require('../../api/auth');
const { APP_CONFIG } = require('../../config/app');
const {
  getBaseUrl,
  getBaseUrlOverride,
  getRuntimeEnv,
  setBaseUrlOverride,
  clearBaseUrlOverride,
} = require('../../config/env');
const { setSession, isLogin } = require('../../utils/auth');
const { DEV_OPEN_ID_KEY, getItem, setItem } = require('../../utils/storage');

Page({
  data: {
    appName: APP_CONFIG.appName,
    loading: false,
    autoLoginTried: false,
    autoLoginFailed: false,
    autoLoginMessage: '',
    devOpenId: '',
    runtimeEnv: 'dev',
    apiBaseUrl: '',
    apiBaseUrlInput: '',
  },

  onLoad() {
    this.refreshRuntime();
  },

  onShow() {
    if (isLogin()) {
      wx.reLaunch({ url: '/pages/home/index' });
      return;
    }

    if (!this.data.autoLoginTried && this.canAutoLogin()) {
      this.autoLogin();
    }
  },

  refreshRuntime() {
    const runtimeEnv = getRuntimeEnv();
    let devOpenId = getItem(DEV_OPEN_ID_KEY) || '';
    if (runtimeEnv === 'dev' && !devOpenId) {
      devOpenId = APP_CONFIG.defaultDevOpenId;
      setItem(DEV_OPEN_ID_KEY, devOpenId);
    }

    const apiBaseUrl = getBaseUrl();
    this.setData({
      runtimeEnv,
      devOpenId,
      apiBaseUrl,
      apiBaseUrlInput: getBaseUrlOverride() || apiBaseUrl,
    });
  },

  canAutoLogin() {
    return this.shouldUseDevOpenId();
  },

  onDevOpenIdInput(event) {
    const value = event.detail.value;
    this.setData({ devOpenId: value });
    setItem(DEV_OPEN_ID_KEY, value);
  },

  onApiBaseUrlInput(event) {
    this.setData({
      apiBaseUrlInput: event.detail.value,
    });
  },

  saveApiBaseUrl() {
    if (this.data.runtimeEnv === 'release') {
      return;
    }

    const value = this.data.apiBaseUrlInput.trim();
    if (!value) {
      wx.showToast({
        title: '请输入接口地址',
        icon: 'none',
      });
      return;
    }

    const normalized = setBaseUrlOverride(value);
    this.setData({
      apiBaseUrl: normalized,
      apiBaseUrlInput: normalized,
      autoLoginTried: false,
      autoLoginFailed: false,
      autoLoginMessage: '',
    });
    wx.showToast({
      title: '接口地址已保存',
      icon: 'none',
    });
  },

  clearApiBaseUrl() {
    if (this.data.runtimeEnv === 'release') {
      return;
    }

    clearBaseUrlOverride();
    this.refreshRuntime();
    this.setData({
      autoLoginTried: false,
      autoLoginFailed: false,
      autoLoginMessage: '',
    });
    wx.showToast({
      title: '已恢复默认接口地址',
      icon: 'none',
    });
  },

  async autoLogin() {
    await this.doLogin({ silent: true, source: 'auto' });
  },

  async handleLogin() {
    await this.doLogin({ silent: false, source: 'manual' });
  },

  retryAutoLogin() {
    this.setData({
      autoLoginTried: false,
      autoLoginFailed: false,
      autoLoginMessage: '',
    });

    if (this.canAutoLogin()) {
      this.autoLogin();
      return;
    }

    wx.showToast({
      title: '请先填写开发 openId',
      icon: 'none',
    });
  },

  async doLogin({ silent, source }) {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });
    try {
      const code = await this.getWxLoginCode();
      const profile = silent ? {} : await this.tryGetUserProfile();
      const payload = {
        code,
        nickName: profile.nickName || APP_CONFIG.defaultUserName,
        avatarUrl: profile.avatarUrl || '',
      };

      if (this.shouldUseDevOpenId()) {
        payload.devOpenId = this.data.devOpenId.trim();
      }

      const result = await miniLogin(payload);
      const loginData = result.data || {};
      if (!loginData.token) {
        throw new Error('后端未返回 token');
      }

      const fullToken = `${loginData.tokenType || 'Bearer'} ${loginData.token}`;
      setSession({
        token: fullToken,
        user: loginData.user || null,
      });

      const app = getApp();
      if (app && typeof app.syncSession === 'function') {
        app.syncSession(loginData.user || null);
      }

      wx.reLaunch({ url: '/pages/home/index' });
    } catch (error) {
      const message = error.message || '登录失败';
      if (source === 'auto') {
        this.setData({
          autoLoginFailed: true,
          autoLoginMessage: message,
        });
      } else {
        wx.showToast({
          title: message,
          icon: 'none',
        });
      }
    } finally {
      this.setData({
        loading: false,
        autoLoginTried: true,
      });
    }
  },

  shouldUseDevOpenId() {
    return this.data.runtimeEnv !== 'release' && Boolean(this.data.devOpenId && this.data.devOpenId.trim());
  },

  getWxLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code);
            return;
          }
          reject(new Error('获取微信登录凭证失败'));
        },
        fail: () => {
          reject(new Error('调用 wx.login 失败'));
        },
      });
    });
  },

  tryGetUserProfile() {
    return new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于完善用户昵称和头像',
        success: (res) => {
          resolve(res.userInfo || {});
        },
        fail: () => {
          resolve({});
        },
      });
    });
  },
});
