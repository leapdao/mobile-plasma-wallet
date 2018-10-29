import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, KeyboardAvoidingView, Button, Text } from 'react-native';
import autobind from 'autobind-decorator';

@inject('account')
@observer
export default class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  @autobind
  handleReset() {
    this.props.account.privKey = null;
    this.props.navigation.navigate('Loading');
  }

  render() {
    const { account } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <SafeAreaView>
          <Text>Account</Text>
          <Text>{account.address}</Text>
          <Button title="Reset" onPress={this.handleReset} />
        </SafeAreaView>
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
