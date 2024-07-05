import mod, { compress_public_key_hex, sm2_encrypt, sm2_generate_keypair, sm3, sm4_encrypt } from './pkg'

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
    encrypt: sm2_encrypt,
  },
  sm3,
  sm4: sm4_encrypt,
}
