# 古风写真提示词 · 微信小程序版（v1）

跟 web 版同源（aixiezhen.tools.kikiaigc.com）的微信小程序版本。v1 只做模板模式（跑通流程、占审核坑），自由模式 v2 再加。

## 在微信开发者工具里跑起来

1. 打开 **微信开发者工具**（去官网下载：<https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html>）
2. 左侧选「小程序」→ 点「+」→「导入项目」
3. 目录选 `/Users/kiki/aixiezhen/miniprogram`
4. AppID 填 `wx6c5b1db9b407e796`（已经写在 `project.config.json` 里，导入时会自动识别）
5. 项目名随便填（比如 "古风写真提示词"）
6. 点「导入」就能看到首页

## 页面流程

```
home（首页）
  └→ themes（42 主题墙 + 搜索）
        └→ variants（变体列表）
              └→ result（提示词 + 复制）
```

返回逻辑用微信原生顶部"<"按钮（`wx.navigateBack`），返回栈跟系统一致。

## 跟 web 版的差异

| 项 | Web | 小程序（v1） | 原因 |
|---|---|---|---|
| 自由模式 | 有 | 无（v2 再加） | 先跑通审核流程 |
| "去哪出图"5 个外链按钮 | 5 个跳转 | 一段文字提示 | 个人主体小程序不能跳外链 |
| 玻璃浮卡 backdrop-filter | 有 | 用纯半透明 + 投影模拟 | 小程序不支持 backdrop-filter |
| hero 图 | 1.7MB PNG | 137KB JPG | 小程序包大小限制 |
| 主题切换 | 跟随系统 + 手动 | 跟随系统 | 简化 |

## 上线前你要做的

1. **微信小程序备案**（工信部，1-3 周）
2. **微信小程序审核**（提交版本，1-3 天）
   - 类目建议选「工具」→「效率」，**不要选 AI 类**
   - 名字写「古风写真提示词」，**避开"AI"字眼**
   - 简介可以写：「by kiki 的 AI 日常 · 选关键词，复制提示词去 AI 工具出图」（描述里有 AI 没事，但小程序名字别带）
3. **隐私协议**：小程序需要简单的隐私协议（即使不收集数据），微信开发者工具里有模板
4. **icon**：512×512 PNG，可以用 `/images/logo.png` 直接上传

## 后续 v2 路线

闺蜜反馈、模板模式跑通、审核过了之后再加：

- [ ] 自由模式（8 维度单选拼接）
- [ ] 复制后跳转引导（如果豆包小程序允许，加一个 "去豆包" 按钮）
- [ ] 收藏 / 历史记录（要存 wx.setStorage）

## 数据更新

修改 `app/src/data/themes.json` 后：

```bash
cd /Users/kiki/aixiezhen/miniprogram/data
{ echo "// 自动生成自 app/src/data/themes.json"; \
  echo "// 数据源 → 小红书古风提示词合集.md → app/scripts/build-themes.mjs"; \
  echo "module.exports ="; \
  cat /Users/kiki/aixiezhen/app/src/data/themes.json; } > themes.js
```

或者让晶晶帮你跑一遍。
