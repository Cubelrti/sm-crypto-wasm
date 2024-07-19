import init, * as mod from "./pkg/index";
console.log("worker-index: init wasm");

worker.onMessage(function (message) {
  console.log(`received worker operation ${message.id}`)
  const { method, id, len } = message;
  let args = [];
  for (let i = 0; i < len; i++) {
    // determine what can be passed
    console.log(`message[${i}] is type ${Object.prototype.toString.call(message[i])} ${JSON.stringify(message[i])}`)
    if (__CONVERT_ARRAYBUFFER__ && message[i] instanceof ArrayBuffer) {
      args.push(new Uint8Array(message[i]));
    } else if (__CONVERT_ARRAY__ && Array.isArray(message[i])) {
      args.push(Uint8Array.from(message[i]));
    } else args.push(message[i]);
  }
  // if (__CONVERT_ARRAYBUFFER__) {
  //   // convert args arraybuffer to Uint8Array
  //   for (let i = 0; i < args.length; i++) {
  //     if (args[i] instanceof ArrayBuffer) {
  //       worker.postMessage({ id: -1, event: 'log', message: `received ArrayBuffer, converting back to Uint8Array`});
  //       args[i] = new Uint8Array(args[i]);
  //     }
  //   }
  // }
  // if (__CONVERT_ARRAY__) {
  //   // convert args array to Uint8Array
  //   for (let i = 0; i < args.length; i++) {
  //     console.log(`args[${i}] is type ${Object.prototype.toString.call(args[i])} ${JSON.stringify(args[i])}`)
  //     if (Array.isArray(args[i])) {
  //       worker.postMessage({ id: -1, event: 'log', message: `received Array, converting back to Uint8Array`});
  //       args[i] = Uint8Array.from(args[i]);
  //     }
  //   }
  // }
  let result = mod[method](...args);
  if (__CONVERT_ARRAYBUFFER__) {
    // convert result back
    if (result instanceof Uint8Array) {
      result = result.buffer;
    }
  }
  if (__CONVERT_ARRAY__) {
    // convert result back
    if (result instanceof Uint8Array) {
      result = Array.from(result);
    }
  }
  worker.postMessage({ id, result, type: Object.prototype.toString.call(result) });
});

console.log = function (...msg) {
  worker.postMessage({ id: -1, event: 'log', message: msg.filter(m => typeof m === 'string' || typeof m === 'number').join(' ')});
  // console.warn(msg)
}

init(WASM_BINARY_PATH).then(module => {
  console.log('module loaded successfully', module);
  worker.postMessage({ id: -1, event: 'ready' });
}).catch(e => {
  console.error('failed to load module', e);
})
