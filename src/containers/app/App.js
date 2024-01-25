import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';

import {
  setSurfaceConstraints,
  setAnimationName,
  setIsImported,
  uploadStore,
} from '../../actions/application';
import {getProjectGuid, getImageSize, getAnimationName} from '../../selectors';
import {resetFramesState} from '../../actions/frames';

import App from '../../components/app/App';

const mapStateToProps = (state) => ({
  guid: getProjectGuid(state),
  imageSize: getImageSize(state),
  animationName: getAnimationName(state),
});

const mapDispatchToProps = (dispatch) => ({
  setSurfaceConstraints(width, height) {
    return dispatch(setSurfaceConstraints(width, height));
  },
  setAnimationName(name) {
    return dispatch(setAnimationName(name));
  },
  setIsImported(isImported) {
    return dispatch(setIsImported(isImported));
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
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
