import mod, { compress_public_key_hex, init_rng_pool, sm2_decrypt, sm2_decrypt_hex, sm2_encrypt, sm2_encrypt_hex, sm2_generate_keypair, sm3, sm4_encrypt } from './pkg'

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
interface SM2Options {
  cipherMode: 1 | 0
  asn1: boolean
  output: 'array' | 'string'
}
export default {
  initSMCrypto,
  sm2: {
    generateKeyPairHex: sm2_generate_keypair,
    compressPublicKeyHex: compress_public_key_hex,
    encrypt(msg: Uint8Array, publicKey: string, options: SM2Options) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
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
    decrypt(msg: Uint8Array, privateKey: string, options: SM2Options) {
      options = Object.assign({
        cipherMode: 1,
        asn1: false,
        output: 'array'
      }, options)
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
    initRNGPool: init_rng_pool,
  },
  sm3,
  sm4: sm4_encrypt,
}
