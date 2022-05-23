"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsToPrefixItems = void 0;
var jsonschema_1 = require("../jsonschema");
var assert_1 = require("assert");
exports.itemsToPrefixItems = {
    condition: function (value) {
        return typeof value === 'object' && !Array.isArray(value) && value !== null &&
            (0, jsonschema_1.usesVocabulary)(value, '2019-09', 'https://json-schema.org/draft/2020-12/vocab/validation') &&
            'items' in value &&
            Array.isArray(value.items);
    },
    transform: function (value) {
        (0, assert_1.strict)(typeof value === 'object' && !Array.isArray(value) && value !== null);
        var items = value.items;
        Reflect.deleteProperty(value, 'items');
        return Object.assign(value, { prefixItems: items });
    }
};
