import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import KeyScreen from '../screens/KeyScreen';

const SwitchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Loading: LoadingScreen,
    Key: KeyScreen,
  },
  {
    initialRouteName: 'Loading',
  }
);

export default SwitchNavigator;
