import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, reaction, action } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { HeaderBackButton } from 'react-navigation';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import autobind from 'autobind-decorator';
import TokenValue from './TokenValue';
import { range } from '../utils/range.ts';

function colorFromAddr(addr) {
  const base = (parseInt(addr.slice(12, 18), 16) % 10) + 2;
  const h = parseInt(addr.slice(base, base + 10), 16) % 360;
  const s = (parseInt(addr.slice(base, base + 10), 16) % 20) - 10;
  return `hsl(${h}, ${30 + s}%, 35%)`;
}

@inject('app', 'tokens')
@observer
class ColorSelector extends Component {
  static propTypes = {
    app: PropTypes.object,
    tokens: PropTypes.object,
    onDepositPress: PropTypes.func,
    onBackPress: PropTypes.func,
  };

  @observable
  width = Dimensions.get('window').width;

  @observable
  contentOffsetX = null;

  backgroundColor = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.updateScrollPosition(props.app.color);
    reaction(
      () => props.app.color,
      () => this.updateScrollPosition(props.app.color)
    );
    StatusBar.setBarStyle('light-content');
  }

  updateScrollPosition(color) {
    if (this.scrollView) {
      const index = this.props.tokens.tokenIndexForColor(color);
      const offsetX = index * this.width;
      if (offsetX !== this.contentOffsetX && this.scrollView && this.width) {
        this.scrollView.scrollTo({
          x: offsetX,
          y: 0,
          animated: false,
        });
      }
    }
  }

  @autobind
  @action
  handleScroll(e) {
    this.contentOffsetX = e.nativeEvent.contentOffset.x;
    this.backgroundColor.setValue(this.contentOffsetX);
  }

  @autobind
  @action
  handleMomentumScrollEnd(e) {
    const { app, tokens } = this.props;
    this.contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(this.contentOffsetX / this.width);
    app.setColor(tokens.list[index].color);
  }

  @autobind
  handleRef(view) {
    this.scrollView = view;
  }

  render() {
    const { app, tokens, onDepositPress, onBackPress } = this.props;
    const widths =
      tokens.list.length < 2
        ? [0, this.width]
        : range(0, tokens.list.length - 1).map(i => i * this.width);
    const colors =
      tokens.list.length < 2
        ? [
            tokens.list.length > 0
              ? colorFromAddr(tokens.list[0].address)
              : '#000',
            tokens.list.length > 0
              ? colorFromAddr(tokens.list[0].address)
              : '#000',
          ]
        : tokens.list.map(token => colorFromAddr(token.address));

    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: this.backgroundColor.interpolate({
              inputRange: widths,
              outputRange: colors,
            }),
          },
        ]}
      >
        <ScrollView
          ref={this.handleRef}
          style={styles.colors}
          contentContainerStyle={styles.contentContainer}
          pagingEnabled={true}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentOffset={{
            x: tokens.tokenIndexForColor(app.color) * this.width,
            y: 0,
          }}
          onScroll={this.handleScroll}
          onMomentumScrollEnd={this.handleMomentumScrollEnd}
        >
          {tokens.list.map(token => (
            <SafeAreaView
              style={[
                styles.color,
                {
                  width: this.width,
                },
              ]}
              key={token.address}
            >
              <Text style={styles.title}>{token.name}</Text>
              <View style={styles.balances}>
                <Text style={styles.balance}>
                  Eth:{' '}
                  <TokenValue
                    precision={2}
                    value={token.balance}
                    color={token.color}
                  />
                </Text>
                <Text style={styles.balance}>
                  Plasma:{' '}
                  <TokenValue
                    precision={2}
                    value={token.plasmaBalance}
                    color={token.color}
                  />
                </Text>
              </View>
            </SafeAreaView>
          ))}
        </ScrollView>
        <SafeAreaView style={styles.nav}>
          {onDepositPress && (
            <View
              style={[styles.navButtonWrapper, styles.depositButtonWrapper]}
            >
              <TouchableOpacity onPress={onDepositPress}>
                <Text style={styles.depositButtonText}>+ deposit</Text>
              </TouchableOpacity>
            </View>
          )}
          {onBackPress && (
            <View style={[styles.navButtonWrapper, styles.backButtonWrapper]}>
              <HeaderBackButton tintColor="white" onPress={onBackPress} />
            </View>
          )}
        </SafeAreaView>
        <View style={styles.dots}>
          {tokens.list.map((token, i) => (
            <View
              style={[
                styles.dot,
                i === tokens.tokenIndexForColor(app.color) && styles.activeDot,
              ]}
              key={token.address}
            />
          ))}
        </View>
      </Animated.View>
    );
  }
}

export default ColorSelector;

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    height: '20%',
    overflow: 'hidden',
  },
  colors: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    flex: 1,
    width: 300,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  balances: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  balance: {
    marginHorizontal: 5,
    color: '#FFF',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.3,
    marginHorizontal: 3,
    backgroundColor: 'black',
  },
  activeDot: {
    opacity: 0.5,
  },
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  navButtonWrapper: {
    position: 'absolute',
  },
  depositButtonWrapper: {
    right: 10,
  },
  backButtonWrapper: {
    left: 5,
  },
  depositButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    padding: 5,
  },
});
