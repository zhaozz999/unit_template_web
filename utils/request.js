const { getBaseUrl } = require('../config/env');
const { getToken, clearSession } = require('./auth');
const { redirectToLogin } = require('./guard');

function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    auth = true,
    timeout = 15000,
  } = options;

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
      url: `${getBaseUrl()}${url}`,
      method,
      data,
      header: requestHeader,
      timeout,
      success: (response) => {
        const { statusCode } = response;
        const body = response.data || {};

        if (statusCode === 401 || body.code === 401) {
          clearSession();
          redirectToLogin();
          reject(new Error('登录状态已失效'));
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
        reject(new Error(error.errMsg || '网络请求失败'));
      },
    });
  });
}

module.exports = request;
