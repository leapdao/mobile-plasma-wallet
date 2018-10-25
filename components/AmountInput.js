import React from 'react';
import { Output } from 'parsec-lib';
import { observer } from 'mobx-react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Select from 'react-native-picker-select';

@observer
export default class AmountInput extends React.Component {
  render() {
    const { color, balance, value, onChange } = this.props;
    return (
      <View style={styles.row}>
        {Output.isNFT(color) && (
          <Select
            value={value}
            onValueChange={onChange}
            items={balance.map(v => ({ value: v, label: v, key: v }))}
            style={{
              inputIOS: inputIOSStyle,
            }}
          />
        )}
        {!Output.isNFT(color) && (
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
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
  width: '100%',
};

const styles = StyleSheet.create({
  input: {
    ...inputIOSStyle,
    marginRight: 10,
  },
  row: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  unit: {
    width: 50,
  },
});
