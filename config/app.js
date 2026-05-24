const APP_CONFIG = Object.freeze({
  appName: 'Miniapp Starter',
  storagePrefix: 'unit_template',
  demoModuleName: 'User CRUD Demo',
  defaultDevOpenId: 'dev_user_001',
  defaultUserName: 'MiniAppUser',
});

function buildStorageKey(key) {
  return `${APP_CONFIG.storagePrefix}_${key}`;
}

module.exports = {
  APP_CONFIG,
  buildStorageKey,
};
