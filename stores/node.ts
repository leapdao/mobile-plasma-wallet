import { observable, reaction, action } from 'mobx';
import { Block } from 'web3/types';
import autobind from 'autobind-decorator';
import getParsecWeb3 from '../utils/getParsecWeb3';
import persistentStore, { IPersistentStore } from './persistentStore';
import { range } from '../utils/range';

@persistentStore('node1')
export default class NodeStore implements IPersistentStore {
  @observable
  public ready: boolean = false;

  @observable
  public latestBlock: number = 0;

  @observable
  private latestFetchedBlock: number = 0;

  @observable
  public blocks: Block[] = observable.array([]);

  constructor() {
    this.loadLatestBlock();
    setInterval(this.loadLatestBlock, 2000);
    reaction(
      () => this.ready,
      (_, r) => {
        r.dispose();
        reaction(() => this.latestBlock, this.fetchBlocks);
      }
    );
  }

  @autobind
  private loadLatestBlock() {
    getParsecWeb3().eth.getBlockNumber((err: any, number: number) => {
      if (this.latestBlock !== number && number) {
        this.latestBlock = number;
      }
    });
  }

  @autobind
  private fetchBlocks() {
    if (this.latestBlock !== this.latestFetchedBlock) {
      this.fetchBlocksRange(this.latestFetchedBlock, this.latestBlock).then(
        blocks => {
          this.blocks = observable.array(this.blocks.concat(blocks));
          this.latestFetchedBlock = this.latestBlock;
        }
      );
    }
  }

  @autobind
  private fetchBlocksRange(from: number, to: number): Promise<Block[]> {
    return Promise.all(
      range(from, to - 1).map(n => getParsecWeb3().eth.getBlock(n, true))
    );
  }

  @autobind
  public toJSON() {
    return {
      blocks: this.blocks,
      latestBlock: this.latestBlock,
      latestFetchedBlock: this.latestFetchedBlock,
    };
  }

  @autobind
  @action
  public fromJSON(json: {
    latestBlock: number;
    latestFetchedBlock: number;
    blocks: Block[];
  }) {
    console.log(json);
    this.latestBlock = json.latestBlock;
    this.latestFetchedBlock = json.latestFetchedBlock;
    this.blocks = json.blocks;
  }
}
