import React, {Component} from 'react';
import {Platform} from 'react-native';
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

class DownloadProjectModal extends Component {
  constructor(props) {
    super(props);
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

  prepareGif() {
    const combinedData = this.combineGifData();
    return Downloader.prepareGIFBlobAsync(combinedData, Files.NAME.ANIMATION);
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

  confirm() {
    const blobs = [];

    if (this.props.includeGif) {
      if (
        this.props.includePalette ||
        this.props.includeProject ||
        this.props.includeSpritesheet
      ) {
        blobs.push(this.prepareGif());
      } else {
        if (Platform.OS === 'web') {
          blobs.push(this.prepareGif());
          Downloader.asFiles(blobs);
        } else {
          const combinedData = this.combineGifData();
          if (combinedData) {
            const directoryPath = `${
              Platform.OS === 'android'
                ? RNFS.PicturesDirectoryPath
                : RNFS.DocumentDirectoryPath
            }/gifs`;

            const now = new Date();
            const year = now.getFullYear();
            let month = now.getMonth() + 1;
            month = month < 10 ? '0' + month : '' + month;
            const date =
              now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate();
            const hour =
              now.getHours() < 10 ? '0' + now.getHours() : '' + now.getHours();
            const minute =
              now.getMinutes() < 10
                ? '0' + now.getMinutes()
                : '' + now.getMinutes();
            const second =
              now.getSeconds() < 10
                ? '0' + now.getSeconds()
                : '' + now.getSeconds();
            const fileName =
              year + month + date + hour + minute + second + '.gif';
            // const fileName = Files.NAME.ANIMATION;

            const fullPath = `${directoryPath}/${fileName}`;

            RNFS.stat(directoryPath)
              .then((success) => {
                RNFS.writeFile(fullPath, combinedData, 'ascii');
              })
              .catch(() => {
                RNFS.mkdir(directoryPath).then((success) => {
                  RNFS.writeFile(fullPath, combinedData, 'ascii');
                });
              });
          }
        }
        this.props.closeModal();
        return;
      }
    }
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
    this.props.closeModal();
  }

  render() {
    return (
      <ModalWindow
        title="Download project"
        ok={{text: 'Download', action: this.confirm.bind(this)}}
        cancel={{text: 'Cancel', action: this.cancel.bind(this)}}
        isShown={this.props.isShown}>
        <ToggleCheckbox
          value={this.props.includeGif}
          onChange={this.props.toggleIncludeGif.bind(this)}>
          Include gif
        </ToggleCheckbox>
        <ToggleCheckbox
          value={this.props.includeSpritesheet}
          onChange={this.props.toggleIncludeSpritesheet.bind(this)}>
          Include spritesheet
        </ToggleCheckbox>
        <ToggleCheckbox
          value={this.props.includePalette}
          onChange={this.props.toggleIncludePalette.bind(this)}>
          Include custom palette
        </ToggleCheckbox>
        <ToggleCheckbox
          value={this.props.includeProject}
          onChange={this.props.toggleIncludeProject.bind(this)}>
          Include project
        </ToggleCheckbox>
      </ModalWindow>
    );
  }
}

export default DownloadProjectModal;
