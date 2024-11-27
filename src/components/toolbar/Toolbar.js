import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import ToolButton from '../toolbutton/ToolButton';
import tools from '../../defaults/tools';

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
      <View style={[styles.container, this.props.style]}>
        {this.getButtons()}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

export default Toolbar;
