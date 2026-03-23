const request = require('../utils/request');

function miniLogin(payload) {
  return request({
    url: '/app/auth/login',
    method: 'POST',
    data: payload,
    auth: false,
  });
}

function fetchCurrentUser() {
  return request({
    url: '/app/auth/me',
    method: 'GET',
  });
}

module.exports = {
  miniLogin,
  fetchCurrentUser,
};
