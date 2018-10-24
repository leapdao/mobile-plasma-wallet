import { observable, action } from 'mobx';
import autobind from 'autobind-decorator';

export default class AppStore {
  @observable
  color = 1;

  @autobind
  @action
  setColor(color) {
    this.color = color;
  }
}
