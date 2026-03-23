const { miniLogin } = require('../../api/auth');
const { setToken, setUser, isLogin } = require('../../utils/auth');
const { getRuntimeEnv } = require('../../config/env');

const DEV_OPEN_ID_KEY = 'template_dev_open_id';
const DEFAULT_DEV_OPEN_ID = 'dev_user_001';

Page({
  data: {
    loading: false,
    autoLoginTried: false,
    autoLoginFailed: false,
    autoLoginMessage: '',
    devOpenId: '',
    runtimeEnv: 'dev',
  },

  onLoad() {
    const runtimeEnv = getRuntimeEnv();
    let devOpenId = wx.getStorageSync(DEV_OPEN_ID_KEY) || '';

    // 开发环境默认提供一个 devOpenId，便于本地无感调试。
    if (runtimeEnv === 'dev' && !devOpenId) {
      devOpenId = DEFAULT_DEV_OPEN_ID;
      wx.setStorageSync(DEV_OPEN_ID_KEY, devOpenId);
    }

    this.setData({
      runtimeEnv,
      devOpenId,
    });
  },

  onShow() {
    if (isLogin()) {
      wx.reLaunch({ url: '/pages/user/list/index' });
      return;
    }

    if (!this.data.autoLoginTried) {
      this.autoLogin();
    }
  },

  onDevOpenIdInput(event) {
    const value = event.detail.value;
    this.setData({ devOpenId: value });
    wx.setStorageSync(DEV_OPEN_ID_KEY, value);
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
    this.autoLogin();
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
        nickName: profile.nickName || 'MiniAppUser',
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
      setToken(fullToken);
      if (loginData.user) {
        setUser(loginData.user);
      }

      wx.reLaunch({ url: '/pages/user/list/index' });
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
    return this.data.runtimeEnv !== 'prod' && Boolean(this.data.devOpenId && this.data.devOpenId.trim());
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
