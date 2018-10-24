import React from 'react';
import Web3 from 'web3';
import { Provider } from 'mobx-react/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppStore from './stores/app';

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));
console.log(web3);

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
