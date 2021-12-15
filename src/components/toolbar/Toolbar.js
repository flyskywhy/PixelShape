import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import ToolButton from '../toolbutton/ToolButton';
import tools from '../../defaults/tools';

const {height} = Dimensions.get('window');

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  getButtons() {
    return tools.map((toolObj, keyValue) => (
      <ToolButton
        key={keyValue}
        name={toolObj.name}
        tool={toolObj.tool}
        icon={toolObj.icon}
        iconSrc={toolObj.iconSrc}
        iconSelectedSrc={toolObj.iconSelectedSrc}
        activeTool={this.props.tool}
        setTool={this.props.setTool.bind(this)}
      />
    ));
  }

  render() {
    return this.props.visible ? (
      <View
        style={{
          position: 'absolute',
          top: (height - tools.length * 40) / 2,
          left: 0,
        }}>
        {this.getButtons()}
      </View>
    ) : null;
  }
}

export default Toolbar;
