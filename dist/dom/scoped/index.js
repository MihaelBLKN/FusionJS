"use strict";
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { scope } from "../scope";
const globalScope = scope(true);
export const scoped = (map) => {
    map && Object.entries(map).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(globalScope, key)) {
            throw new Error(`Key "${key}" already exists in globalScope.`);
        }
        globalScope[key] = value;
    });
    return globalScope;
};
//# sourceMappingURL=index.js.map