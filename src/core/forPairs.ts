"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "./value";
import { createUseFactory } from "../dom/computed";
import { Scope } from "../dom/scope";
import { peek } from "./peek";

export const forPairs = async (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForPairsCallback,
    scope: Scope
): Promise<any> => {
    let cachedResult: any;

    const useFactory = createUseFactory(async () => {
        if ((haystack as any)._PRIVATE_DANGEROUS_isState) {
            const stateValue = peek(haystack as ValueReturnCallback<any>);

            if (Array.isArray(stateValue)) {
                if (!cachedResult) cachedResult = [];
                for (let i = 0; i < stateValue.length; i++) {
                    const [k, v] = await callback(use, scope, i, stateValue[i]);
                    cachedResult[k] = v;
                }
                cachedResult.length = stateValue.length;
            } else if (stateValue instanceof Map) {
                if (!cachedResult) cachedResult = new Map();
                cachedResult.clear();
                for (const [key, value] of stateValue.entries()) {
                    const [k, v] = await callback(use, scope, key, value);
                    cachedResult.set(k, v);
                }
            } else if (typeof stateValue === "object" && stateValue !== null) {
                if (!cachedResult) cachedResult = {};
                for (const key of Object.keys(stateValue)) {
                    const [k, v] = await callback(use, scope, key, stateValue[key]);
                    cachedResult[k] = v;
                }

                for (const key of Object.keys(cachedResult)) {
                    if (!(key in stateValue)) delete cachedResult[key];
                }
            } else {
                cachedResult = stateValue;
            }
        }
    });

    const { use, cleanup } = useFactory;

    try {
        if ((haystack as any)._PRIVATE_DANGEROUS_isState) {
            await useFactory.update();
            return cachedResult;
        }

        let processedValues: any;

        if (typeof haystack === "function") {
            const resolvedHaystack = await haystack();
            return await forPairs(resolvedHaystack, callback, scope);
        } else if (Array.isArray(haystack)) {
            processedValues = [];
            for (let i = 0; i < haystack.length; i++) {
                const [k, v] = await callback(use, scope, i, haystack[i]);
                processedValues[k] = v;
            }
        } else if (haystack instanceof Map) {
            processedValues = new Map();
            for (const [key, value] of haystack.entries()) {
                const [k, v] = await callback(use, scope, key, value);
                processedValues.set(k, v);
            }
        } else if (typeof haystack === "object" && haystack !== null) {
            processedValues = {};
            const record = haystack as Record<string, any>;
            for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                    const [k, v] = await callback(use, scope, key, record[key]);
                    processedValues[k] = v;
                }
            }
        }

        return processedValues;
    } finally {
        if (!(haystack as any)?._PRIVATE_DANGEROUS_isState) {
            cleanup();
        }
    }
};

export type ForPairsCallback = (
    use: any,
    scope: Scope,
    key: string | number,
    value: any
) => Promise<[string | number, any]>;

export type ForPairs = (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForPairsCallback,
    scope?: Scope
) => Promise<any>;
