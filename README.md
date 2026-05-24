# unit_template_web

一个可复用的原生微信小程序模板，目标是让后续轻量级小程序项目尽量少做重复基础工作。

## 当前模板能力

- 微信登录页，支持开发环境 `openId` mock 登录
- 统一请求封装，自动带 token，401 自动回到登录页
- `dev / trial / release` 运行环境识别
- 本地 API 地址覆盖，联调时不用反复改源码
- 公共安全区/导航栏布局工具
- 可复用底部导航组件
- 一个完整的用户 CRUD 示例页，方便按模块克隆

## 目录建议

```text
config/
  app.js          模板级常量
  env.js          环境和 API 地址解析
components/
  bottom-tab/     可复用底部导航
utils/
  auth.js         登录态存取
  guard.js        登录守卫和退出逻辑
  layout.js       安全区和导航栏高度
pages/
  home/           模板工作台
  login/          登录页
  profile/        会话与环境信息
  user/           示例业务模块
```

## 初始化步骤

1. 在微信开发者工具中打开本目录。
2. 把 `project.config.json` 里的 `appid` 换成你自己的小程序 `appid`。
3. 本地联调时，默认后端地址是 `http://127.0.0.1:8086`。
4. 如果真机或局域网联调地址不同，在登录页直接填写新的本地接口地址并保存即可。
5. 新项目开始时，优先保留 `config/`、`utils/`、`components/`，把 `pages/user/` 当作示例业务替换掉。

## 复用建议

- 以后每加一个业务模块，优先照着 `pages/user/` 复制一套再改字段和接口。
- 环境切换和 token 逻辑尽量不要散落到页面里，统一走 `config/env.js` 和 `utils/request.js`。
- 如果新增新的公共布局，先抽到 `utils/layout.js` 或 `components/`，再复用到页面。
