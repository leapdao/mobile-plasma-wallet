import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
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
