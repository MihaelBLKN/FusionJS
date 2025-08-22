import { ValueReturnCallback } from "../../core/value/value"
import { FunctionMapExport } from "../../global"
import { Scope } from "../scope/scope"

export type UseInstruction<T> = (fusionValue: ValueReturnCallback<T>) => T
export type ComputedFactoryFunction = (property: string, element: HTMLElement, scope: Scope) => ComputedReturn
export type CleanupFunction = () => void
export type ComputedCallback<T> = (use: UseInstruction<T>) => T
export type ComputedCleanup = () => void
export interface ComputedReturn {
    cleanup: CleanupFunction,
    __callback: () => any,
    setOnUpdateCallback: (callback: (newValue: any) => void) => void
}
export type Computed<T> = (callback: ComputedCallback<T>, cleanupCallback: ComputedCleanup, scope: Scope) => FunctionMapExport;
