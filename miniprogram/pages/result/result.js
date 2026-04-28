const themesData = require('../../data/themes.js');

const app = getApp();

Page({
  data: {
    theme: 'light',
    breadcrumb: '',
    prompt: '',
    promptCount: 0,
    themeId: '',
  },

  onLoad(options) {
    const { themeId, variantId } = options;
    const t = themesData.themes.find((x) => x.id === themeId);
    const v = t && t.variants.find((x) => x.id === variantId);
    if (!t || !v) {
      wx.showToast({ title: '提示词不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    this.setData({
      theme: app.globalData.theme || 'light',
      breadcrumb: `${t.name} · ${v.poseLabel}`,
      prompt: v.prompt,
      promptCount: v.prompt.length,
      themeId: t.id,
    });
  },

  onThemeChange(theme) {
    this.setData({ theme });
  },

  onCopy() {
    wx.setClipboardData({
      data: this.data.prompt,
      success: () => {
        // wx.setClipboardData 自带"已复制"toast，但样式不可控，关掉用自定义
        wx.hideToast();
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1600,
        });
      },
      fail: () => {
        wx.showToast({ title: '复制失败，请长按文本', icon: 'none' });
      },
    });
  },

  onChangeOne() {
    // 回到当前主题的变体列表
    wx.navigateBack();
  },

  onRestart() {
    // 回首页（清栈）
    wx.reLaunch({ url: '/pages/home/home' });
  },
});
