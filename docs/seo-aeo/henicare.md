# HENI Care SEO / AEO 評估

**URL**：https://henicare.com/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：0.61 / 3

## 已確認

- HTTP 200，Next.js HTML 可讀；首頁 title、description、canonical 存在。
- 首頁有清楚 H1、使用者角色、功能、資料權限、安全、AI 限制與 FAQ 文字。
- `robots.txt` 與 sitemap 可讀，且列出 explore、podcast 等路徑。
- response 使用 `private, no-cache, no-store`。這不等於不能索引，但會讓快取與 crawl efficiency 變差，需確認是否是刻意的預覽策略。
- 抓取到的首頁沒有 robots meta，也沒有 JSON-LD。

## 優先修正

**P0 — 狀態一致性**：網站文案寫「即將開放」，但仍應明確決定公開預覽頁是否 `index, follow`。若要累積品牌搜尋，保留可索引 landing page；若尚未準備公開，對預覽頁加 `noindex`，並避免 sitemap 宣傳不可索引 URL。

**P1 — metadata 與 schema**：補 WebSite、Organization、SoftwareApplication（或 WebApplication）、FAQPage；把「不是診斷／不是急救」「誰能看到資料」「資料所在地」「AI 不調整用藥」等現有文字對應到可見 FAQ 和 schema。

**P1 — E-E-A-T / YMYL**：每篇衛教與 Podcast 內容加作者、醫療審核者、專業資格、更新日期、引用來源和適用限制。這是醫療相關 AEO 的必要信任層，不應只靠產品行銷文案。

**P2 — cache 與 canonical**：確認首頁不需要整頁 no-store；若是安全原因，將個人資料頁與公開 marketing 頁分開設定快取策略。

## 建議驗收

上線前用 Search Console URL Inspection 檢查公開頁是否可索引；用 schema validator 驗證 FAQ 與 organization；以匿名瀏覽器確認未登入也能讀到完整的產品定位與安全限制。
