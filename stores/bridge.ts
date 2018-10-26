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
import { reaction, observable } from 'mobx';
import getParsecWeb3 from '../utils/getParsecWeb3';
import persistentStore, { IPersistentStore } from './persistentStore';

@persistentStore('bridge')
export default class Bridge extends ContractStore implements IPersistentStore {
  @observable
  public ready: boolean = false;

  constructor(private account: Account, address?: string) {
    super(bridgeAbi, address as string);

    reaction(
      () => this.ready,
      () => {
        if (!this.address) {
          getParsecWeb3()
            .getConfig()
            .then((config: any) => {
              this.address = config.bridgeAddr;
            });
        }
      }
    );
  }

  public toJSON() {
    return {
      address: this.address,
    };
  }

  public fromJSON(json: any) {
    this.address = json.address;
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
    if (!this.account.account) {
      throw new Error('No Account');
    }

    return sendTransaction(getWeb3(), {
      method: this.contract.methods.finalizeExits(color),
      to: this.address,
      account: this.account.account,
    });
  }
}
