import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BottomPane({ style, ...props }) {
  return <View style={[styles.container, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: '#eaeaea',
    borderTopWidth: 1,
    paddingBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
});
