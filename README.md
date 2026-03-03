# Prompt Builder

AI 圖生影片提示詞組合器，使用 Vite + React + TypeScript 建置，可本機立即啟動。功能包含：

- 左側全域參數：主體 / 動作 / 環境 / 運鏡 / 風格 / 語言 / Negative Prompt 等
- 中間分鏡編輯器：預設三段，可新增、刪除、上下移動，並覆蓋主體/動作/運鏡
- 右側輸出區：即時產出「基本提示詞」與「分鏡提示詞」，可複製、下載 .txt
- LocalStorage 儲存 Preset（最多 5 組）與 3 組範例一鍵套用
- 中 / 英輸出切換、字數與 token 粗估
- 內建 20 種運鏡（含中英文描述與難度標籤）

## 開發指令

```bash
pnpm install   # 或 npm install / yarn
pnpm dev       # http://localhost:5173 進行開發
pnpm build     # 打包
pnpm preview   # 預覽 build 結果
```

> 若未安裝 `pnpm`，可改用 `npm` 或 `yarn` 執行相同指令。

## 自動部署（GitHub Pages）

Repo 內建 `.github/workflows/deploy.yml`：

1. 每次 push `main` 或手動 `workflow_dispatch` 觸發
2. 使用 Node 20 建置 (`npm install && npm run build`)
3. 上傳 `dist/` 並透過 `actions/deploy-pages` 發佈到 GitHub Pages

啟用方式：到 GitHub 設定 `Pages` → 選擇 **GitHub Actions**，首次部署後 URL 會顯示在 workflow outputs。

## 專案結構

```
prompt-builder/
├─ public/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ hooks/
│  ├─ styles/
│  └─ main.tsx / App.tsx / ...
```
