import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import TokenValue from './TokenValue';

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
  }

  updateScrollPosition(color) {
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
          {tokens.list.map(token => (console.log(token),
            <View style={[styles.color, { width: this.width }]} key={token.address}>
              <Text style={styles.title}>{token.name}</Text>
              <View style={styles.balances}>
                <Text style={styles.balance}>Eth: <TokenValue precision={2} value={token.balance} color={token.color} /></Text>
                <Text style={styles.balance}>Plasma: <TokenValue precision={2} value={token.plasmaBalance} color={token.color} /></Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {tokens.list.map((token, i) => (
            <View
              style={[styles.dot, i === tokens.tokenIndexForColor(app.color) && styles.activeDot]}
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
    paddingTop: 30,
  },
  color: {
    flex: 1,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balances: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  balance: {
    marginHorizontal: 5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
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
