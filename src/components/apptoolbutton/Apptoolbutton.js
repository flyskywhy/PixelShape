import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const AppToolButton = (props) => (
  <TouchableOpacity
    style={[styles.container, {opacity: props.disabled ? 0.5 : 1}]}
    onPress={props.doAction}>
    <Image
      source={props.icon}
      style={[styles.icon, {width: props.width, height: props.height}]}
      resizeMode="stretch"
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    backgroundColor: 'transparent',
    // backgroundColor: '#264653',
    // borderRightWidth: 1,
    // borderColor: '#40606d',
  },
  icon: {
    height: 24,
    width: 24,
    margin: 10,
    alignSelf: 'center',
  },
});

export default AppToolButton;
