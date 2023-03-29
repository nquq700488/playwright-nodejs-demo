const playwright = require('playwright')
const fs = require('fs-extra')

class Playwright {
  constructor(opt = {}) { // pageUrl apiUrl outDir delayTime scrollStep
    this.browser = null
    this.page = null
    this.context = null
    this.pageUrl = opt.pageUrl || ''
    this.apiUrl = opt.apiUrl || ''
    this.timer = null
    this.delayTime = opt.delayTime || 3000
    this.allData = []
    this.outDir = opt.outDir || 'out'
    this.scrollStep = opt.scrollStep || 3000
    this.scrollH = this.scrollStep
    this.browserType = opt.browserType || 'chromium' // chromium firefox webkit
  }

  async init() {
    if (this.pageUrl && this.apiUrl) {
      this.browser = await playwright[this.browserType].launch({ headless: false })

      if (await fs.exists('src/auth.json')) { // 登录信息存在
        this.context = await this.browser.newContext({ storageState: 'src/auth.json' })
        this.page = await this.context.newPage()
      } else {
        this.context = await this.browser.newContext()
        this.page = await this.browser.newPage()
      }

      await this.page.goto(this.pageUrl)
      this.page.on('response', this.onResponse)
    } else {
      console.log('pageUrl 和 apiUrl 不能为空')
    }
  }

  start() {
    if (!this.page) {
      console.log('请先初始化！')
      return false
    }
    if (this.timer) return false
    this.timer = setInterval(() => {
      // page.getByRole('link', { name: '下一页' }).click() // 点击下一页

      this.page.mouse.wheel(0, this.scrollH) // 滚动到页面底部加载下一页
      this.scrollH += this.scrollStep
    }, this.delayTime)
  }

  stop() {
    clearInterval(this.timer)
    this.timer = null
    this.allData = []
    this.browser.close()
  }

  writeFile(data = this.allData) {
    return new Promise((resolve, reject) => {
      // 是否存在该文件夹，不存在则创建
      fs.ensureDir(this.outDir).then(() => {
        fs.writeFile(`${this.outDir}/${this.formatDate()}.json`, JSON.stringify(data),err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

   onResponse = (response) => {
    if (response.url().includes(this.apiUrl)) {
      response.body().then(async res => {
        const jsonData = JSON.parse(Buffer.from(res))
        const data = jsonData.data || []

        if (data.length > 0) {
          this.allData = this.allData.concat(data)
        } else { // 如果没有数据，保存数据并停止
          await this.writeFile()
          await this.stop()
        }
      })
    }
  }

  formatDate() {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const M = date.getMinutes()
    const s = date.getSeconds()
    return `${y}-${this.addZero(m)}-${this.addZero(d)} ${this.addZero(h)}:${this.addZero(M)}:${this.addZero(s)}`
  }

  addZero(num) {
    return num >= 10 ? num : `0${num}`
  }
}

module.exports = Playwright
