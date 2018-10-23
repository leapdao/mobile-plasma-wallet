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
    const items = [{ label: 'PSC', value: 0 }, { label: 'SIM', value: 1 }];
    return (
      <View style={styles.container}>
        <AmountInput
          value={this.value}
          onChange={this.handleChange}
          color={color}
          onColorChange={onColorChange}
        />
        <View style={styles.row}>
          <Button
            title={`Deposit ${items[color].label}`}
            onPress={this.handleSubmit}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: '#eaeaea',
    borderTopWidth: 1,
    paddingBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
});
