import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import autobind from 'autobind-decorator';

import ColorSelector from '../components/ColorSelector';
import DepositForm from '../components/DepositForm';

@observer
export default class DepositScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  @observable
  color = 0;

  @autobind
  handleChange(value) {
    this.value = value;
  }

  @autobind
  handleColorChange(color) {
    this.color = color;
  }

  @autobind
  handleSubmit(value) {
    alert(`Deposit ${value} ${this.color}`);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.accountWrapper}>
          <ColorSelector
            onColorChange={this.handleColorChange}
            color={this.color}
          />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <DepositForm
            onSubmit={this.handleSubmit}
            onColorChange={this.handleColorChange}
            color={this.color}
          />
        </ScrollView>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  accountWrapper: {
    height: '25%',
  },
});
