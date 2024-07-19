
const app = getApp()
import smCrypto from '../../sm-crypto/index'

Page({
  data: {

  },
  onLoad: async function () {
    console.log(smCrypto)
    await smCrypto.initSMCrypto()

    const kp = smCrypto.sm2.generateKeyPairHex()
    console.log(kp)
    const compressed = smCrypto.sm2.compressPublicKeyHex(kp.publicKey);
    this.pk = kp.publicKey
    console.log(compressed)
    const sm2Cbc = smCrypto.sm2.encrypt(new Uint8Array(
      100 * 1000
    ), kp.publicKey, { output: 'array'})
    console.log(sm2Cbc)
    const sm2Cbc2 = smCrypto.sm2.encrypt(new Uint8Array([
      0xde, 0xad, 0xbe, 0xef
    ]), compressed, { output: 'array'})
    console.log(sm2Cbc2)
    // decrypt
    const sm2CbcD = smCrypto.sm2.decrypt(sm2Cbc2, kp.privateKey, {
      output: 'string'
    })
    console.log(sm2CbcD)
    const sm3Result = smCrypto.sm3(new Uint8Array([
      0xde, 0xad, 0xbe, 0xef
    ]))
    console.log(sm3Result)
    const sm4Result = smCrypto.sm4('123', new Uint8Array(16), new Uint8Array(16))
    console.log(sm4Result)

  },
})
