import {
  SET_IMAGE_SIZE,
  SET_SURFACE_CONSTRAINTS,
  TOGGLE_RESET_PALETTE,
  TOGGLE_GRID,
  TOGGLE_STRETCH,
  SET_EXPAND_ANCHOR,
  TOGGLE_INCLUDE_GIF,
  TOGGLE_INCLUDE_SPRITESHEET,
  TOGGLE_INCLUDE_PROJECT,
  TOGGLE_INCLUDE_PALETTE,
  SET_ANIMATION_NAME,
  SET_IS_IMPORTED,
} from '../actions/application';

import {uuid} from '../utils/uuid';
import {Files} from '../defaults/constants';

// TODO: move this to defaults
const defaultConsts = {
  margins: {
    vertical: 300,
    horizontal: 100,
  },
};

const initialState = {
  projectGuid: uuid(),
  size: {
    width: 20,
    height: 20,
  },
  pixelSize: 16,
  optimalPixelSize: 16,
  surfaceConstraints: {
    width: 2000,
    height: 2000,
  },
  resetPalette: false,
  grid: false,
  stretch: true,
  anchor: 'oo',
  downloadOptions: {
    includeGif: true,
    includeSpritesheet: false,
    includeProject: false,
    includePalette: false,
  },
  animationName: Files.NAME.ANIMATION,
  isImported: false,
};

function getActualConstraints(width, height) {
  return {
    width: width - defaultConsts.margins.horizontal,
    height: height - defaultConsts.margins.vertical,
  };
}

function application(state = initialState, action) {
  let constraints = {},
    pixelSize = 0,
    downloadOptions;

  switch (action.type) {
    case SET_IMAGE_SIZE:
      pixelSize = state.optimalPixelSize;
      constraints = getActualConstraints(
        state.surfaceConstraints.width,
        state.surfaceConstraints.height,
      );

      if (action.width * pixelSize > constraints.width) {
        pixelSize = constraints.width / action.width;
      }
      if (action.height * pixelSize > constraints.height) {
        pixelSize = constraints.height / action.height;
      }

      pixelSize |= 0;

      return {
        ...state,
        pixelSize,
        size: {
          width: action.width,
          height: action.height,
        },
      };
    case SET_SURFACE_CONSTRAINTS:
      pixelSize = state.optimalPixelSize;
      constraints = getActualConstraints(action.width, action.height);

      if (state.size.width * pixelSize > constraints.width) {
        pixelSize = constraints.width / state.size.width;
      }
      if (state.size.height * pixelSize > constraints.height) {
        pixelSize = constraints.height / state.size.height;
      }

      if (pixelSize > 1) {
        pixelSize |= 0;
      }

      return {
        ...state,
        pixelSize,
        surfaceConstraints: {
          width: action.width,
          height: action.height,
        },
      };
    case TOGGLE_RESET_PALETTE:
      return {...state, resetPalette: !state.resetPalette};
    case TOGGLE_GRID:
      return {...state, grid: !state.grid};
    case TOGGLE_STRETCH:
      return {...state, stretch: !state.stretch};
    case SET_EXPAND_ANCHOR:
      return {...state, anchor: action.anchor};

    case TOGGLE_INCLUDE_GIF:
      downloadOptions = {
        ...state.downloadOptions,
        includeGif: !state.downloadOptions.includeGif,
      };
      return {...state, downloadOptions};
    case TOGGLE_INCLUDE_SPRITESHEET:
      downloadOptions = {
        ...state.downloadOptions,
        includeSpritesheet: !state.downloadOptions.includeSpritesheet,
      };
      return {...state, downloadOptions};
    case TOGGLE_INCLUDE_PALETTE:
      downloadOptions = {
        ...state.downloadOptions,
        includePalette: !state.downloadOptions.includePalette,
      };
      return {...state, downloadOptions};
    case TOGGLE_INCLUDE_PROJECT:
      downloadOptions = {
        ...state.downloadOptions,
        includeProject: !state.downloadOptions.includeProject,
      };
      return {...state, downloadOptions};
    case SET_ANIMATION_NAME:
      return {...state, animationName: action.name};
    case SET_IS_IMPORTED:
      return {...state, isImported: action.isImported};
    default:
      return state;
  }
}

export default application;
