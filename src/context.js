import React from 'react';

export const PixelShapeContext = React.createContext({
  initialSize: null,
  initialColor: null,
  defaultsPalette: require('./defaults/palette').default,
  onGifGeneratePre: null,
  onGifGeneratePost: null,
  onGifFileSaved: null,
});
