# 📚 AI 輔助學習計畫生成器 - 開發指南

## 項目概述

這是一個純前端的讀書計畫管理應用，採用 **TDD (測試驅動開發)** 方法構建。無需後端服務，使用 CDN 版本的 JavaScript 套件。

- **技術棧**: HTML5 + JavaScript + Bootstrap 5 + GUN.js + Jasmine
- **開發方法**: TDD (測試優先)
- **部署方式**: 靜態網站託管 (GitHub Pages / Netlify / Vercel)

---

## 🚀 快速開始

### 1. 本地開發環境設置

#### 方式 A: 使用 Python 內置伺服器 (推薦)
```bash
cd /workspaces/vibecoding
python -m http.server 8000
```

#### 方式 B: 使用 Node.js http-server
```bash
npm install -g http-server
http-server -p 8000
```

#### 方式 C: 使用 VS Code Live Server
1. 安裝 VS Code 擴展: `Live Server`
2. 右鍵 `index.html` → 選擇 "Open with Live Server"

### 2. 訪問應用

在瀏覽器中打開: `http://localhost:8000`

---

## 📁 項目結構

```
vibecoding/
├── index.html              # 主入口文件 (HTML + CDN 配置)
├── package.json            # 項目依賴和元數據
├── README.md               # 本開發指南
│
├── src/                    # 業務代碼目錄
│   ├── algorithm.js        # 讀書計畫生成算法
│   ├── storage.js          # GUN.js 存儲層
│   └── ui.js               # 用戶界面層
│
├── tests/                  # 測試代碼目錄
│   ├── algorithm.test.js   # 算法單元測試
│   └── storage.test.js     # 存儲層整合測試
│
├── assets/                 # 靜態資源
│   └── styles.css          # 補充樣式表
│
└── docs/                   # 文檔目錄
    ├── ARCHITECTURE.md     # 架構設計文檔
    └── API.md              # API 文檔
```

---

## 🧪 測試

### 運行測試

1. 啟動本地伺服器
2. 訪問 `http://localhost:8000`
3. 自動運行所有測試，結果顯示在頁面下方

### 測試結構

#### 單元測試 (Unit Tests)
- **檔案**: `tests/algorithm.test.js`
- **覆蓋**: 讀書計畫生成算法的所有邏輯
- **測試數量**: 25+ 個 test cases
- **涵蓋範圍**:
  - 天數計算 (邊界情況: 0天、1天、90天)
  - 難度分配 (各種難度組合)
  - 任務生成和排序
  - 錯誤處理

#### 整合測試 (Integration Tests)
- **檔案**: `tests/storage.test.js`
- **覆蓋**: GUN.js 數據層的 CRUD 操作
- **測試數量**: 15+ 個 test cases
- **涵蓋範圍**:
  - 初始化 GUN.js
  - 保存/讀取計畫
  - 更新任務狀態
  - 數據導入/導出
  - 離線模式

### 測試報告

Jasmine 會在頁面下方顯示完整的測試報告，包括:
- ✓ 通過的測試 (綠色)
- ✗ 失敗的測試 (紅色)
- 總覆蓋率統計

---

## 💻 開發工作流程

### TDD 流程

1. **編寫測試** (Red Phase)
   - 在 `tests/` 目錄編寫測試用例
   - 運行測試，確認測試失敗

2. **實現功能** (Green Phase)
   - 在 `src/` 目錄編寫最小代碼
   - 使所有測試通過

3. **重構優化** (Refactor Phase)
   - 改進代碼質量
   - 確保所有測試仍通過

### 例子: 添加新算法

```javascript
// 1. 先在 tests/algorithm.test.js 寫測試
it('應該計算複習間隔', function() {
  const result = calculateReviewInterval([1, 2, 3]);
  expect(result).toBe(expectedValue);
});

// 2. 運行測試 → 失敗 ✗

// 3. 在 src/algorithm.js 實現函數
function calculateReviewInterval(data) {
  // 實現邏輯
}

// 4. 運行測試 → 通過 ✓

// 5. 重構代碼以提高可讀性
```

---

## 📊 核心模塊

### 1. 算法層 (`src/algorithm.js`)

**主要函數**:
- `calculateTotalDays(examDate, startDate)` - 計算可用天數
- `allocateDaysByDifficulty(difficulties, totalDays)` - 按難度分配天數
- `generateDailyTasks(subjects, dayAllocations, startDate)` - 生成每日任務
- `generateStudyPlan(input)` - 完整計畫生成 (主 API)

