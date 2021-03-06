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
import sendTransaction from '../utils/sendTransaction';

import Account from './account';
import ContractStore from './contractStore';
// import { InflightTxReceipt } from '../utils/types';
import getParsecWeb3 from '../utils/getParsecWeb3';
import { range } from '../utils/range';
import NodeStore from './node';
import Web3 from 'web3';
import getWeb3 from '../utils/getWeb3';

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
    (event.returnValues as any)[0].toLowerCase() ===
      ourAccount.address.toLowerCase() ||
    (event.returnValues as any)[1].toLowerCase() ===
      ourAccount.address.toLowerCase()
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

    reaction(
      () => this.account.address,
      () => {
        this.balance = 0;
        this.plasmaBalance = 0;
      }
    );
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
  public toTokens(tokenCentsValue: number, precision?: number): number {
    if (this.isNft) return tokenCentsValue;

    if (precision) {
      return (
        Math.round(tokenCentsValue / 10 ** (this.decimals - precision)) /
        10 ** precision
      );
    }

    return tokenCentsValue / 10 ** this.decimals;
  }

  public transfer(to: string, amount: number): Promise<any> {
    if (!this.account.address) {
      return Promise.reject('No account');
    }

    const parsecWeb3 = getParsecWeb3();
    return (
      parsecWeb3
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
          console.log(unspent, inputs, outputs);
          return Tx.transfer(inputs, outputs);
        })
        .then((tx: Tx<any>) => {
          if (!this.account.account) {
            throw new Error('No account');
          }
          return tx.signAll(this.account.account.privateKey);
        })
        // .then((tx: Tx<any>) => tx.signWeb3(this.iWeb3 as Web3))
        .then((signedTx: Tx<any>) => {
          console.log(signedTx);
          return {
            futureReceipt: parsecWeb3.eth.sendSignedTransaction(
              signedTx.toRaw()
            ),
          };
        })
    );
  }

  // public approveAndCall(to: string, value: number, data: string): Promise<any> {
  //   return this.maybeApprove(to, value).then(() => {
  //     if (!this.account.account) {
  //       throw new Error('No account');
  //     }

  //     sendTransaction(getWeb3(), {
  //       account: this.account.account,
  //       to,
  //       data: data,
  //     })
  //     const futureReceipt = getWeb3().eth.sendTransaction({
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
    if (this.isNft) {
      return this.contract.methods
        .getApproved(value)
        .call()
        .then(operator => operator === spender);
    } else {
      return this.contract.methods
        .allowance(this.account.address, spender)
        .call()
        .then(allowance => Number(allowance) >= value);
    }
  }

  /*
  * Checks transfer allowance for a given spender. If allowance is not enough to transfer a given value,
  * initiates an approval transaction for 2^256 units. Approving maximum possible amount to make `approve` tx
  * one time only — subsequent calls won't requre approve anymore.
  * @param spender Account to approve transfer for
  * @param value Minimal amount of allowance a spender should have
  * @returns Promise resolved when allowance is enough for the transfer
  */
  public maybeApprove(spender: string, value: number): any {
    console.log('maybeApprove', spender, value);
    return this.hasEnoughAllowance(spender, value).then(hasEnoughAllowance => {
      console.log('hasEnoughAllowance');
      if (hasEnoughAllowance) return;
      console.log('hasEnoughAllowance', true);

      if (!this.account.account) {
        throw new Error('No account');
      }
      console.log('approve');
      return sendTransaction(getWeb3(), {
        method: this.contract.methods.approve(
          spender,
          this.allowanceOrTokenId(value)
        ),
        to: this.address,
        account: this.account.account,
      });
    });
  }

  toJSON() {
    return {
      address: this.address,
      color: this.color,
      symbol: this.symbol,
      name: this.name,
      balance: this.balance,
      plasmaBalance: this.plasmaBalance,
      decimals: this.decimals,
    };
  }

  static fromJSON(json: any, account: Account, node: NodeStore) {
    const token = new Token(account, json.address, json.color, node);
    token.symbol = json.symbol;
    token.name = json.name;
    token.balance = json.balance;
    token.plasmaBalance = json.plasmaBalance;
    token.decimals = json.decimals;

    return token;
  }
}
