# 部署说明 · aixiezhen.tools.kikiaigc.com

## 构建

```bash
cd /Users/kiki/aixiezhen/app
npm install            # 首次
npm run build          # 产出 dist/
```

产物目录：`dist/`（纯静态，可直接托管）

```
dist/
├── index.html
└── assets/
    ├── logo.png
    ├── hero-mountains.png
    ├── index-*.css
    ├── index-*.js       # 主入口
    ├── react-*.js       # React 运行时
    └── themes-*.js      # 42 个主题 × 458 变体数据
```

## 托管任选其一

### 1) 对象存储 + CDN（推荐，国内访问快）

上传整个 `dist/` 到对象存储桶（OSS / COS / 七牛 / S3），在控制台绑定
`aixiezhen.tools.kikiaigc.com` 域名，开启静态站点托管 + CDN。

**要点：**
- 默认首页：`index.html`
- 404 回退：**不需要配置 SPA 回退**（本应用唯一 URL 是 `/`，内部用 state 切页）
- `index.html` 设置 `Cache-Control: no-cache`，`assets/*` 设置
  `Cache-Control: public, max-age=31536000, immutable`（文件名带 hash，可长缓存）

### 2) Nginx 反代（VPS 自托管）

```nginx
server {
    listen 443 ssl http2;
    server_name aixiezhen.tools.kikiaigc.com;

    root /var/www/aixiezhen/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

### 3) Cloudflare Pages / Vercel / Netlify

- 构建命令：`npm run build`
- 输出目录：`dist`
- 域名绑定：在平台设置里加 CNAME 到 `aixiezhen.tools.kikiaigc.com`

## 验收清单（部署后手测）

- [ ] iOS Safari 打开 `aixiezhen.tools.kikiaigc.com` —— 首页 hero 背景无白边，标题阴影到位
- [ ] 微信内嵌浏览器打开 —— 同上；点"复制提示词"能复制
- [ ] 系统切深色 —— 自动变墨色烛金；logo 色调反转自然
- [ ] 模板模式 → 任选一个主题 → 选变体 → 复制 —— 全流程通
- [ ] 自由模式 → 至少选 3 项 → 生成提示词 → 复制 —— 全流程通
- [ ] "换一个" / "重新开始" 按钮逻辑正确
- [ ] 点外链（即梦/可灵/豆包/吐司/MJ）能新窗口打开

## 备注

- **hero-mountains.png 目前 1.7 MB**。首屏会拉这张图；想要更快首屏，可以用
  `cwebp -q 82` 压一版 WebP（大约能压到 300 KB 以内），然后把 `Home.css`
  的 `url("/assets/hero-mountains.png")` 换成 `.webp` 路径即可。

- **字体**：没有引入 Google Fonts CDN（国内不可达）。
  `src/styles/tokens.css` 里的字体栈已经按系统字优先：
  iOS/Mac → Songti SC（标题）+ PingFang SC（正文），
  Windows → SimSun + 微软雅黑，
  Android → 系统默认。如果你想要更统一的显示，可以改用
  `fontsapi.zeoseven.com` 等国内镜像，替换 `index.html` 里的 `<link>` 即可。

- **数据更新**：
  ```bash
  # 修改 ../小红书古风提示词合集.md 之后
  node scripts/build-themes.mjs
  npm run build
  ```

- **无后端、无 API 调用、无三方追踪脚本**，离线也能用（只要 dist 提前缓存）。
