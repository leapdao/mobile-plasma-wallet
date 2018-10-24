import React from 'react';
import { Provider } from 'mobx-react/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppStore from './stores/app';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  stores = {
    app: new AppStore(),
  };

  render() {
    return (
      <Provider {...this.stores}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
