# PixelShape

### [origin convicted202's Live Web demo](https://convicted202.github.io/PixelShape/)

Android iOS and Web pixel drawing tool.

## Android
`npm run android` to generate `android/app/build/outputs/apk/debug/app-debug.apk` for development.

`npm run build-worker-android` to generate `android/app/src/main/assets/threads/generateGif.worker.bundle` for production, if `generateGif.worker.js` is changed, need run this again.

`npm run build-android` to generate `android/app/build/outputs/apk/release/app-release.apk` for production.

`npm run bundle-android` to `android/app/build/outputs/bundle/release/app-release.aab` for production.

## Web
`npm run web` for development, then view it at [http://localhost:3000](http://localhost:3000) in web browser.

`npm run build-web` to generate files in `build/` for production, and can use `npx http-server build` to simply test it at [http://127.0.0.1:8080](http://127.0.0.1:8080) in web browser. (TODO: to let it works again since add Web Worker in 99b0eb0)

## Authors
* Alexander Yanovych
* Li Zheng <flyskywhy@gmail.com>

## Donate
To support my work, please consider donate.

- ETH: 0xd02fa2738dcbba988904b5a9ef123f7a957dbb3e

- <img src="https://raw.githubusercontent.com/flyskywhy/flyskywhy/main/assets/alipay_weixin.png" width="500">
