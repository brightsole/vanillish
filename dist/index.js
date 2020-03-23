"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vanillite_1 = __importDefault(require("vanillite"));
const nanoId = __importStar(require("nanoid"));
require("localforage");
class Store {
    constructor(options) {
        this.store = new vanillite_1.default(options);
    }
    async setItem(itemData) {
        const id = nanoId();
        const savedItem = await this.store.setItem(id, itemData);
        return Object.assign({ id }, savedItem);
    }
    async getItem(key) {
        const value = await this.store.getItem(key);
        return Object.assign({ id: key }, value);
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
                    if (!queryValue.some(val => itemParam.includes(val)))
                        return false;
                }
                else if (queryParamIsArray) {
                    // TODO: Fix typecasting
                    if (!queryValue.includes(itemParam))
                        return false;
                }
                else if (itemParamIsArray) {
                    if (!itemParam.includes(queryValue))
                        return false;
                }
                else if (queryValue !== itemParam)
                    return false;
                return match;
            }, true);
            if (isMatch)
                accumulator.push(Object.assign({ id: key }, value));
        });
        return accumulator;
    }
}
exports.default = Store;
