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
import { UseInstruction } from "../dom/computed";

export const forKeys = async (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForKeysCallback,
    scope: Scope
): Promise<any> => {
    let cachedResult: any;

    const useFactory = createUseFactory(async () => {
        if ((haystack as any)._PRIVATE_DANGEROUS_isState) {
            const stateValue = peek(haystack as ValueReturnCallback<any>);

            if (Array.isArray(stateValue)) {
                if (!cachedResult) cachedResult = [];
                for (let i = 0; i < stateValue.length; i++) {
                    cachedResult[i] = await callback(use, scope, i);
                }
                cachedResult.length = stateValue.length;
            } else if (stateValue instanceof Map) {
                if (!cachedResult) cachedResult = new Map();
                cachedResult.clear();
                for (const key of stateValue.keys()) {
                    cachedResult.set(key, await callback(use, scope, key));
                }
            } else if (typeof stateValue === "object" && stateValue !== null) {
                if (!cachedResult) cachedResult = {};
                for (const key of Object.keys(stateValue)) {
                    cachedResult[key] = await callback(use, scope, key);
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

        let processedKeys: any;

        if (typeof haystack === "function") {
            const resolvedHaystack = await haystack();
            return await forKeys(resolvedHaystack, callback, scope);
        } else if (Array.isArray(haystack)) {
            processedKeys = [];
            for (let i = 0; i < haystack.length; i++) {
                processedKeys[i] = await callback(use, scope, i);
            }
        } else if (haystack instanceof Map) {
            processedKeys = new Map();
            for (const key of haystack.keys()) {
                processedKeys.set(key, await callback(use, scope, key));
            }
        } else if (typeof haystack === "object" && haystack !== null) {
            processedKeys = {};
            const record = haystack as Record<string, any>;
            for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                    processedKeys[key] = await callback(use, scope, key);
                }
            }
        }

        return processedKeys;
    } finally {
        if (!(haystack as any)?._PRIVATE_DANGEROUS_isState) {
            cleanup();
        }
    }
}

export type ForKeysCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>
export type ForKeys = (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForKeysCallback,
    scope: Scope
) => Promise<any>;
