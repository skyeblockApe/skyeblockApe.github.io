# SEO / AEO 逐站評估

評估日期：2026-09-27  
資料來源：各站公開首頁、response headers、`robots.txt`、`sitemap.xml`；並以 TypeSafe Jev 做一致性的優先級輔助判斷。

這是技術與內容健檢，不是 Google 排名保證，也不是醫療內容的法律或臨床審查。Jev 分數是相對的 AEO readiness 訊號，不是搜尋引擎分數。

| 網站 | SEO 現況 | AEO readiness（Jev 輔助） | 第一優先 |
|---|---|---:|---|
| [Skyeblock](./skyeblock.md) | 良好 | 1.65 / 3 | 持續補強可引用的答案段落與 freshness |
| [MythFog](./mythfog.md) | 良好 | 1.77 / 3 | 補齊更明確的產品／FAQ 結構化資料 |
| [HENI Care](./henicare.md) | 中等 | 0.61 / 3 | metadata、robots 與公開／預覽狀態一致化 |
| [History 101](./history101.md) | 重大阻塞 | 0.02 / 3 | 先解除首頁登入導向與 `noindex` 矛盾 |
| [Avatar Medicine](./avatarmedicine.md) | 基礎不足 | 0.77 / 3 | title、description、canonical、sitemap |
| [Little Star](./littlestar.md) | 內容佳、技術缺口 | 1.52 / 3 | robots、sitemap、canonical、頁面 metadata |
| [CancerFree](./cancerfree.md) | 內容豐富、metadata 需整理 | 1.56 / 3 | title/description/MedicalOrganization 與信任訊號 |

## 建議執行順序

1. History 101：讓可公開索引的 landing/about 頁真的能被爬蟲讀到，登入頁維持 `noindex`。
2. Avatar Medicine、Little Star：先補最基本的索引入口與頁面 identity，成本低、改善幅度大。
3. HENI Care：在正式開放前把預覽狀態、metadata、FAQ schema 和安全聲明整理一致。
4. CancerFree：把醫療服務、研究證據、適用限制、作者／審核者與更新日期做成可引用的內容單元。
5. Skyeblock、MythFog：維持現有基礎，持續處理 freshness、FAQ、圖片與多語版本的一致性。
