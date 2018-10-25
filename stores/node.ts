import { observable } from 'mobx';
import autobind from 'autobind-decorator';
import getParsecWeb3 from '../utils/getParsecWeb3';
import persistentStore, { IPersistentStore } from './persistentStore';

@persistentStore('node')
export default class NodeStore implements IPersistentStore {
  @observable
  public latestBlock: number = 0;

  constructor() {
    this.loadLatestBlock();
    setInterval(this.loadLatestBlock, 2000);
  }

  @autobind
  private loadLatestBlock() {
    getParsecWeb3().eth.getBlockNumber((err: any, number: number) => {
      if (this.latestBlock !== number) {
        this.latestBlock = number;
      }
    });
  }

  @autobind
  public toJSON() {
    return {
      latestBlock: this.latestBlock,
    };
  }

  @autobind
  public fromJSON({ latestBlock }: { latestBlock: number }) {
    this.latestBlock = latestBlock;
  }
}
