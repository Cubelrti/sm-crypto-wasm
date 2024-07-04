import smCrypto from '../../sm-crypto';
Page({
  async onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);

 },
 async tap() {
  await smCrypto.initSMCrypto()
  const sm2Result = await smCrypto.sm2()
  console.log(sm2Result)
  const sm3Result = await smCrypto.sm3()
  console.log(sm3Result)
  const sm4Result = await smCrypto.sm4('123', new Uint8Array(16), new Uint8Array(16))
  console.log(sm4Result)
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
