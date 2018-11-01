import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Output } from 'parsec-lib';
import { observer } from 'mobx-react';
import Select from 'react-native-picker-select';

import Input, { inputIOSStyle } from './Input';

@observer
class AmountInput extends React.Component {
  static propTypes = {
    color: PropTypes.number.isRequired,
    balance: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.arrayOf(),
    ]).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { color, balance, value, onChange } = this.props;
    return (
      <Fragment>
        {Output.isNFT(color) && (
          <Select
            value={value}
            onValueChange={onChange}
            items={balance.map(v => ({ value: v, label: v, key: v }))}
            style={{
              inputIOS: inputIOSStyle,
            }}
          />
        )}
        {!Output.isNFT(color) && (
          <Input value={value} onChangeText={onChange} keyboardType="numeric" />
        )}
      </Fragment>
    );
  }
}

export default AmountInput;
