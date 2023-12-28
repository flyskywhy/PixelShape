import styles from './app.style.js';

import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {PixelShapeContext} from '../../context';
import Toolbar from '../../containers/toolbar/Toolbar';
import Surface from '../../containers/surface/Surface';
import Sidebar from '../../containers/sidebar/Sidebar';
import Framebar from '../../containers/framebar/Framebar';
import Apptoolbox from '../../containers/apptoolbox/Apptoolbox';

class App extends Component {
  static contextType = PixelShapeContext;

  constructor(props, context) {
    super(props, context);

    this.context.fileExtension = this.context.fileExtension || 'gif';

    const ext = props.animationName.substring(
      props.animationName.lastIndexOf('.') + 1,
    );
    if (ext !== this.context.fileExtension) {
      const stringWithoutExt = props.animationName.substring(
        0,
        props.animationName.lastIndexOf('.') + 1,
      );
      props.setAnimationName(stringWithoutExt + this.context.fileExtension);
    }
  }

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
    const ext = this.props.animationName.substring(
      this.props.animationName.lastIndexOf('.') + 1,
    );

    return (
      <View style={styles.app} data-guid={this.props.guid}>
        <Apptoolbox />
        <View style={styles.appContent}>
          <Toolbar />
          <Surface />
          <Sidebar />
        </View>
        {ext === 'gif' && <Framebar />}
      </View>
    );
  }
}

export default App;
