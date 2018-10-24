/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import { observable, action, reaction, IObservableArray } from 'mobx';
import autobind from 'autobind-decorator';
import {Contract} from 'web3/types';
import { bridge as bridgeAbi } from '../utils/abis';

import Token from './token';
import Account from './account';
import ContractStore from './contractStore';

import { range } from '../utils/range';

export default class Bridge extends ContractStore {

  constructor(private account: Account, address?: string) {
    super(bridgeAbi, address as string);
  }

  public deposit(token: Token, amount: any): Promise<any> {
    if (!this.iContract) {
      throw new Error('No metamask');
    }

    const data = this.contract.methods
      .deposit(this.account.address, amount, token.color)
      .encodeABI();

    // const inflightTxReceiptPromise = token.approveAndCall(
    //   this.address,
    //   amount,
    //   data
    // );

    // this.watchTx(inflightTxReceiptPromise, 'deposit', {
    //   message: 'Deposit tokens to the bridge',
    // });

    // return inflightTxReceiptPromise;
    return Promise.resolve('0x00');
  }

  public startExit(proof: string[], outIndex: number) {
    if (!this.iContract || !this.account.address) {
      return;
    }

    const tx = this.iContract.methods.startExit(proof, outIndex).send({
      from: this.account.address,
    });

    return tx;
  }

  public finalizeExits(color: number) {
    if (!this.iContract || !this.account.address) {
      return;
    }

    const tx = this.iContract.methods.finalizeExits(color).send({
      from: this.account.address,
    });

    return tx;
  }
}
