import * as nanoId from 'nanoid';
import * as localForage from 'localforage';

type StorageObject = {
  id: typeof nanoId;
  [index: string]: any;
};

class Store {
  store: LocalForage;

  constructor(options = { name: 'default', storeLib: localForage }) {
    this.store = options.storeLib.createInstance(options);
  }

  async setItem(itemData) {
    const id = nanoId();
    const savedItem = await this.store.setItem(id, itemData);
    return { id, ...savedItem };
  }

  async getItem(key) {
    const value = await this.store.getItem(key);
    // TODO: Fix typecasting
    return { id: key, ...(value as any) };
  }

  async getAll() {
    const keys = await this.store.keys();
    return Promise.all(keys.map(key => this.getItem(key)));
  }

  deleteItem(key) {
    return this.store.removeItem(key);
  }

  deleteAll() {
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

      // TODO: Fix typecasting
      if (isMatch) accumulator.push({ id: key, ...(value as any) });
    });

    return accumulator;
  }
}

export default Store;
