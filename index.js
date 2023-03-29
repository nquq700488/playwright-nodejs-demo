const Playwright = require('./src')

let opt = {
  pageUrl: 'https://juejin.cn/recommended',
  apiUrl: 'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
  delayTime: 3000,
  outDir: 'out',
  scrollStep: 3000,
  browserType: 'chromium', // chromium firefox webkit
}

init()

async function init() {
  // 实例
  const playwright = new Playwright(opt)

  // 初始化并启动
  await playwright.init()
  await playwright.start()

  // 10s后写入文件并停止
  setTimeout(async () => {
    await playwright.writeFile()
    await playwright.stop()
  }, 10 * 1000)
}
