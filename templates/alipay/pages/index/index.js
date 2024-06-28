Page({
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    const scriptPath = 'workers/index.js'; // worker 的入口文件
    try {
      this.worker = my.createWorker(scriptPath, {
        useExperimentalWorker: true // iOS下需开启实验 worker
      });
      console.log(this.worker)
      this.worker.onMessage(msg => {
        console.log('onMessage', msg)
      })
      this.worker.onProcessKilled(console.log)
    } catch (error) {
      console.warn(error)
    }
  },
  sendMsg() {
    this.worker.postMessage({
      text: 'hello'
    });
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
