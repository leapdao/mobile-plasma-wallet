import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import DepositScreen from '../screens/DepositScreen';
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

// const DepositStack = createStackNavigator(
//   {
//     Deposit: DepositScreen,
//   },
//   stackNavigatorOptions
// );

// DepositStack.navigationOptions = {
//   tabBarLabel: 'Deposit',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? `login` : 'md-information-circle'}
//     />
//   ),
// };

const TransferStack = createStackNavigator(
  {
    Transfer: TransferScreen,
  },
  stackNavigatorOptions
);

TransferStack.navigationOptions = {
  tabBarLabel: 'Transfer',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `swap` : 'md-swap'}
    />
  ),
};

const ExitStack = createStackNavigator(
  {
    Exit: ExitScreen,
  },
  stackNavigatorOptions
);

ExitStack.navigationOptions = {
  tabBarLabel: 'Exit',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `logout` : 'md-options'}
    />
  ),
};

const AccountStack = createStackNavigator({
  Account: AccountScreen,
});

AccountStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `user` : 'md-options'}
    />
  ),
};

const TabNavigator = createBottomTabNavigator({
  // DepositStack,
  TransferStack,
  ExitStack,
  AccountStack,
});

export default TabNavigator;
