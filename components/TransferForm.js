import React from 'react';
import { Output } from 'parsec-lib';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import {
  StyleSheet,
  Button,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import autobind from 'autobind-decorator';
import { isValidAddress } from 'ethereumjs-util';

import AmountInput from './AmountInput';
import Input from './Input';
import BottomPane from './BottomPane';

@inject('tokens')
@observer
export default class TransferForm extends React.Component {
  @observable
  value = Output.isNFT(this.props.color) ? '' : '0';

  @observable
  address = '';

  @observable
  sending = false;

  @autobind
  handleChange(value) {
    this.value = value;
  }

  @autobind
  handleAddressChange(address) {
    this.address = address;
  }

  componentWillReceiveProps({ color: nextColor }) {
    const { color } = this.props;
    if (color !== nextColor) {
      if (
        Output.isNFT(nextColor) ||
        Output.isNFT(color) !== Output.isNFT(nextColor)
      ) {
        this.value = Output.isNFT(nextColor) ? '' : '0';
      }
    }
  }

  @autobind
  handleSubmit() {
    const { onSubmit, tokens, color } = this.props;
    const token = tokens.tokenForColor(color);
    const value = token.isNft ? this.value : Number(this.value);
    const address = this.address.trim();

    if (onSubmit && value && isValidAddress(address)) {
      Alert.alert(
        'Transfer',
        `${value} ${token.symbol} → ${this.address}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Submit',
            onPress: () => {
              this.sending = true;
              Promise.resolve(onSubmit(this.value))
                .then(
                  txHash => {
                    this.value = Output.isNFT(color) ? '' : '0';
                  },
                  () => Promise.resolve()
                )
                .then(() => {
                  this.sending = false;
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { color, tokens } = this.props;
    const token = tokens.tokenForColor(color);

    if (!token || !token.ready) {
      return null;
    }

    return (
      <BottomPane>
        <AmountInput
          value={this.value}
          onChange={this.handleChange}
          color={color}
          balance={token.plasmaBalance}
          disabled={this.sending}
        />
        <Input
          placeholder="Receiver address"
          value={this.address}
          onChangeText={this.handleAddressChange}
        />
        <View style={styles.row}>
          {this.sending && <ActivityIndicator size="small" />}
          {!this.sending && (
            <Button
              title={`Transfer ${token.symbol}`}
              onPress={this.handleSubmit}
            />
          )}
        </View>
      </BottomPane>
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
