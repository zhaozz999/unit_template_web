function getLayoutInfo() {
  const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
  const menuRect = wx.getMenuButtonBoundingClientRect
    ? wx.getMenuButtonBoundingClientRect()
    : null;
  const statusBarHeight = sys.statusBarHeight || 20;

  let navHeight = statusBarHeight + 44;
  if (menuRect && menuRect.top) {
    navHeight = menuRect.bottom + menuRect.top - statusBarHeight;
  }

  let safeBottom = 0;
  if (sys.safeArea && sys.windowHeight) {
    safeBottom = Math.max(0, sys.windowHeight - sys.safeArea.bottom);
  }

  return {
    navHeight,
    safeBottom,
    statusBarHeight,
  };
}

function applyLayout(page, extraData = {}) {
  if (!page || typeof page.setData !== 'function') {
    return;
  }

  page.setData({
    ...getLayoutInfo(),
    ...extraData,
  });
}

module.exports = {
  getLayoutInfo,
  applyLayout,
};
