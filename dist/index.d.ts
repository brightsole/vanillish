import Vanillite from 'vanillite';
import { nanoid as nanoId } from 'nanoid';
import 'localforage';
declare type StorageObject = {
    id: typeof nanoId;
    [i: string]: any;
};
declare type VanillishOptions = {
    name: string;
};
declare class Store {
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
