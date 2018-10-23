import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  // Image,
  // Platform,
  ScrollView,
  StyleSheet,
  Button,
  TextInput,
  KeyboardAvoidingView,
  // Picker,
  // TouchableOpacity,
  View,
} from 'react-native';
// import { WebBrowser } from 'expo';
import autobind from 'autobind-decorator';
import Select from 'react-native-picker-select';


@observer
export default class DepositScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  @observable
  value = '0';

  @autobind
  handleChange(value) {
    this.value = value;
  }

  @autobind
  handleSubmit() {
    const { onSubmit } = this.props;
    if (onSubmit) {
      Promise.resolve(onSubmit(this.value))
        .then(() => {
          this.value = '0';
        });
    }
  }

  render() {
    const { color, onColorChange } = this.props;
    return (
      <View>
        <View style={styles.row}>
          <TextInput
            value={this.value}
            onChangeText={this.handleChange}
            keyboardType="numeric"
            style={styles.input}
            />
          <Select
            value={color}
            onValueChange={onColorChange}
            items={[
              { label: 'PSC', value: 0 },
              { label: 'SIM', value: 1 },
            ]}
            style={{
              inputIOS: inputIOSStyle,
            }}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Deposit"
            onPress={this.handleSubmit}
            />
        </View>
      </View>
    );
  }
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
  input: {
    ...inputIOSStyle,
    flex: 1,
    marginRight: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  }
});
