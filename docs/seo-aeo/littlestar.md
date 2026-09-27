# Little Star SEO / AEO 評估

**URL**：https://littlestar.love/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：1.52 / 3

## 已確認

- HTTP 200，GitHub Pages；首頁有 substantial Traditional Chinese 兒童癌症衛教、研究摘要、活動與病友內容。
- title 只有 `Little Star`；description 為空，未找到 robots meta 或 canonical。
- UI 有繁中／英文／日文入口，HTML 也有一個 JSON-LD 區塊，但未形成完整的首頁 identity 訊號。
- `/robots.txt` 與 `/sitemap.xml` 都回 404。

## 優勢

內容量和主題明確度其實不差，包含兒童癌症、CTC、精準醫療、論文與服務說明；問題主要是搜尋引擎缺少「這些內容屬於誰、哪一頁是 canonical、有哪些 URL」的技術入口。

## 優先修正

**P0 — crawl entry points**：建立 robots.txt 與 sitemap.xml，並在 robots 宣告 sitemap；sitemap 列出語言版本、衛教分類、研究／論文頁、活動頁和服務頁。

**P0 — metadata**：每個語言版本補獨立 title、description、canonical、Open Graph image/alt 和 hreflang；首頁 title 應同時含 Little Star 與兒童癌症支持／衛教定位。

**P1 — YMYL trust**：每篇醫療內容顯示作者、審核者、資料來源、發布／更新日期、適用範圍與「請和主治醫師討論」提示。研究摘要要連到原始論文，不只放結論。

**P1 — schema**：補 Organization、WebSite、WebPage、Article／MedicalWebPage；只有頁面真的有問答時才使用 FAQPage，不要把導覽標籤偽裝成 FAQ。

## 驗收

確認 robots/sitemap 200、每個 hreflang URL 互相回指；抽查一篇衛教、一篇研究、一個活動頁的 rendered HTML 和 structured data。
