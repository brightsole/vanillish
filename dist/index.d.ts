import Ajv from 'ajv';
import Vanillite from 'vanillite';
import { nanoid as nanoId } from 'nanoid';
import 'localforage';
declare type StorageObject = {
    id: typeof nanoId;
    $skip?: number;
    $limit?: number;
    [i: string]: any;
};
declare type VanillishOptions = {
    name: string;
    schema?: any;
};
declare class Store {
    validate: Ajv.ValidateFunction;
    store: Vanillite<StorageObject>;
    constructor(options: VanillishOptions);
    setItem(itemData: any): Promise<StorageObject>;
    getItem(key: any): Promise<StorageObject>;
    getAll(): Promise<Array<StorageObject>>;
    deleteItem(key: any): Promise<void>;
    deleteAll(): Promise<void>;
    query(query: any): Promise<any[]>;
}
export default Store;
