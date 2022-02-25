# PixelShapeRN

Android iOS Web pixel drawing editor APP and sub-app that comes in handy when creating pixel art images and gif animations.

### [origin convicted202's Live Web demo](https://convicted202.github.io/PixelShape/)

## Android
`npm run android` to generate `android/app/build/outputs/apk/debug/app-debug.apk` for development.

`npm run build-worker-android` to generate `android/app/src/main/assets/threads/generateGif.worker.bundle` for production, if `generateGif.worker.js` is changed, need run this again.

`npm run build-android` to generate `android/app/build/outputs/apk/release/app-release.apk` for production.

`npm run bundle-android` to `android/app/build/outputs/bundle/release/app-release.aab` for production.

## iOS
`npm run build-worker-ios` to generate `ios/generateGif.worker.jsbundle` for production, if `generateGif.worker.js` is changed, need run this again.

## Web
`npm run web` for development, then view it at [http://localhost:3000](http://localhost:3000) in web browser.

`npm run build-web` to generate files in `build/` for production, and can use `npx http-server build` to simply test it at [http://127.0.0.1:8080](http://127.0.0.1:8080) in web browser. (TODO: to let it works again since add Web Worker in 99b0eb0)

## be embeded as sub-app
Ref to [Isolating Redux Sub-Apps](https://redux.js.org/usage/isolating-redux-sub-apps) and [Breaking out of Redux paradigm to isolate apps](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400), PixelShapeRN can be embeded into other react-native APP easily.

* `npm install pixelshapern` in `otherAPP/`.
* Add native component name e.g. `"@flyskywhy/react-native-gcanvas": "2.3.18",` into `otherAPP/package.json` so that they can be automatically linked by react-native.
* Copy `/generateGif.worker.js` into `otherAPP/`, and change './src/libs/gif/GIFEncoder' to 'pixelshapern/src/libs/gif/GIFEncoder' in it.
* Copy `build-worker-android` in `package.json` into `otherAPP/package.json` to generate `otherAPP/android/app/src/main/assets/threads/generateGif.worker.bundle` for production.
* Copy `build-worker-ios` in `package.json` into `otherAPP/package.json` to generate `otherAPP/ios/generateGif.worker.jsbundle` for production.
* Finally, in other APP, can embed PixelShapeRN as sub-app and customize it with e.g. defaultsPalette as described in `src/context.js` .
```
import PixelShapeRN from 'pixelshapern/src/index';
import {PixelShapeContext} from 'pixelshapern/src/context';
...
    <PixelShapeContext.Provider
      value={{
        defaultsPalette: [
          {color: '#ff0000'},
          {color: '#00ff00'},
          {color: '#0000ff'},
        ],
      }}>
      <PixelShapeRN />
    </PixelShapeContext.Provider>
```

## Authors
* Alexander Yanovych
* Li Zheng <flyskywhy@gmail.com>

## Donate
To support my work, please consider donate.

- ETH: 0xd02fa2738dcbba988904b5a9ef123f7a957dbb3e

- <img src="https://raw.githubusercontent.com/flyskywhy/flyskywhy/main/assets/alipay_weixin.png" width="500">
