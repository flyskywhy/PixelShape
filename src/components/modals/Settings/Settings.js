import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import ModalWindow from '../../modalwindow/Modalwindow';
import ToggleCheckbox from '../../togglecheckbox/Togglecheckbox';
// import CanvasAnchors from '../../../containers/canvasanchors/Canvasanchors';

// TODO: take styles from apptoolbox and push in separate related stylesheets

const maxVal = 600,
  errorColor = '#9a1000',
  regularColor = '#eee';

class SettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthText: '' + props.imageSize.width,
      heightText: '' + props.imageSize.height,
      widthError: false,
      heightError: false,
    };
  }

  resetErrors() {
    this.setState({
      widthError: false,
      heightError: false,
    });
  }

  isInputValid(input) {
    return input <= maxVal;
  }

  checkErrors() {
    let ok = false;

    if (!this.isInputValid(parseInt(this.state.widthText, 10))) {
      this.setState({widthError: true});
      ok = true;
    }
    if (!this.isInputValid(parseInt(this.state.heightText, 10))) {
      this.setState({heightError: true});
      ok = true;
    }
    return ok;
  }

  getErrorMessage() {
    if (this.state.widthError || this.state.heightError) {
      return (
        <Text style={styles.dimensionsInputsError}>
          {'Sorry, max allowed value is ' + maxVal}
        </Text>
      );
    }
    return null;
  }

  setActualInputValues() {
    this.setState({
      widthText: '' + this.props.imageSize.width,
      heightText: '' + this.props.imageSize.height,
    });
  }

  confirm() {
    this.resetErrors();
    if (this.checkErrors()) {
      return;
    }
    this.props.setImageSize(
      parseInt(this.state.widthText, 10),
      parseInt(this.state.heightText, 10),
      this.props.stretchOn,
    );
    this.props.closeModal();
  }

  cancel() {
    this.setActualInputValues();
    this.resetErrors();
    this.props.closeModal();
  }

  getInputs() {
    return [
      <View key="width" style={styles.input}>
        <Text style={styles.inputlabel}>Width </Text>
        <TextInput
          style={[
            styles.inputinline,
            {
              borderColor: this.state.widthError ? errorColor : regularColor,
            },
          ]}
          key={this.props.imageSize.width}
          value={this.state.widthText}
          onChangeText={(value) => this.setState({widthText: value})}
        />
      </View>,

      <View key="height" style={styles.input}>
        <Text style={styles.inputlabel}>Height </Text>
        <TextInput
          style={[
            styles.inputinline,
            {
              borderColor: this.state.heightError ? errorColor : regularColor,
            },
          ]}
          key={this.props.imageSize.height}
          value={this.state.heightText}
          onChangeText={(value) => this.setState({heightText: value})}
        />
      </View>,
    ];
  }

  render() {
    return (
      <ModalWindow
        title="Settings"
        ok={{text: 'Save', action: this.confirm.bind(this)}}
        cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
        isShown={this.props.isShown}>
        <View style={styles.dimensions}>
          <View style={styles.dimensionsEdit}>
            <View style={styles.dimensionsInputs}>
              {this.getInputs()}
              {this.getErrorMessage()}
            </View>
            {/*<ToggleCheckbox
              style={styles.dimensionsEditRatio}
              value={false}
              onChange={() => {}}>
              Keep ratio
            </ToggleCheckbox>*/}
          </View>
          <View style={styles.dimensionsModifiers}>
            {/*<CanvasAnchors
              style={styles.dimensionsModifiersAnchors}
              disabled={this.props.stretchOn}
            />*/}
            <ToggleCheckbox
              style={styles.dimensionsModifiersStretch}
              value={this.props.stretchOn}
              onChange={this.props.toggleStretch.bind(this)}>
              Stretch
            </ToggleCheckbox>
          </View>
        </View>
        {/*<ToggleCheckbox
          value={this.props.gridShown}
          onChange={this.props.toggleGrid.bind(this)}>
          Show grid
        </ToggleCheckbox>*/}
      </ModalWindow>
    );
  }
}

const styles = StyleSheet.create({
  dimensions: {
    flexDirection: 'row',
    // marginBottom: 7,
    // paddingBottom: 20,
    // borderBottomWidth: 1,
    // borderColor: '#e0e0e0',
  },
  dimensionsEdit: {
    flex: 1,
    marginRight: 15,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  dimensionsInputs: {
    minHeight: 100,
  },
  dimensionsInputsError: {
    paddingTop: 10,
    fontSize: 8,
    color: '#9a1000',
  },
  dimensionsEditRatio: {
    paddingTop: 20,
  },
  dimensionsModifiers: {},
  dimensionsModifiersAnchors: {
    marginVertical: 0,
    marginHorizontal: 10,
  },
  dimensionsModifiersStretch: {
    paddingTop: 17,
  },
  input: {
    flexDirection: 'row',
  },
  inputlabel: {
    width: 60,
    textAlignVertical: 'bottom',
  },
  inputinline: {
    width: 70,
    height: 50,
    marginLeft: 10,
    textAlign: 'center',
    fontFamily: 'robotothin',
    fontSize: 20,
    borderBottomWidth: 2,
    color: '#264653',
    backgroundColor: 'transparent',
  },
});

export default SettingsModal;
