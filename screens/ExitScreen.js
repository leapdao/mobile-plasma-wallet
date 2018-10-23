import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ColorSelector from '../components/ColorSelector';

export default class ExitScreen extends React.Component {
  // static navigationOptions = {
  //   header: <ColorSelector />,
  // };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>UTXOs list</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
