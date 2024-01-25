import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';

import {
  getResetPaletteState,
  getImageSize,
  getAnimationName,
} from '../../selectors';

import {
  toggleResetPalette,
  uploadStore,
  setAnimationName,
  setIsImported,
} from '../../actions/application';
import {resetUserColors} from '../../actions/palette';
import {resetFramesState} from '../../actions/frames';

import NewProjectModal from '../../components/modals/Newproject/Newproject';

const mapStateToProps = (state) => ({
  resetPaletteOn: getResetPaletteState(state),
  imageSize: getImageSize(state),
  animationName: getAnimationName(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleResetPalette() {
    return dispatch(toggleResetPalette());
  },
  resetUserColors() {
    return dispatch(resetUserColors());
  },
  resetFramesState(width, height) {
    return dispatch(resetFramesState(width, height));
  },
  resetUndoHistory() {
    return dispatch(ActionCreators.clearHistory());
  },
  uploadProject(data) {
    return dispatch(uploadStore(data));
  },
  setAnimationName(name) {
    return dispatch(setAnimationName(name));
  },
  setIsImported(isImported) {
    return dispatch(setIsImported(isImported));
  },
});

const NewProjectModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewProjectModal);

export default NewProjectModalContainer;
