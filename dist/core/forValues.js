"use strict";
import { createUseFactory } from "../dom/computed";
import { peek } from "./peek";
export const forValues = async (haystack, callback, scope) => {
    let cachedResult;
    const useFactory = createUseFactory(async () => {
        if (haystack._PRIVATE_DANGEROUS_isState) {
            const stateValue = peek(haystack);
            if (Array.isArray(stateValue)) {
                if (!cachedResult)
                    cachedResult = [];
                for (let i = 0; i < stateValue.length; i++) {
                    cachedResult[i] = await callback(use, scope, stateValue[i]);
                }
                cachedResult.length = stateValue.length;
            }
            else if (stateValue instanceof Map) {
                if (!cachedResult)
                    cachedResult = new Map();
                cachedResult.clear();
                for (const [key, value] of stateValue.entries()) {
                    cachedResult.set(key, await callback(use, scope, value));
                }
            }
            else if (typeof stateValue === "object" && stateValue !== null) {
                if (!cachedResult)
                    cachedResult = {};
                for (const key of Object.keys(stateValue)) {
                    cachedResult[key] = await callback(use, scope, stateValue[key]);
                }
                for (const key of Object.keys(cachedResult)) {
                    if (!(key in stateValue))
                        delete cachedResult[key];
                }
            }
            else {
                cachedResult = stateValue;
            }
        }
    });
    const { use, cleanup } = useFactory;
    try {
        if (haystack._PRIVATE_DANGEROUS_isState) {
            await useFactory.update();
            return cachedResult;
        }
        let processedValues;
        if (typeof haystack === "function") {
            const resolvedHaystack = await haystack();
            return await forValues(resolvedHaystack, callback, scope);
        }
        else if (Array.isArray(haystack)) {
            processedValues = [];
            for (let i = 0; i < haystack.length; i++) {
                processedValues[i] = await callback(use, scope, haystack[i]);
            }
        }
        else if (haystack instanceof Map) {
            processedValues = new Map();
            for (const [key, value] of haystack.entries()) {
                processedValues.set(key, await callback(use, scope, value));
            }
        }
        else if (typeof haystack === "object" && haystack !== null) {
            processedValues = {};
            const record = haystack;
            for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                    processedValues[key] = await callback(use, scope, record[key]);
                }
            }
        }
        return processedValues;
    }
    finally {
        if (!(haystack === null || haystack === void 0 ? void 0 : haystack._PRIVATE_DANGEROUS_isState)) {
            cleanup();
        }
    }
};
//# sourceMappingURL=forValues.js.map