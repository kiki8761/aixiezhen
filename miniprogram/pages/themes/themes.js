const themesData = require('../../data/themes.js');
const { hexToRgba } = require('../../utils/color.js');

const app = getApp();

// 预先把每个主题的渐变背景算好，避免 wxml 里调用函数
const ALL_THEMES = themesData.themes.map((t) => ({
  id: t.id,
  name: t.name,
  tagline: t.tagline,
  color: t.color,
  variantCount: t.variants.length,
  bg: `linear-gradient(160deg, ${hexToRgba(t.color, 0.42)} 0%, ${hexToRgba(t.color, 0.16)} 100%)`,
}));

Page({
  data: {
    list: ALL_THEMES,
    query: '',
    theme: 'light',
    empty: false,
  },

  onLoad() {
    this.setData({
      query: app.globalData.themeQuery || '',
      theme: app.globalData.theme || 'light',
    });
    this.applyFilter(app.globalData.themeQuery || '');
  },

  onThemeChange(theme) {
    this.setData({ theme });
  },

  onQueryInput(e) {
    const q = e.detail.value || '';
    app.globalData.themeQuery = q;
    this.setData({ query: q });
    this.applyFilter(q);
  },

  onClearQuery() {
    app.globalData.themeQuery = '';
    this.setData({ query: '' });
    this.applyFilter('');
  },

  applyFilter(q) {
    const trimmed = (q || '').trim();
    if (!trimmed) {
      this.setData({ list: ALL_THEMES, empty: false });
      return;
    }
    const next = ALL_THEMES.filter(
      (t) => t.name.indexOf(trimmed) >= 0 || (t.tagline && t.tagline.indexOf(trimmed) >= 0)
    );
    this.setData({ list: next, empty: next.length === 0 });
  },

  onTapTheme(e) {
    const themeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/variants/variants?themeId=${themeId}`,
    });
  },
});
