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
import base64 from 'base64-js';
import Frame from '../frame/Frame';
import {PixelShapeContext} from '../../context';
import GifEncoder from '../../libs/GifEncoder';

if (Platform.OS === 'web') {
  var Image = require('react-native').Image;
} else {
  var Image = require('react-native-fast-image');
}

class FramesContainer extends Component {
  static contextType = PixelShapeContext;

  constructor(props) {
    super(props);

    this.state = {
      modifiedFrames: props.modifiedFrames,

      frameAdded: false,
      loading: false,
      gifImgSrc: '',
    };
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

    let elements = [
      <View key="image" style={this.stylesToCenter()}>
        <ImageBackground
          style={styles.gifImg}
          source={require('../../images/tile-light-16.png')}
          resizeMethod="resize"
          resizeMode="repeat">
          <Image style={styles.gifImg} source={{uri: this.state.gifImgSrc}} />
        </ImageBackground>
      </View>,
    ];

    if (!this.context.fpsController) {
      elements.push(
        <Text key="fps" style={styles.gifFps}>
          {this.props.fps}fps
        </Text>,
      );
    }

    return elements;
  }

  onClickGifImage() {
    this.context.onClickGifImage && this.context.onClickGifImage();
  }

  generateGif(
    modified = this.props.modifiedFrames,
    collection = this.props.framesCollection,
    order = this.props.framesOrder,
    width = this.props.imageSize.width,
    height = this.props.imageSize.height,
    fps = this.props.fps,
  ) {
    const gif = GifEncoder({
      collection,
      order,
      width,
      height,
      fps,
    });

    this.context.onGifGeneratePost &&
      this.context.onGifGeneratePost({
        fps: this.props.fps,
        gif,
      });

    this.setState({
      loading: false,
      gifImgSrc: `data:image/gif;base64,${base64.fromByteArray(gif)}`,
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
        <TouchableOpacity
          style={styles.gifContainer}
          onPress={this.onClickGifImage.bind(this)}>
          <View style={styles.gif}>{this.getGifImage()}</View>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
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
