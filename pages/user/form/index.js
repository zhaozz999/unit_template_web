const { createUser, updateUser, getUserDetail } = require('../../../api/user');
const { isLogin } = require('../../../utils/auth');

Page({
  data: {
    mode: 'create',
    userId: '',
    loading: false,
    form: {
      openId: '',
      nickName: '',
      avatarUrl: '',
      status: '0',
      remark: '',
    },
  },

  onLoad(options) {
    if (!isLogin()) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }

    const userId = options.userId || '';
    if (userId) {
      this.setData({ mode: 'edit', userId });
      this.loadDetail(userId);
    }
  },

  async loadDetail(userId) {
    this.setData({ loading: true });
    try {
      const result = await getUserDetail(userId);
      const data = result.data || {};
      this.setData({
        form: {
          openId: data.openId || '',
          nickName: data.nickName || '',
          avatarUrl: data.avatarUrl || '',
          status: data.status || '0',
          remark: data.remark || '',
        },
      });
    } catch (error) {
      wx.showToast({ title: error.message || '加载详情失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: event.detail.value,
    });
  },

  async onSubmit() {
    if (this.data.loading) {
      return;
    }

    const form = this.data.form;
    if (this.data.mode === 'create' && !form.openId.trim()) {
      wx.showToast({ title: 'openId 不能为空', icon: 'none' });
      return;
    }
    if (!form.nickName.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    try {
      if (this.data.mode === 'create') {
        await createUser({
          openId: form.openId.trim(),
          nickName: form.nickName.trim(),
          avatarUrl: form.avatarUrl.trim(),
          status: form.status || '0',
          remark: form.remark.trim(),
        });
      } else {
        await updateUser(this.data.userId, {
          nickName: form.nickName.trim(),
          avatarUrl: form.avatarUrl.trim(),
          status: form.status || '0',
          remark: form.remark.trim(),
        });
      }

      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack();
          return;
        }
        wx.reLaunch({ url: '/pages/user/list/index' });
      }, 500);
    } catch (error) {
      wx.showToast({ title: error.message || '保存失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
