const { clearSession, isLogin } = require('./auth');

let redirecting = false;

function getCurrentRoute() {
  const pages = getCurrentPages();
  const currentPage = pages.length > 0 ? pages[pages.length - 1] : null;
  return currentPage ? currentPage.route : '';
}

function redirectToLogin() {
  if (redirecting || getCurrentRoute() === 'pages/login/index') {
    return false;
  }

  redirecting = true;
  wx.reLaunch({
    url: '/pages/login/index',
    complete: () => {
      redirecting = false;
    },
  });
  return true;
}

function ensureLogin(options = {}) {
  const { redirect = true } = options;
  if (isLogin()) {
    return true;
  }

  if (redirect) {
    redirectToLogin();
  }
  return false;
}

function logout(options = {}) {
  const {
    title = '已退出登录',
    showToast = true,
    redirect = true,
  } = options;

  clearSession();
  if (showToast) {
    wx.showToast({
      title,
      icon: 'none',
    });
  }

  if (redirect) {
    setTimeout(() => {
      redirectToLogin();
    }, showToast ? 300 : 0);
  }
}

module.exports = {
  redirectToLogin,
  ensureLogin,
  logout,
};
