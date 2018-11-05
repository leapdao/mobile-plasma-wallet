import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Output } from 'parsec-lib';
import TokenValue from './TokenValue';
import { shortenHex } from '../utils';

const Separator = () => <View style={styles.separator} />;

@inject('account', 'app', 'node', 'tokens')
@observer
class TransactionsList extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    app: PropTypes.object,
    node: PropTypes.object,
    tokens: PropTypes.object,
  };

  static navigationOptions = {
    header: null,
  };

  render() {
    const { account, app, node, tokens } = this.props;

    if (!tokens.tokensReady) {
      return null;
    }

    const isIcoming = tx => (tx.to || '').toLowerCase() === account.address;
    const signedValue = tx => {
      if (Output.isNFT(tx.color)) {
        return `${isIcoming(tx) ? '' : '−'}${tx.value}`;
      }

      return tx.value * (isIcoming(tx) ? 1 : -1);
    };
    const data = account.transactions
      .filter(tx => tx.color === app.color)
      .map(tx => ({
        ...tx,
        key: tx.hash,
      }));
    return (
      <FlatList
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No{' '}
            {tokens.tokenForColor(app.color) &&
              tokens.tokenForColor(app.color).symbol}{' '}
            transactions
          </Text>
        }
        onEndReached={() => {
          if (node.firstBlock > 0) {
            node.fetchOldBlocks();
          }
        }}
        onEndReachedThreshold={0.5}
        data={data}
        renderItem={({ item: tx }) => (
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
        )}
      />
    );
  }
}

export default TransactionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  item: {
    padding: 10,
  },
  value: {
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#efefef',
  },
  empty: {
    color: '#000',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
