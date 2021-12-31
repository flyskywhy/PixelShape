import React, {Component} from 'react';
import {ImageBackground, Platform, StyleSheet, View} from 'react-native';
import {GCanvasView} from '@flyskywhy/react-native-gcanvas';
import toolsMap from '../../modules/toolsmap';
import {
  disableImageSmoothing,
  drawGrid,
  resizeImageData,
  copyImageData,
} from '../../utils/canvasUtils';

const minPixelGridSize = 9,
  LEFT_CLICK = 0;

class Surface extends Component {
  constructor(...args) {
    super(...args);
    this.tool = toolsMap.get(this.props.tool);
  }

  applyAllContextInformation() {
    this.ctx && this.tool._assignRenderingContext(this.ctx);
    this.buffer && this.tool._assignBufferContext(this.buffer);
    this.tool.applyState(Object.assign({}, this.props.toolSettings));
    this.tool.applyPixelSize(this.props.pixelSize);
  }

  applyImageData() {
    this.tool._applyNaturalImageData(
      copyImageData(this.props.currentFrame.naturalImageData),
    );
  }

  detectImageSizeChanged(props, changedProps) {
    return (
      props.imageSize.width !== changedProps.imageSize.width ||
      props.imageSize.height !== changedProps.imageSize.height ||
      props.pixelSize !== changedProps.pixelSize
    );
  }

  componentDidMount() {
    this.applyAllContextInformation();
    this.applyImageData();
  }

  initCanvasMainRendering = (canvas) => {
    if (this._canvas) {
      return;
    }

    this._canvas = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this._canvas.width = this._canvas.clientWidth;
      this._canvas.height = this._canvas.clientHeight;
    }
    this.ctx = this._canvas.getContext('2d');

    this.applyAllContextInformation();

