# History 101 SEO / AEO 評估

**URL**：https://history101.skyeblock.com/  
**抓取日期**：2026-09-27  
**Jev AEO readiness**：0.02 / 3

## 重大發現

- 根 URL 回傳 307，導向 `/login?next=%2F`；登入頁 HTTP 200 但不是產品 landing page。
- response header 明確是 `x-robots-tag: noindex, nofollow, noarchive, nosnippet`；登入頁 HTML 也有 `noindex, nofollow`。
- robots.txt 雖允許 `/about`、`/stats`、`/events`、`/people` 等公開路徑，root 仍沒有可索引的公開介紹頁。
- sitemap 存在並列出公開路徑；登入頁 title/description 和 WebSite JSON-LD 本身尚可。

## 判斷

這不是一般 metadata 小問題，而是 indexability blocker。搜尋引擎與答案引擎目前看到的是登入要求，無法穩定回答「History 101 是什麼」「包含哪些年代／地圖／人物資料」。

## 修正順序

**P0 — 建立公開 landing page**：讓 `/` 回傳可索引的產品介紹，包含 H1、用途、資料範圍、主要公開路徑與登入 CTA；只有登入頁維持 `noindex`。

**P0 — 對齊 robots / headers / metadata**：root、about、events、people 等公開頁不得被 middleware 統一加上 `x-robots-tag: noindex`。登入、auth、feedback、API 仍可阻擋。

**P1 — AEO answer pages**：在 `/about` 直接回答資料範圍、時間線、地圖、人物和資料來源；每個 event/person 頁補 `Article`、`Person`、`Event` 或 `Dataset` schema（依實際頁面內容）。

**P2 — sitemap**：只放真的可匿名讀取且可索引的 URL，更新 `lastmod`；登入 URL 不進 sitemap。

## 驗收

用匿名 `curl -I` 確認 `/` 為 200、沒有 noindex；用 Search Console URL Inspection 檢查 rendered HTML；再用 structured data validator 驗證公開頁。
