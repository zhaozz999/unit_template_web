const request = require('../utils/request');

function listUsers(nickName) {
  return request({
    url: '/app/users',
    method: 'GET',
    data: nickName ? { nickName } : {},
  });
}

function getUserDetail(userId) {
  return request({
    url: `/app/users/${userId}`,
    method: 'GET',
  });
}

function createUser(payload) {
  return request({
    url: '/app/users',
    method: 'POST',
    data: payload,
  });
}

function updateUser(userId, payload) {
  return request({
    url: `/app/users/${userId}`,
    method: 'PUT',
    data: payload,
  });
}

function deleteUser(userId) {
  return request({
    url: `/app/users/${userId}`,
    method: 'DELETE',
  });
}

module.exports = {
  listUsers,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
};
