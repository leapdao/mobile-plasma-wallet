import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { reaction } from 'mobx';

@inject('bridge', 'app', 'node', 'account', 'tokens')
@observer
class LoadingScreen extends React.Component {
  static propTypes = {
    bridge: PropTypes.object,
    app: PropTypes.object,
    node: PropTypes.object,
    account: PropTypes.object,
    tokens: PropTypes.object,
    navigation: PropTypes.object,
  };

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
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
