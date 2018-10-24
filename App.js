import React from 'react';
import Web3 from 'web3';
import { Provider } from 'mobx-react/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppStore from './stores/app';
import NodeStore from './stores/node';
import Account from './stores/account';
import Tokens from './stores/tokens';
import Bridge from './stores/bridge';
import Unspents from './stores/unspents';

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const stores = {
      app: new AppStore(),
      node: new NodeStore(),
      account: new Account(),
    };
    stores.bridge = new Bridge(stores.account, '0x2ac21a06346f075cfa4c59779f85830356ea64f3');
    stores.tokens = new Tokens(stores.account, stores.bridge, stores.node);
    stores.unspents = new Unspents(stores.bridge, stores.account, stores.node);
    this.stores = stores;
  }


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
