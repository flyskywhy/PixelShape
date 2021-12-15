import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors as stylesColors} from '../../styles/variables.js';

class ToolButton extends Component {
  render() {
    let active = this.props.tool === this.props.activeTool;
    let icon = active ? this.props.iconSelectedSrc : this.props.iconSrc;
    let backgroundColor = active ? stylesColors.deeppaleblue : '#264653';
    let borderLeftColor = active ? '#70C1B3' : stylesColors.deeppaleblue;
    return (
      <View style={[styles.container, {borderLeftColor}]}>
        <TouchableOpacity
          onPress={this.props.setTool.bind(null, this.props.tool)}
          style={[styles.activeButton, {backgroundColor}]}>
          <Image source={icon} style={styles.icon} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    borderBottomWidth: 1,
    borderBottomColor: stylesColors.paleblue,
    borderLeftWidth: 8,
  },
  activeButton: {
    flex: 1,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 1,
  },
  icon: {
    height: 24,
    width: 24,
    // margin: 15,
    alignSelf: 'center',
  },
});

export default ToolButton;
