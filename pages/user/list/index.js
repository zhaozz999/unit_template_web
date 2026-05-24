const { listUsers, deleteUser } = require('../../../api/user');
const { APP_CONFIG } = require('../../../config/app');
const { formatDateTime } = require('../../../utils/date');
const { ensureLogin, logout } = require('../../../utils/guard');

Page({
  data: {
    pageTitle: APP_CONFIG.demoModuleName,
    loading: false,
    keyword: '',
    users: [],
  },

  onShow() {
    if (!ensureLogin()) {
      return;
    }
    this.loadUsers();
  },

  onPullDownRefresh() {
    this.loadUsers({ stopPullDownRefresh: true });
  },

  onKeywordInput(event) {
    this.setData({ keyword: event.detail.value });
  },

  onSearch() {
    this.loadUsers();
  },

  async loadUsers(options = {}) {
    const { stopPullDownRefresh = false } = options;
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
      if (stopPullDownRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/user/form/index' });
  },

  goEdit(event) {
    const userId = event.currentTarget.dataset.userId;
    wx.navigateTo({ url: `/pages/user/form/index?userId=${userId}` });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/home/index' });
  },

  async onDelete(event) {
    const userId = event.currentTarget.dataset.userId;
    const confirmed = await this.confirm('确认删除这个示例用户吗？');
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
    logout({ showToast: false });
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
