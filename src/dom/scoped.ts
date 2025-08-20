"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import scope from "./scope"
import { Scope } from "./scope/scope";

const globalScope = scope(true);
export default (map?: { [key: string]: any }): Scope => {
    map && Object.entries(map).forEach(([key, value]) => {
        if (globalScope.has(key)) {
            throw new Error(`Key "${key}" already exists in globalScope.`);
        }

        globalScope.set(key, value);
    });

    return globalScope
}
