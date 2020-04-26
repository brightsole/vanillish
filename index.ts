import Ajv from 'ajv';
import Vanillite from 'vanillite';
import { nanoid as nanoId } from 'nanoid';
import 'localforage';

type StorageObject = {
  id: typeof nanoId;
  $skip?: number;
  $limit?: number;
  [i: string]: any;
};

type VanillishOptions = {
  name: string;
  schema?: any;
};

class Store {
  validate: Ajv.ValidateFunction;

  store: Vanillite<StorageObject>;

  constructor(options: VanillishOptions) {
    const { schema, ...rest } = options;

    const ajv = new Ajv({ allErrors: true });

    this.validate = ajv.compile(schema);
    this.store = new Vanillite(rest);
  }

  async setItem(itemData): Promise<StorageObject> {
    const id = nanoId();
    const item = { id, ...itemData };
    const valid = this.validate(item);
    if (!valid) throw new Error(this.validate.errors.join(', '));

    const savedItemData = await this.store.setItem(id, itemData);
    return { id, ...savedItemData };
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

    const { $limit, $skip, ...rest } = query;
    const queryEntries = Object.entries(rest);

    let index = 0;
    await this.store.iterate((value, key) => {
      if ($skip && $skip < index) return undefined;

      index += index;
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

      // a useful quirk of localforage is that any return that isn't undefined will break
      // the iterator function. returning accumulator should stop iteration no-ops
      return $limit && $skip === accumulator.length ? accumulator : undefined;
    });

    return accumulator;
  }
}

export default Store;
