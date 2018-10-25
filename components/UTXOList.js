import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { inject } from 'mobx-react/native';
import TokenValue from './TokenValue';
import { shortenHex } from '../utils';
import { bufferToHex } from 'ethereumjs-util';

@inject('app', 'unspents')
@observer
export default class UTXOList extends React.Component {
  render() {
    const { unspents, app } = this.props;
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
