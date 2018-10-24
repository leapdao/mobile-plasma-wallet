/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  observable,
  action,
  computed,
  autorun,
  IObservableArray,
  reaction,
} from 'mobx';
import { helpers, Tx, Input, Output, Unspent } from 'parsec-lib';
import autobind from 'autobind-decorator';
import BN from 'bn.js';
import { EventLog, Contract } from 'web3/types';
import { erc20, erc721 } from '../utils/abis';

import Account from './account';
import ContractStore from './contractStore';
// import { InflightTxReceipt } from '../utils/types';
import getParsecWeb3 from '../utils/getParsecWeb3';
import { range } from '../utils/range';
import NodeStore from './node';
import Web3 from 'web3';

const tokenInfo = (
  token: Contract,
  color: number
): Promise<[string, string, string]> => {
  return Promise.all([
    token.methods.symbol().call(),
    Output.isNFT(color) ? Promise.resolve(0) : token.methods.decimals().call(),
    token.methods.name().call(),
  ]);
};

const isOurTransfer = (event: EventLog, ourAccount: Account): boolean => {
  if (!ourAccount.address) {
    return false;
  }

  return (
    ((event.returnValues as any)[0]).toLowerCase() === ourAccount.address.toLowerCase() ||
    ((event.returnValues as any)[1]).toLowerCase() === ourAccount.address.toLowerCase()
  );
};

export default class Token extends ContractStore {
  @observable
  public tokens: IObservableArray<Token> = observable.array([]);

  private account: Account;

  public color: number;

  @observable
  public name: string = '';
  @observable
  public symbol: string = '';
  @observable
  public decimals: number = 0;
  @observable
  public balance?: number | string[];
  @observable
  public plasmaBalance?: number | string[];

  constructor(
    account: Account,
    address: string,
    color: number,
    private node: NodeStore
  ) {
    super(Output.isNFT(color) ? erc721 : erc20, address);

    this.account = account;
    this.color = color;

    autorun(this.loadBalance.bind(null, false));
    autorun(this.loadBalance.bind(null, true));
    tokenInfo(this.contract, color).then(this.setInfo);

    if (this.events) {
      this.events.on('Transfer', (event: EventLog) => {
        if (isOurTransfer(event, this.account)) {
          this.loadBalance(false);
        }
      });
    }

    reaction(() => this.node.latestBlock, this.loadBalance.bind(null, true));
  }

  @computed
  public get decimalsBalance() {
    if (this.isNft) {
      return (this.balance as string[]).length;
    }

    return this.balance && this.toTokens(this.balance as number);
  }

  @computed
  public get ready() {
    return !!this.symbol;
  }

  public get isNft() {
    return Output.isNFT(this.color);
  }

  /**
   * Converts given amount of tokens to token cents according to this token decimals.
   * Returns given value unchanged if this token is NFT.
   * @param tokenValue Amount of tokens to convert to token cents or token Id for NFT token
   */
  public toCents(tokenValue: number): number {
    if (this.isNft) return tokenValue;

    return tokenValue * 10 ** this.decimals;
  }

  /**
   * Converts given amount of token cents to the whole token according to this token decimals.
   * Returns given value unchanged if this token is NFT.
   * @param tokenValue Amount of token cents to convert to tokens or token Id for NFT token
   */
  public toTokens(tokenCentsValue: number, precision: number): number {
    if (this.isNft) return tokenCentsValue;

    if (precision) {
      return Math.round(tokenCentsValue / 10 ** (this.decimals - precision)) / 10 ** precision;
    }

    return tokenCentsValue / 10 ** this.decimals;
  }

