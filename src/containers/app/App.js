import {connect} from 'react-redux';

import {
  setSurfaceConstraints,
  setAnimationName,
  setIsImported,
} from '../../actions/application';
import {getProjectGuid, getAnimationName} from '../../selectors';

import App from '../../components/app/App';

const mapStateToProps = (state) => ({
  guid: getProjectGuid(state),
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
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
