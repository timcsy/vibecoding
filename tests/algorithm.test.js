/**
 * 讀書計畫生成算法 - 單元測試 (Algorithm Unit Tests)
 * 
 * 使用 Jasmine 框架進行測試
 * 測試涵蓋：天數計算、難度分配、任務生成、邊界情況
 */

describe('讀書計畫生成算法', function() {
  
  describe('calculateTotalDays 函數', function() {
    
    it('應該正確計算兩個日期之間的天數', function() {
      const startDate = '2024-11-19';
      const examDate = '2024-12-19';
      const result = calculateTotalDays(examDate, startDate);
      expect(result).toBe(30);
    });
    
    it('應該處理同一天的情況 (0 天)', function() {
      const date = '2024-11-19';
      const result = calculateTotalDays(date, date);
      expect(result).toBe(0);
    });
    
    it('應該處理相鄰天數 (1 天)', function() {
      const startDate = '2024-11-19';
      const examDate = '2024-11-20';
      const result = calculateTotalDays(examDate, startDate);
      expect(result).toBe(1);
    });
    
    it('應該處理長期間複習 (90 天)', function() {
      const startDate = '2024-08-21';
      const examDate = '2024-11-19';
      const result = calculateTotalDays(examDate, startDate);
      expect(result).toBe(90);
    });
    
    it('應該在日期反向時返回 0', function() {
      const startDate = '2024-12-19';
      const examDate = '2024-11-19';
      const result = calculateTotalDays(examDate, startDate);
      expect(result).toBe(0);
    });
    
  });
  
  describe('allocateDaysByDifficulty 函數', function() {
    
    it('應該根據難度比例分配天數', function() {
      const difficulties = [4, 3, 2];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      // 難度總和 = 9, 所以分配: 30*4/9=13, 30*3/9=10, 30*2/9=7
      expect(result[0]).toBe(13);
      expect(result[1]).toBe(10);
      expect(result[2]).toBe(7);
    });
    
    it('應該處理相等難度的情況', function() {
      const difficulties = [3, 3, 3];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      expect(result[0]).toBe(10);
      expect(result[1]).toBe(10);
      expect(result[2]).toBe(10);
    });
    
    it('應該處理單科情況', function() {
      const difficulties = [5];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      expect(result[0]).toBe(30);
    });
    
    it('應該處理難度為 0 的情況', function() {
      const difficulties = [0, 0, 0];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(0);
    });
    
    it('應該返回空陣列當輸入為空', function() {
      const difficulties = [];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      expect(result.length).toBe(0);
    });
    
    it('應該處理難度差異很大的情況', function() {
      const difficulties = [5, 1];
      const totalDays = 30;
      const result = allocateDaysByDifficulty(difficulties, totalDays);
      
      // 難度總和 = 6, 所以分配: 30*5/6=25, 30*1/6=5
      expect(result[0]).toBe(25);
      expect(result[1]).toBe(5);
    });
    
  });
  
  describe('generateDailyTasks 函數', function() {
    
    it('應該生成正確數量的任務', function() {
      const subjects = [
        { name: '數學', difficulty: 3 },
        { name: '英文', difficulty: 3 }
      ];
      const dayAllocations = [5, 5];
      const result = generateDailyTasks(subjects, dayAllocations, '2024-11-19');
      
      // 應該有 10 個任務 (5 個數學 + 5 個英文)
      expect(result.length).toBe(10);
    });
    
    it('應該按日期排序任務', function() {
      const subjects = [
        { name: '數學', difficulty: 3 },
        { name: '英文', difficulty: 3 }
      ];
      const dayAllocations = [3, 3];
      const result = generateDailyTasks(subjects, dayAllocations, '2024-11-19');
      
      // 驗證任務按日期排序
      for (let i = 1; i < result.length; i++) {
        expect(new Date(result[i].date) >= new Date(result[i-1].date)).toBe(true);
      }
    });
    
    it('應該包含正確的任務屬性', function() {
      const subjects = [{ name: '數學', difficulty: 3 }];
      const dayAllocations = [1];
      const result = generateDailyTasks(subjects, dayAllocations, '2024-11-19');
      
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('subject');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('hours');
    });
    
    it('應該合理分配每天的學習時間', function() {
      const subjects = [
        { name: '數學', difficulty: 3 },
        { name: '英文', difficulty: 3 }
      ];
      const dayAllocations = [1, 1];
      const result = generateDailyTasks(subjects, dayAllocations, '2024-11-19');
      
      // 第一天應該有 2 個任務，每個 1.5 小時
      const firstDayTasks = result.filter(t => t.date === result[0].date);
      expect(firstDayTasks.length).toBe(2);
      expect(firstDayTasks[0].hours + firstDayTasks[1].hours).toBe(3);
    });
    
  });
  
  describe('generateStudyPlan 函數', function() {
    
    it('應該生成完整的讀書計畫', function() {
      const input = {
        subjects: [
          { name: '數學', difficulty: 4 },
          { name: '英文', difficulty: 3 }
        ],
        examDate: '2024-12-19',
        startDate: '2024-11-19'
      };
      const result = generateStudyPlan(input);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('examDate');
      expect(result).toHaveProperty('totalDays');
      expect(result).toHaveProperty('subjects');
      expect(result).toHaveProperty('tasks');
      expect(result).toHaveProperty('createdAt');
    });
    
    it('應該在科目為空時拋出錯誤', function() {
      const input = {
        subjects: [],
        examDate: '2024-12-19'
      };
      
      expect(function() {
        generateStudyPlan(input);
      }).toThrowError('科目不能為空');
    });
    
    it('應該在考試日期為空時拋出錯誤', function() {
      const input = {
        subjects: [{ name: '數學', difficulty: 3 }],
        examDate: null
      };
      
      expect(function() {
        generateStudyPlan(input);
      }).toThrowError('考試日期不能為空');
    });
    
    it('應該生成唯一的計畫 ID', function() {
      const input = {
        subjects: [{ name: '數學', difficulty: 3 }],
        examDate: '2024-12-19'
      };
      
      const plan1 = generateStudyPlan(input);
      const plan2 = generateStudyPlan(input);
      
      expect(plan1.id).not.toBe(plan2.id);
    });
    
    it('應該正確計算計畫中的總天數', function() {
      const input = {
        subjects: [{ name: '數學', difficulty: 3 }],
        examDate: '2024-12-19',
        startDate: '2024-11-19'
      };
      const result = generateStudyPlan(input);
      
      expect(result.totalDays).toBe(30);
    });
    
  });
  
  describe('邊界情況測試', function() {
    
    it('應該處理只有 1 天複習時間的情況', function() {
      const input = {
        subjects: [
          { name: '數學', difficulty: 3 },
          { name: '英文', difficulty: 3 }
        ],
        examDate: '2024-11-20',
        startDate: '2024-11-19'
      };
      
      expect(function() {
        generateStudyPlan(input);
      }).not.toThrow();
    });
    
    it('應該處理 100+ 天複習時間的情況', function() {
      const input = {
        subjects: [
          { name: '數學', difficulty: 4 },
          { name: '英文', difficulty: 3 },
          { name: '歷史', difficulty: 2 }
        ],
        examDate: '2025-02-27',
        startDate: '2024-11-19'
      };
      
      const result = generateStudyPlan(input);
      expect(result.totalDays).toBeGreaterThan(100);
      expect(result.tasks.length).toBeGreaterThan(0);
    });
    
    it('應該處理 5 個以上科目的情況', function() {
      const input = {
        subjects: [
          { name: '數學', difficulty: 3 },
          { name: '英文', difficulty: 3 },
          { name: '歷史', difficulty: 3 },
          { name: '地理', difficulty: 3 },
          { name: '物理', difficulty: 3 },
          { name: '化學', difficulty: 3 }
        ],
        examDate: '2024-12-19',
        startDate: '2024-11-19'
      };
      
      const result = generateStudyPlan(input);
      expect(result.subjects.length).toBe(6);
      expect(result.tasks.length).toBeGreaterThan(0);
    });
    
  });
  
});
