const themesData = require('../../data/themes.js');

const app = getApp();

Page({
  data: {
    themeCount: themesData.themes.length,
    variantCount: themesData.themes.reduce((acc, t) => acc + t.variants.length, 0),
    statusBarHeight: 0,
    theme: 'light',
  },

  onLoad() {
    // 用新 API getWindowInfo 取状态栏高度（旧的 getSystemInfoSync 已弃用）
    let statusBarHeight = 0;
    try {
      const winInfo = wx.getWindowInfo ? wx.getWindowInfo() : null;
      statusBarHeight = (winInfo && winInfo.statusBarHeight) || 0;
    } catch (e) {
      statusBarHeight = 0;
    }
    this.setData({
      statusBarHeight,
      theme: app.globalData.theme || 'light',
    });
  },

  onThemeChange(theme) {
    this.setData({ theme });
  },

  onShow() {
    // 每次显示时同步全局主题状态（被 v2 自由模式回首页时也覆盖）
    if (this.data.theme !== app.globalData.theme) {
      this.setData({ theme: app.globalData.theme });
    }
  },

  onTapTemplate() {
    wx.navigateTo({
      url: '/pages/themes/themes',
    });
  },

  onTapFree() {
    wx.navigateTo({
      url: '/pages/free/free',
    });
  },
});
