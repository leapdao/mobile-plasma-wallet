/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import { bridge as bridgeAbi } from '../utils/abis';

import Token from './token';
import Account from './account';
import ContractStore from './contractStore';

import getWeb3 from '../utils/getWeb3';
import sendTransaction from '../utils/sendTransaction';

export default class Bridge extends ContractStore {
  constructor(private account: Account, address?: string) {
    super(bridgeAbi, address as string);
  }

  public deposit(token: Token, amount: number): Promise<any> {
    console.log('deposit', token.symbol, amount);
    return token.maybeApprove(this.address, amount).then(() => {
      console.log('approved');
      if (!this.account.account) {
        throw new Error('No Account');
      }
      console.log('has account');
      return sendTransaction(getWeb3(), {
        method: this.contract.methods.deposit(
          this.account.address,
          amount,
          token.color
        ),
        to: this.address,
        account: this.account.account,
      });
    });
  }

  public startExit(proof: string[], outIndex: number) {
    if (!this.account.account) {
      throw new Error('No Account');
    }

    return sendTransaction(getWeb3(), {
      method: this.contract.methods.startExit(proof, outIndex),
      to: this.address,
      account: this.account.account,
    });
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
