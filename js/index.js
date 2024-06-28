import './shim-encoding';
import init, { sm3 } from "../pkg/index";
worker.onMessage(function (message) {
  console.log('收到来自主线程的消息', message);
  const res = sm3(6666)
  console.log('res', res)
  worker.postMessage({ res })
});
init("/index_bg.wasm").then(module => {
  const res = sm3(6666)
  console.log('res', res)
  worker.postMessage(res)
}).catch(console.error)