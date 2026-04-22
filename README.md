# unit_template_web

Reusable native WeChat Mini Program starter for projects that use a separate backend service.

## Included baseline

- native mini-program app shell
- login flow based on `wx.login`
- token and user storage helpers
- shared request wrapper with `401` redirect handling
- environment-aware API host selection
- sample CRUD pages under `pages/user`

## Starter setup

1. Open the project in WeChat DevTools.
2. Replace the placeholder `appid` in `project.config.json` with the appid of the new mini-program before real deployment.
3. Point the frontend at the target backend:
   - edit `config/env.js`
   - or set a custom local base URL for device testing
4. Replace the sample module under `pages/user` with the real business pages of the new project.

## API host strategy

The starter supports three host levels:

- built-in `dev` host for simulator use
- built-in `prod` host for release builds
- a `custom_base_url` local override for real-device debugging

Example for local device debugging:

```js
wx.setStorageSync('custom_base_url', 'http://192.168.1.10:8086');
```

Clear the override when no longer needed:

```js
wx.removeStorageSync('custom_base_url');
```

## Project rules

- Treat `pages/user` as sample code, not final business logic.
- Keep shared logic inside `config/`, `utils/`, and `api/`.
- Do not commit a production appid from a real project back into the starter.
