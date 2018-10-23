import { observable, action } from 'mobx';
import autobind from 'autobind-decorator';

export default class AppStore {
  @observable
  public color = 1;

  @autobind
  @action
  public setColor(color: number) {
    this.color = color;
  }
}
