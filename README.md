# 登录 获取Cookie
playwright codegen --save-storage=auth.json https://juejin.cn/

# 加载页面
playwright codegen --load-storage=auth.json https://juejin.cn/

# 第一步
先执行`npm run login`获取登录信息（`auth.json`存储用户的登录信息）

# 第二步
再执行`npm run load`验证是否登录成功

# 第三步
最后执行`npm run start`启动项目

```js
// 启动参数
let opt = {
  pageUrl: 'https://juejin.cn/recommended', // 页面URL 必填
  apiUrl: 'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed', // 接口URL 必填
  delayTime: 3000, // 延时时间
  outDir: 'out', // 输出文件夹
  scrollStep: 3000, // 滚动步长 需要滚动到页面底部触发加载接口
  browserType: 'chromium', // 浏览器类型 chromium firefox webkit
}
```
