"use strict";
import { createUseFactory } from "../../dom/computed";
import { peek } from "../peek";
export const forKeys = async (haystack, callback, scope) => {
    let cachedResult;
    const useFactory = createUseFactory(async () => {
        if (haystack._PRIVATE_DANGEROUS_isState) {
            const stateValue = peek(haystack);
            if (Array.isArray(stateValue)) {
                if (!cachedResult)
                    cachedResult = [];
                for (let i = 0; i < stateValue.length; i++) {
                    cachedResult[i] = await callback(use, scope, i);
                }
                cachedResult.length = stateValue.length;
            }
            else if (stateValue instanceof Map) {
                if (!cachedResult)
                    cachedResult = new Map();
                cachedResult.clear();
                for (const key of stateValue.keys()) {
                    cachedResult.set(key, await callback(use, scope, key));
                }
            }
            else if (typeof stateValue === "object" && stateValue !== null) {
                if (!cachedResult)
                    cachedResult = {};
                for (const key of Object.keys(stateValue)) {
                    cachedResult[key] = await callback(use, scope, key);
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
        let processedKeys;
        if (typeof haystack === "function") {
            const resolvedHaystack = await haystack();
            return await forKeys(resolvedHaystack, callback, scope);
        }
        else if (Array.isArray(haystack)) {
            processedKeys = [];
            for (let i = 0; i < haystack.length; i++) {
                processedKeys[i] = await callback(use, scope, i);
            }
        }
        else if (haystack instanceof Map) {
            processedKeys = new Map();
            for (const key of haystack.keys()) {
                processedKeys.set(key, await callback(use, scope, key));
            }
        }
        else if (typeof haystack === "object" && haystack !== null) {
            processedKeys = {};
            const record = haystack;
            for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                    processedKeys[key] = await callback(use, scope, key);
                }
            }
        }
        return processedKeys;
    }
    finally {
        if (!(haystack === null || haystack === void 0 ? void 0 : haystack._PRIVATE_DANGEROUS_isState)) {
            cleanup();
        }
    }
};
//# sourceMappingURL=index.js.map