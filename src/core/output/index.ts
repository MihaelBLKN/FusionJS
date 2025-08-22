"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "../value/value"
import { Connection } from "../signal/signal"
import { scope } from "../../dom/scope"
import { FunctionMapExport } from "../../global"

const outputScope = scope()
const outputFactory = (property: string, value: ValueReturnCallback<any>, changePropertyOnValueChange?: boolean) => {
    return async (element: HTMLElement): Promise<any> => {
        const localScope = outputScope.innerScope(true)
        let valueChangedConnection: Connection
        let changedSignal = value.getChangedSignal()

        localScope.onChange(property, (newValue: any) => {
            value.set(newValue)
        })(element, localScope)

        if (changedSignal) {
            valueChangedConnection = await changedSignal.connect((newValue: any) => {
                if (changePropertyOnValueChange) {
                    (element as any)[property] = newValue
                }
            })
        }

        element.addEventListener("remove", () => {
            valueChangedConnection?.disconnect()
            localScope.doCleanup()
        })

        return (element as any)[property]
    }
}

export const output = (property: string, value: ValueReturnCallback<any>, changePropertyOnValueChange?: boolean): FunctionMapExport => {
    const factory = outputFactory(property, value, changePropertyOnValueChange);

    return {
        getSignature: () => "output",
        getFactory: () => factory,
    }
}
