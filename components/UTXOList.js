import React, { Fragment } from 'react';
import { toJS } from 'mobx';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import TokenValue from './TokenValue';
import { shortenHex } from '../utils';
import { bufferToHex } from 'ethereumjs-util';

@inject('app', 'unspents', 'tokens')
@observer
export default class UTXOList extends React.Component {
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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        {utxoList
          .sort((a, b) => b.transaction.blockNumber - a.transaction.blockNumber)
          .map(u => (
            <View style={styles.item} key={u.outpoint.hex()}>
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
          ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
  item: {
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
});
