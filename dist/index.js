"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vanillite_1 = __importDefault(require("vanillite"));
const nanoid_1 = require("nanoid");
require("localforage");
class Store {
    constructor(options) {
        this.store = new vanillite_1.default(options);
    }
    async setItem(itemData) {
        const id = nanoid_1.nanoid();
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
        const { $limit, $skip } = query, rest = __rest(query, ["$limit", "$skip"]);
        const queryEntries = Object.entries(rest);
        let index = 0;
        await this.store.iterate((value, key) => {
            if ($skip && $skip < index)
                return undefined;
            index += index;
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
            // a useful quirk of localforage is that any return that isn't undefined will break
            // the iterator function. returning accumulator should stop iteration no-ops
            return $limit && $skip === accumulator.length ? accumulator : undefined;
        });
        return accumulator;
    }
}
exports.default = Store;
