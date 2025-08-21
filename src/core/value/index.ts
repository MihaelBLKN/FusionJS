"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "./value";
import signal from "../signal";
import { Scope } from "../../dom/scope/scope";

export default (initialValue: any, scope: Scope) => {
    let currentValue = initialValue;
    let changedSignal = signal();

    const deconstructorsScope = scope.getDeconstructors();
    deconstructorsScope.value.set(deconstructorsScope.value.size + 1, () => {
        (changedSignal as any) = undefined;
        changedSignal.disconnectAll();
    });

    return {
        set: (value: any) => {
            currentValue = value;
            changedSignal.fire(currentValue);
        },
        getChangedSignal: () => changedSignal,
        _PRIVATE_DANGEROUS_get: () => currentValue,
        _PRIVATE_DANGEROUS_isState: true,
    } as ValueReturnCallback<typeof initialValue>;
}
