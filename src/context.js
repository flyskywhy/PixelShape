import React from 'react';

export const PixelShapeContext = React.createContext({
  defaultsPalette: require('./defaults/palette').default,
});
