import React from 'react';
import { StyleSheet, Button, Text } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { SafeAreaView } from 'react-navigation';
import autobind from 'autobind-decorator';
import getWeb3 from '../utils/getWeb3';
import Input from '../components/Input';

@inject('account')
@observer
export default class KeyScreen extends React.Component {
  @observable
  privKey = '';

  @autobind
  handleNewKey() {
    const web3 = getWeb3();
    this.props.account.privKey = web3.eth.accounts.create().privateKey;
    this.props.navigation.navigate('Loading');
  }

  @autobind
  handlePrivKeyChange(privKey) {
    this.privKey = privKey;
  }

  @autobind
  handleImport() {
    this.props.account.privKey = this.privKey;
    this.privKey = '';
    this.props.navigation.navigate('Loading');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Create or import key here</Text>
        <Button title="Generate new key" onPress={this.handleNewKey} />
        <Text>Or</Text>
        <Input
          value={this.privKey}
          placeholder="Your private key"
          onChangeText={this.handlePrivKeyChange}
        />
        <Button title="Import" onPress={this.handleImport} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
