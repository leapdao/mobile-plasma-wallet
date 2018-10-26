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

import AmountInput from './AmountInput';

@inject('tokens')
@observer
export default class DepositForm extends React.Component {
  @observable
  value = Output.isNFT(this.props.color) ? '' : '0';

  @observable
  sending = false;

  @autobind
  handleChange(value) {
    this.value = value;
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
    if (onSubmit && value) {
      Alert.alert(
        'Deposit',
        `${this.value} ${token.symbol}`,
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
                    console.log('deposit', txHash);
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
      <View style={styles.container}>
        <AmountInput
          value={this.value}
          onChange={this.handleChange}
          color={color}
          balance={token.balance}
          disabled={this.sending}
        />
        <View style={styles.row}>
          {this.sending && <ActivityIndicator size="small" />}
          {!this.sending && (
            <Button
              title={`Deposit ${token.symbol}`}
              onPress={this.handleSubmit}
            />
          )}
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
