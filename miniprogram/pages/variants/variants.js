const themesData = require('../../data/themes.js');

const app = getApp();

Page({
  data: {
    theme: 'light',
    themeName: '',
    tagline: '',
    variants: [],
  },

  onLoad(options) {
    const themeId = options.themeId;
    const t = themesData.themes.find((x) => x.id === themeId);
    if (!t) {
      wx.showToast({ title: '主题不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    // 设置导航栏标题为主题名
    wx.setNavigationBarTitle({ title: t.name });

    this.setData({
      theme: app.globalData.theme || 'light',
      themeName: t.name,
      tagline: t.tagline,
      // 给每条变体加序号字符串，避免 wxml 里算
      variants: t.variants.map((v, idx) => ({
        ...v,
        idx: String(idx + 1).padStart(2, '0'),
        themeId: t.id,
      })),
    });
  },

  onThemeChange(theme) {
    this.setData({ theme });
  },

  onTapVariant(e) {
    const variantId = e.currentTarget.dataset.id;
    const themeId = e.currentTarget.dataset.themeId;
    wx.navigateTo({
      url: `/pages/result/result?themeId=${themeId}&variantId=${variantId}`,
    });
  },
});
