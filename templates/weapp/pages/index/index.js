// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import smCrypto from '../../sm-crypto/index'

function hexToBytes(str) {
  const bytes = []
  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.substr(i, 2), 16))
  }
  return new Uint8Array(bytes)
}
function bytesToHex(bytes) {
  return Array.prototype.map.call(bytes, x => ('00' + x.toString(16)).slice(-2)).join('')
}
function concatArray(arrays) {
  // sum of individual array lengths
  let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

  if (!arrays.length) return null;

  let result = new Uint8Array(totalLength);

  // for each array - copy it over result
  // next array is copied right after the previous one
  let length = 0;
  for (let array of arrays) {
    result.set(array, length);
    length += array.length;
  }

  return result;
}
Page({
  async onLoad() {
    await smCrypto.initSMCrypto()

    await new Promise(rs => {
      wx.getRandomValues({
        length: 32,
        success(res) {
          console.log(res.randomValues)
          smCrypto.sm2.initRNGPool(new Uint8Array(res.randomValues));
          rs()
        }
      })
    })
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
    const deadbeef = new Uint8Array([
      0xde, 0xad, 0xbe, 0xef
    ])
    const sm3Result = smCrypto.sm3(deadbeef)
    console.log(sm3Result)
    const sign = smCrypto.sm2.doSignature(deadbeef, "00ba60c0eb75a0bfade88abe8ec0467a438078a6d82a1e9ba49a309f09ae12c6", { hash: true, der: false})
    console.log(sign)
    const verify = smCrypto.sm2.doVerifySignature(deadbeef, "046d9e13b362da45fc702f14d4d8aa5c90ae2b1815108787d4814d61f4730cae2aa080d3ba15dd10562b3c7145ea8ab2adee4b2bd848e563528841dffed560c76d", sign, { hash: true, der: false})
    console.log('verify', verify)

    const sm4Result = smCrypto.sm4.encrypt(deadbeef, '0123456789ABCDEFFEDCBA9876543210', {
       mode: 'cbc',
       iv: 'fedcba98765432100123456789abcdef',
       output: 'string'
    })
    console.log(sm4Result)
    const gcm = smCrypto.sm4.gcm(
      deadbeef, 
      hexToBytes("0123456789ABCDEFFEDCBA9876543210"),
      hexToBytes("00001234567800000000ABCD"),
      hexToBytes("FEEDFACEDEADBEEFFEEDFACEDEADBEEFABADDAD2")
    )
    console.log(bytesToHex(gcm))
    global.smCrypto = smCrypto
  },
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  perf() {
    // sm2Enc-sm4Enc-sm3Hmac
    const time = Date.now()
    const sm2Enc = smCrypto.sm2.encrypt(new Uint8Array(32), this.pk, { output: 'array'})
    const sm4Enc = smCrypto.sm4.encrypt(new Uint8Array(500 * 1000), new Uint8Array(16), new Uint8Array(16))
    const tag = smCrypto.hmac(new Uint8Array(16), concatArray([
      sm2Enc,
      sm4Enc,
    ]))
    console.log({
      tag, sm4Enc, sm2Enc,
      time: Date.now() - time
    })
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})
