const API_CONFIG = {
  dev: 'http://127.0.0.1:8086',
  prod: 'https://your-production-api.example.com',
};

function getRuntimeEnv() {
  try {
    const info = wx.getAccountInfoSync();
    const envVersion = info.miniProgram.envVersion;
    return envVersion === 'release' ? 'prod' : 'dev';
  } catch (error) {
    return 'dev';
  }
}

function getBaseUrl() {
  const env = getRuntimeEnv();
  return API_CONFIG[env] || API_CONFIG.dev;
}

module.exports = {
  API_CONFIG,
  getRuntimeEnv,
  getBaseUrl,
};

