import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { bufferToHex } from 'ethereumjs-util';
import { inject, observer } from 'mobx-react/native';
import TokenValue from './TokenValue';
import { shortenHex } from '../utils';

const Separator = () => <View style={styles.separator} />;

@inject('app', 'unspents', 'tokens')
@observer
class UTXOList extends React.Component {
  handleExit(u) {
    const { unspents } = this.props;
    Alert.alert(
      'Exit',
      ``,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            unspents.exitUnspent(u).then(({ futureReceipt }) => {
              futureReceipt.once('transactionHash', txHash =>
                console.log(txHash)
              );
            });
          },
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    const { unspents, app, tokens } = this.props;
    const utxoList = unspents && app && unspents.listForColor(app.color);

    if (!utxoList) {
      return null;
    }

    return (
      <FlatList
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No {tokens.tokenForColor(app.color).symbol} UTXOs
          </Text>
        }
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
        extraData={unspents.pendingExits}
        data={utxoList
          .sort((a, b) => b.transaction.blockNumber - a.transaction.blockNumber)
          .map(u => ({
            ...u,
            key: u.outpoint.hex(),
          }))}
        renderItem={({ item: u }) => (
          <View style={styles.item}>
            <TokenValue {...u.output} />
            <Text>
              Input: {shortenHex(bufferToHex(u.outpoint.hash))}:{' '}
              {u.outpoint.index} | Height: {u.transaction.blockNumber}
            </Text>

            <Fragment>
              {unspents.periodBlocksRange[0] > u.transaction.blockNumber && (
                <Fragment>
                  {!unspents.pendingExits[u.outpoint.hex()] ? (
                    <Button title="Exit" onPress={() => this.handleExit(u)} />
                  ) : (
                    <ActivityIndicator />
                  )}
                </Fragment>
              )}

              {unspents.periodBlocksRange[0] <= u.transaction.blockNumber && (
                <Text>Wait until height {unspents.periodBlocksRange[1]}</Text>
              )}
            </Fragment>
          </View>
        )}
      />
    );
  }
}

export default UTXOList;

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
  item: {
    padding: 10,
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
