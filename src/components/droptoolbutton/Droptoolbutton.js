import './droptoolbutton.styl';

import React, { Component } from 'react';
import classNames from 'classnames';

// TODO: might need to use more generic reusable Toolbutton.js component
// for active button and dropdown buttons

class DropToolButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTool: this.props.tool,
      activeIcon: this.props.icon
    };
  }

  setActiveTool (toolObj) {
    this.setState({
      activeTool: toolObj.tool,
      activeIcon: toolObj.icon
    });
    this.props.setTool(toolObj.tool);
  }

  getActiveTool () {
    const classes = classNames(
      'toolbutton__active-button',
      {
        'tooltipshift': this.props.dropdownTools && this.props.dropdownTools.length
      }
    );

    return (
      <div className={classes} onClick={this.props.setTool.bind(null, this.state.activeTool)} data-tooltip={this.props.name}>
        <svg className="toolbutton__icon" viewBox="0 0 24 24" width="40" height="40">
          <use xlinkHref={`#${this.state.activeIcon}`}></use>
        </svg>
      </div>
    );
  }

  getDropdownTools () {
    return this.props.dropdownTools
      .map((toolObj, key) => {
        const classes = classNames(
          'toolbutton-dropdown__toolbutton',
          'tooltip-bottom',
          {
            'active': this.state.activeTool === toolObj.tool
          });

        return (
          <li
            key={key}
            className={classes}
            onClick={this.setActiveTool.bind(this, toolObj)}
            data-tooltip={toolObj.name}>
            <svg className="toolbutton-dropdown__toolbutton__icon" viewBox="0 0 24 24" width="40" height="40">
              <use xlinkHref={`#${toolObj.icon}`}></use>
            </svg>
          </li>
        );
      });
  }

  getDropDown () {
    if (this.props.dropdownTools) {
      return (
        <ul className="toolbutton-dropdown">
          { this.getDropdownTools() }
        </ul>
      );
    }

    return null;
  }

  render () {
    const classes = classNames(
      'toolbutton',
      'tooltip-right',
      {
        'active': this.state.activeTool === this.props.activeTool
      });

    return (
      <li className={classes}>
        { this.getActiveTool() }
        { this.getDropDown() }
      </li>
    );
  }
}

export default DropToolButton;
