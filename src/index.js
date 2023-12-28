import React, {Component} from 'react';
import {Platform} from 'react-native';
if (Platform.OS === 'web') {
  global.Buffer = require('buffer').Buffer;
}
import {Provider} from 'react-redux';

import createStore from './store';

import PixelArtEditor from './containers/app/App';

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PixelArtEditor />
      </Provider>
    );
  }
}

export default App;
