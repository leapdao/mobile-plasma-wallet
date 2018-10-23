import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

@observer
export default class AmountInput extends React.Component {
  render() {
    const { color, value, onChange } = this.props;
    const items = [{ label: 'PSC', value: 0 }, { label: 'SIM', value: 1 }];
    return (
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingTop: 11,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    backgroundColor: 'white',
    width: 100,
    color: 'black',
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  unit: {
    width: 50,
  },
});
