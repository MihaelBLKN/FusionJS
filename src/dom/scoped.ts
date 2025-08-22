"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Scope, scope } from "./scope";

const globalScope = scope(true);
export const scoped = (map?: { [key: string]: any }): Scope => {
    map && Object.entries(map).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(globalScope, key)) {
            throw new Error(`Key "${key}" already exists in globalScope.`);
        }

        (globalScope as any)[key] = value;
    });

    return globalScope
}

export type Scoped = (map?: { [key: string]: any }) => Scope
