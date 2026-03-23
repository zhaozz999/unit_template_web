const { listUsers, deleteUser } = require('../../../api/user');
const { clearToken, clearUser, isLogin } = require('../../../utils/auth');
const { formatDateTime } = require('../../../utils/date');

Page({
  data: {
    loading: false,
    keyword: '',
    users: [],
  },

  onShow() {
    if (!isLogin()) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }
    this.loadUsers();
  },

  onKeywordInput(event) {
    this.setData({ keyword: event.detail.value });
  },

  onSearch() {
    this.loadUsers();
  },

  async loadUsers() {
    this.setData({ loading: true });
    try {
      const result = await listUsers(this.data.keyword.trim());
      const users = (result.data || []).map((item) => ({
        ...item,
        lastLoginTimeText: formatDateTime(item.lastLoginTime),
      }));
      this.setData({ users });
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/user/form/index' });
  },

  goEdit(event) {
    const userId = event.currentTarget.dataset.userId;
    wx.navigateTo({ url: `/pages/user/form/index?userId=${userId}` });
  },

  async onDelete(event) {
    const userId = event.currentTarget.dataset.userId;
    const confirmed = await this.confirm('确认删除该用户吗？');
    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(userId);
      wx.showToast({ title: '删除成功', icon: 'success' });
      this.loadUsers();
    } catch (error) {
      wx.showToast({ title: error.message || '删除失败', icon: 'none' });
    }
  },

  logout() {
    clearToken();
    clearUser();
    wx.reLaunch({ url: '/pages/login/index' });
  },

  confirm(content) {
    return new Promise((resolve) => {
      wx.showModal({
        title: '提示',
        content,
        success: (res) => {
          resolve(Boolean(res.confirm));
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  },
});

