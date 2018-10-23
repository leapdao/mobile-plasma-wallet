import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TextInput, View } from 'react-native';
import Select from 'react-native-picker-select';

@observer
export default class AmountInput extends React.Component {
  render() {
    const { color, onColorChange, value, onChange } = this.props;
    return (
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          style={styles.input}
        />
        <Select
          value={color}
          onValueChange={onColorChange}
          items={[{ label: 'PSC', value: 0 }, { label: 'SIM', value: 1 }]}
          style={{
            inputIOS: inputIOSStyle,
          }}
        />
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
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
