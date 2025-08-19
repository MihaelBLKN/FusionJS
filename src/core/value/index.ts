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
        get: () => currentValue,
        set: (value: any) => {
            currentValue = value;
            changedSignal.fire(currentValue);
        },
        getChangedSignal: () => changedSignal,
    } as ValueReturnCallback<typeof initialValue>;
}
