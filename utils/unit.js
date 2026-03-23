function rpxToPx(rpx) {
  const info = wx.getWindowInfo();
  return (Number(rpx) * info.windowWidth) / 750;
}

function pxToRpx(px) {
  const info = wx.getWindowInfo();
  return (Number(px) * 750) / info.windowWidth;
}

function fenToYuan(fen) {
  return (Number(fen) / 100).toFixed(2);
}

function yuanToFen(yuan) {
  return Math.round(Number(yuan) * 100);
}

module.exports = {
  rpxToPx,
  pxToRpx,
  fenToYuan,
  yuanToFen,
};
