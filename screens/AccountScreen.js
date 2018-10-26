import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, KeyboardAvoidingView, View, Text } from 'react-native';

@inject('app', 'bridge', 'tokens')
@observer
export default class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View>
          <Text>Account</Text>
        </View>
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
