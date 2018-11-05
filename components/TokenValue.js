import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react/native';

const TokenValue = ({ value, color, tokens, precision, ...props }) => {
  const token = tokens && tokens.tokenForColor(color);

  if (!token || !token.ready || value === undefined) {
    return null;
  }

  return (
    <Text {...props}>
      {Array.isArray(value) ? value.length : token.toTokens(value, precision)}{' '}
      {token.symbol}
    </Text>
  );
};

TokenValue.propTypes = {
  value: PropTypes.any,
  color: PropTypes.number.isRequired,
  tokens: PropTypes.object,
  precision: PropTypes.number,
};

export default inject('tokens')(observer(TokenValue));
