const { getBaseUrl } = require('../config/env');
const { getToken, clearToken, clearUser } = require('./auth');

let redirecting = false;

function jumpToLogin() {
  if (redirecting) {
    return;
  }
  redirecting = true;
  // 登录态失效时清理本地缓存，避免脏 token 反复触发 401。
  clearToken();
  clearUser();

  const pages = getCurrentPages();
  const currentPage = pages.length > 0 ? pages[pages.length - 1] : null;
  const route = currentPage ? currentPage.route : '';

  if (route === 'pages/login/index') {
    redirecting = false;
    return;
  }

  wx.reLaunch({
    url: '/pages/login/index',
    complete: () => {
      redirecting = false;
    },
  });
}

function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    auth = true,
  } = options;

  const baseUrl = getBaseUrl();
  const requestHeader = {
    'Content-Type': 'application/json',
    ...header,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      requestHeader.Authorization = token;
    }
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: requestHeader,
      success: (response) => {
        const { statusCode } = response;
        const body = response.data || {};

        // 统一拦截未登录状态，强制跳转登录页。
        if (statusCode === 401 || body.code === 401) {
          jumpToLogin();
          reject(new Error('未登录或登录已过期'));
          return;
        }

        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(body.message || `请求失败: ${statusCode}`));
          return;
        }

        if (typeof body.code === 'number') {
          if (body.code === 200) {
            resolve(body);
            return;
          }
          reject(new Error(body.message || '业务处理失败'));
          return;
        }

        resolve(body);
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

module.exports = request;
