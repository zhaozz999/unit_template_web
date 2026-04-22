const API_CONFIG = {
  dev: 'http://127.0.0.1:8086',
  prod: 'https://your-production-api.example.com',
};

const CUSTOM_BASE_URL_KEY = 'custom_base_url';

function getRuntimeEnv() {
  try {
    const info = wx.getAccountInfoSync();
    const envVersion = info.miniProgram.envVersion;
    return envVersion === 'release' ? 'prod' : 'dev';
  } catch (error) {
    return 'dev';
  }
}

function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value.trim().replace(/\/+$/, '');
}

function getCustomBaseUrl() {
  try {
    const value = wx.getStorageSync(CUSTOM_BASE_URL_KEY);
    return normalizeBaseUrl(value);
  } catch (error) {
    return '';
  }
}

function setCustomBaseUrl(value) {
  const normalized = normalizeBaseUrl(value);
  wx.setStorageSync(CUSTOM_BASE_URL_KEY, normalized);
}

function clearCustomBaseUrl() {
  wx.removeStorageSync(CUSTOM_BASE_URL_KEY);
}

function getBaseUrl() {
  const customBaseUrl = getCustomBaseUrl();
  if (customBaseUrl) {
    return customBaseUrl;
  }
  const env = getRuntimeEnv();
  return normalizeBaseUrl(API_CONFIG[env] || API_CONFIG.dev);
}

module.exports = {
  API_CONFIG,
  CUSTOM_BASE_URL_KEY,
  getRuntimeEnv,
  getCustomBaseUrl,
  setCustomBaseUrl,
  clearCustomBaseUrl,
  getBaseUrl,
};

