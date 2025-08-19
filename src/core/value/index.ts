"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "./value";
import signal from "../signal";

export default (initialValue: any) => {
    let currentValue = initialValue;
    const changedSignal = signal();

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
