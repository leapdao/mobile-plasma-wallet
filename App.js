import React from 'react';
import { Provider, observer } from 'mobx-react/native';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppStore from './stores/app';
import NodeStore from './stores/node';
import Account from './stores/account';
import Tokens from './stores/tokens';
import Bridge from './stores/bridge';
import Unspents from './stores/unspents';

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const stores = {
      app: new AppStore(),
      node: new NodeStore(),
    };

    stores.account = new Account(stores.node);
    stores.bridge = new Bridge(stores.account);
    stores.tokens = new Tokens(stores.account, stores.bridge, stores.node);
    stores.unspents = new Unspents(stores.bridge, stores.account, stores.node);
    this.stores = stores;
    // AsyncStorage.clear();
  }

  render() {
    return (
      <Provider {...this.stores}>
        <View style={styles.container}>
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
