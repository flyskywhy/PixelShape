import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNSystemFileBrower from 'react-native-system-file-browser';
if (Platform.OS !== 'web') {
  var ReactNativeBlobUtil = require('react-native-blob-util').default;
}

import ModalWindow from '../../modalwindow/Modalwindow';
import ToggleCheckbox from '../../togglecheckbox/Togglecheckbox';

import StateLoader from '../../../statemanager/StateLoader';
import {projectExtension} from '../../../defaults/constants';

class NewProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importedFileName: null,
      importedData: null,
      loading: false,
      progress: 0,
    };
  }

  async onFileLoaded(data) {
    let importedFileName = this.props.animationName;
    if (Platform.OS === 'web') {
      importedFileName = data.file.name || importedFileName;
    } else {
      let stat = await ReactNativeBlobUtil.fs.stat(data.file);
      importedFileName = stat.filename || importedFileName;
    }
    this.setState({
      importedFileName,
      importedData: data.json,
      loading: false,
      progress: 0,
    });
  }

  onStep(current, total) {
    this.setState({
      progress: Math.round((100 * current) / total),
    });
  }

  startLoading() {
    this.setState({
      loading: true,
    });
  }

  importFile() {
    if (Platform.OS === 'web') {
      document.getElementById('project-import').click();
    } else {
      const params =
        Platform.OS === 'android' ? {types: 'image/gif'} : undefined;
      RNSystemFileBrower.openFileBrower(params).then((res) => {
        if (res && typeof res.url === 'string') {
          const callback = this.onFileLoaded.bind(this),
            stepCallback = this.onStep.bind(this);
          StateLoader.uploadGif(res.url, callback, stepCallback);
        }
      });
    }
  }

  handleUpload() {
    const file = this._input.files[0],
      callback = this.onFileLoaded.bind(this),
      stepCallback = this.onStep.bind(this);

    // IE11 fix
    if (!file) {
      return;
    }

    this.startLoading();
    if (file.type.match(/image\/gif/)) {
      StateLoader.uploadGif(file, callback, stepCallback);
    }
    if (file.name.match(projectExtension)) {
      StateLoader.upload(file, callback);
    }
  }

  getFileNotification() {
    if (this.state.importedFileName) {
      return <Text style={styles.infoFile}>{this.state.importedFileName}</Text>;
    }

    if (this.state.loading) {
      return this.getFileLoadingTracking();
    }

    return [
      <Text key="info" style={styles.infoRow}>
        No file imported.
      </Text>,
      <Text key="note" style={styles.infoRowNote}>
        New project will be created.
      </Text>,
    ];
  }

  getFileLoadingTracking() {
    // return [
    //   <div key="spinner" className="newproject-import__info-spinner"></div>,
    //   <div
    //     key="tracking"
    //     className="newproject-import__info-tracking">{`${this.state.progress}%`}</div>,
    // ];
    return <Text style={styles.infoTracking}>{`${this.state.progress}%`}</Text>;
  }

  dropImportedFile() {
    this.setState({
      importedFileName: null,
      importedData: null,
    });
    if (Platform.OS === 'web') {
      this._input.value = '';
    }
  }

  confirm() {
    if (this.state.importedData) {
      this.props.setAnimationName(this.state.importedFileName);
      this.props.uploadProject(this.state.importedData);
    } else {
      if (this.props.resetPaletteOn) {
        this.props.resetUserColors();
      }
      this.props.resetFramesState(
        this.props.imageSize.width,
        this.props.imageSize.height,
      );
    }
    this.dropImportedFile();
    this.props.closeModal();
  }

  cancel() {
    this.dropImportedFile();
    this.props.closeModal();
  }

  render() {
    return (
      <ModalWindow
        title="New project"
        ok={{text: 'Create', action: this.confirm.bind(this)}}
        cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
        isShown={this.props.isShown}>
        <ToggleCheckbox
          value={this.props.resetPaletteOn}
          onChange={this.props.toggleResetPalette.bind(this)}>
          Reset palette
        </ToggleCheckbox>

        <View style={styles.import}>
          {Platform.OS === 'web' && (
            <input
              id="project-import"
              type="file"
              accept={[projectExtension, '.gif'].join()}
              ref={(input) => (this._input = input)}
              style={{display: 'none'}}
              onChange={this.handleUpload.bind(this)}
            />
          )}
          <TouchableOpacity onPress={this.importFile.bind(this)}>
            <View style={styles.upload}>
              <Text style={styles.uploadBtn}>Import</Text>
              <Image
                source={require('../../../images/upload.png')}
                style={styles.icon}
                resizeMode="stretch"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.info}>{this.getFileNotification()}</View>
        </View>

        <Text>
          {'You are allowed to load only files of `.gif`' +
            (Platform.OS === 'web' ? ' and `.pxlsh` formats' : 'format')}
        </Text>
      </ModalWindow>
    );
  }
}

const styles = StyleSheet.create({
  import: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  upload: {
    flexDirection: 'row',
    paddingHorizontal: 19,
    backgroundColor: '#264653',
  },
  uploadBtn: {
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'center',
    lineHeight: 40,
  },
  icon: {
    height: 24,
    width: 24,
    marginLeft: 10,
    alignSelf: 'center',
  },
  info: {
    flex: 1,
    paddingLeft: 19,
  },
  infoFile: {
    lineHeight: 20,
    fontWeight: 'bold',
  },
  infoRow: {
    textAlign: 'left',
    lineHeight: 20,
  },
  infoRowNote: {
    fontWeight: 'bold',
  },
  infoTracking: {
    marginLeft: 30,
    lineHeight: 40,
    fontFamily: 'robotobold',
  },
});

export default NewProjectModal;
