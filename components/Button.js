import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

function Button({ title, style, textStyle, onPress, ...props }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View {...props} style={[styles.container, style]}>
        {typeof title === 'string' && (
          <Text style={[styles.title, textStyle]}>{title}</Text>
        )}
        {typeof title !== 'string' && title}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  title: {
    fontSize: 18,
    color: '#2f95dc',
  },
});

export default Button;
