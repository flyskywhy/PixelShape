import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
if (Platform.OS !== 'web') {
  var RNFS = require('react-native-fs');
}
import ModalWindow from '../../modalwindow/Modalwindow';
import ToggleCheckbox from '../../togglecheckbox/Togglecheckbox';

import Downloader from '../../../fileloaders/Downloader';
import {combineImageDataToCanvas} from '../../../utils/canvasUtils';
import {getAllActiveColors} from '../../../utils/colorUtils';
import StateLoader from '../../../statemanager/StateLoader';

import {Files} from '../../../defaults/constants';

import generatePalette from '../../../htmlgenerators/paletteGenerator';

const errorColor = '#9a1000';
const regularColor = '#eee';

class DownloadProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationName: props.animationName,

      gifName: props.animationName.replace(/(.gif$)/, ''),
      saveError: '',
    };

    if (Platform.OS !== 'web') {
      this.directoryPath = `${
        Platform.OS === 'android'
          ? RNFS.PicturesDirectoryPath
          : RNFS.DocumentDirectoryPath
      }/gifs`;
    }
  }

  combineGifData() {
    return this.props.framesOrder
      .map((el) => this.props.gifFramesData[el])
      .join('');
  }

  prepareProject() {
    const state = this.props.getProjectState();
    return StateLoader.prepareForDownload(state, Files.NAME.PROJECT);
  }

  prepareGif(fileName) {
    const combinedData = this.combineGifData();
    return Downloader.prepareGIFBlobAsync(
      combinedData,
      fileName || Files.NAME.ANIMATION,
    );
  }

  prepareSpritesheet() {
    const spritesImageDataArray = this.props.framesOrder.map(
      (el) => this.props.framesCollection[el].naturalImageData,
    );
    return Downloader.prepareCanvasBlobAsync(
      combineImageDataToCanvas(
        spritesImageDataArray,
        spritesImageDataArray[0].width,
        spritesImageDataArray[0].height,
      ),
      Files.NAME.SPRITES,
    );
  }

  preparePalette() {
    const spritesImageDataArray = this.props.framesOrder.map(
      (el) => this.props.framesCollection[el].naturalImageData,
    );

    return Downloader.prepareHTMLBlobAsync(
      generatePalette(getAllActiveColors(spritesImageDataArray)),
      Files.NAME.PALETTE,
    );
  }

  async confirm() {
    const blobs = [];

    if (this.props.includeGif) {
      if (
        this.props.includePalette ||
        this.props.includeProject ||
        this.props.includeSpritesheet
      ) {
        // should not be here, to support gif name change
        blobs.push(this.prepareGif());
      } else {
        // const now = new Date();
        // const year = now.getFullYear();
        // let month = now.getMonth() + 1;
        // month = month < 10 ? '0' + month : '' + month;
        // const date =
        //   now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate();
        // const hour =
        //   now.getHours() < 10 ? '0' + now.getHours() : '' + now.getHours();
        // const minute =
        //   now.getMinutes() < 10
        //     ? '0' + now.getMinutes()
        //     : '' + now.getMinutes();
        // const second =
        //   now.getSeconds() < 10
        //     ? '0' + now.getSeconds()
        //     : '' + now.getSeconds();
        // const fileName =
        //   year + month + date + hour + minute + second + '.gif';
        const fileName = this.state.gifName + '.gif';
        this.props.setAnimationName(fileName);

        if (Platform.OS === 'web') {
          blobs.push(this.prepareGif(fileName));
          Downloader.asFiles(blobs);
          this.props.closeModal();
        } else {
          const combinedData = this.combineGifData();
          if (combinedData) {
            const fullPath = `${this.directoryPath}/${fileName}`;

            if (Platform.OS === 'android') {
              try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                    title: 'Write External Storage Permission',
                    message: 'Your app needs this permission to save file.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                  },
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                  this.setState({
                    saveError: 'Write external storage permission denied',
                  });
                  return false;
                }
              } catch (err) {
                this.setState({saveError: err.message});
                return false;
              }
            }

            RNFS.stat(this.directoryPath)
              .then((success) => {
                RNFS.writeFile(fullPath, combinedData, 'ascii')
                  .then(this.props.closeModal)
                  .catch((err) => {
                    this.setState({saveError: err.message});
                  });
              })
              .catch(() => {
                RNFS.mkdir(this.directoryPath)
                  .then(() => {
                    RNFS.writeFile(fullPath, combinedData, 'ascii')
                      .then(this.props.closeModal)
                      .catch((err) => {
                        this.setState({saveError: err.message});
                      });
                  })
                  .catch((err) => {
                    this.setState({saveError: err.message});
                  });
              });
          } else {
            this.setState({saveError: 'Please draw some pixels first'});
          }
        }
        return;
      }
    }

    // should not be here, to support gif name change
    if (this.props.includePalette) {
      blobs.push(this.preparePalette());
    }
    if (this.props.includeProject) {
      blobs.push(this.prepareProject());
    }
    if (this.props.includeSpritesheet) {
      blobs.push(this.prepareSpritesheet());
    }
    if (!blobs.length) {
      return;
    }
    Downloader.asZIP(blobs, Files.NAME.PACKAGE);
    this.props.closeModal();
  }

  cancel() {
    this.setState({saveError: ''});
    this.props.closeModal();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.animationName !== nextProps.animationName) {
      return {
        animationName: nextProps.animationName,
        gifName: nextProps.animationName.replace(/(.gif$)/, ''),
      };
    }

    return null;
  }

  render() {
    return (
      <ModalWindow
        title="Download project"
        ok={{text: 'Download', action: this.confirm.bind(this)}}
        cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
        isShown={this.props.isShown}>
        <View style={styles.container}>
          {typeof this.directoryPath === 'string' && (
            <Text style={styles.directorylabel}>
              {this.directoryPath + '/'}
            </Text>
          )}
          <View key="width" style={styles.input}>
            <TextInput
              style={[
                styles.inputinline,
                {
                  borderColor: this.state.saveError ? errorColor : regularColor,
                },
              ]}
              maxLength={16}
              // key={this.props.imageSize.height}
              value={this.state.gifName}
              onChangeText={(value) => this.setState({gifName: value})}
            />
            <Text style={styles.inputlabel}>.gif</Text>
          </View>
          {this.state.saveError !== '' && (
            <Text style={styles.saveError}>{this.state.saveError}</Text>
          )}
        </View>
      </ModalWindow>
    );

    // use above not below, to support gif name change
    // return (
    //   <ModalWindow
    //     title="Download project"
    //     ok={{text: 'Download', action: this.confirm.bind(this)}}
    //     cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
    //     isShown={this.props.isShown}>
    //     <ToggleCheckbox
    //       value={this.props.includeGif}
    //       onChange={this.props.toggleIncludeGif.bind(this)}>
    //       Include gif
    //     </ToggleCheckbox>
    //     <ToggleCheckbox
    //       value={this.props.includeSpritesheet}
    //       onChange={this.props.toggleIncludeSpritesheet.bind(this)}>
    //       Include spritesheet
    //     </ToggleCheckbox>
    //     <ToggleCheckbox
    //       value={this.props.includePalette}
    //       onChange={this.props.toggleIncludePalette.bind(this)}>
    //       Include custom palette
    //     </ToggleCheckbox>
    //     <ToggleCheckbox
    //       value={this.props.includeProject}
    //       onChange={this.props.toggleIncludeProject.bind(this)}>
    //       Include project
    //     </ToggleCheckbox>
    //   </ModalWindow>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
  },
  directorylabel: {},
  saveError: {
    paddingTop: 10,
    fontSize: 8,
    color: '#9a1000',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputlabel: {
    width: 60,
    textAlignVertical: 'bottom',
  },
  inputinline: {
    width: 200,
    height: 50,
    marginLeft: 10,
    textAlign: 'center',
    // fontFamily: 'robotothin',
    fontSize: 20,
    borderBottomWidth: 2,
    color: '#264653',
    backgroundColor: 'transparent',
  },
});

export default DownloadProjectModal;