  public transfer(to: string, amount: number): Promise<any> {
    if (!this.iWeb3 || !this.account.address) {
      return Promise.reject('No metamask');
    }

    const parsecWeb3 = getParsecWeb3();
    return parsecWeb3
      .getUnspent(this.account.address)
      .then((unspent: Array<Unspent>) => {
        if (this.isNft) {
          const found = unspent.find(
            ({ output }: Unspent) =>
              Number(output.color) === Number(this.color) &&
              output.value === amount
          );
          if (!found) {
            throw new Error('No corresponding unspent');
          }
          const { outpoint } = found;
          const inputs = [new Input(outpoint)];
          const outputs = [new Output(amount, to, this.color)];
          return Tx.transfer(inputs, outputs);
        }

        const inputs = helpers.calcInputs(
          unspent,
          this.account.address as string,
          amount,
          this.color
        );
        const outputs = helpers.calcOutputs(
          unspent,
          inputs,
          this.account.address as string,
          to,
          amount,
          this.color
        );
        return Tx.transfer(inputs, outputs);
      })
      .then((tx: Tx<any>) => tx.signWeb3(this.iWeb3 as Web3))
      .then(
        (signedTx: Tx<any>) => {
          return {
            futureReceipt: parsecWeb3.eth.sendSignedTransaction(
              signedTx.toRaw()
            ),
          };
        },
      );
  }

  // public approveAndCall(
  //   to: string,
  //   value: number,
  //   data: string
  // ): Promise<InflightTxReceipt> {
  //   if (!this.iContract) {
  //     throw new Error('No metamask');
  //   }

  //   return this.maybeApprove(to, value).then(() => {
  //     if (!this.iWeb3 || !this.account.address) {
  //       throw new Error('No metamask');
  //     }
  //     const futureReceipt = this.iWeb3.eth.sendTransaction({
  //       from: this.account.address,
  //       to,
  //       data,
  //     });
  //     return { futureReceipt }; // wrapping, otherwise PromiEvent will be returned upstream only when resolved
  //   });
  // }

  @autobind
  @action
  private setInfo([symbol, decimals, name]: [string, string, string]) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = Number(decimals);
  }

  @autobind
  @action
  private updateBalance(balance: number | string[], plasma = false) {
    if (plasma) {
      this.plasmaBalance = balance;
    } else {
      this.balance = balance;
    }
  }

  @autobind
  private loadBalance(plasma = false) {
    const contract = plasma ? this.plasmaContract : this.contract;
    if (contract && this.account.address) {
      contract.methods
        .balanceOf(this.account.address)
        .call()
        .then(balance => {
          if (this.isNft) {
            return Promise.all(
              range(0, balance - 1).map(i =>
                contract.methods
                  .tokenOfOwnerByIndex(this.account.address, i)
                  .call()
              )
            ) as Promise<string[]>;
          }

          return balance;
        })
        .then(balance => {
          this.updateBalance(balance, plasma);
        });
    }
  }

  private allowanceOrTokenId(valueOrTokenId: number) {
    if (this.isNft) return valueOrTokenId;

    return `0x${new BN(2, 10).pow(new BN(255, 10)).toString(16)}`;
  }

  private hasEnoughAllowance(spender: string, value: number): Promise<Boolean> {
    // if (this.isNft) {
    //   return this.iContract.methods
    //     .getApproved(value)
    //     .call()
    //     .then(operator => operator === spender);
    // } else {
    //   return this.iContract.methods
    //     .allowance(this.account.address, spender)
    //     .call()
    //     .then(allowance => Number(allowance) >= value);
    // }
    return Promise.resolve(true);
  }

  /*
  * Checks transfer allowance for a given spender. If allowance is not enough to transfer a given value,
  * initiates an approval transaction for 2^256 units. Approving maximum possible amount to make `approve` tx
  * one time only — subsequent calls won't requre approve anymore.
  * @param spender Account to approve transfer for
  * @param value Minimal amount of allowance a spender should have
  * @returns Promise resolved when allowance is enough for the transfer
  */
  private maybeApprove(spender: string, value: number): any {
    // return this.hasEnoughAllowance(spender, value).then(hasEnoughAllowance => {
    //   if (hasEnoughAllowance) return;

    //   const tx = this.iContract.methods
    //     .approve(spender, this.allowanceOrTokenId(value))
    //     .send({ from: this.account.address });

    //   this.watchTx(tx, 'approve', {
    //     message: `Approve bridge to transfer ${this.symbol}`,
    //     description:
    //       'Before you proceed with your tx, you need to sign a ' +
    //       `transaction to allow the bridge contract to transfer your ${
    //         this.symbol
    //       }.`,
    //   });

    //   return txSuccess(tx);
    // });
  }
}