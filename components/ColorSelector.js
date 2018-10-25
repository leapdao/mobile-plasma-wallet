import React, { Component } from 'react';
import { observable, reaction } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, View, Text, StyleSheet, StatusBar } from 'react-native';
import TokenValue from './TokenValue';

function colorFromAddr(addr) {
  const base = (parseInt(addr.slice(11, 21), 16) % 10) + 2;
  const h = parseInt(addr.slice(base, base + 30), 16) % 360;
  const s = (parseInt(addr.slice(base, base + 5), 16) % 20) - 10;
  return `hsl(${h}, ${90 + s}%, 75%)`;
}

@inject('app', 'tokens')
@observer
export default class ColorSelector extends Component {
  @observable
  width = null;

  @observable
  contentOffsetX = null;

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
    if (!this.scrollView) {
      return null;
    }
    const index = this.props.tokens.tokenIndexForColor(color);
    const offsetX = index * this.width;
    if (offsetX !== this.contentOffsetX && this.scrollView && this.width) {
      // console.log(index * this.width, this.contentOffsetX);
      this.scrollView.scrollTo({
        x: offsetX,
        y: 0,
        animated: false,
      });
    }
  }

  render() {
    const { app, tokens } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          ref={view => {
            this.scrollView = view;
            this.updateScrollPosition(app.color);
          }}
          onLayout={e => {
            this.width = e.nativeEvent.layout.width;
          }}
          contentContainerStyle={styles.contentContainer}
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={e => {
            this.contentOffsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(this.contentOffsetX / this.width);
            app.setColor(tokens.list[index].color);
          }}
        >
          {tokens.list.map(token => (
            <View
              style={[
                styles.color,
                {
                  width: this.width,
                  backgroundColor: colorFromAddr(token.address),
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
            </View>
          ))}
        </ScrollView>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    backgroundColor: '#efefef',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    paddingTop: 30,
    flex: 1,
    width: 300,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  balances: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  balance: {
    marginHorizontal: 5,
    color: '#000',
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
});
