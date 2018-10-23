import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

@observer
export default class DepositScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const transactions = [
      { value: 1, color: 0, from: '0x000', to: '0x000', hash: '0x000001' },
      { value: 0.3, color: 0, from: '0x000', to: '0x000', hash: '0x000002' },
      { value: 1, color: 0, from: '0x000', to: '0x000', hash: '0x000003' },
      { value: 1, color: 0, from: '0x000', to: '0x000', hash: '0x000004' },
      { value: 0.2, color: 0, from: '0x000', to: '0x000', hash: '0x000005' },
      { value: 1, color: 0, from: '0x000', to: '0x000', hash: '0x000006' },
      { value: 4, color: 0, from: '0x000', to: '0x000', hash: '0x000007' },
      { value: 10, color: 0, from: '0x000', to: '0x000', hash: '0x000008' },
      { value: 20, color: 0, from: '0x000', to: '0x000', hash: '0x000009' },
      { value: 1, color: 0, from: '0x000', to: '0x000', hash: '0x000010' },
    ];
    return (
      <ScrollView>
        {transactions.map(item => (
          <View style={styles.item} key={item.hash}>
            <Text>
              {item.from} → {item.to}
            </Text>
            <Text>
              {item.value} {item.color}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
    return (
      <FlatList
        data={transactions}
        keyExtractor={item => item.hash}
        renderItem={({ item }) => {
          return (
            <View style={styles.item}>
              <Text>
                {item.from} → {item.to}
              </Text>
              <Text>
                {item.value} {item.color}
              </Text>
            </View>
          );
        }}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />
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
});