    this.updateCanvasMainRendering();
  };

  initCanvasBuffer = (canvas) => {
    if (this._buffer) {
      return;
    }

    this._buffer = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this._buffer.width = this._buffer.clientWidth;
      this._buffer.height = this._buffer.clientHeight;
    }
    this.buffer = this._buffer.getContext('2d');

    this.applyAllContextInformation();

    this.updateCanvasBuffer();
  };

  initCanvasGrid = (canvas) => {
    if (this._grid) {
      return;
    }

    this._grid = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this._grid.width = this._grid.clientWidth;
      this._grid.height = this._grid.clientHeight;
    }
    this.grid = this._grid.getContext('2d');

    this.updateCanvasGrid();
  };

  initCanvasHandleLayer = (canvas) => {
    if (this._handleLayer) {
      return;
    }

    this._handleLayer = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this._handleLayer.width = this._handleLayer.clientWidth;
      this._handleLayer.height = this._handleLayer.clientHeight;
    }
  };

  updateCanvasMainRendering = () => {
    if (this.ctx) {
      // new imageData has arrived with a new currentFrame -
      // need to apply to the surface
      const iData = resizeImageData(
        this.props.currentFrame.naturalImageData,
        this._canvas.width,
        this._canvas.height,
      );
      // this.ctx.putImageData(this.props.currentFrame.imageData, 0, 0);
      this.ctx.putImageData(iData, 0, 0);

      // disable smoothing once again, in case we faced canvas resizing and smoothing is reset
      disableImageSmoothing(this.ctx);
    }
  };

  updateCanvasBuffer = () => {
    if (this.buffer) {
      // disable smoothing once again, in case we faced canvas resizing and smoothing is reset
      disableImageSmoothing(this.buffer);
    }
  };

  updateCanvasGrid = () => {
    if (this.grid) {
      drawGrid(this.grid, this.props.pixelSize | 0, 0.5);
    }
  };

  componentDidUpdate(prevProps) {
    this.updateCanvasMainRendering();
    this.tool._applyNaturalImageData(
      copyImageData(this.props.currentFrame.naturalImageData),
    );
    this.updateCanvasBuffer();
    // redraw grid if imageSize changed
    if (this.detectImageSizeChanged(this.props, prevProps)) {
      this.updateCanvasGrid();
    }
  }

  shouldShowGrid() {
    return this.props.gridShown && this.props.pixelSize > minPixelGridSize;
  }

  updateFrameImageData() {
    this.props.updateFrameImageData(
      this.props.currentFrameUUID,
      this.tool._naturalImageData,
    );
    // this.applyImageData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.tool !== nextProps.tool) {
      this.tool = toolsMap.get(nextProps.tool);
      this.applyAllContextInformation();
      this.applyImageData();
    }

    if (
      this.tool._naturalImageData !== nextProps.currentFrame.naturalImageData
    ) {
      this.tool._applyNaturalImageData(
        copyImageData(nextProps.currentFrame.naturalImageData),
      );
    }
  }

  shouldComponentUpdate(nextProps) {
    // this is very important, since we are tracking currentFrame object
    // which is being changed all the time when framesContainer is updated
    // do not redraw component if currentFrame doesn't change
    if (this.detectImageSizeChanged(this.props, nextProps)) {
      return true;
    }
    if (this.props.projectGuid !== nextProps.projectGuid) {
      return true;
    }
    if (this.props.gridShown !== nextProps.gridShown) {
      return true;
    }
    // if (this.props.currentFrameUUID === nextProps.currentFrameUUID) return false;
    return true;
  }

  normalizeEvent(ev) {
    this.boundRect = this._canvas.getBoundingClientRect();
    return [ev.clientX - this.boundRect.left, ev.clientY - this.boundRect.top];
  }

  onMouseDown(ev) {
    if (!this.isMouseLeftBtn(ev)) {
      return;
    }
    this.tool.storeCallback = this.props.setTempColor.bind(this);
    this.tool.onMouseDown(...this.normalizeEvent(ev));
  }

  mouseMoveOffBounds(ev) {
    if (this.isToolDrawing() && !this.isInBounds(ev)) {
      this.cancelMouseDown();
      this.updateFrameImageData();
    }
  }

  onMouseMove(ev) {
    this.mouseMoveOffBounds(ev);
    // this.tool = toolsMap.get(this.props.tool);
    this.applyAllContextInformation();
    this.tool.onMouseMove(...this.normalizeEvent(ev));
  }

  onMouseUp(ev) {
    if (!this.isMouseLeftBtn(ev)) {
      return;
    }
    this.tool.onMouseUp(...this.normalizeEvent(ev));
    this.updateFrameImageData();
  }

  cancelMouseDown() {
    this.tool.cancelMouseDown();
  }

  isMouseLeftBtn(ev) {
    return ev.button === LEFT_CLICK;
  }

  isToolDrawing() {
    return this.tool.mouseDown;
  }

  isInBounds(ev) {
    return ev.target === this._handleLayer;
  }

  render() {
    const {surfaceWidth, surfaceHeight} = this.props;
    let canvasStyleMainRendering = {
      width: surfaceWidth,
      height: surfaceHeight,
    };
    let canvasStyleOther = {
      width: surfaceWidth,
      height: surfaceHeight,
      marginTop: -surfaceHeight,
    };
    return (
      <View style={styles.container} ref={(s) => (this._surface = s)}>
        {Platform.OS === 'web' ? (
          <ImageBackground
            style={canvasStyleMainRendering}
            source={require('../../images/tile-light-16.png')}
            resizeMode="repeat">
            <canvas
              style={canvasStyleMainRendering}
              ref={this.initCanvasMainRendering}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
            />
            <canvas
              style={canvasStyleOther}
              ref={this.initCanvasBuffer}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
            />
            {this.shouldShowGrid() && (
              <canvas
                style={canvasStyleOther}
                ref={this.initCanvasGrid}
                height={this.props.surfaceHeight}
                width={this.props.surfaceWidth}
              />
            )}
            <canvas
              style={canvasStyleOther}
              ref={this.initCanvasHandleLayer}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
            />
          </ImageBackground>
        ) : (
          <ImageBackground
            style={canvasStyleMainRendering}
            source={require('../../images/tile-light-16.png')}
            resizeMode="repeat">
            <GCanvasView
              style={canvasStyleMainRendering}
              onCanvasCreate={this.initCanvasMainRendering}
              isGestureResponsible={false}
            />
            <GCanvasView
              style={canvasStyleOther}
              onCanvasCreate={this.initCanvasBuffer}
              isGestureResponsible={false}
            />
            {this.shouldShowGrid() && (
              <GCanvasView
                style={canvasStyleOther}
                onCanvasCreate={this.initCanvasGrid}
                isGestureResponsible={false}
              />
            )}
            <GCanvasView
              style={canvasStyleOther}
              onCanvasCreate={this.initCanvasHandleLayer}
              isGestureResponsible={true}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
            />
          </ImageBackground>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Surface;
