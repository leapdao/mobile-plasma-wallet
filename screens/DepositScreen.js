import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollView, StyleSheet, KeyboardAvoidingView } from 'react-native';
import autobind from 'autobind-decorator';

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

const inputIOSStyle = {
  fontSize: 16,
  paddingTop: 13,
  paddingHorizontal: 10,
  paddingBottom: 12,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 4,
  backgroundColor: 'white',
  width: 100,
  color: 'black',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  input: {
    ...inputIOSStyle,
    flex: 1,
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
