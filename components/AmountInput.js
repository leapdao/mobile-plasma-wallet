import React, { Fragment } from 'react';
import { Output } from 'parsec-lib';
import { observer } from 'mobx-react';
import Select from 'react-native-picker-select';

import Input, { inputIOSStyle } from './Input';

@observer
export default class AmountInput extends React.Component {
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
