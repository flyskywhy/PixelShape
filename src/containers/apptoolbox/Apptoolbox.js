import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';

import Apptoolbox from '../../components/apptoolbox/Apptoolbox';
import {setAnimationName, uploadStore} from '../../actions/application';
import {canRedo, canUndo, undoLength} from '../../selectors/timetravel';
import {getAnimationName} from '../../selectors';

const mapStateToProps = (state) => ({
  canRedo: canRedo(state),
  canUndo: canUndo(state),
  undoLength: undoLength(state),
  animationName: getAnimationName(state),
});

const mapDispatchToProps = (dispatch) => ({
  uploadProject(data) {
    return dispatch(uploadStore(data));
  },
  setAnimationName(name) {
    return dispatch(setAnimationName(name));
  },
  undo() {
    return dispatch(ActionCreators.undo());
  },
  redo() {
    return dispatch(ActionCreators.redo());
  },
});

const ApptoolboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Apptoolbox);

export default ApptoolboxContainer;
