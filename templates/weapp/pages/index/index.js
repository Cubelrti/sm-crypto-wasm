// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import smCrypto from '../../sm-crypto/index'
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
    const sm3Result = smCrypto.sm3()
    console.log(sm3Result)
    const sm4Result = smCrypto.sm4('123', new Uint8Array(16), new Uint8Array(16))
    console.log(sm4Result)
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
