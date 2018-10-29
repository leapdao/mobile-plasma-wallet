import React from 'react';
import { View } from 'react-native';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import KeyScreen from '../screens/KeyScreen';
import ColorSelector from '../components/ColorSelector';
import DepositScreen from '../screens/DepositScreen';

const SwitchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: createStackNavigator(
      {
        Tabs: MainTabNavigator,
        Deposit: createStackNavigator(
          {
            DepositScreen,
          },
          {
            navigationOptions: {
              header: props => {
                return (
                  <ColorSelector
                    onBackPress={() => {
                      props.navigation.pop();
                    }}
                  />
                );
              },
            },
          }
        ),
      },
      {
        navigationOptions: {
          header: null,
        },
      }
    ),
    Loading: LoadingScreen,
    Key: KeyScreen,
  },
  {
    initialRouteName: 'Loading',
  }
);

export default SwitchNavigator;
