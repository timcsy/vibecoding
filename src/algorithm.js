/**
 * 讀書計畫生成算法 (Reading Plan Generation Algorithm)
 * 
 * 負責根據用戶輸入自動生成科學合理的讀書計畫
 * 使用 TDD 方法開發，所有邏輯均通過單元測試驗證
 */

/**
 * 計算可用的總天數
 * @param {Date|string} examDate - 考試日期 (格式: "YYYY-MM-DD" 或 Date 對象)
 * @param {Date|string} [startDate] - 開始日期 (預設為今天)
 * @returns {number} 可用天數
 */
function calculateTotalDays(examDate, startDate = new Date()) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const exam = typeof examDate === 'string' ? new Date(examDate) : examDate;
  
  // 計算兩個日期之間的天數差
  const diffTime = exam - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(diffDays, 0);
}

/**
 * 根據科目難度分配每科的複習天數
 * @param {Array<number>} difficulties - 各科目難度等級陣列 (1-5)
 * @param {number} totalDays - 可用總天數
 * @returns {Array<number>} 每科的複習天數分配
 */
function allocateDaysByDifficulty(difficulties, totalDays) {
  if (difficulties.length === 0) return [];
  
  const difficultySum = difficulties.reduce((sum, d) => sum + d, 0);
  if (difficultySum === 0) return difficulties.map(() => 0);
  
  // 按難度比例分配天數
  return difficulties.map(difficulty => {
    return Math.round((totalDays * difficulty) / difficultySum);
  });
}

/**
 * 生成每日任務清單 (按科目輪流分配)
 * @param {Array<{name: string, difficulty: number}>} subjects - 科目配置
 * @param {Array<number>} dayAllocations - 每科分配天數
 * @param {Date|string} startDate - 開始日期
 * @returns {Array<{date: string, subject: string, content: string, hours: number}>} 任務清單
 */
function generateDailyTasks(subjects, dayAllocations, startDate = new Date()) {
  const tasks = [];
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  
  // 為每科建立剩餘天數計數
  const remainingDays = [...dayAllocations];
  
  // 計算每科需要安排的具體日期
  const subjectDates = subjects.map((_, index) => {
    const daysToSchedule = remainingDays[index];
    const dates = [];
    
    // 按輪轉方式分配日期
    let dayOffset = 0;
    for (let i = 0; i < daysToSchedule; i++) {
      // 尋找下一個可用的日期（避免連續複習同一科）
      let attempts = 0;
      while (attempts < daysToSchedule + subjects.length) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + dayOffset);
        
        // 檢查該日期是否已被該科目使用
        const dateStr = currentDate.toISOString().split('T')[0];
        const isUsed = dates.some(d => d === dateStr);
        
        if (!isUsed) {
          dates.push(dateStr);
          dayOffset++;
          break;
        }
        dayOffset++;
        attempts++;
      }
    }
    
    return dates;
  });
  
  // 生成任務清單（按日期順序）
  const allTasks = [];
  subjects.forEach((subject, index) => {
    subjectDates[index].forEach(date => {
      allTasks.push({
        date: date,
        subject: subject.name,
        difficulty: subject.difficulty,
        dayIndex: index
      });
    });
  });
  
  // 按日期排序
  allTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 計算每天的學習時間分配
  const dailyHours = 3; // 預設每天 3 小時
  const tasksPerDay = {};
  
  allTasks.forEach(task => {
    if (!tasksPerDay[task.date]) {
      tasksPerDay[task.date] = [];
    }
    tasksPerDay[task.date].push(task);
  });
  
  // 生成最終任務列表
  Object.keys(tasksPerDay).forEach(date => {
    const dayTasks = tasksPerDay[date];
    const hoursPerTask = dailyHours / dayTasks.length;
    
    dayTasks.forEach(task => {
      tasks.push({
        date: task.date,
        subject: task.subject,
        content: `複習 ${task.subject} - 難度等級 ${task.difficulty}`,
        hours: Math.round(hoursPerTask * 10) / 10 // 四捨五入到小數點第一位
      });
    });
  });
  
  return tasks;
}

/**
 * 完整的讀書計畫生成函數 (主要 API)
 * @param {Object} input - 輸入參數
 * @param {Array<{name: string, difficulty: number}>} input.subjects - 科目配置
 * @param {string} input.examDate - 考試日期 (YYYY-MM-DD)
 * @param {string} [input.startDate] - 開始日期 (預設為今天)
 * @returns {Object} 生成的讀書計畫
 */
function generateStudyPlan(input) {
  const {
    subjects,
    examDate,
    startDate = new Date()
  } = input;
  
  // 驗證輸入
  if (!subjects || subjects.length === 0) {
    throw new Error('科目不能為空');
  }
  if (!examDate) {
    throw new Error('考試日期不能為空');
  }
  
  // 執行算法
  const totalDays = calculateTotalDays(examDate, startDate);
  const dayAllocations = allocateDaysByDifficulty(
    subjects.map(s => s.difficulty),
    totalDays
  );
  const tasks = generateDailyTasks(subjects, dayAllocations, startDate);
  
  return {
    id: generatePlanId(),
    title: `${subjects.map(s => s.name).join('、')} 考試複習計畫`,
    examDate: examDate,
    startDate: startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate,
    totalDays: totalDays,
    subjects: subjects,
    dayAllocations: dayAllocations,
    tasks: tasks,
    createdAt: new Date().toISOString()
  };
}

/**
 * 生成計畫 ID
 * @returns {string} 唯一的計畫 ID
 */
function generatePlanId() {
  return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
