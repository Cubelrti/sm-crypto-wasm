import { SM2EncryptionOptions, SM2SignatureOptions, SM4EncryptionOptions } from './common'
import mod, { compress_public_key_hex, init_rng_pool, sm2_decrypt, sm2_decrypt_hex, sm2_encrypt, sm2_encrypt_hex, sm2_generate_keypair, sm2_sign, sm2_verify, sm3, sm3_hmac, sm4_decrypt, sm4_encrypt, sm4_encrypt_gcm, sm4_encrypt_hex } from './pkg'
import { hexToBytes } from './utils'
export type Mod = typeof mod
type ArgsType<T> = T extends (...args: infer U) => any ? U : never

let wasmInstance: any = null

async function initSMCrypto() {
  // 直接创建，不经过 worker
  if (wasmInstance) return
  try {
    const instance = await mod('/sm-crypto/crypto.wasm')
    console.log('init sm-crypto-wasm direct success', instance)
    wasmInstance = instance
  } catch (error) {
    console.log('init sm-crypto-wasm direct failed', error)
    wasmInstance = null
  }
}
export default {
  initSMCrypto,
  sm2: {
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
    gcm: sm4_encrypt_gcm,
  },
}
