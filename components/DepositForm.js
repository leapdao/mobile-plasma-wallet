import React from 'react';
import PropTypes from 'prop-types';
import { Output } from 'parsec-lib';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import autobind from 'autobind-decorator';

import AmountInput from './AmountInput';
import BottomPane from './BottomPane';
import Button from './Button';

@inject('tokens')
@observer
class DepositForm extends React.Component {
  static propTypes = {
    color: PropTypes.number.isRequired,
    onSubmit: PropTypes.func,
    tokens: PropTypes.object,
  };

  @observable
  value = Output.isNFT(this.props.color) ? '' : '0';

  @observable
  sending = false;

  @autobind
  handleChange(value) {
    this.value = value;
  }

  componentDidUpdate({ color: prevColor }) {
    const { color } = this.props;
    if (color !== prevColor) {
      if (
        Output.isNFT(color) ||
        Output.isNFT(color) !== Output.isNFT(prevColor)
      ) {
        this.value = Output.isNFT(color) ? '' : '0';
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
      <BottomPane style={{ paddingBottom: 20 }}>
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
      </BottomPane>
    );
  }
}

export default DepositForm;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
});
