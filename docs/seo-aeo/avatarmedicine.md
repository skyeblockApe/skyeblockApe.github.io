# Avatar Medicine SEO / AEO 評估

**URL**：https://avatarmedicine.xyz/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：0.77 / 3

## 已確認

- HTTP 200，GitHub Pages；首頁可讀到英文的 Avatar Medicine Forum 歷史與 2021、2022、2023 活動導覽。
- title 只有 `AvatarMedicine`；沒有 description、robots meta、canonical 或 JSON-LD。
- `robots.txt` 可讀，內容主要是 content-signal 權利聲明；`sitemap.xml` 回傳 404。
- 首頁有中英文切換，但目前沒有足夠的多語 metadata 訊號可供搜尋引擎消歧。

## 優先修正

**P0 — 基本 identity**：title 改成包含品牌與用途，例如「Avatar Medicine Forum｜替身醫療與虛實醫療論壇」，補 120–160 字的 description，明確說明論壇主題、年份、主辦／合作關係與網站是歷史檔案還是持續活動。

**P0 — canonical / sitemap / robots**：補 canonical、`index, follow`（若確實要公開索引）與 sitemap.xml；sitemap 列出年度頁、活動頁和聯絡頁的實際 URL。

**P1 — AEO 結構**：加 Organization、WebSite、Event（各年度論壇）、Person（講者／主持人，只有有可靠資料時）JSON-LD；頁面直接回答「Avatar Medicine 是什麼」「論壇何時舉行」「BAYC #8796 的角色是什麼」並附原始來源。

**P1 — 內容可信度**：把英文段落拆成小標題和短答案，補日期、地點、主辦單位、影像來源、更新日期與聯絡方式；避免用「可取代患者功能」這類容易被誤解成臨床承諾的絕對語句。

## 驗收

確認 sitemap 回 200、canonical 指向單一主 URL、三語頁面互有 hreflang；再以 rich results validator 檢查 Event / Organization。
