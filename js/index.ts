import type * as mod from '../pkg/index'
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
declare const __IS_WEAPP__: boolean
declare const WORKER_SCRIPT_PATH: string

function initSMCrypto() {
  const scriptPath = WORKER_SCRIPT_PATH // worker 的入口文件
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

// async function initSMCryptoDirect() {
//   // 直接创建，不经过 worker
//   const instance = await mod.default("/sm-crypto/crypto.wasm")
//   console.log("init sm-crypto-wasm direct success")
//   wasmInstance = instance
// }

let callbackId = 0

// a custom function to call the worker, using callbackId to act as a Promise
function invokeMethod<M extends keyof Mod>(
  method: M,
  ...args: ArgsType<Mod[M]>
): Promise<ReturnType<Mod[M]>> {
  return new Promise((resolve, reject) => {
    const id = callbackId++
    const startTime = Date.now()
    // if (wasmInstance) {
    //   resolve(mod[method].call(wasmInstance, ...args))
    // }
    if (__IS_WEAPP__) {
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

function sm3() {
  return invokeMethod('sm3')
}

function sm2() {
  return invokeMethod('sm2_encrypt')
}
function sm4(input: string, key: Uint8Array, iv: Uint8Array) {
  return invokeMethod('sm4_encrypt', input, key, iv)
}
export default {
  initSMCrypto,
  sm2,
  sm3,
  sm4,
}
