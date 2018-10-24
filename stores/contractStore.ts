/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import Web3 from 'web3';
import { computed, observable } from 'mobx';
import { Contract } from 'web3/types';
import { TransactionReceipt } from 'web3/types';
import getWeb3 from '../utils/getWeb3';
import getParsecWeb3 from '../utils/getParsecWeb3';
import ContractEventsSubscription from '../utils/ContractEventsSubscription';

export default class ContractStore {
  @observable
  public address: string;
  public abi: any[];
  public iWeb3?: Web3;
  private activeEventSub: ContractEventsSubscription | null = null;

  constructor(abi: any[], address: string) {
    this.abi = abi;
    this.address = address;

    // if ((window as any).web3) {
    //   this.iWeb3 = this.iWeb3 || (getWeb3(true) as Web3);
    // }
  }

  @computed
  public get events(): ContractEventsSubscription | undefined {
    if (!this.contract.options.address) return;
    console.log(
      `Setting up event listener for contract at ${
        this.contract.options.address
      }..`
    );
    if (this.activeEventSub) {
      console.log('Stopping the old subscription..');
      this.activeEventSub.stop();
    }
    this.activeEventSub = new ContractEventsSubscription(
      this.contract,
      getWeb3()
    );
    this.activeEventSub.start();
    return this.activeEventSub;
  }

  @computed
  public get contract(): Contract {
    const web3 = getWeb3() as Web3;
    return new web3.eth.Contract(this.abi, this.address);
  }

  @computed
  public get iContract(): Contract | undefined {
    if (this.iWeb3) {
      return new this.iWeb3.eth.Contract(this.abi, this.address);
    }
  }

  @computed
  public get plasmaContract(): Contract | undefined {
    const web3 = getParsecWeb3() as Web3;
    return new web3.eth.Contract(this.abi, this.address);
  }
}
