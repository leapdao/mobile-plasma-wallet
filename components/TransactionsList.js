import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TokenValue from './TokenValue';

@inject('account')
@observer
export default class DepositScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { account } = this.props;
    return (
      <ScrollView>
        {account.transactions.map(item => (
          <View style={styles.item} key={item.hash}>
            <TokenValue value={item.value} color={item.color} />
            {!item.from && <Text>Deposit</Text>}
            {!item.to && <Text>Exit</Text>}
            {!!item.to &&
              !!item.from && (
                <Fragment>
                  {item.to.toLowerCase() === account.address && (
                    <Text>From {item.from}</Text>
                  )}
                  {item.from.toLowerCase() === account.address && (
                    <Text>To {item.to}</Text>
                  )}
                </Fragment>
              )}
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
});
