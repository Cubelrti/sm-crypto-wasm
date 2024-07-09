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
declare const __CONVERT_ARRAY__: boolean
declare const WORKER_SCRIPT_PATH: string

function initSMCrypto() {
  const scriptPath = WORKER_SCRIPT_PATH // worker 的入口文件
  console.log('init smcrypto worker')
  return new Promise<void>((resolve, reject) => {
    try {
      worker = PLATFORM.createWorker(scriptPath, {
        useExperimentalWorker: true, // iOS下需开启实验 worker
      })
      worker.onMessage(({ id, event, message }) => {
        if (id === -1 && event === 'ready') {
          console.log('[sm-crypto] worker ready')
          resolve()
        }
        if (id === -1 && event === 'log') {
          console.warn(message)
        }
      })
      worker.onProcessKilled?.((err) => {
        console.warn('[sm-crypto] worker process killed', err)
      })
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

    // create message layout
    // since alipay has very poor support on Workers
    // message, array inside array is not supported
    // and many quirks with arraybuffer
    // we need to create a flat message layout
    let msg: any = {};

    const argLen = args.length

    msg.len = args.length
    msg.method = method
    msg.id = id
    for (let i = 0; i < argLen; i++) {
      if (__CONVERT_ARRAYBUFFER__) {
        let arg = args[i]
        if (arg instanceof Uint8Array) {
          msg[i] = arg.buffer
        } else msg[i] = arg
      } else if (__CONVERT_ARRAY__) {
        let arg = args[i]
        if (arg instanceof Uint8Array) {
          msg[i] = Array.from(arg)
        } else msg[i] = arg
      }
    }


    console.log(`[sm-crypto] call method: ${method}, id: ${id}`)
    let timeout = setTimeout(() => {
      reject(new Error(`timeout for id: ${id}`))
    }, 1000) 
    worker.onMessage((data) => {
      let { id: responseId, event, message, result, type } = data
      if (responseId === -1 && event === 'log') {
        console.warn(message)
      }
      if (responseId === id) {
        clearTimeout(timeout)

        const endTime = Date.now()
        console.log(`[sm-crypto] perf: ${method} took ${endTime - startTime}ms, id: ${id}`)
        if (__CONVERT_ARRAY__) {
          // back to Uint8Array
          if (Array.isArray(result)) {
            result = new Uint8Array(result)
          }
        }

        resolve(result)
      }
    })
    worker.postMessage(msg)

  })
}
interface SM2Options {
  cipherMode: 1 | 0
  asn1: boolean
  output: 'array' | 'string'
}
export default {
  // initSMCrypto,
  // sm2: {
  //   encrypt: wrapMethod('sm2_encrypt')
  // },
  // sm3: wrapMethod('sm3'),
  // sm4: wrapMethod('sm4_encrypt'),
  initSMCrypto,
  sm2: {
    generateKeyPairHex: wrapMethod('sm2_generate_keypair'),
    compressPublicKeyHex: wrapMethod('compress_public_key_hex'),
    encrypt(msg: Uint8Array, publicKey: string, options: SM2Options) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
      if (options.output === 'string') {
        return wrapMethod('sm2_encrypt_hex')(publicKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      } else {
        return wrapMethod('sm2_encrypt')(publicKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      }
    },
    decrypt(msg: Uint8Array, privateKey: string, options: SM2Options) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
      if (options.output === 'string') {
        return wrapMethod('sm2_decrypt_hex')(privateKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      } else {
        return wrapMethod('sm2_decrypt')(privateKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      }

    },
    initRNGPool: wrapMethod('init_rng_pool'),
  },
  sm3: wrapMethod('sm3'),
  hmac: wrapMethod('sm3_hmac'),
  sm4: wrapMethod('sm4_encrypt'),
}
