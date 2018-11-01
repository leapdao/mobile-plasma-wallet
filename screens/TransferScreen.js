import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import autobind from 'autobind-decorator';

import TransactionsList from '../components/TransactionsList';
import TransferForm from '../components/TransferForm';

@inject('app', 'tokens')
@observer
class TransferScreen extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    tokens: PropTypes.object,
  };

  @autobind
  handleSubmit(to, value) {
    const { app, tokens } = this.props;
    const token = tokens.tokenForColor(app.color);

    if (token) {
      return token.transfer(to, token.toCents(value)).then(
        ({ futureReceipt }) => {
          return new Promise((resolve, reject) => {
            futureReceipt.once('transactionHash', resolve);
            futureReceipt.once('error', reject);
          });
        },
        err => {
          console.error(err);
        }
      );
    }

    return undefined;
  }

  render() {
    const { app } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <TransactionsList />
        <TransferForm onSubmit={this.handleSubmit} color={app.color} />
      </KeyboardAvoidingView>
    );
  }
}

export default TransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
