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
  reaction,
  IObservableArray,
  toJS,
} from 'mobx';
import autobind from 'autobind-decorator';

import { NFT_COLOR_BASE } from '../utils';
import { range } from '../utils/range';
import Account from './account';
import Token from './token';
import Bridge from './bridge';
import { Output } from 'parsec-lib';
import NodeStore from './node';
import persistentStore, { IPersistentStore } from './persistentStore';

@persistentStore('tokens')
export default class Tokens implements IPersistentStore {
  @observable
  public list: IObservableArray<Token> = observable.array([]);

  private erc20TokenCount: number;
  private nftTokenCount: number;

  @observable
  public ready: boolean = false;

  constructor(
    private account: Account,
    private bridge: Bridge,
    private node: NodeStore
  ) {
    this.erc20TokenCount = 0;
    this.nftTokenCount = 0;

    reaction(
      () => this.bridge.events,
      () => {
        if (this.bridge.events) {
          this.bridge.events.on('NewToken', this.loadTokens.bind(this));
        }
      }
    );

    // ready value would be changed in persistentStore decorator
    reaction(
      () => this.ready && !!this.bridge.address,
      (_, r) => {
        if (this.ready) {
          this.init();
          r.dispose();
        }
      }
    );
  }

  @autobind
  private init() {
    this.loadTokens();
  }

  @autobind
  @action
  private addTokens(tokens: Array<Token>) {
    if (!this.list) {
      this.list = observable.array([]);
    }
    tokens.forEach(token => {
      this.list.push(token);
    });
  }

  // @computed
  // public get ready() {
  //   if (!this.list) {
  //     return false;
  //   }
  //   return !this.list.some(token => !token.ready);
  // }

  public tokenIndexForColor(color: number) {
    return Output.isNFT(color)
      ? this.erc20TokenCount + (color - NFT_COLOR_BASE)
      : color;
  }

  public tokenForColor(color: number) {
    const index = this.tokenIndexForColor(color);
    if (index < this.list.length) {
      return this.list[index];
    }

    return null;
  }

  private loadTokenColorRange(from: number, to: number): Promise<Token>[] {
    return (range(from, to) as number[]).map(color => {
      return this.bridge.contract.methods
        .tokens(color)
        .call()
        .then(({ 0: address }) => {
          return new Token(this.account, address, color, this.node);
        });
    });
  }

  public loadTokens() {
    return Promise.all([
      this.bridge.contract.methods
        .erc20TokenCount()
        .call()
        .then(r => Number(r)),
      this.bridge.contract.methods
        .nftTokenCount()
        .call()
        .then(r => Number(r)),
    ])
      .then(([erc20TokenCount, nftTokenCount]) => {
        // load new tokens for ERC20 and ERC721 color ranges
        const tokens = Promise.all([
          ...this.loadTokenColorRange(
            this.erc20TokenCount,
            erc20TokenCount - 1
          ),
          ...this.loadTokenColorRange(
            NFT_COLOR_BASE + this.nftTokenCount,
            NFT_COLOR_BASE + nftTokenCount - 1
          ),
        ]);
        this.erc20TokenCount = erc20TokenCount;
        this.nftTokenCount = nftTokenCount;
        return tokens;
      })
      .then(this.addTokens);
  }

  public toJSON() {
    return {
      list: toJS(this.list.map(token => token.toJSON())),
      erc20TokenCount: this.erc20TokenCount,
      nftTokenCount: this.nftTokenCount,
    };
  }

  public fromJSON(json: any) {
    this.erc20TokenCount = json.erc20TokenCount;
    this.nftTokenCount = json.nftTokenCount;
    console.log(
      json.list.map((j: any) => Token.fromJSON(j, this.account, this.node))
    );
    this.list = observable.array(
      json.list.map((j: any) => Token.fromJSON(j, this.account, this.node))
    );
  }
}
