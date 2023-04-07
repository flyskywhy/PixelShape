import {GIFEncoder, quantize, applyPalette} from 'gifenc';

const GifEncoder = function ({collection, order, width, height, fps}) {
  // Create an encoding stream
  const gif = GIFEncoder();

  const delay = Math.round(1000 / fps);

  const framesLength = order.length;
  for (let i = 0; i < framesLength; i++) {
    const frameUUID = order[i];
    const data = collection[frameUUID].naturalImageData.data;

    // Quantize your colors to a 256-color RGB palette palette
    const palette = quantize(data, 256);

    // Get an indexed bitmap by reducing each pixel to the nearest color palette
    const index = applyPalette(data, palette);

    // Write a single frame
    gif.writeFrame(index, width, height, {
      palette,
      delay,
      transparent: true,
      // dispose: 2,
    });

    // Wait a tick so that we don't lock up browser
    // await new Promise(resolve => setTimeout(resolve, 0));
  }

  // Write end-of-stream character
  gif.finish();

  // Get the Uint8Array output of your binary GIF file
  const output = gif.bytes();

  return output;
};

export default GifEncoder;
