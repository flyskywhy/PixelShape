# PixelShape

[![Build Status](https://travis-ci.org/Convicted202/PixelShape.svg?branch=master)](https://travis-ci.org/Convicted202/PixelShape)
[![Coverage Status](https://coveralls.io/repos/github/Convicted202/PixelShape/badge.svg?branch=master)](https://coveralls.io/github/Convicted202/PixelShape?branch=master)

### [Live demo](https://convicted202.github.io/PixelShape/)

Android iOS and Web pixel drawing tool.

## Android
`npm run android` to generate `android/app/build/outputs/apk/debug/app-debug.apk` for development.

`npm run build-worker-android` to generate `android/app/src/main/assets/threads/generateGif.worker.bundle` for production, if `generateGif.worker.js` is changed, need run this again.

`npm run build-android` to generate `android/app/build/outputs/apk/release/app-release.apk` for production.

`npm run bundle-android` to `android/app/build/outputs/bundle/release/app-release.aab` for production.

## Web

`npm run web` for development, then view it at [http://localhost:3000](http://localhost:3000) in web browser

`npm run build-web` to generate files in `build/` for production, and can use `npx http-server build` to simply test it at [http://127.0.0.1:8080](http://127.0.0.1:8080) in web browser
