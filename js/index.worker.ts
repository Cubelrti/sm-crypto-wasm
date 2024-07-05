import type * as mod from './pkg/index'
type Mod = typeof mod
type ArgsType<T> = T extends (...args: infer U) => any ? U : never

let worker: any = null
let wasmInstance: any = null
declare const PLATFORM: {
  createWorker: (
    scriptPath: string,
    options: { useExperimentalWorker: boolean }
  ) => any
}
declare const __CONVERT_ARRAYBUFFER__: boolean
declare const WORKER_SCRIPT_PATH: string

function initSMCrypto() {
  const scriptPath = WORKER_SCRIPT_PATH // worker 的入口文件
  console.log('init smcrypto worker')
  return new Promise<void>((resolve, reject) => {
    try {
      worker = PLATFORM.createWorker(scriptPath, {
        useExperimentalWorker: true, // iOS下需开启实验 worker
      })
      worker.onMessage(({ id, event }) => {
        if (id === -1 && event === 'ready') {
          console.log('[sm-crypto] worker ready')
          resolve()
        }
      })
      worker.onProcessKilled?.(console.log)
    } catch (error) {
      console.warn(error)
      worker.terminate()
      reject(error)
    }
  })
}

let callbackId = 0

// a custom function to call the worker, using callbackId to act as a Promise
function wrapMethod<M extends keyof Mod>(
  method: M,
) {
  return (...args: ArgsType<Mod[M]>) => new Promise<ReturnType<Mod[M]>>((resolve, reject) => {
    const id = callbackId++
    const startTime = Date.now()
    // if (wasmInstance) {
    //   resolve(mod[method].call(wasmInstance, ...args))
    // }
    if (__CONVERT_ARRAYBUFFER__) {
      // convert Uint8Array to ArrayBuffer
      // @ts-ignore
      args = args.map((arg) => {
        if (arg instanceof Uint8Array) {
          return arg.buffer
        }
        return arg
      })
    }
    worker.postMessage({ id, method, args })
    worker.onMessage(({ id: responseId, result }) => {
      if (responseId === id) {
        const endTime = Date.now()
        console.log(`[sm-crypto] perf: ${method} took ${endTime - startTime}ms`)
        resolve(result)
      }
    })
  })
}

export default {
  initSMCrypto,
  sm2: {
    encrypt: wrapMethod('sm2_encrypt')
  },
  sm3: wrapMethod('sm3'),
  sm4: wrapMethod('sm4_encrypt'),
}
