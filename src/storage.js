/**
 * 本地存儲層 - GUN.js 集成 (Storage Layer)
 * 
 * 負責將讀書計畫和用戶數據存儲到本地 GUN.js 數據庫
 * 支持離線優先的設計，所有數據在本地持久化
 */

/**
 * 初始化 GUN.js 並建立本地存儲引用
 * @returns {Object} GUN 數據庫實例
 */
function initializeGUN() {
  if (typeof Gun === 'undefined') {
    throw new Error('GUN.js 未正確加載，請檢查 CDN 連結');
  }
  
  // 初始化 GUN (本地存儲)
  const gun = Gun();
  return gun;
}

/**
 * 保存讀書計畫到本地存儲
 * @param {Object} plan - 讀書計畫對象
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Object>} 保存結果
 */
async function savePlanToStorage(plan, gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const gun = gunInstance || initializeGUN();
      
      gun.get('plans').get(plan.id).put(plan, (ack) => {
        if (ack.err) {
          reject(new Error('保存計畫失敗: ' + ack.err));
        } else {
          resolve({
            success: true,
            planId: plan.id,
            message: '計畫已保存'
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 從本地存儲讀取計畫
 * @param {string} planId - 計畫 ID
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Object>} 計畫對象
 */
async function loadPlanFromStorage(planId, gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const gun = gunInstance || initializeGUN();
      
      gun.get('plans').get(planId).once((data) => {
        if (data && data.id) {
          resolve(data);
        } else {
          reject(new Error('計畫不存在: ' + planId));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 取得所有計畫列表
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Array>} 計畫陣列
 */
async function getAllPlansFromStorage(gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const gun = gunInstance || initializeGUN();
      const plans = [];
      
      gun.get('plans').map().once((data) => {
        if (data && data.id) {
          plans.push(data);
        }
      });
      
      // 延遲以確保所有數據加載完成
      setTimeout(() => {
        resolve(plans);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 更新計畫中的任務完成狀態
 * @param {string} planId - 計畫 ID
 * @param {number} taskIndex - 任務索引
 * @param {boolean} completed - 完成狀態
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Object>} 更新結果
 */
async function updateTaskCompletionStatus(planId, taskIndex, completed, gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const gun = gunInstance || initializeGUN();
      
      gun.get('plans').get(planId).once((plan) => {
        if (!plan || !plan.tasks) {
          reject(new Error('計畫或任務不存在'));
          return;
        }
        
        // 更新任務完成狀態
        plan.tasks[taskIndex].completed = completed;
        
        gun.get('plans').get(planId).put(plan, (ack) => {
          if (ack.err) {
            reject(new Error('更新任務失敗: ' + ack.err));
          } else {
            resolve({
              success: true,
              planId: planId,
              taskIndex: taskIndex,
              completed: completed
            });
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 刪除計畫
 * @param {string} planId - 計畫 ID
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Object>} 刪除結果
 */
async function deletePlanFromStorage(planId, gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const gun = gunInstance || initializeGUN();
      
      gun.get('plans').get(planId).put(null, (ack) => {
        if (ack.err) {
          reject(new Error('刪除計畫失敗: ' + ack.err));
        } else {
          resolve({
            success: true,
            planId: planId,
            message: '計畫已刪除'
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 導出所有計畫為 JSON (便於備份和遷移)
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<string>} JSON 字串
 */
async function exportPlansAsJSON(gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      getAllPlansFromStorage(gunInstance).then(plans => {
        resolve(JSON.stringify(plans, null, 2));
      }).catch(error => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 導入計畫從 JSON (用於數據遷移)
 * @param {string} jsonData - JSON 字串
 * @param {Object} gunInstance - GUN 實例
 * @returns {Promise<Object>} 導入結果
 */
async function importPlansFromJSON(jsonData, gunInstance) {
  return new Promise((resolve, reject) => {
    try {
      const plans = JSON.parse(jsonData);
      const gun = gunInstance || initializeGUN();
      let importedCount = 0;
      
      if (!Array.isArray(plans)) {
        reject(new Error('JSON 格式不正確，應為陣列'));
        return;
      }
      
      plans.forEach(plan => {
        savePlanToStorage(plan, gun).then(() => {
          importedCount++;
          if (importedCount === plans.length) {
            resolve({
              success: true,
              importedCount: importedCount,
              message: `已導入 ${importedCount} 個計畫`
            });
          }
        }).catch(error => {
          reject(error);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
