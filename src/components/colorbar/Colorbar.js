import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {PixelShapeContext} from '../../context';
import Coloritem from '../coloritem/Coloritem';
import Colorpicker from '../colorpicker/Colorpicker';

import defaultColors from '../../defaults/palette';
import {colors as stylesColors} from '../../styles/variables.js';

class Colorbar extends Component {
  static contextType = PixelShapeContext;

  componentDidMount() {
    this.context.initialColor && this.props.setColor(this.context.initialColor);
  }

  getPalette(colors) {
    return colors.map((colorObj) => (
      <Coloritem
        key={colorObj.color}
        color={colorObj.color}
        isActive={colorObj.color === this.props.currentColor}
        setColor={this.props.setColor.bind(this, colorObj.color)}>
        {colorObj.color}
      </Coloritem>
    ));
  }

  getDefaultColorPalette() {
    return this.getPalette(this.context.defaultsPalette || defaultColors);
  }

  getUserColorPalette() {
    return (
      <ScrollView style={styles.userPaletteWrapper}>
        {this.getPalette(this.props.userColors)}
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.defaultPalette}>
          <Text style={styles.label}>Palette</Text>
          {this.getDefaultColorPalette()}
        </View>
        <Colorpicker
          addColor={this.props.addColor.bind(this)}
          userColors={this.props.userColors}
          tempColor={this.props.tempColor}
        />
        <View style={styles.userPalette}>
          <Text style={styles.label}>Custom</Text>
          {this.getUserColorPalette()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 45,
    alignItems: 'center',
    paddingVertical: 5,
  },
  defaultPalette: {
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: stylesColors.greyblue,
  },
  userPalette: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: stylesColors.greyblue,
    paddingBottom: 10,
  },
  userPaletteWrapper: {
    maxHeight: 80,
  },
  label: {
    paddingBottom: 10,
    fontSize: 9,
    color: stylesColors.greyblue,
  },
});

export default Colorbar;
