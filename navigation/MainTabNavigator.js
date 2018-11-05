/* eslint-disable react/prop-types */

import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TransferScreen from '../screens/TransferScreen';
import ExitScreen from '../screens/ExitScreen';
import AccountScreen from '../screens/AccountScreen';
import ColorSelector from '../components/ColorSelector';

const stackNavigatorOptions = {
  navigationOptions: {
    header: props => {
      return (
        <ColorSelector
          onDepositPress={() => {
            props.navigation.push('Deposit');
          }}
        />
      );
    },
  },
};

const TransferStack = createStackNavigator(
  {
    Transfer: TransferScreen,
  },
  stackNavigatorOptions
);

TransferStack.navigationOptions = {
  tabBarLabel: 'Transfer',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="swap" />,
};

const ExitStack = createStackNavigator(
  {
    Exit: ExitScreen,
  },
  stackNavigatorOptions
);

ExitStack.navigationOptions = {
  tabBarLabel: 'Exit',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="logout" />,
};

const AccountStack = createStackNavigator({
  Account: AccountScreen,
});

AccountStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="user" />,
};

const TabNavigator = createBottomTabNavigator({
  // DepositStack,
  TransferStack,
  ExitStack,
  AccountStack,
});

export default TabNavigator;
