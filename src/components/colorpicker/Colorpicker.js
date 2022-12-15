import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors as stylesColors} from '../../styles/variables.js';

// TODO: move this to defaults file
const defaultColor = '#b7b7b7';

const pattern = /^#([a-f0-9]{3}){1,2}$/i;

function getInputColor(value) {
  if (value) {
    return value.match(pattern) ? value : defaultColor;
  } else {
    return defaultColor;
  }
}

class Colorpicker extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      currentColor: defaultColor,
      borderColor: defaultColor,
    };
  }

  onChange(value) {
    const color = getInputColor(value);
    this.setState({
      borderColor: color,
      currentColor: value,
    });
  }

  onBlur() {
    const color = getInputColor(this.state.currentColor);
    this.setState({
      borderColor: color,
      currentColor: color,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tempColor) {
      const color = getInputColor(nextProps.tempColor);
      return {
        borderColor: color,
        currentColor: color,
      };
    }

    return null
  }

  getUserColorsList() {
    return this.props.userColors.map((colorObj) => colorObj.color);
  }

  onClick() {
    if (!this.state.currentColor.match(this.pattern)) {
      return;
    }
    if (this.getUserColorsList().includes(this.state.currentColor)) {
      return;
    }

    this.props.addColor(this.state.currentColor);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.hexColor}
          maxLength={7}
          defaultValue={this.state.currentColor}
          placeholder="Hex"
          placeholderTextColor="#ccc"
          onChangeText={this.onChange.bind(this)}
          onBlur={this.onBlur.bind(this)}
        />

        <TouchableOpacity style={styles.add} onPress={this.onClick.bind(this)}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  hexColor: {
    color: '#ffffff',
    fontSize: 8,
    width: 40,
    height: 30,
  },
  add: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: stylesColors.seagreen,
  },
  label: {
    padding: 8,
    paddingBottom: 10,
    fontSize: 9,
    color: stylesColors.greyblue,
  },
});

export default Colorpicker;
