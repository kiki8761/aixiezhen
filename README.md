# aixiezhen · 古风艺术照提示词生成器

选关键词 → 生成古风艺术照提示词 → 复制去 AI 绘图工具出图。

- 线上：<https://aixiezhen.tools.kikiaigc.com/>
- 技术栈：Vite + React 19 + TypeScript，纯前端 SPA，无后端
- 视觉规范：青瓷淡彩（默认）/ 墨色烛金（暗色），跟随系统 `prefers-color-scheme`
- 数据：42 个主题 × 458 个变体（来自小红书整理合集）

## 目录

```
├── app/                              # React 工程（构建产物所在）
│   ├── src/
│   ├── public/assets/                # logo.png、hero-mountains.png
│   ├── scripts/build-themes.mjs      # md → themes.json 转换
│   ├── DEPLOY.md                     # 部署说明
│   └── ...
├── 古风提示词生成器_设计Brief_双模式版.md   # 产品 brief
├── 小红书古风提示词合集.md                  # 数据源
└── 数据处理Prompt.md                       # 转换规则
```

## 开发

```bash
cd app
npm install
npm run dev          # http://localhost:5173
npm run build        # 产出 dist/
```

## 部署

详见 [`app/DEPLOY.md`](./app/DEPLOY.md)。当前走腾讯云 `82.156.43.88` + nginx + Let's Encrypt + Cloudflare DNS。

## 数据更新

修改 `小红书古风提示词合集.md` 后：

```bash
cd app
node scripts/build-themes.mjs
npm run build
```
