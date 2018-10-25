import React from 'react';
import { Output } from 'parsec-lib';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, Button, View } from 'react-native';
import autobind from 'autobind-decorator';

import AmountInput from './AmountInput';

@inject('tokens')
@observer
export default class DepositForm extends React.Component {
  @observable
  value = Output.isNFT(this.props.color) ? '' : '0';

  @autobind
  handleChange(value) {
    this.value = value;
  }

  componentWillReceiveProps({ color: nextColor }) {
    const { color } = this.props;
    if (
      Output.isNFT(nextColor) ||
      Output.isNFT(color) !== Output.isNFT(nextColor)
    ) {
      this.value = Output.isNFT(nextColor) ? '' : '0';
    }
  }

  @autobind
  handleSubmit() {
    const { onSubmit, color } = this.props;
    if (onSubmit) {
      Promise.resolve(onSubmit(this.value)).then(() => {
        this.value = Output.isNFT(color) ? '' : '0';
      });
    }
  }

  render() {
    const { color, onColorChange, tokens } = this.props;
    const token = tokens.tokenForColor(color);

    if (!token || !token.ready) {
      return null;
    }

    return (
      <View style={styles.container}>
        <AmountInput
          value={this.value}
          onChange={this.handleChange}
          color={color}
          onColorChange={onColorChange}
          balance={token.balance}
        />
        <View style={styles.row}>
          <Button
            title={`Deposit ${token.symbol}`}
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
