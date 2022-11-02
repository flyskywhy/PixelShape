import React from 'react';

export const PixelShapeContext = React.createContext({
  initialImageSource: {
    uri: '', // e.g. '/storage/emulated/0/Pictures/gifs/animation7.gif'
    fileName: '', // e.g. 'animation7.gif'
  },
  initialSize: null,
  initialColor: null,
  defaultsPalette: require('./defaults/palette').default,
  onGifGeneratePre: null,
  onGifGeneratePost: null,
  onClickGifImage: null,
  refApptoolbox: null, // e.g. `(ref) => (this.apptoolbox = ref)` to this.apptoolbox.openDownloadProject()
  onGifFileSaved: null,
  onGifFileSaveCanceled: null,
});