**示例使用**:
```javascript
const plan = generateStudyPlan({
  subjects: [
    { name: '數學', difficulty: 4 },
    { name: '英文', difficulty: 3 }
  ],
  examDate: '2024-12-19',
  startDate: '2024-11-19'
});

console.log(plan.tasks); // 每日任務列表
```

### 2. 存儲層 (`src/storage.js`)

**主要函數**:
- `initializeGUN()` - 初始化 GUN.js
- `savePlanToStorage(plan, gunInstance)` - 保存計畫
- `loadPlanFromStorage(planId, gunInstance)` - 讀取計畫
- `updateTaskCompletionStatus(planId, taskIndex, completed)` - 更新任務
- `exportPlansAsJSON(gunInstance)` - 導出數據
- `importPlansFromJSON(jsonData, gunInstance)` - 導入數據

**示例使用**:
```javascript
// 保存計畫
savePlanToStorage(plan, null).then(result => {
  console.log('計畫已保存:', result);
});

// 讀取計畫
loadPlanFromStorage('plan_123', null).then(plan => {
  console.log('計畫數據:', plan);
});
```

### 3. 界面層 (`src/ui.js`)

**主要函數**:
- `initializeUI()` - 初始化頁面
- `renderPlanForm()` - 渲染計畫表單
- `renderTaskList(plan)` - 渲染任務列表
- `addSubject()` - 添加科目欄位
- `handlePlanFormSubmit(event)` - 提交表單

---

## 🔧 CDN 依賴

所有外部庫通過 CDN 動態加載，無需本地安裝:

| 庫 | 用途 | CDN 版本 |
|----|------|--------|
| Bootstrap | UI 框架 | 5.3.0 |
| jQuery | DOM 操作 | 3.6.0 |
| GUN.js | 本地存儲 | 0.2.x |
| Day.js | 日期處理 | 1.11.0 |
| Jasmine | 測試框架 | 3.10.1 |

所有 CDN 連結保存在 `index.html` 中，便於修改和更新。

---

## 📝 數據模型

### 計畫 (Plan)
```javascript
{
  id: "plan_1234567890",
  title: "數學、英文考試複習計畫",
  examDate: "2024-12-19",
  startDate: "2024-11-19",
  totalDays: 30,
  subjects: [
    { name: "數學", difficulty: 4 },
    { name: "英文", difficulty: 3 }
  ],
  dayAllocations: [13, 10],
  tasks: [
    {
      date: "2024-11-19",
      subject: "數學",
      content: "複習微積分 - 極限概念",
      hours: 1.5,
      completed: false
    }
  ],
  createdAt: "2024-11-19T10:30:00Z"
}
```

### 存儲結構 (GUN.js)
```javascript
{
  plans: {
    plan_001: { /* 計畫數據 */ },
    plan_002: { /* 計畫數據 */ }
  },
  blocklist: {
    block_001: { /* 防沉迷設置 */ } // V1.1
  }
}
```

---

## 🎯 開發進度

### 已完成 ✓
- [x] 項目結構搭建
- [x] 算法設計與實現
- [x] 測試框架配置
- [x] 25+ 單元測試
- [x] 15+ 整合測試
- [x] 基礎 UI 實現

### 進行中 🔄
- [ ] 完整 UI 界面開發
- [ ] E2E 測試編寫
- [ ] 性能優化

### 計劃 📅
- [ ] V1.1: 防沉迷機制
- [ ] V1.2: 讀書統計分析
- [ ] V2.0: 跨設備同步

---

## 🐛 故障排除

### 問題: 測試不運行
**解決**: 確保 GUN.js CDN 已正確加載
```javascript
// 在瀏覽器控制台檢查
typeof Gun !== 'undefined' // 應返回 true
```

### 問題: 計畫未保存
**解決**: 檢查瀏覽器本地存儲是否啟用
```javascript
// 在瀏覽器控制台測試
localStorage.setItem('test', 'value');
localStorage.getItem('test'); // 應返回 'value'
```

### 問題: CDN 資源加載失敗
**解決**: 檢查網絡連接，或替換 CDN 源
- 備用 CDN: `unpkg.com`, `jsDelivr`, `cdnjs`

---

## 📚 進一步資源

- **Jasmine 文檔**: https://jasmine.github.io/
- **GUN.js 文檔**: https://gun.js.org/
- **Bootstrap 文檔**: https://getbootstrap.com/docs/
- **Day.js 文檔**: https://day.js.org/

---

## 📞 聯絡和支持

有問題或建議？請查看:
- `PRD.md` - 產品需求文檔
- `AGENTS.md` - 項目進度和架構說明
- GitHub Issues

---

**版本**: 1.0.0 (Beta)  
**最後更新**: 2025-11-19  
**開發狀態**: 活躍開發中