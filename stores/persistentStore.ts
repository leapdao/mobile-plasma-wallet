import { autorun, observable, decorate } from 'mobx';
import { AsyncStorage } from 'react-native';

type Store = {
  new(...args : any[]): IPersistentStore;
};

export interface IPersistentStore {
  toJSON(): {};
  fromJSON(json: {}): void;
}

export default (key: string) => <T extends Store>(StoreClass: T) => {
  class DecoratedStoreClass extends StoreClass {
    constructor(...args: any[]) {
      super(...args);

      autorun(this.autosave.bind(this));
      AsyncStorage.getItem(key).then(data => {
        if (data) {
          this.fromJSON(JSON.parse(data));
        }
        this.ready = true;
      });

      observable(this, 'ready');
    }

    public ready: boolean = false;

    private autosave() {
      if (this.ready) {
        AsyncStorage.setItem(key, JSON.stringify(this.toJSON()));
      }
    }
  }

  decorate(DecoratedStoreClass, {
    ready: observable,
  });

  return DecoratedStoreClass;
};
