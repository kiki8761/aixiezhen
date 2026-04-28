const {
  FREE_DIMENSIONS,
  totalSelected,
  buildFreePrompt,
} = require('../../data/freeMode.js');

const app = getApp();

// 把 dimensions 转为可渲染结构（chip 带 selected 标记）
function buildRenderList(selection) {
  return FREE_DIMENSIONS.map((dim) => {
    const sel = (selection && selection[dim.id]) || [];
    return {
      id: dim.id,
      name: dim.name,
      total: dim.keywords.length,
      selectedCount: sel.length,
      chips: dim.keywords.map((kw) => ({
        kw,
        on: sel[0] === kw,
      })),
    };
  });
}

Page({
  data: {
    theme: 'light',
    list: [],
    total: 0,
    enough: false,
  },

  onLoad() {
    const selection = app.globalData.freeSelection || {};
    const total = totalSelected(selection);
    this.setData({
      theme: app.globalData.theme || 'light',
      list: buildRenderList(selection),
      total,
      enough: total >= 3,
    });
  },

  onThemeChange(theme) {
    this.setData({ theme });
  },

  // 单选：点已选 → 取消；点其他 → 替换
  onTapChip(e) {
    const { dimId, kw } = e.currentTarget.dataset;
    const prev = app.globalData.freeSelection || {};
    const current = prev[dimId] || [];
    const next = current[0] === kw ? [] : [kw];
    const selection = { ...prev, [dimId]: next };
    app.globalData.freeSelection = selection;

    const total = totalSelected(selection);
    this.setData({
      list: buildRenderList(selection),
      total,
      enough: total >= 3,
    });
  },

  onClear() {
    app.globalData.freeSelection = {};
    this.setData({
      list: buildRenderList({}),
      total: 0,
      enough: false,
    });
  },

  onGenerate() {
    if (!this.data.enough) return;
    const selection = app.globalData.freeSelection || {};
    const prompt = buildFreePrompt(selection);
    // 通过 globalData 传给 result，避免 URL 长度限制
    app.globalData.pendingResult = {
      prompt,
      breadcrumb: '自由组合',
      from: 'free',
    };
    wx.navigateTo({
      url: '/pages/result/result?from=free',
    });
  },
});
