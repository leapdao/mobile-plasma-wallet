import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { StyleSheet, Button, View } from 'react-native';
import autobind from 'autobind-decorator';

import AmountInput from './AmountInput';

@observer
export default class DepositForm extends React.Component {
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
      Promise.resolve(onSubmit(this.value)).then(() => {
        this.value = '0';
      });
    }
  }

  render() {
    const { color, onColorChange } = this.props;
    return (
      <View>
        <AmountInput
          value={this.value}
          onChange={this.handleChange}
          color={color}
          onColorChange={onColorChange}
        />

        <View style={styles.row}>
          <Button title="Deposit" onPress={this.handleSubmit} />
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
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
