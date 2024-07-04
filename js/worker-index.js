import init, * as mod from "../pkg/index";
console.log("worker-index: init wasm");

worker.onMessage(function (message) {
  console.log('received worker operation', message);
  const { method, args, id } = message;
  if (__CONVERT_ARRAYBUFFER__) {
    // convert args arraybuffer to Uint8Array
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof ArrayBuffer) {
        args[i] = new Uint8Array(args[i]);
      }
    }
  }
  const result = mod[method](...args);
  worker.postMessage({ id, result });
});
init(WASM_BINARY_PATH).then(module => {
  console.log('module loaded successfully', module);
  worker.postMessage({ id: -1, event: 'ready' });
}).catch(e => {
  console.error('failed to load module', e);
})
