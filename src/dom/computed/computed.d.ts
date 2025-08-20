import { ValueReturnCallback } from "../../core/value/value"
import { Scope } from "../scope/scope"

export type UseInstruction<T> = (fusionValue: ValueReturnCallback<T>) => any
export type ComputedFactoryFunction = (property: string, element: HTMLElement, scope: Scope) => ComputedReturn
export type CleanupFunction = () => void
export type ComputedCallback<T> = (use: UseInstruction<any>) => T
export type ComputedCleanup = () => void
export interface ComputedReturn {
    cleanup: CleanupFunction,
    __callback: () => any,
    setOnUpdateCallback: (callback: (newValue: any) => void) => void
}
