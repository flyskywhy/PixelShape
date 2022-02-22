import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors as stylesColors} from '../../styles/variables.js';

// TODO: move this to defaults file
const defaultColor = '#b7b7b7';

class Colorpicker extends Component {
  constructor(...args) {
    super(...args);
    this.pattern = /^#([a-f0-9]{3}){1,2}$/i;
    this.state = {
      currentColor: defaultColor,
      borderColor: defaultColor,
    };
  }

  getInputColor(value) {
    if (value) {
      return value.match(this.pattern) ? value : defaultColor;
    } else {
      return defaultColor;
    }
  }

  onChange(value) {
    const color = this.getInputColor(value);
    this.setState({
      borderColor: color,
      currentColor: value,
    });
  }

  onBlur() {
    const color = this.getInputColor(this.state.currentColor);
    this.setState({
      borderColor: color,
      currentColor: color,
    });
  }

  componentWillReceiveProps(nextProps) {
    const color = this.getInputColor(nextProps.tempColor);
    this.setState({
      borderColor: color,
      currentColor: color,
    });
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
          value={this.state.currentColor}
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
