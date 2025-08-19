"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "./value/value"

export default (value: ValueReturnCallback<any>) => {
    // :p
    // :p
    // :p
    // :p
    // :p
    // :p
    // :p
    // :p
    // ignore private usage
    return value && (value as any)._PRIVATE_DANGEROUS_isState
        ? (value as any)._PRIVATE_DANGEROUS_get()
        : value;
}
