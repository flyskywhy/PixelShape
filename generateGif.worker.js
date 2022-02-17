// bundle.worker.js code lines will from 56791 to 1182 in Web
// if not import react-native like
// import {Platform} from 'react-native';
// if (Platform.OS !== 'web') {
//   var self = require('@minar-kotonoha/react-native-threads').self;
// }
// so
// for Android and iOS: /generateGif.worker.js
// for Web: /src/workers/generateGif.worker.js
import {self} from '@minar-kotonoha/react-native-threads';
import GIFEncoder from './src/libs/gif/GIFEncoder';

// below is same with /src/workers/generateGif.worker.js`
// =======

self.onmessage = (event) => {
  // we need to check if imageDataArr has transparent color in it
  // and if it does - specify it in encoder, otherwise - don't specify it
  // this hack is made because encoder takes the closest color to transparent and makes it transparent
  // TODO: this is so not ideal, if imageDataArr has black color - it will be transparent
  // Need to rework this, to deal with the "REAL" black
  const isTransparencyPresent = (imageDataArr, transparentColor) => {
    let i = 0,
      transpUsed = -1;
    const len = imageDataArr.length;

    for (; i < len; ) {
      transpUsed *=
        imageDataArr[i++] -
        transparentColor.r +
        imageDataArr[i++] -
        transparentColor.g +
        imageDataArr[i++] -
        transparentColor.b;

      i++;

      if (!transpUsed) {
        break;
      }
      transpUsed = -1;
    }
    return !transpUsed;
  };

  const data = typeof event === 'string' ? JSON.parse(event) : event.data;
  const {
    frameUUID,
    frameNum,
    framesLength,
    height,
    width,
    fps,
    imageData,
  } = data;

  const encoder = new GIFEncoder(); // create a new GIFEncoder for every new job
  const transparentColor = 0x000000;
  const transpRGB = {r: 0, g: 0, b: 0};

  const useTransparency = isTransparencyPresent(imageData, transpRGB);

  encoder.setRepeat(0);
  // we need to set disposal code of 2 for each frame
  // to be sure that the current frame will override the previous and won't overlap
  encoder.setDispose(2);
  encoder.setQuality(1);
  encoder.setFrameRate(fps);
  encoder.setSize(width, height);

  if (useTransparency) {
    encoder.setTransparent(transparentColor);
  } else {
    encoder.setTransparent(null);
  }

  if (frameNum === 0) {
    encoder.start();
  } else {
    encoder.cont();
    encoder.setProperties(true, false); // started, firstFrame
  }

  encoder.addFrame(imageData, true);

  if (framesLength === frameNum + 1) {
    encoder.finish();
  }

  const res = {
    frameUUID,
    frameIndex: frameNum,
    frameData: encoder.stream().getData(),
  };
  self.postMessage(typeof event === 'string' ? JSON.stringify(res) : res);
};
