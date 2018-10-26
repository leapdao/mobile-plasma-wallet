import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import UTXOList from '../components/UTXOList';
import BottomPane from '../components/BottomPane';
import { inject } from 'mobx-react/native';

@inject('unspents', 'app', 'bridge')
export default class ExitScreen extends React.Component {
  render() {
    const { app, unspents, bridge } = this.props;
    return (
      <View style={styles.container}>
        <UTXOList />
        <BottomPane style={styles.pane}>
          <Button
            title="Finalize exits"
            onPress={() => {
              bridge.finalizeExits(app.color);
            }}
          />
          <Button
            title="Consolidate"
            onPress={() => {
              unspents.consolidate(app.color);
            }}
          />
        </BottomPane>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pane: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
});
