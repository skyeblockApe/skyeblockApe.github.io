# CancerFree SEO / AEO 評估

**URL**：https://cancerfree.io/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：1.56 / 3

## 已確認

- HTTP 200，Shopify storefront；canonical、description、zh-Hant / en / ja hreflang 和 sitemap index 存在。
- 首頁有大量可讀的服務、替身醫療、E.V.A. Select、CTC、病友案例與癌症照護內容。
- `robots.txt` 可讀，並公開 agentic discovery / UCP 相關入口；sitemap 由 Shopify 即時分拆產品、頁面與集合。
- title 的 raw HTML 抓取出現 `Visa` 重複片段，需確認實際 DOM／瀏覽器 title 是否也有污染。
- 沒有在首頁 HTML 找到 robots meta；有兩段 JSON-LD，但需驗證是否正確描述醫療組織、服務與產品。

## 優勢

品牌、服務名稱與使用情境清楚，且首頁已能回答「什麼是替身醫療」「E.V.A. Select 用什麼檢體」「有哪些服務」等核心問題。Shopify sitemap 與產品／頁面 URL 結構是穩定基礎。

## 優先修正

**P0 — title / entity cleanup**：確認並修正 title 的重複 `Visa` artifact；統一「精拓生技」「CancerFree Biotech」「Cancer Free 精準醫學」的 Organization name、alternateName、logo、社群連結和官方聯絡資訊。

**P1 — 醫療信任與限制**：每項服務頁補作者／醫療審核者、研究證據、適用癌別、檢測限制、結果解讀限制、更新日期與「不能取代醫師判斷」的明確說明。病友案例要有同意與內容性質標籤，避免被誤讀為療效保證。

**P1 — schema 對應**：使用 Organization / MedicalOrganization、MedicalWebPage、Service、Product（真正販售的商品才用）與 Article；不要將研究性服務標成一般商品或暗示保證治療效果。

**P2 — AEO answer hubs**：為「替身醫療」「E.V.A. Select」「CTC 循體欣」「全守護基因風險評估」各建一頁可引用的定義、流程、需要什麼資料、限制、費用／諮詢方式與來源；FAQ 需對應頁面可見問答。

## 驗收

以瀏覽器與 `curl` 同時檢查 title；用 Schema Markup Validator、Search Console rich-result report 和 mobile Lighthouse 驗證。Shopify 更新後確認 sitemap index 仍能列出所有 canonical 語言頁。
