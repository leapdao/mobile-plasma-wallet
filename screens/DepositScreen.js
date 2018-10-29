import React from 'react';
import { observer, inject } from 'mobx-react/native';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  Button,
  Clipboard,
} from 'react-native';
import autobind from 'autobind-decorator';

import TransactionsList from '../components/TransactionsList';
import DepositForm from '../components/DepositForm';

@inject('app', 'bridge', 'tokens', 'account')
@observer
export default class DepositScreen extends React.Component {
  @autobind
  handleSubmit(value) {
    const { app, tokens, bridge, navigation } = this.props;
    const token = tokens.tokenForColor(app.color);

    if (token) {
      const txPromise = bridge.deposit(token, token.toCents(value)).then(
        ({ futureReceipt }) => {
          return new Promise((resolve, reject) => {
            futureReceipt.once('transactionHash', resolve);
            futureReceipt.once('error', reject);
            futureReceipt.then(r => resolve(r.transactionHash));
          });
        },
        err => {
          console.error(err);
        }
      );
      txPromise.then(() => {
        navigation.pop();
      });
      return txPromise;
    }
  }

  render() {
    const { app, account } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.instruction}>
          <Text style={styles.instructionText}>
            Some instructions how to fund a wallet and deposit
          </Text>
          <Text style={styles.instructionText}>
            Address:
            {'\n'}
            {account.address}
          </Text>
          <Button
            title="Copy"
            onPress={() => {
              Clipboard.setString(account.address);
            }}
          />
        </View>
        <DepositForm onSubmit={this.handleSubmit} color={app.color} />
      </KeyboardAvoidingView>
    );
  }

  _handleLearnMorePress = () => {
    // WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    // WebBrowser.openBrowserAsync(
    //   'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    // );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  instruction: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 21,
    marginVertical: 5,
  },
});
