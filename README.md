# Prompt Builder

AI 圖生影片提示詞組合器，使用 Vite + React + TypeScript + Express 建置。功能包含：

> **2026-03-04 更新**：依指示停止使用 OpenAI API，Sora 相關後端已停用並一律回傳 503。前端僅保留提示詞編輯功能。

- 左側全域參數：主體 / 動作 / 環境 / 運鏡 / 風格 / 語言 / Negative Prompt 等
- 中間分鏡編輯器：預設三段，可新增、刪除、上下移動，並覆蓋主體/動作/運鏡
- 右側輸出區：即時產出「基本提示詞」與「分鏡提示詞」，可複製、下載 .txt
- 內建 20+ 運鏡選項、3 組範例 Snapshot
- ~~新增 **OpenAI Sora 影片生成**~~（已停用）：僅保留原本 UI，但後端不再呼叫 OpenAI API

## 環境變數

複製 `.env.example` 為 `.env`，或直接在 shell 匯出變數：

```
OPENAI_API_KEY=sk-...
# 可選：允許額外的前端來源 (dev CORS)
# CLIENT_ORIGIN=http://localhost:5173
```

> `OPENAI_API_KEY` 僅供 `server/index.js` 使用，不會被送到前端 bundle。

## 開發指令

```bash
npm install
npm run server      # 在 http://localhost:4000 啟動 Express（Sora API 會直接回傳 503）
npm run dev         # 另開一個 terminal，在 http://localhost:5173 啟動 Vite
```

預設 Vite dev server 已透過 proxy 將 `/api/*` 轉送到 `http://localhost:4000`，因此前端直接呼叫 `/api/sora/...` 即可。

常用腳本：

```bash
npm run build    # tsc + vite build，輸出到 dist/
npm run preview  # 預覽 production build
```

## Sora API 狀態

依照 2026-03-04 的要求，所有 `/api/sora/*` 端點現已停用並固定回傳 503，伺服器不會再呼叫任何 OpenAI 服務。
如果未來需要接入其他影片引擎，可在 `server/index.js` 中更換實作。

## 自動部署（GitHub Pages）

Repo 內建 `.github/workflows/deploy.yml`：

1. push `main` 或手動 `workflow_dispatch` 觸發
2. 使用 Node 20 建置 (`npm install && npm run build`)
3. 上傳 `dist/` 並透過 `actions/deploy-pages` 發佈到 GitHub Pages

> GitHub Pages 只提供靜態檔案，部署時請另外將 `server/index.js` 佈署到可長駐 Node（Railway、Fly.io、Render、Vercel Functions 等），並透過反向代理或 CORS 連回 `/api`。

## 專案結構

```
prompt-builder/
├─ public/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ styles/
│  └─ main.tsx / App.tsx / ...
├─ server/
│  └─ index.js        # Express + OpenAI proxy
├─ .env.example
└─ vite.config.ts    # dev proxy 已指到 http://localhost:4000
```
