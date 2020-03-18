"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var nanoId = require("nanoid");
var localForage = require("localforage");
var Store = /** @class */ (function () {
    function Store(options) {
        if (options === void 0) { options = { name: 'default', storeLib: localForage }; }
        this.store = options.storeLib.createInstance(options);
    }
    Store.prototype.setItem = function (itemData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, savedItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = nanoId();
                        return [4 /*yield*/, this.store.setItem(id, itemData)];
                    case 1:
                        savedItem = _a.sent();
                        return [2 /*return*/, __assign({ id: id }, savedItem)];
                }
            });
        });
    };
    Store.prototype.getItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.getItem(key)];
                    case 1:
                        value = _a.sent();
                        // TODO: Fix typecasting
                        return [2 /*return*/, __assign({ id: key }, value)];
                }
            });
        });
    };
    Store.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.keys()];
                    case 1:
                        keys = _a.sent();
                        return [2 /*return*/, Promise.all(keys.map(function (key) { return _this.getItem(key); }))];
                }
            });
        });
    };
    Store.prototype.deleteItem = function (key) {
        return this.store.removeItem(key);
    };
    Store.prototype.deleteAll = function () {
        return this.store.clear();
    };
    Store.prototype.query = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var accumulator, queryEntries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accumulator = [];
                        queryEntries = Object.entries(query);
                        return [4 /*yield*/, this.store.iterate(function (value, key) {
                                var isMatch = queryEntries.reduce(function (match, _a) {
                                    var queryKey = _a[0], queryValue = _a[1];
                                    var itemParam = value[queryKey];
                                    var itemParamIsArray = Array.isArray(itemParam);
                                    var queryParamIsArray = Array.isArray(queryValue);
                                    if (itemParamIsArray && queryParamIsArray) {
                                        // TODO: Fix typecasting
                                        if (!queryValue.some(function (val) { return itemParam.includes(val); }))
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
                                // TODO: Fix typecasting
                                if (isMatch)
                                    accumulator.push(__assign({ id: key }, value));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, accumulator];
                }
            });
        });
    };
    return Store;
}());
exports["default"] = Store;
