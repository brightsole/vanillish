declare class Store {
    store: LocalForage;
    constructor(options?: {
        name: string;
        storeLib: LocalForage;
    });
    setItem(itemData: any): Promise<any>;
    getItem(key: any): Promise<any>;
    getAll(): Promise<any[]>;
    deleteItem(key: any): Promise<void>;
    deleteAll(): Promise<void>;
    query(query: any): Promise<any[]>;
}
export default Store;
