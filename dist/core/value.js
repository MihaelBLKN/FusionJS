"use strict";
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { signal } from "./signal";
export const value = (initialValue, scope) => {
    let currentValue = initialValue;
    let changedSignal = signal();
    const deconstructorsScope = scope === null || scope === void 0 ? void 0 : scope.getDeconstructors();
    deconstructorsScope === null || deconstructorsScope === void 0 ? void 0 : deconstructorsScope.value.set(deconstructorsScope.value.size + 1, () => {
        changedSignal = undefined;
        changedSignal.disconnectAll();
    });
    return {
        set: (value) => {
            currentValue = value;
            changedSignal.fire(currentValue);
        },
        getChangedSignal: () => changedSignal,
        _PRIVATE_DANGEROUS_get: () => currentValue,
        _PRIVATE_DANGEROUS_isState: true,
    };
};
//# sourceMappingURL=value.js.map