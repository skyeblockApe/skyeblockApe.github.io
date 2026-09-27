# Skyeblock SEO / AEO 評估

**URL**：https://skyeblock.com/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：1.65 / 3（中間值；本報告的人工證據比模型分數優先）

**本輪已處理**：`site/sitemap.xml` 六個 URL 的 `lastmod` 已由 2026-09-24 同步為 2026-09-26，對應最近一次內容更新；`site/app.js` 也會在切換語言時同步 JSON-LD 的 URL、`inLanguage`、FAQ 文案與 `og:locale`。

## 已確認

- HTTP 200，GitHub Pages 回應；首頁有可讀的 server-rendered HTML。
- title：`Skyeblock — 讓好奇，成為作品。`
- description 清楚說明創意工作室與 MythFog、HENI Care、History 101、GeneDex、Podcast。
- `index, follow`、canonical、zh-Hant / English / 日本語 hreflang 都存在。
- 首頁有 Organization、WebSite、WebPage、ItemList、Event、PodcastSeries、FAQPage JSON-LD。
- `robots.txt` 與 sitemap 可讀；sitemap 包含首頁與 THE CABINET 的多語 URL。

## 優勢

首頁的 entity、作品關係、語言與 FAQ 已經比一般作品集完整，對品牌消歧和答案引擎引用很有幫助。`llms.txt` 也提供了可供人工／機器核對的 canonical facts，並特別澄清 CancerFree、BAYC 與合作關係。

## 優先修正

**P1 — freshness 與可引用性**：線上首頁版本已是 0.23，但 sitemap 的 `lastmod` 仍顯示 2026-09-24。每次 deploy 同步更新 sitemap 日期，避免搜尋引擎低估內容新鮮度。

**P1 — AEO answer blocks**：在首頁或各作品頁加入短而直接的問答，例如「Skyeblock 是什麼？」「THE CABINET 保存什麼？」「MythFog、HENI Care、History 101 分別是什麼？」答案先給結論，再放延伸連結。

**P2 — schema 驗證**：確認 Event 的日期／地點、PodcastSeries 的節目來源、FAQPage 的可見文字與 JSON-LD 完全一致；不要把尚未公開的 GeneDex 寫成已上線服務。

**P2 — 多語一致性**：三語版本的 title、description、canonical、JSON-LD entity name 與 sitemap hreflang 要逐一互相回指。

## 建議驗收

用 Rich Results Test、Search Console URL Inspection、`curl -I` 檢查 canonical/robots；部署後重新提交 sitemap，並檢查首頁的 0.23 與日期是否同步。
