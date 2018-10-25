import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default ({ style, ...props }) => (
  <TextInput {...props} style={[style, styles.input]} />
);

export const inputIOSStyle = {
  fontSize: 16,
  paddingTop: 13,
  paddingHorizontal: 10,
  paddingBottom: 12,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 4,
  backgroundColor: 'white',
  width: 100,
  color: 'black',
  width: '100%',
};

const styles = StyleSheet.create({
  input: {
    ...inputIOSStyle,
    marginRight: 10,
    marginVertical: 5,
  },
});
