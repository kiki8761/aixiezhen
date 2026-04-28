// 全局应用入口
App({
  onLaunch() {
    // 初始读取系统主题
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.theme = systemInfo.theme || 'light';

    // 监听主题变化（系统切换深色模式时实时响应）
    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.globalData.theme = theme;
        // 通知所有页面刷新主题
        const pages = getCurrentPages();
        pages.forEach((page) => {
          if (page && typeof page.onThemeChange === 'function') {
            page.onThemeChange(theme);
          }
        });
      });
    }
  },

  globalData: {
    theme: 'light',
    // 模板模式搜索词跨页保留
    themeQuery: '',
  },
});
