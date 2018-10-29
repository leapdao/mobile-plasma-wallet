import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TokenValue from './TokenValue';
import { shortenHex } from '../utils';
import { Output } from 'parsec-lib';

@inject('account')
@observer
export default class DepositScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { account } = this.props;
    const isIcoming = tx => (tx.to || '').toLowerCase() === account.address;
    const signedValue = tx => {
      if (Output.isNFT(tx.color)) {
        return `${isIcoming(tx) ? '' : '−'}${tx.value}`;
      }

      return tx.value * (isIcoming(tx) ? 1 : -1);
    };
    return (
      <ScrollView>
        {account.transactions.map(tx => (
          <View style={styles.item} key={tx.hash}>
            <TokenValue
              value={signedValue(tx)}
              color={tx.color}
              style={styles.value}
            />
            {!tx.from && <Text>Deposit</Text>}
            {!tx.to && <Text>Exit</Text>}
            {!!tx.to &&
              !!tx.from && (
                <Fragment>
                  {tx.to.toLowerCase() === account.address && (
                    <Text>From {shortenHex(tx.from)}</Text>
                  )}
                  {tx.from.toLowerCase() === account.address && (
                    <Text>To {shortenHex(tx.to)}</Text>
                  )}
                </Fragment>
              )}

            <Text>Height: {tx.blockNumber}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  item: {
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  value: {
    fontWeight: 'bold',
  },
});
