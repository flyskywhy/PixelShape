import styles from './app.style.js';

import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
// import Toolbar from '../../containers/toolbar/Toolbar';
// import Surface from '../../containers/surface/Surface';
// import Sidebar from '../../containers/sidebar/Sidebar';
// import Framebar from '../../containers/framebar/Framebar';
// import Apptoolbox from '../../containers/apptoolbox/Apptoolbox';

class App extends Component {
  applyConstraints() {
    this.props.setSurfaceConstraints(
      Dimensions.get('window').width,
      Dimensions.get('window').height,
    );
  }

  componentDidMount() {
    this.applyConstraints();
  }

  componentDidUpdate() {
    this.applyConstraints();
  }

  render() {
    return (
      <View style={styles.app} data-guid={this.props.guid}>
        {/*
        <Toolbar />
        */}
        <View style={styles.appContent}>
          {/*
          <Apptoolbox />
          <Surface />
          <Framebar />
          */}
        </View>
        {/*
        <Sidebar />
        */}
      </View>
    );
  }
}

export default App;
