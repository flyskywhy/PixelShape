import React, {Component} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Slider from '@react-native-community/slider';
// import decorateWithKeyBindings from '../../helpers/KeyBindings';

import FrameButton from '../framebutton/Framebutton';
// import FrameButtonBig from '../framebutton/Framebuttonbig';
import FramesContainer from '../../containers/framescontainer/Framescontainer';

import debounce from '../../utils/debounce';
import {colors as stylesColors} from '../../styles/variables.js';

const {width} = Dimensions.get('window');

class Framebar extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fps: 2,
      maximized: true,
    };
    this.setFPS = debounce(this.props.setFPS, 300);

    this.goLeft = this.goLeft.bind(this);
    this.goRight = this.goRight.bind(this);

    // this.bindKeys({
    //   'alt + left': this.goLeft,
    //   'alt + right': this.goRight,
    // });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.fps !== nextProps.fps) {
      return {fps: nextProps.fps};
    }

    return null;
  }

  removeCurrentFrame() {
    this.props.removeFrame(this.props.currentFrameUUID);
  }

  moveCurrentFrameRight() {
    this.props.moveFrameRight(this.props.currentFrameUUID);
  }

  moveCurrentFrameLeft() {
    this.props.moveFrameLeft(this.props.currentFrameUUID);
  }

  duplicateCurrentFrame() {
    this.props.duplicateFrame(this.props.currentFrameUUID);
  }

  goLeft() {
    this.props.setCurrentFrame(this.props.previousFrameUUID);
  }

  goRight() {
    this.props.setCurrentFrame(this.props.nextFrameUUID);
  }

  onChange(value) {
    // setting just state, to make slider movable
    this.setState({fps: value});
    // and then setting actual fps debounced to apply changes
    this.setFPS(value);
  }

  saveCurrentFrameName() {
    this.props.updateFrameName(
      this.props.currentFrameUUID,
      this._nameInput.value,
    );
  }

  getMaximizedControls() {
    return [
      <View style={styles.gifControls} key="maxgifcontrols">
        <Slider
          step={1}
          minimumValue={1}
          maximumValue={24}
          value={this.state.fps}
          thumbTintColor="#1b2631"
          onSlidingComplete={this.onChange.bind(this)}
        />
      </View>,

      <View style={styles.framesControls} key="maxcontrols">
        <FrameButton
          btnTooltip="Duplicate"
          icon={require('../../images/duplicate.png')}
          doAction={this.duplicateCurrentFrame.bind(this)}
        />
        <FrameButton
          btnTooltip="Remove"
          icon={require('../../images/remove.png')}
          doAction={this.removeCurrentFrame.bind(this)}
        />
        <FrameButton
          btnTooltip="Move left"
          icon={require('../../images/move-left.png')}
          doAction={this.moveCurrentFrameLeft.bind(this)}
        />
        <FrameButton
          btnTooltip="Move right"
          icon={require('../../images/move-right.png')}
          doAction={this.moveCurrentFrameRight.bind(this)}
        />

        <FrameButton
          btnTooltip="Go left"
          icon={require('../../images/left-min.png')}
          doAction={this.goLeft}
        />
        <FrameButton
          btnTooltip="Go right"
          icon={require('../../images/right-min.png')}
          doAction={this.goRight}
        />
      </View>,
      /*{
      <View style={styles.framename} key="maxframename">
        <Text
          style={styles.framenameInput}
          ref={(inp) => (this._nameInput = inp)}
          key={this.props.currentFrameName}
          defaultValue={this.props.currentFrameName}
          onBlur={this.saveCurrentFrameName.bind(this)}
        />
      </View>,
      }*/
    ];
  }

  // getMinimizedControls() {
  //   return [
  //     <View style={styles.frameCounter} key="mincounter">
  //       <Text>{this.props.currentFrameIndex + 1} of </Text>
  //       <Text>{this.props.framesCount}</Text>
  //     </View>,

  //     <View
  //       style={[styles.framesControls, {height: 60}]}
  //       key="mincontrols">
  //       <FrameButtonBig
  //         btnTooltip="Go left"
  //         btnShortcut="(ALT + LEFT)"
  //         icon={require('../../images/left-min.png')}
  //         doAction={this.goLeft}
  //       />
  //       <FrameButtonBig
  //         btnTooltip="Go right"
  //         btnShortcut="(ALT + RIGHT)"
  //         icon={require('../../images/right-min.png')}
  //         doAction={this.goRight}
  //       />
  //     </View>,
  //   ];
  // }

  toggleMinimize() {
    this.setState({
      maximized: !this.state.maximized,
    });
  }

  render() {
    return this.props.visible ? (
      <View style={styles.container}>
        <View style={styles.controls}>{this.getMaximizedControls()}</View>
        <FramesContainer hidden={!this.state.maximized} />
      </View>
    ) : null;

    // return this.props.visible ? (
    //   <View style={[styles.container, {height: this.state.maximized ? 100 : 70}]}>
    //     <View style={styles.controls}>
    //       {this.state.maximized
    //         ? this.getMaximizedControls()
    //         : this.getMinimizedControls()}
    //       <View style={styles.minimize}>
    //         <TouchableOpacity
    //           style={styles.minimizeButton}"
    //           onPress={this.toggleMinimize.bind(this)}>
    //           {this.state.maximized ? 'Minimize' : 'Maximize'}
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //     <FramesContainer hidden={!this.state.maximized} />
    //   </View>
    // ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    // width: width * 0.6,
    width: width,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#3a3a3a',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    backgroundColor: stylesColors.blue,
  },
  frameCounter: {
    flex: 0.7,
    flexDirection: 'row',
    padding: 18,
    color: '#b7b7b7',
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 2,
  },
  gifControls: {
    flex: 1,
    height: 50,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  framesControls: {
    flex: 2,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  framename: {
    height: 50,
  },
  framenameInput: {
    width: 100,
    height: 20,
    paddingLeft: 3,
    marginTop: 15,
    fontFamily: 'robotothin',
    fontSize: 9,
    borderBottomWidth: 2,
    color: '#fff',
    backgroundColor: '#264653',
  },
  minimize: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  minimizeButton: {
    width: 90,
    height: 40,
    padding: 8,
    textAlign: 'center',
    color: '#b7b7b7',
    fontWeight: 'bold',
  },
});

// export default decorateWithKeyBindings(Framebar);
export default Framebar;
