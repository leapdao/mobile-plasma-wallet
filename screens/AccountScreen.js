import React from 'react';
import PropTypes from 'prop-types';
import createBlockie from 'ethereum-blockies-base64';
import { SafeAreaView } from 'react-navigation';
import { observer, inject } from 'mobx-react/native';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Image,
  Alert,
} from 'react-native';
import autobind from 'autobind-decorator';
import BottomPane from '../components/BottomPane';
import Button from '../components/Button';

@inject('account')
@observer
class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    account: PropTypes.object,
    navigation: PropTypes.object,
  };

  @autobind
  handleReset() {
    Alert.alert(
      'Reset account',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            this.props.account.privKey = null;
            this.props.navigation.navigate('Loading');
          },
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    const { account } = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <SafeAreaView style={styles.innerContainer}>
          <Image
            source={{
              uri: createBlockie(account.address),
            }}
            style={styles.image}
          />
          <Text>{account.address}</Text>
        </SafeAreaView>
        <BottomPane style={styles.pane}>
          <Button title="Reset" onPress={this.handleReset} />
        </BottomPane>
      </KeyboardAvoidingView>
    );
  }
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pane: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginBottom: 20,
    marginTop: 50,
  },
});
