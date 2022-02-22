import React from 'react';
import {View} from 'react-native';
import Colorbar from '../../containers/colorbar/Colorbar';
// import Sizerangebar from '../../containers/sizerangebar/Sizerangebar';
// import About from '../about/About';

import {colors as stylesColors} from '../../styles/variables.js';

const Sidebar = (props) =>
  props.visible ? (
    <View
      style={{
        position: 'absolute',
        top: 60,
        right: 0,
        backgroundColor: stylesColors.blue,
      }}>
      <Colorbar />
      {/*<Sizerangebar />
      <About />*/}
    </View>
  ) : null;

export default Sidebar;
