const themesData = require('../../data/themes.js');

const app = getApp();

Page({
  data: {
    theme: 'light',
    breadcrumb: '',
    prompt: '',
    promptCount: 0,
    from: 'template', // 'template' | 'free'
  },

  onLoad(options) {
    const from = options.from || 'template';

    if (from === 'free') {
      // 自由模式：从 globalData 读临时结果
      const pending = app.globalData.pendingResult;
      if (!pending || !pending.prompt) {
        wx.showToast({ title: '提示词丢失，请重新生成', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 800);
        return;
      }
      this.setData({
        theme: app.globalData.theme || 'light',
        breadcrumb: pending.breadcrumb || '自由组合',
        prompt: pending.prompt,
        promptCount: pending.prompt.length,
        from: 'free',
      });
      // 消费完即清，避免下次误读
      app.globalData.pendingResult = null;
      return;
    }

    // 模板模式：从 themeId + variantId 查
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
      from: 'template',
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
    // 回上一级：模板回变体列表，自由回自由模式（selection 还在 globalData 里）
    wx.navigateBack();
  },

  onRestart() {
    // 重新开始：自由模式额外清空 selection
    if (this.data.from === 'free') {
      app.globalData.freeSelection = {};
    }
    wx.reLaunch({ url: '/pages/home/home' });
  },
});
