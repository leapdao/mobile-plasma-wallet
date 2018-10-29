import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { SafeAreaView } from 'react-navigation';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/AntDesign';
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
    if (this.privKey) {
      this.props.account.privKey = this.privKey;
      this.privKey = '';
      this.props.navigation.navigate('Loading');
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.iconWrapper}>
          <Icon
            color={'#ccc'}
            name={'user'}
            size={80}
            style={{ marginBottom: -3 }}
          />
        </View>
        <Button title="Generate new key" onPress={this.handleNewKey} />
        <Text style={styles.divider}>or</Text>
        <Input
          value={this.privKey}
          placeholder="Your private key"
          onChangeText={this.handlePrivKeyChange}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        <Button title="Import" onPress={this.handleImport} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  divider: {
    textAlign: 'center',
    marginVertical: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
});
