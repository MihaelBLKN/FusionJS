import { ValueReturnCallback } from "../../core/value/value"

export type UseInstruction<T> = (fusionValue: ValueReturnCallback<T>) => any
export type CleanupFunction = () => void
export type ComputedCallback<T> = (use: UseInstruction<T>) => T
export type ComputedCleanup = () => void
export interface ComputedReturn {
    cleanup: CleanupFunction,
    __callback: ComputedCallback<any>,
}
