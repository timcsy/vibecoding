# 專案開發進度記錄 (AGENTS.md)

## 專案概況
- **專案名稱**: AI 輔助學習 App
- **開發方法**: TDD (測試驅動開發)
- **技術架構**: 純前端 (CDN 版本 JS 套件 + GUN.js)
- **狀態**: 需求討論階段

## 目標客群
- **群體**: 高中生
- **特質**:
  - 課業壓力大
  - 作息不穩定
  - 常因考試而熬夜
  - 重視成績但也想兼顧社交與休閒

## 核心痛點
- **場景**: 不知道該怎麼安排讀書順序與時間
- **具體問題**:
  - 一邊唸書一邊滑手機，容易分心
  - 缺乏有效的時間管理工具

## 產品方案
- **AI 輔助學習 App** 功能:
  - 幫助安排時間
  - 擬定讀書計畫
  - 特定時間將其他app鎖住（防沉迷機制）

## 技術決策
- **讀書計畫生成**: 演算法生成（非 AI/LLM）
- **防沉迷機制**: 網頁層級過濾
- **用戶認證**: 不需要
- **數據同步**: 本地存儲（離線優先）
- **資料庫**: GUN.js

## 開發進度
- [x] 需求文檔 (PRD.md) 完成
- [x] 使用者故事編寫
- [x] 項目結構搭建完成
- [x] 算法單元測試編寫 (25+ test cases)
- [x] 存儲層整合測試編寫 (15+ test cases)
- [x] 算法實現
- [x] 存儲層實現
- [x] UI 基礎實現
- [ ] E2E 測試編寫
- [ ] UI 完整開發
- [ ] 防沉迷機制 (V1.1)
- [ ] 部署與測試

## 重要文檔
- **PRD.md**: 完整的產品需求文檔，包含所有功能規格、數據模型、成功指標
- **README.md**: 完整的開發指南和快速開始教程
- **本檔案 (AGENTS.md)**: 專案概況與進度追蹤，供後續開發者參考

## 技術決策與架構
- **前端框架**: 純前端 (CDN 版本 JS 套件，無打包工具)
- **測試框架**: Jasmine 3.10.1 (通過 CDN 加載)
- **存儲方案**: GUN.js (本地離線存儲)
- **UI 框架**: Bootstrap 5.3.0
- **日期處理**: Day.js 1.11.0
- **開發伺服器**: Python http.server 或任何靜態伺服器

### 項目結構
```
src/
  ├── algorithm.js    # 讀書計畫生成算法 (4 個主要函數)
  ├── storage.js      # GUN.js 存儲層 (CRUD + 數據遷移)
  └── ui.js           # 用戶界面層 (表單、列表渲染)

tests/
  ├── algorithm.test.js   # 算法單元測試 (25+ cases)
  └── storage.test.js     # 存儲層整合測試 (15+ cases)

index.html  # 主入口 (CDN 配置、測試運行)
```

## 下一步行動
1. ✅ 啟動本地伺服器: `python -m http.server 8000`
2. ✅ 訪問 `http://localhost:8000` 查看應用和測試結果
3. ⏳ 驗證所有測試通過
4. ⏳ 完成 UI 界面的完整開發
5. ⏳ 編寫 E2E 測試 (使用者完整流程)
6. ⏳ 實現 V1.1 防沉迷機制

## CDN 依賴 (自動從 CDN 加載)
- Bootstrap 5.3.0: https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/
- jQuery 3.6.0: https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/
- GUN.js: https://gun.js.org/gun.js
- Day.js 1.11.0: https://cdn.jsdelivr.net/npm/dayjs@1.11.0/
- Jasmine 3.10.1: https://cdnjs.cloudflare.com/ajax/libs/jasmine/3.10.1/

## 開發方法論 (TDD)
- **紅色階段 (Red)**: 編寫失敗的測試
- **綠色階段 (Green)**: 編寫最小代碼使測試通過
- **重構階段 (Refactor)**: 優化代碼質量，確保測試仍通過

---
**最後更新**: 2025-11-19
**更新者**: AI Assistant (GitHub Copilot)
**狀態**: 項目初始化完成 → 進入開發驗證階段
