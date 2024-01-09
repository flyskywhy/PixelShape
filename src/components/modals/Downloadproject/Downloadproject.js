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
  var ReactNativeBlobUtil = require('react-native-blob-util').default;
}
import bmp from 'bmp-ts';
import ModalWindow from '../../modalwindow/Modalwindow';
import ToggleCheckbox from '../../togglecheckbox/Togglecheckbox';

import Downloader from '../../../fileloaders/Downloader';
import {combineImageDataToCanvas} from '../../../utils/canvasUtils';
import {getAllActiveColors, rgbaToAbgr} from '../../../utils/colorUtils';
import StateLoader from '../../../statemanager/StateLoader';
import {PixelShapeContext} from '../../../context';
import {Files} from '../../../defaults/constants';

import generatePalette from '../../../htmlgenerators/paletteGenerator';
import GifEncoder from '../../../libs/GifEncoder';

const errorColor = '#9a1000';
const regularColor = '#eee';

// just like if 'file.gif' exist then rename to 'file (1).gif' when not want overwrite
function autoRenameLikeWeb(namesInDir, fileName, fileExt) {
  const fullName = fileName + '.' + fileExt;
  if (namesInDir.includes(fullName)) {
    const matchResult = fileName.match(/ \((\d+)\)$/);
    const newSeq = parseInt(matchResult[1], 10) + 1;
    const newFileName = fileName.replace(/ \(\d+\)$/, ' (' + newSeq + ')');
    return autoRenameLikeWeb(namesInDir, newFileName, fileExt);
  } else {
    return fullName;
  }
}

class DownloadProjectModal extends Component {
  static contextType = PixelShapeContext;

  constructor(props) {
    super(props);
    this.state = {
      animationName: props.animationName,

      gifName: props.animationName.substring(
        0,
        props.animationName.lastIndexOf('.'),
      ),
      saveError: '',
    };

    if (Platform.OS !== 'web') {
      const ext = props.animationName.substring(
        props.animationName.lastIndexOf('.') + 1,
      );
      this.directoryPath = `${
        Platform.OS === 'android'
          ? '/sdcard/Pictures' // not ReactNativeBlobUtil.fs.dirs.PictureDir, to match in ../../apptoolbox/Apptoolbox.js
          : ReactNativeBlobUtil.fs.dirs.DocumentDir
      }/${ext}s`;
    }

    this.needRename = false;
  }

  componentDidMount() {
    // this.context.initialImageSource means import file not new file so want overwrite I think
    this.needRename = this.context.initialImageSource ? false : true;
  }

  combineGifData() {
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );
    if (ext === 'bmp') {
      const frameUUID = this.props.framesOrder[0];
      const rawData = bmp.encode({
        data: rgbaToAbgr(
          this.props.framesCollection[frameUUID].naturalImageData.data,
        ),
        bitPP: 24,
        width: this.props.imageSize.width,
        height: this.props.imageSize.height,
      });
      return rawData.data;
    } else {
      return GifEncoder({
        collection: this.props.framesCollection,
        order: this.props.framesOrder,
        width: this.props.imageSize.width,
        height: this.props.imageSize.height,
        fps: this.props.fps,
      });
    }
  }

  prepareProject() {
    const state = this.props.getProjectState();
    return StateLoader.prepareForDownload(state, Files.NAME.PROJECT);
  }

  prepareGif(fileName) {
    const combinedData = this.combineGifData();
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );
    if (ext === 'bmp') {
      return Downloader.prepareBMPBlobAsync(
        combinedData,
        fileName || Files.NAME.ANIMATION,
      );
    } else {
      return Downloader.prepareGIFBlobAsync(
        combinedData,
        fileName || Files.NAME.ANIMATION,
      );
    }
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
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );

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
        // let fileName =
        //   year + month + date + hour + minute + second + '.gif';
        let fileName = this.state.gifName + '.' + ext;

        if (Platform.OS === 'web') {
          blobs.push(this.prepareGif(fileName));
          Downloader.asFiles(blobs);
          this.context.onGifFileSaved &&
            this.context.onGifFileSaved({fileName, fps: this.props.fps});
          this.props.setAnimationName(fileName);
          this.props.closeModal();
        } else {
          const combinedData = this.combineGifData();
          if (combinedData) {
            if (Platform.OS === 'android') {
              try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                    // if user allow fisrt in APP, then manually disallow in OS setting,
                    // then will show below message
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

            try {
              await ReactNativeBlobUtil.fs.stat(this.directoryPath);
            } catch (e) {
              try {
                await ReactNativeBlobUtil.fs.mkdir(this.directoryPath);
              } catch (err) {
                this.setState({saveError: err.message});
                return;
              }
            }

            try {
              const namesInDir = await ReactNativeBlobUtil.fs.ls(
                this.directoryPath,
              );
              if (this.needRename && namesInDir.includes(fileName)) {
                const nameWithoutExt = this.props.animationName.substring(
                  0,
                  this.props.animationName.lastIndexOf('.'),
                );
                fileName = autoRenameLikeWeb(
                  namesInDir,
                  nameWithoutExt.replace(/ \(\d+\)$/, '') + ' (1)',
                  ext,
                );
              }
              const fullPath = `${this.directoryPath}/${fileName}`;
              await ReactNativeBlobUtil.fs.writeFile(
                fullPath,
                Array.from(combinedData),
                'ascii',
              );
              this.needRename = false;
              this.context.onGifFileSaved &&
                this.context.onGifFileSaved({fileName, fps: this.props.fps});
              this.props.setAnimationName(fileName);
              this.props.closeModal();
            } catch (err) {
              this.setState({saveError: err.message});
              return;
            }
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
    this.context.onGifFileSaveCanceled && this.context.onGifFileSaveCanceled();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.animationName !== nextProps.animationName) {
      return {
        animationName: nextProps.animationName,
        gifName: nextProps.animationName.substring(
          0,
          nextProps.animationName.lastIndexOf('.'),
        ),
      };
    }

    return null;
  }

  render() {
    let path =
      Platform.OS === 'ios'
        ? this.directoryPath.replace(/^file:\/\//, '')
        : this.directoryPath;
    path += '/';
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );

    return (
      <ModalWindow
        title="Download project"
        ok={{text: 'Download', action: this.confirm.bind(this)}}
        cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
        isShown={this.props.isShown}>
        <View style={styles.container}>
          {typeof this.directoryPath === 'string' && (
            <Text style={styles.directorylabel}>{path}</Text>
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
            <Text style={styles.inputlabel}>{`.${ext}`}</Text>
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
