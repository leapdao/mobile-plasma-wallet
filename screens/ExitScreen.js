import React from 'react';
import { StyleSheet, View } from 'react-native';
import UTXOList from '../components/UTXOList';

export default class ExitScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <UTXOList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
