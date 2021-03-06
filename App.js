import React from 'react';
import { Provider, observer } from 'mobx-react/native';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppStore from './stores/app.ts';
import NodeStore from './stores/node.ts';
import Account from './stores/account.ts';
import Tokens from './stores/tokens.ts';
import Bridge from './stores/bridge.ts';
import Unspents from './stores/unspents.ts';

@observer
class App extends React.Component {
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

export default App;

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
