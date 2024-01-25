import styles from './app.style.js';

import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import StateLoader from '../../statemanager/StateLoader';
import {PixelShapeContext} from '../../context';
import Toolbar from '../../containers/toolbar/Toolbar';
import Surface from '../../containers/surface/Surface';
import Sidebar from '../../containers/sidebar/Sidebar';
import Framebar from '../../containers/framebar/Framebar';
import Apptoolbox from '../../containers/apptoolbox/Apptoolbox';

class App extends Component {
  static contextType = PixelShapeContext;

  constructor(props, context) {
    super(props, context);

    props.setIsImported(false);

    if (context.initialImageSource) {
      if (
        context.initialImageSource.uri &&
        context.initialImageSource.fileName
      ) {
        const callback = (data) => {
          props.setAnimationName(context.initialImageSource.fileName);
          props.uploadProject(data.json);
        };
        const stepCallback = () => {};

        const ext = context.initialImageSource.fileName.substring(
          context.initialImageSource.fileName.lastIndexOf('.') + 1,
        );
        if (ext === 'gif') {
          StateLoader.uploadGif(
            context.initialImageSource.uri,
            callback,
            stepCallback,
          );
        }
        if (ext === 'bmp') {
          StateLoader.uploadBmp(
            context.initialImageSource.uri,
            callback,
            stepCallback,
          );
        }
      }
    } else {
      context.fileExtension = context.fileExtension || 'gif';

      const ext = props.animationName.substring(
        props.animationName.lastIndexOf('.') + 1,
      );

      if (context.initialAnimationName) {
        props.setAnimationName(context.initialAnimationName);
      } else if (ext !== context.fileExtension) {
        const stringWithoutExt = props.animationName.substring(
          0,
          props.animationName.lastIndexOf('.') + 1,
        );
        props.setAnimationName(stringWithoutExt + context.fileExtension);
      } else {
        props.setAnimationName(props.animationName);
      }

      props.resetFramesState(props.imageSize.width, props.imageSize.height);

      // TODO: how to resetUndoHistory after resetFramesState success without setTimeout?
      // BUG: the first draw on Surface can't let canUndo in Apptoolbox.js be true
      setTimeout(props.resetUndoHistory);
    }
  }

  applyConstraints() {
    this.props.setSurfaceConstraints(
      Dimensions.get('window').width,
      Dimensions.get('window').height,
    );
  }

  componentDidMount() {
    this.applyConstraints();
  }

  componentDidUpdate() {
    this.applyConstraints();
  }

  render() {
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );

    return (
      <View style={styles.app} data-guid={this.props.guid}>
        <Apptoolbox />
        <View style={styles.appContent}>
          <Toolbar />
          <Surface />
          <Sidebar />
        </View>
        {ext === 'gif' && <Framebar />}
      </View>
    );
  }
}

export default App;
