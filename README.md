# buffTerm 官网

buffTerm 的静态官网，纯 HTML / CSS / JS，直接部署到 GitHub Pages（自定义域名 https://buffterm.com/）。

## 目录结构

- `index.html` 中文首页（默认语言，站点根路径）
- `en/index.html` 英文首页（与中文页结构一一对应，内容需与中文页同步维护）
- `css/style.css` 样式（黑色系 + 霓虹渐变 + 玻璃拟态 + 响应式）
- `js/script.js` 交互（粒子背景、打字机、滚动渐现、数字滚动、3D 卡片、截图切换、灯箱）
- `pic/` 软件截图与 Open Graph 分享封面（`og-cover.jpg`）
- `scripts/sync-version.mjs` 发版同步版本号、更新时间与 sitemap 日期
- `sitemap.xml` / `robots.txt` SEO（含中英 hreflang 互指）

## 双语约定

- 两个语言页面**共用同一份 `css/style.css` 与 `js/script.js`**：
  - 文案由 `<html lang>` 决定（`js/script.js` 内的 `TEXT` 表按语言选择打字机短语、实拍模块名等）；
  - 资源路径前缀由 `<html data-root>` 声明（根目录页为 `""`，`en/` 子目录页为 `"../"`）。
- 每个页面都带 canonical、`hreflang` 互指（zh-CN / en / x-default）与对应的 `og:locale`；修改语言相关内容时请同步更新两页与 `sitemap.xml`。
- 语言切换入口是普通链接（`EN` / `中文`），不使用 JS 切换，以保证两种语言各自拥有独立 URL 与索引。

## 发版同步

应用发布新版本后运行：

```bash
node scripts/sync-version.mjs 1.4.5
```

该脚本会同时更新两页 JSON-LD 的 `softwareVersion`、`dateModified` 与 `sitemap.xml` 的 `lastmod`。

访问：https://buffterm.com/
