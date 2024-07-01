let worker = null;

function initSMCrypto() {
  const scriptPath = 'sm-crypto/workers/sm-crypto.js'; // worker 的入口文件
  return new Promise((resolve, reject) => {
    try {
      worker = UNIFIED_PLATFORM.createWorker(scriptPath, {
        useExperimentalWorker: true // iOS下需开启实验 worker
      });
      worker.onMessage(({ id, event }) => {
        if (id === -1 && event === 'ready') {
          console.log('[sm-crypto] worker ready');
          resolve();
        }
      })
      worker.onProcessKilled(console.log)
    } catch (error) {
      console.warn(error)
      reject(error)
    }
  })

}
let callbackId = 0;

// a custom function to call the worker, using callbackId to act as a Promise
function invokeMethod(method, args) {
  return new Promise((resolve, reject) => {
    const id = callbackId++;
    const startTime = Date.now();
    worker.postMessage({ id, method, args });
    worker.onMessage(({ id: responseId, result }) => {
      if (responseId === id) {
        const endTime = Date.now();
        console.log(`[sm-crypto] perf: ${method} took ${endTime - startTime}ms`);
        resolve(result);
      }
    });
  });
}

function sm3() {
  return invokeMethod('sm3', [6666]);
}

function sm2() {
  return invokeMethod('sm2_encrypt', [6666]);

}

module.exports = {
  initSMCrypto,
  sm3,
  sm2,
}