import React, {Component} from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GCanvasView} from '@flyskywhy/react-native-gcanvas';

import {disableImageSmoothing} from '../../utils/canvasUtils';
import {colors as stylesColors} from '../../styles/variables.js';

class Frame extends Component {
  initCanvas = (canvas) => {
    if (this._frameCanvas) {
      return;
    }

    this._frameCanvas = canvas;
    // should not name this.context because this.context is already be {} here and will
    // be {} again after componentDidUpdate() on react-native or react-native-web, so
    // name this.ctx
    this.ctx = this._frameCanvas.getContext('2d');
    if (Platform.OS !== 'web') {
      this.ctx.scale(
        this._frameCanvas.clientWidth / this.props.width,
        this._frameCanvas.clientHeight / this.props.height,
      );
    }
    disableImageSmoothing(this.ctx);
    this.updateFrameCanvas();
  };

  componentDidUpdate() {
    this.updateFrameCanvas();
  }

  updateFrameCanvas() {
    if (this.ctx) {
      this.ctx.putImageData(this.props.imageData, 0, 0);
    }

    // window.createImageBitmap(this.props.imageData)
    //   .then(data => this.ctx.drawImage(data, 0, 0));
  }

  render() {
    const {width, height} = this.props;

    const containerBorder = this.props.isActive
      ? {borderColor: stylesColors.seagreenlight, borderWidth: 3}
      : {};

    const canvasStyle = {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <TouchableOpacity
        style={[styles.container, containerBorder]}
        onPress={this.props.setActive}>
        <View style={this.props.stylesToCenter()}>
          <ImageBackground
            style={canvasStyle}
            source={require('../../images/tile-light-16.png')}
            resizeMode="repeat">
            {Platform.OS === 'web' ? (
              <canvas
                style={canvasStyle}
                height={height}
                width={width}
                ref={this.initCanvas}
              />
            ) : (
              <GCanvasView
                style={canvasStyle}
                onCanvasCreate={this.initCanvas}
                isGestureResponsible={false}
                isAutoClearRectBeforePutImageData={true}
              />
            )}
          </ImageBackground>
          <Text style={styles.index}>{this.props.index}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B2631',
    borderWidth: 2,
    borderColor: '#40606d',
  },
  index: {
    position: 'absolute',
    width: 12,
    height: 12,
    textAlign: 'center',
    fontSize: 9,
    color: '#5b5c5d',
    backgroundColor: '#b7b7b7',
  },
});

export default Frame;
