/**
 * Copyright (c) 2018-present, Parsec Labs (parseclabs.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import { observable, reaction, computed, action, toJS } from 'mobx';
import {
  Unspent,
  Tx,
  Period,
  Block,
  Input,
  Output,
  Type,
  Outpoint,
} from 'parsec-lib';
import { Transaction, Eth } from 'web3/types';
import { bufferToHex } from 'ethereumjs-util';

import persistentStore, { IPersistentStore } from './persistentStore';
import Bridge from './bridge';
import Account from './account';
import autobind from 'autobind-decorator';
import { range } from '../utils/range';
import getParsecWeb3 from '../utils/getParsecWeb3';
import NodeStore from './node';

const pWeb3 = getParsecWeb3();

interface ParsecTransaction extends Transaction {
  raw: string;
}

type UnspentWithTx = Unspent & { transaction: ParsecTransaction };

function entriesToObject<T>(entries: [string, T][]): { [key: string]: T } {
  return entries.reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: value,
    }),
    {}
  );
}

function makePeriodFromRange(startBlock: number, endBlock: number) {
  // ToDo: fix typing in lib
  const eth = (pWeb3 as any).eth as Eth;
  return Promise.all(
    range(startBlock, endBlock - 1).map(n => eth.getBlock(n, true))
  ).then(blocks => {
    return new Period(
      '',
      blocks.filter(a => !!a).map(({ number, timestamp, transactions }) => {
        const block = new Block(number, {
          timestamp,
          txs: (transactions as ParsecTransaction[]).map(tx =>
            Tx.fromRaw(tx.raw)
          ),
        });

        return block;
      })
    );
  });
}

@persistentStore('unspents1')
export default class Unspents implements IPersistentStore {
  @observable
  public list: Array<UnspentWithTx> = observable.array([]);

  @observable
  public pendingExits: { [key: string]: string } = {};

  @observable
  private latestBlock: number = 0;

  constructor(
    private bridge: Bridge,
    private account: Account,
    private node: NodeStore
  ) {
    reaction(() => this.account.address, this.clearUnspents);
    reaction(() => this.account.address, this.fetchUnspents);
    reaction(
      () => bridge.events,
      () => {
        if (bridge.events) {
          bridge.events.on('NewDeposit', this.fetchUnspents);
          bridge.events.on('ExitStarted', this.fetchUnspents);
        }
      }
    );
    reaction(() => this.node.latestBlock, this.fetchUnspents);
  }

  public toJSON() {
    return {
      list: toJS(
        this.list.map(u => ({
          outpoint: u.outpoint.hex(),
          output: u.output,
          transaction: u.transaction,
        }))
      ),
      pendingExits: entriesToObject(
        Object.entries(toJS(this.pendingExits)).filter(
          ([, value]) => value === 'sent'
        )
      ),
    };
  }

  public fromJSON(json: any) {
    console.log(json);
    this.list = observable.array(
      json.list.map((u: any) => {
        return {
          outpoint: Outpoint.fromRaw(u.outpoint),
          output: u.output,
          transaction: u.transaction,
        };
      })
    );
    this.pendingExits = json.pendingExits;
  }

  @computed
  public get periodBlocksRange() {
    if (this.latestBlock) {
      return [
        Math.floor(this.latestBlock / 32) * 32,
        Math.ceil(this.latestBlock / 32) * 32,
      ];
    }

    return undefined;
  }

  @autobind
  private clearUnspents() {
    this.list = observable.array([]);
    this.pendingExits = {};
    this.latestBlock = 0;
  }

  @autobind
  @action
  private updateUnspents(list: Array<UnspentWithTx>) {
    this.list = observable.array(list);
    this.pendingExits = entriesToObject(
      Object.entries(this.pendingExits).filter(([pending]) => {
        return this.list.some(u => u.outpoint.hex() === pending);
      })
    );
  }

  @autobind
  private fetchUnspents() {
    // ToDo: fix typing in lib
    const eth = (pWeb3 as any).eth as Eth;

    if (this.account.address) {
      if (this.latestBlock !== this.node.latestBlock) {
        this.latestBlock = this.node.latestBlock;
        pWeb3
          .getUnspent(this.account.address)
          .then((unspent: Array<Unspent>) => {
            return Promise.all(
              unspent.map(u => eth.getTransaction(bufferToHex(u.outpoint.hash)))
            ).then(transactions => {
              transactions.forEach((tx, i) => {
                (unspent[
                  i
                ] as UnspentWithTx).transaction = tx as ParsecTransaction;
              });

              return unspent as UnspentWithTx[];
            });
          })
          .then(this.updateUnspents);
      }
    }
  }

  @autobind
  public exitUnspent(unspent: UnspentWithTx) {
    const { blockNumber, raw } = unspent.transaction;
    const periodNumber = Math.floor(blockNumber / 32);
    const startBlock = periodNumber * 32;
    const endBlock = periodNumber * 32 + 32;
    const hex = unspent.outpoint.hex();
    this.pendingExits[hex] = 'pending';

    const removePending = () => {
      delete this.pendingExits[hex];
    };

    return makePeriodFromRange(startBlock, endBlock)
      .then(period =>
        this.bridge.startExit(
          period.proof(Tx.fromRaw(raw)),
          unspent.outpoint.index
        )
      )
      .then(({ futureReceipt }) => {
        this.pendingExits[hex] = 'sent';
        futureReceipt.once('error', removePending);
        return { futureReceipt };
      })
      .catch(removePending);
  }

  public listForColor(color: number) {
    return this.list.filter(u => u.output.color === color);
  }

  @autobind
  public consolidate(color: number) {
    if (!this.account.address) {
      return;
    }

    const list = this.listForColor(color);
    const chunks = list.reduce(
      (acc, u) => {
        const currentChunk = acc[acc.length - 1];
        currentChunk.push(u);
        if (currentChunk.length === 15) {
          acc.push([] as UnspentWithTx[]);
        }

        return acc;
      },
      [[]] as UnspentWithTx[][]
    );

    const consolidates = chunks.reduce(
      (txs, chunk) => {
        const inputs = chunk.reduce(
          (inputs, u) => {
            const index = inputs.findIndex(
              input =>
                !!(
                  input.prevout &&
                  input.prevout.hash.compare(u.outpoint.hash) === 0 &&
                  input.prevout.index === u.outpoint.index
                )
            );

            if (index === -1) {
              inputs.push(new Input(u.outpoint));
            }

            return inputs;
          },
          [] as Input[]
        );
        const value = chunk.reduce((v, u) => v + Number(u.output.value), 0);
        txs.push(
          Tx.consolidate(
            inputs,
            new Output(value, this.account.address as string, Number(color))
          )
        );
        return txs;
      },
      [] as Array<Tx<Type.CONSOLIDATE>>
    );

    consolidates.forEach(consolidate => {
      pWeb3.eth.sendSignedTransaction(consolidate.toRaw());
    });
  }
}
