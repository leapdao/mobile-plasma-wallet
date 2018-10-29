import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { reaction } from 'mobx';

@inject('bridge', 'app', 'node', 'account', 'tokens')
@observer
export default class KeyScreen extends React.Component {
  constructor(props) {
    super(props);
    const isReady = () =>
      this.props.bridge.ready &&
      this.props.app.ready &&
      this.props.node.ready &&
      this.props.account.ready &&
      this.props.tokens.ready;

    const navigate = () => {
      this.props.navigation.navigate(
        this.props.account.account ? 'Main' : 'Key'
      );
    };

    if (isReady()) {
      navigate();
    } else {
      reaction(isReady, (_, r) => {
        r.dispose();
        navigate();
      });
    }
  }
  render() {
    // const { account } = this.props;
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
