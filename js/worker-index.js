import './shim-encoding';
import init, * as mod from "../pkg/index";
worker.onMessage(function (message) {
  console.log('received worker operation', message);
  const { method, args, id } = message;
  const result = mod[method](...args);
  worker.postMessage({ id, result });
});
init("/sm-crypto/crypto.wasm").then(module => {
  console.log('module loaded successfully', module);
  worker.postMessage({ id: -1, event: 'ready' });
}).catch(console.error)
