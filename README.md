# PixelShapeRN

[![npm version](http://img.shields.io/npm/v/pixelshapern.svg?style=flat-square)](https://npmjs.org/package/pixelshapern "View this project on npm")
[![npm downloads](http://img.shields.io/npm/dm/pixelshapern.svg?style=flat-square)](https://npmjs.org/package/pixelshapern "View this project on npm")
[![npm licence](http://img.shields.io/npm/l/pixelshapern.svg?style=flat-square)](https://npmjs.org/package/pixelshapern "View this project on npm")
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-989898.svg?style=flat-square)](https://npmjs.org/package/pixelshapern "View this project on npm")

Android iOS Web pixel drawing editor APP and sub-app that comes in handy when creating pixel art images and gif animations.

<img src="https://raw.githubusercontent.com/flyskywhy/PixelShapeRN/master/assets/PixelShapeRN.gif" width="480">

### [Live Web demo](https://flyskywhy.github.io/PixelShapeRN/)

## Android
`npm run android` to generate `android/app/build/outputs/apk/debug/app-debug.apk` for development.

`npm run build-android` to generate `android/app/build/outputs/apk/release/app-release.apk` for production.

`npm run bundle-android` to `android/app/build/outputs/bundle/release/app-release.aab` for production.

## Web
`npm run web` for development, then view it at [http://localhost:3000](http://localhost:3000) in web browser.

[fix: with react-native-web product build](https://github.com/RonRadtke/react-native-blob-util/pull/201) manually that add `node_modules/react-native-blob-util/index.web.js` and edit `node_modules/react-native-blob-util/package.json` before `npm run build-web`, otherwise will `export 'URIUtil' (reexported as 'URIUtil') was not found in './utils/uri' (possible exports: default)`.

`npm run build-web` to generate files in `build/` for production to deploy to `https://foo.bar.com/` , and can use `npx http-server@13.0.2 build` to simply test it at [http://127.0.0.1:8080](http://127.0.0.1:8080) in web browser.

`npm run build-web-PixelShapeRN` to generate files in `build/` for production to deploy to `https://foo.bar.com/PixelShapeRN/`, e.g. [https://flyskywhy.github.io/PixelShapeRN/](https://flyskywhy.github.io/PixelShapeRN/) .

## permission
PixelShapeRN will automatically request `('react-native').PermissionsAndroid` on Android when import or save file, so your iOS APP embeded PixelShapeRN as sub-app maybe need request permission with e.g. `react-native-permissions` or `expo-permissions`.

## be embeded as sub-app
Ref to [Isolating Redux Sub-Apps](https://redux.js.org/usage/isolating-redux-sub-apps) and [Breaking out of Redux paradigm to isolate apps](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400), PixelShapeRN can be embeded into other react-native APP easily.

* `npm install pixelshapern` in `otherAPP/`.
* Add `dependencies` in `pixelshapern/react-native.config.js` into `otherAPP/react-native.config.js`.
* Add native component name e.g. `"@flyskywhy/react-native-gcanvas": "6.0.6 OR_OTHER_VERSION",` into `otherAPP/package.json` so that they can be automatically linked by react-native. PS: The reason why "@flyskywhy/react-native-gcanvas" even "react-native" is writen in "devDependencies" no "dependencies" in `pixelshapern/package.json` is, if version here mismatch (e.g. `6.0.6` and `6.0.5`) between `pixelshapern/package.json` and `otherAPP/package.json`, will cause e.g. `Invariant Violation: Tried to register two views with the same name RCTGCanvasView`, if "react-native" mismatch (e.g. `0.63.2` and `0.63.3`) will cause `React Native version mismatch. JavaScript version: 0.63.2 Native version: 0.63.3`.
* `npm install --save-dev react-refresh@0.11.0` in `otherAPP/` so that can `npm run web` , because lower version of `react-refresh` comes from `metro-react-native-babel-preset` may cause `Module not found: Error: Cannot find module 'react-refresh'` , ref to [RN >= 0.60 的安装 react-native-web](https://github.com/flyskywhy/g/blob/master/i%E4%B8%BB%E8%A7%82%E7%9A%84%E4%BD%93%E9%AA%8C%E6%96%B9%E5%BC%8F/t%E5%BF%AB%E4%B9%90%E7%9A%84%E4%BD%93%E9%AA%8C/%E7%94%B5%E4%BF%A1/Tool/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/JavaScript/React%E4%BD%BF%E7%94%A8%E8%AF%A6%E8%A7%A3.md#rn--060-%E7%9A%84%E5%AE%89%E8%A3%85-react-native-web).
* Enable fs permission in other APP to save and load `.gif` file, ref to [ENOENT: open failed: EACCES (Permission denied), open '/storage/emulated/0/Download/](https://github.com/itinance/react-native-fs/issues/941) on Android, and [IOS file downloaded not able to be located on device](https://github.com/itinance/react-native-fs/issues/897#issuecomment-759577180) on iOS.
* Copy `web` `web-fresh` and `build-web` in `package.json` into `otherAPP/package.json` .
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
