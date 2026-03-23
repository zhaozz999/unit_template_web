const TOKEN_KEY = 'template_token';
const USER_KEY = 'template_user';

function setItem(key, value) {
  wx.setStorageSync(key, value);
}

function getItem(key) {
  return wx.getStorageSync(key);
}

function removeItem(key) {
  wx.removeStorageSync(key);
}

function clearAll() {
  wx.clearStorageSync();
}

module.exports = {
  TOKEN_KEY,
  USER_KEY,
  setItem,
  getItem,
  removeItem,
  clearAll,
};
