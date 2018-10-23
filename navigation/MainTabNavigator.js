import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import DepositScreen from '../screens/DepositScreen';
import TransferScreen from '../screens/TransferScreen';
import ExitScreen from '../screens/ExitScreen';

const DepositStack = createStackNavigator({
  Deposit: DepositScreen,
});

DepositStack.navigationOptions = {
  tabBarLabel: 'Deposit',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-log-in${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const TransferStack = createStackNavigator({
  Transfer: TransferScreen,
});

TransferStack.navigationOptions = {
  tabBarLabel: 'Transfer',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-swap${focused ? '' : '-outline'}` : 'md-swap'}
    />
  ),
};

const ExitStack = createStackNavigator({
  Exit: ExitScreen,
});

ExitStack.navigationOptions = {
  tabBarLabel: 'Exit',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-log-out${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  DepositStack,
  TransferStack,
  ExitStack,
});
