import {connect} from 'react-redux';

import {
  getGifFramesData,
  getFramesOrder,
  getAllFrames,
  getSpritesheetDownloadOption,
  getGifDownloadOption,
  getProjectDownloadOption,
  getPaletteDownloadOption,
  getAnimationName,
} from '../../selectors';

import {
  getStore,
  toggleIncludeGif,
  toggleIncludeSpritesheet,
  toggleIncludeProject,
  toggleIncludePalette,
  setAnimationName,
} from '../../actions/application';

import DownloadProjectModal from '../../components/modals/Downloadproject/Downloadproject';

const mapStateToProps = (state) => ({
  gifFramesData: getGifFramesData(state),
  framesOrder: getFramesOrder(state),
  framesCollection: getAllFrames(state),
  includeSpritesheet: getSpritesheetDownloadOption(state),
  includeGif: getGifDownloadOption(state),
  includeProject: getProjectDownloadOption(state),
  includePalette: getPaletteDownloadOption(state),
  animationName: getAnimationName(state),
});

const mapDispatchToProps = (dispatch) => ({
  getProjectState() {
    return dispatch(getStore());
  },
  toggleIncludeGif() {
    return dispatch(toggleIncludeGif());
  },
  toggleIncludeSpritesheet() {
    return dispatch(toggleIncludeSpritesheet());
  },
  toggleIncludeProject() {
    return dispatch(toggleIncludeProject());
  },
  toggleIncludePalette() {
    return dispatch(toggleIncludePalette());
  },
  setAnimationName(name) {
    return dispatch(setAnimationName(name));
  },
});

const DownloadProjectModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadProjectModal);

export default DownloadProjectModalContainer;
