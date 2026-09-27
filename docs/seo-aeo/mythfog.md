# MythFog SEO / AEO 評估

**URL**：https://mythfog.com/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：1.77 / 3

## 已確認

- HTTP 200，Next.js server-rendered HTML。
- title、description、canonical、`index, follow` 與 zh-Hant / en / ja hreflang 都存在。
- 首頁有 Organization、WebSite、SoftwareApplication JSON-LD。
- `robots.txt` 和 sitemap 可讀；`/download`、`/invite`、`/safety` 被刻意排除。
- hero 圖有 preload、responsive `srcset` 與 descriptive alt；首頁有明顯 H1、產品流程和 guide/support 連結。

## 優勢

產品定位、iOS 版本、台灣先行、功能流程和「不是抓怪／不是抽卡」的差異化敘事都能被爬蟲直接讀到。這使它既能做品牌搜尋，也能回答「MythFog 是什麼」和「如何開始」這類問題。

## 優先修正

**P1 — 結構化資料細化**：在現有 SoftwareApplication 旁補 `offers`（若目前是受邀 TestFlight，清楚標示 beta／無公開價格）、`downloadUrl` 或 App Store/TestFlight 入口、`featureList`、`audience` 和 `sameAs`。沒有公開商店頁時，不要填虛構評分或價格。

**P1 — FAQ / HowTo 答案單元**：把「需要什麼 iOS 版本」「是否一定要登入」「如何開始探訪」「照片如何處理」「飛機是否計入」整理成可見的 FAQ，必要時加 FAQPage 或 HowTo schema。

**P2 — 多語與 URL**：確認 `/en`、`/ja` 每個頁面的 canonical、hreflang、title、description 和 JSON-LD `inLanguage` 成對回指；sitemap 的 `lastmod` 隨正式內容更新。

**P2 — 首屏效能**：hero 圖目前已做 Next Image 變體，但仍應以 Lighthouse mobile 檢查 LCP、canvas fog 動畫與字體；`prefers-reduced-motion` 使用者應能跳過動態效果。

## 建議驗收

以 mobile Lighthouse、Search Console URL Inspection、Schema Markup Validator 和三語逐頁 crawl 驗證。特別確認被 robots 排除的流程頁仍有可索引的說明頁承接搜尋意圖。
