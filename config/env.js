const { API_BASE_URL_KEY, getItem, removeItem, setItem } = require('../utils/storage');

const API_CONFIG = {
  dev: 'http://127.0.0.1:8086',
  trial: 'http://127.0.0.1:8086',
  release: 'https://your-production-api.example.com',
};

const ENV_VERSION_MAP = {
  develop: 'dev',
  trial: 'trial',
  release: 'release',
};

function normalizeUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function getRuntimeEnv() {
  try {
    const info = wx.getAccountInfoSync();
    return ENV_VERSION_MAP[info.miniProgram.envVersion] || 'dev';
  } catch (error) {
    return 'dev';
  }
}

function getBaseUrlOverride() {
  return normalizeUrl(getItem(API_BASE_URL_KEY) || '');
}

function setBaseUrlOverride(url) {
  const normalized = normalizeUrl(url);
  if (normalized) {
    setItem(API_BASE_URL_KEY, normalized);
  }
  return normalized;
}

function clearBaseUrlOverride() {
  removeItem(API_BASE_URL_KEY);
}

function getBaseUrl() {
  const override = getBaseUrlOverride();
  if (override) {
    return override;
  }

  const env = getRuntimeEnv();
  return normalizeUrl(API_CONFIG[env] || API_CONFIG.dev);
}

module.exports = {
  API_CONFIG,
  getRuntimeEnv,
  getBaseUrl,
  getBaseUrlOverride,
  setBaseUrlOverride,
  clearBaseUrlOverride,
};
