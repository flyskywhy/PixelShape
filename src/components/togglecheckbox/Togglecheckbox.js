import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Checkbox from 'expo-checkbox';

// this is needed to reference input from label
// so we will increase it in constructor to keep unique
let id = 0;

class ToggleCheckbox extends Component {
  constructor(...props) {
    id++;
    super(...props);
    this.state = {id};
  }

  render() {
    return (
      <View key={`togglecheckbox-${this.state.id}`} style={styles.container}>
        <Checkbox
          style={styles.checkbox}
          value={this.props.value}
          onValueChange={this.props.onChange}
          color={this.props.value ? '#70c1b3' : '#bddcd7'}
        />
        <Text style={styles.text}>{this.props.children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginVertical: 3,
    marginLeft: 24,
    marginRight: 4,
  },
  text: {
    color: 'black',
    textAlignVertical: 'center',
  },
});

export default ToggleCheckbox;
