import { SM2EncryptionOptions, SM2SignatureOptions, SM4EncryptionOptions } from './common'
import type * as mod from './pkg/index'
import { hexToBytes } from './utils'
type Mod = typeof mod
type ArgsType<T> = T extends (...args: infer U) => any ? U : never

let worker: any = null
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
          console.log(message)
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
        console.log(message)
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
// wrap all methods in mod
const sm2_generate_keypair = wrapMethod('sm2_generate_keypair')
const compress_public_key_hex = wrapMethod('compress_public_key_hex')
const sm2_encrypt = wrapMethod('sm2_encrypt')
const sm2_encrypt_hex = wrapMethod('sm2_encrypt_hex')
const sm2_decrypt = wrapMethod('sm2_decrypt')
const sm2_decrypt_hex = wrapMethod('sm2_decrypt_hex')
const sm2_sign = wrapMethod('sm2_sign')
const sm2_verify = wrapMethod('sm2_verify')
const init_rng_pool = wrapMethod('init_rng_pool')
const sm3 = wrapMethod('sm3')
const sm3_hmac = wrapMethod('sm3_hmac')
const sm4_encrypt = wrapMethod('sm4_encrypt')
const sm4_encrypt_hex = wrapMethod('sm4_encrypt_hex')
const sm4_decrypt = wrapMethod('sm4_decrypt')
const sm4_encrypt_gcm = wrapMethod('sm4_encrypt_gcm')
const sm4_decrypt_gcm = wrapMethod('sm4_decrypt_gcm')

interface SM2Options {
  cipherMode: 1 | 0
  asn1: boolean
  output: 'array' | 'string'
}
export default {
  initSMCrypto,
  _sm2: {
    generateKeyPairHex: sm2_generate_keypair,
    compressPublicKeyHex: compress_public_key_hex,
    encrypt(msg: Uint8Array | string, publicKey: string, options: SM2EncryptionOptions) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
      msg = typeof msg === 'string' ? hexToBytes(msg) : msg
      if (options.output === 'string') {
        return sm2_encrypt_hex(publicKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      } else {
        return sm2_encrypt(publicKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      }
    },
    decrypt(msg: Uint8Array | string, privateKey: string, options: SM2EncryptionOptions) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
      msg = typeof msg === 'string' ? hexToBytes(msg) : msg
      if (options.output === 'string') {
        return sm2_decrypt_hex(privateKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      } else {
        return sm2_decrypt(privateKey, msg, {
          asn1: options.asn1,
          c1c2c3: options.cipherMode === 0,
        })
      }
    },
    doSignature(msg: Uint8Array | string, privateKey: string, options: SM2SignatureOptions) {
      msg = typeof msg === 'string' ? hexToBytes(msg) : msg
      options = Object.assign({
        hash: true,
        der: true,
      }, options)
      return sm2_sign(privateKey, msg, options)
    },
    doVerifySignature(msg: Uint8Array | string, publicKey: string, signature: string, options: SM2SignatureOptions) {
      msg = typeof msg === 'string' ? hexToBytes(msg) : msg
      options = Object.assign({
        hash: true,
        der: true,
      }, options)
      return sm2_verify(publicKey, msg, signature, options)
    },
    initRNGPool: init_rng_pool,
  },
  get sm2() {
    return this._sm2
  },
  set sm2(value) {
    this._sm2 = value
  },
  sm3,
  hmac: sm3_hmac,
  sm4: {
    encrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions) {
      options = Object.assign({
        mode: 'cbc',
        padding: 'pkcs7',
        output: 'array'
      }, options)
      options.iv = options.iv ? 
        typeof options.iv === 'string' ? hexToBytes(options.iv) : options.iv
        : undefined
      key = typeof key === 'string' ? hexToBytes(key) : key
      if (options.output === 'string') {
        return sm4_encrypt_hex(data, key, {
          mode: options.mode,
          padding: options.padding,
          iv: options.iv,
        })
      }
      return sm4_encrypt(data, key, {
        mode: options.mode,
        padding: options.padding,
        iv: options.iv,
      })
    },
    decrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions) {
      options = Object.assign({
        mode: 'cbc',
        padding: 'pkcs7',
        output: 'array'
      }, options)
      options.iv = options.iv ? 
        typeof options.iv === 'string' ? hexToBytes(options.iv) : options.iv
        : undefined
      key = typeof key === 'string' ? hexToBytes(key) : key

      return sm4_decrypt(data, key, {
        mode: options.mode,
        padding: options.padding,
        iv: options.iv,
      })
    },
    gcm: {
      encrypt: sm4_encrypt_gcm,
      decrypt: sm4_decrypt_gcm,
    },
  },
}
