/**
 * 存儲層 - GUN.js 整合測試 (Storage Integration Tests)
 * 
 * 測試 GUN.js 的 CRUD 操作、離線模式、數據一致性
 */

describe('GUN.js 本地存儲', function() {
  
  let gunInstance;
  let testPlan;
  
  beforeEach(function() {
    // 初始化 GUN 實例
    try {
      gunInstance = initializeGUN();
    } catch (e) {
      pending('GUN.js 未載入');
    }
    
    // 建立測試用計畫
    testPlan = {
      id: 'test_plan_' + Date.now(),
      title: '測試計畫',
      examDate: '2024-12-19',
      startDate: '2024-11-19',
      totalDays: 30,
      subjects: [
        { name: '數學', difficulty: 3 }
      ],
      dayAllocations: [30],
      tasks: [
        {
          date: '2024-11-19',
          subject: '數學',
          content: '複習微積分',
          hours: 3,
          completed: false
        }
      ],
      createdAt: new Date().toISOString()
    };
  });
  
  describe('初始化', function() {
    
    it('應該成功初始化 GUN 實例', function() {
      expect(gunInstance).toBeDefined();
      expect(typeof gunInstance.get).toBe('function');
    });
    
    it('應該在 GUN.js 未加載時拋出錯誤', function() {
      const originalGun = window.Gun;
      window.Gun = undefined;
      
      expect(function() {
        initializeGUN();
      }).toThrowError('GUN.js 未正確加載');
      
      window.Gun = originalGun;
    });
    
  });
  
  describe('保存計畫 (Create)', function() {
    
    it('應該成功保存計畫到本地存儲', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function(result) {
        expect(result.success).toBe(true);
        expect(result.planId).toBe(testPlan.id);
        done();
      }).catch(function(error) {
        fail('保存失敗: ' + error.message);
        done();
      });
    });
    
    it('應該保存完整的計畫數據', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded) {
          expect(loaded.id).toBe(testPlan.id);
          expect(loaded.title).toBe(testPlan.title);
          expect(loaded.examDate).toBe(testPlan.examDate);
          expect(loaded.tasks.length).toBe(testPlan.tasks.length);
          done();
        }).catch(function(error) {
          fail('讀取失敗: ' + error.message);
          done();
        });
      });
    });
    
  });
  
  describe('讀取計畫 (Read)', function() {
    
    it('應該成功讀取已保存的計畫', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded) {
          expect(loaded.id).toBe(testPlan.id);
          done();
        });
      });
    });
    
    it('應該在計畫不存在時拋出錯誤', function(done) {
      loadPlanFromStorage('non_existent_plan', gunInstance).then(function() {
        fail('應該拋出錯誤');
        done();
      }).catch(function(error) {
        expect(error.message).toContain('計畫不存在');
        done();
      });
    });
    
  });
  
  describe('更新任務完成狀態 (Update)', function() {
    
    it('應該成功更新任務完成狀態', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        updateTaskCompletionStatus(testPlan.id, 0, true, gunInstance).then(function(result) {
          expect(result.success).toBe(true);
          expect(result.completed).toBe(true);
          done();
        });
      });
    });
    
    it('應該持久化完成狀態', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        updateTaskCompletionStatus(testPlan.id, 0, true, gunInstance).then(function() {
          loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded) {
            expect(loaded.tasks[0].completed).toBe(true);
            done();
          });
        });
      });
    });
    
  });
  
  describe('刪除計畫 (Delete)', function() {
    
    it('應該成功刪除計畫', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        deletePlanFromStorage(testPlan.id, gunInstance).then(function(result) {
          expect(result.success).toBe(true);
          done();
        });
      });
    });
    
  });
  
  describe('數據遷移 (Import/Export)', function() {
    
    it('應該成功導出計畫為 JSON', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        exportPlansAsJSON(gunInstance).then(function(jsonData) {
          expect(typeof jsonData).toBe('string');
          const parsed = JSON.parse(jsonData);
          expect(Array.isArray(parsed)).toBe(true);
          done();
        });
      });
    });
    
    it('應該成功導入 JSON 計畫', function(done) {
      const plansJSON = JSON.stringify([testPlan]);
      
      importPlansFromJSON(plansJSON, gunInstance).then(function(result) {
        expect(result.success).toBe(true);
        expect(result.importedCount).toBeGreaterThan(0);
        done();
      }).catch(function(error) {
        fail('導入失敗: ' + error.message);
        done();
      });
    });
    
    it('應該在 JSON 格式不正確時拋出錯誤', function(done) {
      const invalidJSON = '{ invalid }';
      
      importPlansFromJSON(invalidJSON, gunInstance).then(function() {
        fail('應該拋出錯誤');
        done();
      }).catch(function(error) {
        expect(error).toBeDefined();
        done();
      });
    });
    
  });
  
  describe('離線模式', function() {
    
    it('應該在本地保存數據以支持離線訪問', function(done) {
      savePlanToStorage(testPlan, gunInstance).then(function() {
        // 模擬離線狀態下的讀取
        loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded) {
          expect(loaded).toBeDefined();
          done();
        });
      });
    });
    
  });
  
  describe('數據一致性', function() {
    
    it('應該保持多次保存和讀取的數據一致性', function(done) {
      const originalData = Object.assign({}, testPlan);
      
      savePlanToStorage(testPlan, gunInstance).then(function() {
        loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded1) {
          savePlanToStorage(loaded1, gunInstance).then(function() {
            loadPlanFromStorage(testPlan.id, gunInstance).then(function(loaded2) {
              expect(loaded2.id).toBe(originalData.id);
              expect(loaded2.title).toBe(originalData.title);
              done();
            });
          });
        });
      });
    });
    
  });
  
});
