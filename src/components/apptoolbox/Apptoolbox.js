import React, {Component} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import RNSystemFileBrower from 'react-native-system-file-browser';
// import decorateWithKeyBindings from '../../helpers/KeyBindings';

import AppToolButton from '../apptoolbutton/Apptoolbutton';

import NewProjectModal from '../../containers/modals/Newproject';
import DownloadProjectModal from '../../containers/modals/Downloadproject';
import CustomizePanelsModal from '../../containers/modals/Customizepanels';
// import SettingsModal from '../../containers/modals/Settings';

import StateLoader from '../../statemanager/StateLoader';

const {width, height} = Dimensions.get('window');

const MODALS = {
  NewProject: 'newProjectShow',
  DownloadProject: 'downloadProjectShow',
  CustomizePanels: 'customizePanelsShow',
  Settings: 'settingsShow',
};

class Apptoolbox extends Component {
  constructor(...args) {
    super(...args);
    this.initialModalState = {
      [MODALS.NewProject]: false,
      [MODALS.DownloadProject]: false,
      [MODALS.CustomizePanels]: false,
      [MODALS.Settings]: false,
    };
    this.state = Object.assign({}, this.initialModalState);

    this.executeUndo = this.executeUndo.bind(this);
    this.executeRedo = this.executeRedo.bind(this);

    // can't open RNSystemFileBrower from react-native Modal on iOS, so skip Modal
    this.openNewProject =
      Platform.OS === 'web'
        ? this.openModal.bind(this, MODALS.NewProject)
        : this.importFile.bind(this);

    this.openDownloadProject = this.openModal.bind(
      this,
      MODALS.DownloadProject,
    );
    this.openCustomizePanels = this.openModal.bind(
      this,
      MODALS.CustomizePanels,
    );
    this.openSettings = this.openModal.bind(this, MODALS.Settings);

    this.closeModal = this.closeModal.bind(this);

    // this.bindKeys({
    //   'ctrl + z': this.executeUndo,
    //   'ctrl + y': this.executeRedo,
    //   'alt + n': this.openNewProject,
    //   'alt + d': this.openDownloadProject,
    //   'alt + p': this.openCustomizePanels,
    //   'alt + s': this.openSettings,
    //   esc: this.closeModal,
    // });
  }

  importFile() {
    const params = Platform.OS === 'android' ? 'image/gif' : undefined;
    RNSystemFileBrower.openFileBrower(params).then((res) => {
      if (res && typeof res.url === 'string') {
        const callback = (data) => {
          this.props.uploadProject(data.json);
        };
        const stepCallback = () => {};
        StateLoader.uploadGif(res.url, callback, stepCallback);
      }
    });
  }

  setStateFlag(flag) {
    const newState = Object.assign({}, this.initialModalState);

    newState[flag] = true;
    this.setState(newState);
  }

  unsetState() {
    const newState = Object.assign({}, this.initialModalState);

    this.setState(newState);
  }

  openModal(modal) {
    this.setStateFlag(modal);
  }

  closeModal() {
    this.unsetState();
  }

  executeUndo() {
    if (this.props.canUndo) this.props.undo();
  }

  executeRedo() {
    if (this.props.canRedo) this.props.redo();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <AppToolButton
            btnTooltip="New project"
            btnShortcut="(ALT + N)"
            width={30}
            height={30}
            icon={require('../../images/new-project.png')}
            doAction={this.openNewProject}
          />
          <AppToolButton
            btnTooltip="Undo"
            btnShortcut="(CTRL + Z)"
            disabled={!this.props.canUndo}
            width={30}
            height={30}
            icon={require('../../images/undo.png')}
            doAction={this.executeUndo}
          />
          <AppToolButton
            btnTooltip="Redo"
            btnShortcut="(CTRL + Y)"
            disabled={!this.props.canRedo}
            width={30}
            height={30}
            icon={require('../../images/redo.png')}
            doAction={this.executeRedo}
          />
          <AppToolButton
            btnTooltip="Download"
            btnShortcut="(ALT + D)"
            width={30}
            height={30}
            icon={require('../../images/download.png')}
            doAction={this.openDownloadProject}
          />
          <AppToolButton
            btnTooltip="Panels"
            btnShortcut="(ALT + P)"
            width={30}
            height={30}
            icon={require('../../images/panels.png')}
            doAction={this.openCustomizePanels}
          />
          {/*<AppToolButton
            btnTooltip="Settings"
            btnShortcut="(ALT + S)"
            width={30}
            height={30}
            icon={require('../../images/settings.png')}
            doAction={this.openSettings}
          />*/}
        </View>

        {(this.state.newProjectShow ||
          this.state.downloadProjectShow ||
          this.state.customizePanelsShow ||
          this.state.settingsShow) && <View style={[styles.modalLayer]} />}

        <NewProjectModal
          isShown={this.state.newProjectShow}
          closeModal={this.closeModal}
        />

        <DownloadProjectModal
          isShown={this.state.downloadProjectShow}
          closeModal={this.closeModal}
        />

        <CustomizePanelsModal
          isShown={this.state.customizePanelsShow}
          closeModal={this.closeModal}
        />

        {/*        <SettingsModal
          isShown={this.state.settingsShow}
          closeModal={this.closeModal}
        />*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#40606d',
    padding: 5,
    backgroundColor: '#365561',
  },
  modalLayer: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

// export default decorateWithKeyBindings(Apptoolbox);
export default Apptoolbox;
