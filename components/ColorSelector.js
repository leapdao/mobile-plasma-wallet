import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

@inject('app')
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

  updateScrollPosition(index) {
    const offsetX = index * this.width;
    if (offsetX !== this.contentOffsetX && this.scrollView && this.width) {
      console.log(index * this.width, this.contentOffsetX);
      this.scrollView.scrollTo({
        x: offsetX,
        y: 0,
        animated: false,
      });
    }
  }

  render() {
    const { app } = this.props;
    const items = ['Parsec Token', 'Simple Token'];
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
            app.setColor(Math.round(this.contentOffsetX / this.width));
          }}
        >
          {items.map(c => (
            <View style={[styles.color, { width: this.width }]} key={c}>
              <Text style={styles.title}>{c}</Text>
              <View style={styles.balances}>
                <Text style={styles.balance}>Main: 10 PSC</Text>
                <Text style={styles.balance}>Side: 10 PSC</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {items.map((c, i) => (
            <View
              style={[styles.dot, i === app.color && styles.activeDot]}
              key={c}
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
