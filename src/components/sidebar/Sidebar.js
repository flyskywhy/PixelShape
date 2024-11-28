import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colorbar from '../../containers/colorbar/Colorbar';
// import Sizerangebar from '../../containers/sizerangebar/Sizerangebar';
// import About from '../about/About';

import {colors as stylesColors} from '../../styles/variables.js';

const Sidebar = (props) =>
  props.visible ? (
    <View style={[styles.container, props.style]}>
      <Colorbar />
      {/*<Sizerangebar />
      <About />*/}
    </View>
  ) : null;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: stylesColors.blue,
  },
});

export default Sidebar;
