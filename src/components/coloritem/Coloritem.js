import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const Coloritem = (props) => {
  const containerBorder = props.isActive
    ? {borderColor: '#ffffff', borderWidth: 1}
    : {};

  const labelColor = props.children === '#1B2631' ? {color: '#ffffff'} : {};

  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerBorder,
        {backgroundColor: props.color, color: props.color},
      ]}
      onPress={props.setColor}>
      {/*<Text style={[styles.label, labelColor]}>{props.children}</Text>*/}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    marginVertical: 2,
    marginHorizontal: 2,
    lineHeight: 11,
    borderRadius: 11,
    justifyContent: 'center',
  },
  label: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 8,
    width: 35,
  },
});

export default Coloritem;
