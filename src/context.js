import React from 'react';

export const PixelShapeContext = React.createContext({
  // below must be commented to match PixelShapeRN against app or sub-app, because if not, then for example:
  // when PixelShapeRN is an app, this.context.initialImageSource is {uri: '', fileName: ''} ,
  //     so that below is meaningful
  // when pixelshapern is a sub-app and PixelShapeContext.Provider value={some_object} and
  //     there is no initialImageSource in some_object, this.context.initialImageSource is undefined,
  //     so that below is meaningless
  //
  //
  // initialImageSource: {
  //   uri: '', // e.g. '/storage/emulated/0/Pictures/gifs/animation7.gif'
  //   fileName: '', // e.g. 'animation7.gif' will auto be setAnimationName()
  // },
  // initialAnimationName: null, // if no initialImageSource, then also can initialAnimationName to auto be setAnimationName()
  // initialSize: null,
  // initialColor: null,
  // defaultsPalette: require('./defaults/palette').default,
  // onGifGeneratePre: null,
  // onGifGeneratePost: null,
  // onClickGifImage: null,
  // refApptoolbox: null, // e.g. `(ref) => (this.apptoolbox = ref)` to this.apptoolbox.openDownloadProject()
  // onGifFileSaved: null,
  // onGifFileSaveCanceled: null,
  // fpsController: { // if no fpsController, will use fps slider, otherwise use steps up down buttons
  //   steps: [1, 3, 6, 8],
  //   stepsDefaultIndex: 1,
  // },
});
