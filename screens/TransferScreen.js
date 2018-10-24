import React from 'react';
import { observer, inject } from 'mobx-react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import autobind from 'autobind-decorator';

import TransactionsList from '../components/TransactionsList';

@inject('app')
@observer
export default class TransferScreen extends React.Component {
  @autobind
  handleSubmit(value) {
    alert(`Deposit ${value} ${this.color}`);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <TransactionsList />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
