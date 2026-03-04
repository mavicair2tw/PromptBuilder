# Prompt Builder

AI 圖生影片提示詞組合器，使用 Vite + React + TypeScript + Express 建置。功能包含：

- 左側全域參數：主體 / 動作 / 環境 / 運鏡 / 風格 / 語言 / Negative Prompt 等
- 中間分鏡編輯器：預設三段，可新增、刪除、上下移動，並覆蓋主體/動作/運鏡
- 右側輸出區：即時產出「基本提示詞」與「分鏡提示詞」，可複製、下載 .txt
- 內建 20+ 運鏡選項、3 組範例 Snapshot
- 新增 **OpenAI Sora 影片生成**：可調整模型 / 秒數 / 畫面比例 / 解析度，一鍵送出並在前端嵌入播放

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
npm run server      # 在 http://localhost:4000 啟動 Express + OpenAI proxy
npm run dev         # 另開一個 terminal，在 http://localhost:5173 啟動 Vite
```

預設 Vite dev server 已透過 proxy 將 `/api/*` 轉送到 `http://localhost:4000`，因此前端直接呼叫 `/api/sora/...` 即可。

常用腳本：

```bash
npm run build    # tsc + vite build，輸出到 dist/
npm run preview  # 預覽 production build
```

## Sora API 流程（後端）

- `POST /api/sora/generate`
  - body: `{ prompt, model, duration, aspect_ratio, resolution }`
  - 伺服器會套用 prompt 長度限制 (≤ 1500 chars)、基本 rate limit、解析度/比例自動對應，再呼叫 `openai.videos.create()`。
  - response: `{ id, status }`
- `GET /api/sora/status/:id`
  - 直接代理 `openai.videos.retrieve()`，回傳 `{ id, status, progress, error?, video_url? }`
  - 當狀態為 `completed` 時提供 `video_url = /api/sora/video/:id`（server 會從 OpenAI 下載內容並串流給前端）。
- 額外 `GET /api/sora/video/:id` 供 `<video>` 直接播放；URL 可複製分享（需同一個 server 存取）。

錯誤處理：
- 401 / 429 / 400 由 OpenAI 轉換成人類可讀訊息後回傳。
- 伺服器層再加上簡單的每分鐘 5 次 rate limit 與 prompt 長度檢查。

## API 測試

Server 啟動後，可用 `curl` 手動驗證：

```bash
curl -X POST http://localhost:4000/api/sora/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A neon-lit cyberpunk rider speeding through Taipei streets.",
    "model": "sora-2",
    "duration": 5,
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'

curl http://localhost:4000/api/sora/status/video_123456
```

成功後即可在前端按「Generate Video (Sora)」完成整個流程。

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
