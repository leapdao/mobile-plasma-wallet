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
import getWeb3 from '../utils/getWeb3';
import autobind from 'autobind-decorator';

export default class Account {
  @observable
  private _privKey: string | null = null;
  @observable
  public ready = false;

  constructor() {
    AsyncStorage.getItem('privKey').then(privKey => {
      if (privKey) {
        this._privKey = privKey;
      }

      this.ready = true;
    });
    autorun(this.autoSaveKey);
  }

  @autobind
  private autoSaveKey() {
    if (this._privKey) {
      AsyncStorage.setItem('privKey', this._privKey);
    } else {
      AsyncStorage.removeItem('privKey');
    }
  }

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
}
