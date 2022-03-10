import React, {Component} from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Frame from '../frame/Frame';
import {PixelShapeContext} from '../../context';

import WorkerPool from '../../workers/workerPool';

if (Platform.OS === 'web') {
  var Image = require('react-native').Image;
  var WebWorker = 'generateGif.worker.js';
} else {
  var Image = require('react-native-fast-image');

  // in dev mode, bundler only picks up js files from project root,
  // ref to https://github.com/joltup/react-native-threads/issues/125#issuecomment-939343110
  var NativeWorker = 'generateGif.worker.js';
}

const Worker = Platform.OS === 'web' ? WebWorker : NativeWorker;

class FramesContainer extends Component {
  static contextType = PixelShapeContext;

  constructor(props) {
    super(props);

    this.initializeGifWorker();
    this.state = {
      modifiedFrames: props.modifiedFrames,

      frameAdded: false,
      loading: false,
      gifImgSrc: '',
    };
  }

  initializeGifWorker() {
    this.workerPool = new WorkerPool({
      amount: 5,
      worker: Worker,
    });

    this.workerPool.spawnWorkers();

    this.workerPool.addEventListener('message', (event) => {
      let gif = '';

      this.props.updateFrameGIFData(event.data.frameUUID, event.data.frameData);

      // update the actual gif image when all parts processed
      if (event.data.currentPart === event.data.partsTotal - 1) {
        this.endLoading();
        gif = this.getOrderedGif();
        this.setState({
          gifImgSrc: `data:image/gif;base64,${btoa(gif)}`,
        });
      }
    });
  }

  getOrderedGif() {
    return this.props.framesOrder
      .map((el) => this.props.gifFramesData[el])
      .join('');
  }

  getFrames() {
    const collection = this.props.framesCollection;
    return this.props.framesOrder.map((uuid, index) => (
      <Frame
        key={uuid}
        uuid={uuid}
        height={this.props.imageSize.height}
        width={this.props.imageSize.width}
        stylesToCenter={this.stylesToCenter.bind(this)}
        isActive={uuid === this.props.currentUUID}
        index={index + 1}
        setActive={this.props.setCurrentFrame.bind(this, uuid)}
        imageData={collection[uuid].naturalImageData}
      />
    ));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.modifiedFrames !== nextProps.modifiedFrames) {
      let state = {
        modifiedFrames: nextProps.modifiedFrames,
      };
      if (nextProps.modifiedFrames.length > 3) {
        state.loading = true;
      }
      return state;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modifiedFrames !== prevProps.modifiedFrames) {
      this.context.onGifGeneratePre &&
        this.context.onGifGeneratePre({
          fps: this.props.fps,
          imageDatas: this.props.framesOrder.map(
            (uuid) => this.props.framesCollection[uuid].naturalImageData,
          ),
        });

      this.generateGif(
        this.props.modifiedFrames,
        this.props.framesCollection,
        this.props.framesOrder,
        this.props.imageSize.width,
        this.props.imageSize.height,
        this.props.fps,
      );
    }

    if (this.state.frameAdded) {
      // Web don't need this setTimeout, but Android need
      setTimeout(() => {
        this._addButton.scrollToEnd();
      });

      this.setState({frameAdded: false});
    }
  }

  startLoading() {
    this.setState({loading: true});
  }

  endLoading() {
    this.setState({loading: false});
  }

  getGifImage() {
    if (this.state.loading) {
      return <View style={styles.gifLoading} />;
    }

    return [
      <View key="image" style={this.stylesToCenter()}>
        <ImageBackground
          style={styles.gifImg}
          source={require('../../images/tile-light-16.png')}
          resizeMode="repeat">
          <Image style={styles.gifImg} source={{uri: this.state.gifImgSrc}} />
        </ImageBackground>
      </View>,
      <Text key="fps" style={styles.gifFps}>
        {this.props.fps}fps
      </Text>,
    ];
  }

  generateGif(
    modified = this.props.modifiedFrames,
    collection = this.props.framesCollection,
    order = this.props.framesOrder,
    width = this.props.imageSize.width,
    height = this.props.imageSize.height,
    fps = this.props.fps,
  ) {
    const gifLength = order.length;

    this.workerPool.startOver(modified.length);

    modified.forEach((frameObj) => {
      const id = Object.keys(frameObj)[0];
      this.workerPool.postMessage({
        frameUUID: id,
        frameNum: frameObj[id],
        framesLength: gifLength,
        // need this [...] otherwise will be object like {"0":0} after
        // JSON.stringify(Uint8ClampedArray naturalImageData.data) ,
        // for postMessage() and onmessage() only eat string in
        // react-native-threads, and since [] instead of Uint8ClampedArray
        // also works well in getImagePixels() of `src/libs/gif/GIFEncoder.js`,
        // so [...] here is ok
        imageData: [...collection[id].naturalImageData.data],
        height,
        width,
        fps,
      });
    });
  }

  addFrame() {
    this.props.addFrame(
      this.props.imageSize.width,
      this.props.imageSize.height,
    );
    this.setState({frameAdded: true});
  }

  stylesToCenter() {
    const root = this,
      getRatio = (val1, val2) => (val1 > val2 ? 1 : val1 / val2);

    const getWidth = () =>
      100 * getRatio(root.props.imageSize.width, root.props.imageSize.height) +
      '%';

    const getPadding = () => {
      const vertical =
        50 *
          (1 -
            getRatio(root.props.imageSize.height, root.props.imageSize.width)) +
        '%';
      return vertical;
    };

    return {
      height: '100%',
      width: getWidth(),
      paddingVertical: getPadding(),
    };
  }

  render() {
    return this.props.hidden ? null : (
      <View style={styles.container}>
        <View style={styles.gifContainer}>
          <View style={styles.gif}>{this.getGifImage()}</View>
        </View>
        <ScrollView
          style={styles.frames}
          horizontal={true}
          ref={(b) => (this._addButton = b)}>
          {this.getFrames()}
          <TouchableOpacity
            style={styles.framesAddframe}
            onPress={this.addFrame.bind(this)}>
            <Image
              source={require('../../images/plus.png')}
              style={styles.framesAddframeIcon}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  gifContainer: {
    width: 55,
    height: 50,
    paddingRight: 5,
    borderRightWidth: 1,
    borderColor: '#6d858e',
  },
  gif: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#1b2631',
    borderWidth: 4,
    borderColor: '#1b2631',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  gifImg: {
    width: '100%',
    height: '100%',
  },
  gifFps: {
    width: 23,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    textAlign: 'center',
    fontSize: 9,
    opacity: 0.8,
    color: '#5b5c5d',
    backgroundColor: '#b7b7b7',
  },
  gifLoading: {
    width: 35,
    height: 10,
  },
  frames: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    paddingLeft: 5,
    // overflow: 'hidden',
  },
  framesAddframe: {
    height: 45,
    width: 45,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1b2631',
  },
  framesAddframeIcon: {
    width: 40,
    height: 40,
    margin: 15,
  },
});

export default FramesContainer;
