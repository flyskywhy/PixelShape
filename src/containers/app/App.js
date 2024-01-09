import {connect} from 'react-redux';

import {
  setSurfaceConstraints,
  setAnimationName,
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
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
