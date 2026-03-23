const { TOKEN_KEY, USER_KEY, setItem, getItem, removeItem } = require('./storage');

function setToken(token) {
  setItem(TOKEN_KEY, token);
}

function getToken() {
  return getItem(TOKEN_KEY);
}

function clearToken() {
  removeItem(TOKEN_KEY);
}

function setUser(user) {
  setItem(USER_KEY, user);
}

function getUser() {
  return getItem(USER_KEY);
}

function clearUser() {
  removeItem(USER_KEY);
}

function isLogin() {
  return Boolean(getToken());
}

module.exports = {
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  clearUser,
  isLogin,
};
