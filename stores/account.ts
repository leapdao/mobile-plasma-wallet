/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-underscore-dangle */

import { AsyncStorage } from 'react-native';
import { observable, computed, autorun } from 'mobx';
import { Account as Web3Account } from 'web3/types';
import autobind from 'autobind-decorator';
import persistentStore, { IPersistentStore } from './persistentStore';
import getWeb3 from '../utils/getWeb3';

@persistentStore('account')
export default class Account implements IPersistentStore {
  @observable
  private _privKey: string | null = null;

  public set privKey(privKey: string | null) {
    this._privKey = privKey;
  }

  @computed
  public get account(): Web3Account | null {
    if (!this._privKey) {
      return null;
    }

    const web3 = getWeb3();
    return web3.eth.accounts.privateKeyToAccount(this._privKey);
  }

  @computed
  public get address() {
    return this.account && this.account.address;
  }

  @autobind
  public toJSON() {
    return {
      privKey: this._privKey,
    };
  }

  public fromJSON(json: { privKey: string }) {
    this._privKey = json.privKey;
  }
}
