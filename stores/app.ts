import { observable, action } from 'mobx';
import autobind from 'autobind-decorator';
import persistentStore, { IPersistentStore } from './persistentStore';

@persistentStore('app')
export default class AppStore implements IPersistentStore {
  @observable
  public color = 0;

  @autobind
  @action
  public setColor(color: number) {
    this.color = color;
  }

  @autobind
  public toJSON() {
    return {
      color: this.color,
    };
  }

  @autobind
  public fromJSON(json: { color: number }) {
    this.color = json.color;
  }
}
