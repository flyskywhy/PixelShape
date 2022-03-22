import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';

import Apptoolbox from '../../components/apptoolbox/Apptoolbox';
import {setAnimationName, uploadStore} from '../../actions/application';
import {canRedo, canUndo} from '../../selectors/timetravel';

const mapStateToProps = (state) => ({
  canRedo: canRedo(state),
  canUndo: canUndo(state),
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
