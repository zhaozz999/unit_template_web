Page({
  data: {
    dateLabel: '',
    safeBottom: 0,
    navHeight: 96,
    hero: {
      tag: '今日推荐',
      titleLine1: 'Less is More.',
      titleLine2: '极致简约。',
      subtitle: '这是一个通用的 Java 后端驱动的小程序脚手架模板。'
    },
    featureList: [
      {
        key: 'console',
        iconColor: '#1677D9',
        title: '控制台'
      },
      {
        key: 'report',
        iconColor: '#34C759',
        title: '统计报表'
      }
    ],
    tabActive: 'home'
  },

  onLoad() {
    this.initLayout();
    this.setData({
      dateLabel: this.formatDateLabel(new Date())
    });
  },

  initLayout() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const menuRect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    const statusBarHeight = sys.statusBarHeight || 20;

    let navHeight = statusBarHeight + 44;
    if (menuRect && menuRect.top) {
      navHeight = menuRect.bottom + menuRect.top - statusBarHeight;
    }

    let safeBottom = 0;
    if (sys.safeArea && sys.windowHeight) {
      safeBottom = Math.max(0, sys.windowHeight - sys.safeArea.bottom);
    }

    this.setData({
      navHeight,
      safeBottom
    });
  },

  formatDateLabel(date) {
    const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = weekMap[date.getDay()];
    return `${month}月${day}日 ${week}`;
  },

  onHeroTap() {
    wx.showToast({
      title: '推荐内容展示中',
      icon: 'none'
    });
  },

  onFeatureTap(event) {
    const item = event.currentTarget.dataset.item;
    if (!item) {
      return;
    }

    wx.showToast({
      title: `${item.title} 即将开放`,
      icon: 'none'
    });
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key;
    if (key === this.data.tabActive) {
      return;
    }

    if (key === 'profile') {
      wx.navigateTo({
        url: '/pages/profile/index',
        animationType: 'fade-in',
        animationDuration: 120
      });
    }
  }
});