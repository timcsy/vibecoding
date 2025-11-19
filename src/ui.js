/**
 * UI 層 (User Interface Layer)
 * 
 * 負責頁面渲染、事件處理、用戶交互
 * 依賴於 algorithm.js 和 storage.js
 */

/**
 * 初始化 UI
 */
function initializeUI() {
  const app = document.getElementById('app');
  
  if (!app) {
    console.error('找不到 ID 為 "app" 的 DOM 元素');
    return;
  }
  
  // 渲染初始化 UI
  app.innerHTML = `
    <div class="container mt-5">
      <h1>📚 AI 輔助學習計畫生成器</h1>
      <div id="formSection" class="row mt-4">
        <!-- 表單將在此渲染 -->
      </div>
      <div id="taskSection" class="row mt-4">
        <!-- 任務列表將在此渲染 -->
      </div>
    </div>
  `;
  
  renderPlanForm();
}

/**
 * 渲染計畫創建表單
 */
function renderPlanForm() {
  const formSection = document.getElementById('formSection');
  
  formSection.innerHTML = `
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">建立新計畫</h5>
          <form id="planForm">
            <div class="mb-3">
              <label for="examDate" class="form-label">考試日期</label>
              <input type="date" class="form-control" id="examDate" required>
            </div>
            
            <div class="mb-3">
              <label for="dailyHours" class="form-label">每日學習時間 (小時)</label>
              <input type="number" class="form-control" id="dailyHours" min="1" max="12" value="3" required>
            </div>
            
            <div class="mb-3">
              <label class="form-label">科目與難度</label>
              <div id="subjectsContainer">
                <div class="input-group mb-2">
                  <input type="text" class="form-control subject-name" placeholder="科目名稱 (例: 數學)">
                  <select class="form-select subject-difficulty">
                    <option value="1">難度 1 (簡單)</option>
                    <option value="2">難度 2</option>
                    <option value="3" selected>難度 3 (中等)</option>
                    <option value="4">難度 4</option>
                    <option value="5">難度 5 (困難)</option>
                  </select>
                  <button class="btn btn-outline-danger" type="button" onclick="removeSubject(this)">刪除</button>
                </div>
              </div>
              <button class="btn btn-outline-secondary btn-sm" type="button" onclick="addSubject()">+ 新增科目</button>
            </div>
            
            <button type="submit" class="btn btn-primary w-100">生成讀書計畫</button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // 綁定表單提交事件
  document.getElementById('planForm').addEventListener('submit', handlePlanFormSubmit);
  
  // 初始添加一個空科目欄位
  addSubject();
}

/**
 * 新增科目欄位
 */
function addSubject() {
  const container = document.getElementById('subjectsContainer');
  const div = document.createElement('div');
  div.className = 'input-group mb-2';
  div.innerHTML = `
    <input type="text" class="form-control subject-name" placeholder="科目名稱">
    <select class="form-select subject-difficulty">
      <option value="1">難度 1 (簡單)</option>
      <option value="2">難度 2</option>
      <option value="3" selected>難度 3 (中等)</option>
      <option value="4">難度 4</option>
      <option value="5">難度 5 (困難)</option>
    </select>
    <button class="btn btn-outline-danger" type="button" onclick="removeSubject(this)">刪除</button>
  `;
  container.appendChild(div);
}

/**
 * 移除科目欄位
 */
function removeSubject(button) {
  button.parentElement.remove();
}

/**
 * 處理計畫表單提交
 */
function handlePlanFormSubmit(event) {
  event.preventDefault();
  
  try {
    // 收集表單數據
    const examDate = document.getElementById('examDate').value;
    const subjectInputs = document.querySelectorAll('.input-group');
    
    const subjects = [];
    subjectInputs.forEach(input => {
      const name = input.querySelector('.subject-name').value.trim();
      const difficulty = parseInt(input.querySelector('.subject-difficulty').value);
      
      if (name) {
        subjects.push({ name, difficulty });
      }
    });
    
    if (subjects.length === 0) {
      alert('請至少新增一個科目');
      return;
    }
    
    // 生成計畫
    const plan = generateStudyPlan({
      subjects: subjects,
      examDate: examDate,
      startDate: new Date()
    });
    
    // 保存到本地存儲
    savePlanToStorage(plan, null).then(() => {
      alert('計畫已生成並保存！');
      renderTaskList(plan);
    }).catch(error => {
      console.error('保存失敗:', error);
      alert('保存計畫時發生錯誤：' + error.message);
    });
  } catch (error) {
    console.error('生成計畫失敗:', error);
    alert('生成計畫時發生錯誤：' + error.message);
  }
}

/**
 * 渲染任務列表
 */
function renderTaskList(plan) {
  const taskSection = document.getElementById('taskSection');
  
  let taskHTML = `
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${plan.title}</h5>
          <p class="text-muted">考試日期：${plan.examDate} | 總天數：${plan.totalDays}</p>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>科目</th>
                  <th>學習內容</th>
                  <th>時間</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
  `;
  
  plan.tasks.forEach((task, index) => {
    const status = task.completed ? '✓ 已完成' : '○ 未完成';
    taskHTML += `
      <tr>
        <td>${task.date}</td>
        <td>${task.subject}</td>
        <td>${task.content}</td>
        <td>${task.hours} 小時</td>
        <td>
          <button class="btn btn-sm btn-outline-success" onclick="markTaskComplete('${plan.id}', ${index})">
            ${status}
          </button>
        </td>
      </tr>
    `;
  });
  
  taskHTML += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  taskSection.innerHTML = taskHTML;
}

/**
 * 標記任務為完成
 */
function markTaskComplete(planId, taskIndex) {
  updateTaskCompletionStatus(planId, taskIndex, true, null).then(() => {
    alert('任務已標記為完成！');
  }).catch(error => {
    console.error('更新失敗:', error);
    alert('更新任務時發生錯誤：' + error.message);
  });
}

// 頁面加載時初始化 UI
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}
