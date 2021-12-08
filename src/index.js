import React, {Component} from 'react';
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
