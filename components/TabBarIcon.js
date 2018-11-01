import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    focused: PropTypes.bool,
  };

  render() {
    return (
      <Icon
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
      />
    );
  }
}
