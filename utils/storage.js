const { buildStorageKey } = require('../config/app');

const TOKEN_KEY = buildStorageKey('token');
const USER_KEY = buildStorageKey('user');
const API_BASE_URL_KEY = buildStorageKey('api_base_url');
const DEV_OPEN_ID_KEY = buildStorageKey('dev_open_id');

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
  API_BASE_URL_KEY,
  DEV_OPEN_ID_KEY,
  setItem,
  getItem,
  removeItem,
  clearAll,
};
