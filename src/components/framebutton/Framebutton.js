import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const FrameButton = (props) => (
  <TouchableOpacity style={styles.container} onPress={props.doAction}>
    <Image source={props.icon} style={styles.icon} resizeMode="stretch" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: '#264653',
    borderRightWidth: 1,
    borderColor: '#40606d',
  },
  icon: {
    height: 24,
    width: 24,
    margin: 8,
    alignSelf: 'center',
  },
});

export default FrameButton;
