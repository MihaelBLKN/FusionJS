"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ForValuesCallback } from "./forValues"
import { ValueReturnCallback } from "../value/value";
import { createUseFactory } from "../../dom/computed";
import { Scope } from "../../dom/scope/scope";
import peek from "../peek";

const forValues = async (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForValuesCallback,
    scope: Scope
): Promise<any> => {
    let cachedResult: any;

    const useFactory = createUseFactory(async () => {
        if ((haystack as any)._PRIVATE_DANGEROUS_isState) {
            const stateValue = peek(haystack as ValueReturnCallback<any>);

            if (Array.isArray(stateValue)) {
                if (!cachedResult) cachedResult = [];
                for (let i = 0; i < stateValue.length; i++) {
                    cachedResult[i] = await callback(use, scope, stateValue[i]);
                }
                cachedResult.length = stateValue.length;
            } else if (stateValue instanceof Map) {
                if (!cachedResult) cachedResult = new Map();
                cachedResult.clear();
                for (const [key, value] of stateValue.entries()) {
                    cachedResult.set(key, await callback(use, scope, value));
                }
            } else if (typeof stateValue === "object" && stateValue !== null) {
                if (!cachedResult) cachedResult = {};
                for (const key of Object.keys(stateValue)) {
                    cachedResult[key] = await callback(use, scope, stateValue[key]);
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
            return await forValues(resolvedHaystack, callback, scope);
        } else if (Array.isArray(haystack)) {
            processedValues = [];
            for (let i = 0; i < haystack.length; i++) {
                processedValues[i] = await callback(use, scope, haystack[i]);
            }
        } else if (haystack instanceof Map) {
            processedValues = new Map();
            for (const [key, value] of haystack.entries()) {
                processedValues.set(key, await callback(use, scope, value));
            }
        } else if (typeof haystack === "object" && haystack !== null) {
            processedValues = {};
            const record = haystack as Record<string, any>;
            for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                    processedValues[key] = await callback(use, scope, record[key]);
                }
            }
        }

        return processedValues;
    } finally {
        if (!(haystack as any)?._PRIVATE_DANGEROUS_isState) {
            cleanup();
        }
    }
}

export default forValues;
