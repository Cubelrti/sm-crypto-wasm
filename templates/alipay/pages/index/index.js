import smCrypto from '../../sm-crypto';
function toHex(array) {
  return Array.prototype.map.call(array, x => ('00' + x.toString(16)).slice(-2)).join('');
}
Page({
  async tap() {
    // 页面加载
    console.info(`tap`);
    await smCrypto.initSMCrypto()

    const kp = await smCrypto.sm2.generateKeyPairHex()
    console.log(kp.publicKey, kp.privateKey)
    const compressed = await smCrypto.sm2.compressPublicKeyHex(kp.publicKey);
    this.pk = kp.publicKey
    console.log(compressed)
    const sm2Cbc = await smCrypto.sm2.encrypt(new Uint8Array(
      100
    ), kp.publicKey, {
      output: 'array'
    })
    console.log(toHex(sm2Cbc))
    const sm2Cbc2 = await smCrypto.sm2.encrypt(new Uint8Array([
      0xde, 0xad, 0xbe, 0xef
    ]), compressed, {
      output: 'array'
    })

    console.log(toHex(sm2Cbc2))

    // decrypt
    const sm2CbcD = await smCrypto.sm2.decrypt(sm2Cbc2, kp.privateKey, {
      output: 'string'
    })
    console.log(sm2CbcD)

    const sm3Result = await smCrypto.sm3(new Uint8Array([
      0xde, 0xad, 0xbe, 0xef
    ]))
    console.log(toHex(sm3Result))
    const sm4Result = await smCrypto.sm4.encrypt(new Uint8Array(16), new Uint8Array(16), {
      iv: new Uint8Array(16),
    })
    console.log(toHex(sm4Result))

  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});