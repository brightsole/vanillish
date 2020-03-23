import Vanillite from 'vanillite';
import * as nanoId from 'nanoid';
import 'localforage';

type StorageObject = {
  id: typeof nanoId;
  [i: string]: any;
};

type VanillishOptions = {
  name: string;
};

class Store {
  store: Vanillite<StorageObject>;

  constructor(options: VanillishOptions) {
    this.store = new Vanillite(options);
  }

  async setItem(itemData): Promise<StorageObject> {
    const id = nanoId();
    const savedItem = await this.store.setItem(id, itemData);
    return { id, ...savedItem };
  }

  async getItem(key): Promise<StorageObject> {
    const value = await this.store.getItem(key);
    return { id: key, ...value };
  }

  async getAll(): Promise<Array<StorageObject>> {
    const keys = await this.store.keys();
    return Promise.all(keys.map(key => this.getItem(key)));
  }

  deleteItem(key): Promise<void> {
    return this.store.removeItem(key);
  }

  deleteAll(): Promise<void> {
    return this.store.clear();
  }

  async query(query) {
    const accumulator = [];

    const queryEntries = Object.entries(query);

    await this.store.iterate((value, key) => {
      const isMatch = queryEntries.reduce((match, [queryKey, queryValue]) => {
        const itemParam = value[queryKey];
        const itemParamIsArray = Array.isArray(itemParam);
        const queryParamIsArray = Array.isArray(queryValue);

        if (itemParamIsArray && queryParamIsArray) {
          // TODO: Fix typecasting
          if (!(queryValue as any).some(val => itemParam.includes(val)))
            return false;
        } else if (queryParamIsArray) {
          // TODO: Fix typecasting
          if (!(queryValue as any).includes(itemParam)) return false;
        } else if (itemParamIsArray) {
          if (!itemParam.includes(queryValue)) return false;
        } else if (queryValue !== itemParam) return false;

        return match;
      }, true);

      if (isMatch) accumulator.push({ id: key, ...value });
    });

    return accumulator;
  }
}

export default Store;
