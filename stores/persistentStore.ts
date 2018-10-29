import { autorun, observable, decorate, action } from 'mobx';
import { AsyncStorage } from 'react-native';

type Store = {
  new (...args: any[]): IPersistentStore;
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
      AsyncStorage.getItem(key).then(this.updateData.bind(this));
    }

    public ready: boolean = false;

    public updateData(data: string | null) {
      if (data) {
        this.fromJSON(JSON.parse(data));
      }
      this.ready = true;
    }

    private autosave() {
      if (this.ready) {
        AsyncStorage.setItem(key, JSON.stringify(this.toJSON()));
      }
    }
  }

  decorate(DecoratedStoreClass, {
    ready: observable,
    updateData: action,
  });

  return DecoratedStoreClass;
};
