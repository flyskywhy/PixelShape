import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {GCanvasView} from '@flyskywhy/react-native-gcanvas';
import toolsMap from '../../modules/toolsmap';
import {
  disableImageSmoothing,
  drawGrid,
  drawTile,
  resizeImageData,
  copyImageData,
} from '../../utils/canvasUtils';
import tileLight13ImageData from '../../images/tile-light-13-ImageData.js';

const minPixelGridSize = 9,
  LEFT_CLICK = 0;

class Surface extends Component {
  constructor(...args) {
    super(...args);
    this.tool = toolsMap.get(this.props.tool);
  }

  applyAllContextInformation(props) {
    this.tool.applyState(Object.assign({}, props.toolSettings));
    this.tool.applyPixelSize(props.pixelSize);
    this.ctx && this.tool._assignRenderingContext(this.ctx);
    this.buffer && this.tool._assignBufferContext(this.buffer);
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
    this.applyAllContextInformation(this.props);
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

    this.applyAllContextInformation(this.props);

    this.updateCanvasMainRendering();
  };

  onCanvasMainRenderingResize = ({width, height, canvas}) => {
    canvas.width = width;
    canvas.height = height;
    this.applyAllContextInformation(this.props);
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

    this.applyAllContextInformation(this.props);

    this.updateCanvasBuffer();
  };

  onCanvasBufferResize = ({width, height, canvas}) => {
    canvas.width = width;
    canvas.height = height;
    this.applyAllContextInformation(this.props);
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

  onCanvasGridResize = ({width, height, canvas}) => {
    canvas.width = width;
    canvas.height = height;
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
        'nearest-neighbor',
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
      // // here is how tile-light-13-ImageData.js be converted from tile-light.png
      // const tileLightImage = new Image();
      // tileLightImage.onload = () => {
      //   const space = 13;
      //   this.grid.drawImage(tileLightImage, 0, 0, tileLightImage.width, tileLightImage.height, 0, 0, space, space);
      //   setTimeout(() => {
      //     const imageData = this.grid.getImageData(0, 0, space, space);
      //     console.warn(imageData);
      //   }, 16);
      // };
      // // base64 of '../../images/tile-light.png'
      // tileLightImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAAAAACo4kLRAAAAIElEQVR42mN8zwADAnAWEwMWMFQEGf/DmR8GiZMoFAQATUsDFTL1pGoAAAAASUVORK5CYII=';

      let imageData = new ImageData(
        new Uint8ClampedArray(tileLight13ImageData),
        13,
        13,
      );
      const space = this.props.pixelSize | 0;
      if (space !== 13) {
        imageData = resizeImageData(imageData, space, space);
      }
      drawTile(this.grid, space, imageData);

      if (this.shouldShowGrid()) {
        drawGrid(this.grid, space, 0.5, true);
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // TODO: `this.tool !== prevProps.tool` is always true because they
    // are object and string; and modify `return true` in shouldComponentUpdate()
    if (this.tool !== prevProps.tool) {
      this.tool = toolsMap.get(this.props.tool);
      this.applyAllContextInformation(this.props);
      // this.applyImageData();
    }

    // if (
    //   this.tool._naturalImageData !== prevProps.currentFrame.naturalImageData
    // ) {
    //   this.applyImageData();
    // }

    this.updateCanvasMainRendering();
    this.applyImageData();
    this.updateCanvasBuffer();
    // redraw grid if imageSize changed
    if (
      this.detectImageSizeChanged(this.props, prevProps) ||
      this.props.gridShown !== prevProps.gridShown
    ) {
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
    // this.applyAllContextInformation(this.props);
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
    let canvasStyleFirst = {
      width: surfaceWidth,
      height: surfaceHeight,
    };
    let canvasStyleMargin = {
      width: surfaceWidth,
      height: surfaceHeight,
      marginTop: -surfaceHeight,
    };

    return (
      <View style={styles.container} ref={(s) => (this._surface = s)}>
        {Platform.OS === 'web' ? (
          <View style={canvasStyleFirst}>
            <canvas
              style={canvasStyleFirst}
              ref={this.initCanvasGrid}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
            />
            <canvas
              style={canvasStyleMargin}
              ref={this.initCanvasMainRendering}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
            />
            <canvas
              style={canvasStyleMargin}
              ref={this.initCanvasBuffer}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
            />
            <canvas
              style={canvasStyleMargin}
              ref={this.initCanvasHandleLayer}
              height={this.props.surfaceHeight}
              width={this.props.surfaceWidth}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
            />
          </View>
        ) : (
          <View style={canvasStyleFirst}>
            <GCanvasView
              style={canvasStyleFirst}
              onCanvasCreate={this.initCanvasGrid}
              onCanvasResize={this.onCanvasGridResize}
              isGestureResponsible={false}
            />
            <GCanvasView
              style={canvasStyleMargin}
              onCanvasCreate={this.initCanvasMainRendering}
              onCanvasResize={this.onCanvasMainRenderingResize}
              isGestureResponsible={false}
              isAutoClearRectBeforePutImageData={true}
            />
            <GCanvasView
              style={canvasStyleMargin}
              onCanvasCreate={this.initCanvasBuffer}
              onCanvasResize={this.onCanvasBufferResize}
              isGestureResponsible={false}
            />
            <GCanvasView
              style={canvasStyleMargin}
              onCanvasCreate={this.initCanvasHandleLayer}
              isGestureResponsible={true}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
            />
          </View>
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
    marginLeft: 8, // same with borderLeftWidth in components/toolbutton/ToolButton.js
  },
});

export default Surface;
