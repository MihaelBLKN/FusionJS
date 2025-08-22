import { Signal } from "./signal";
import { Scope } from "../dom/scope";
export declare const value: (initialValue: any, scope: Scope) => ValueReturnCallback<typeof initialValue>;
export interface ValueReturnCallback<T> {
    _PRIVATE_DANGEROUS_get: () => T;
    set: (value: T) => void;
    getChangedSignal: () => Signal<T> | undefined;
    _PRIVATE_DANGEROUS_isState: boolean;
}
export type Value<T = any> = (initialValue: any) => ValueReturnCallback<T>;
//# sourceMappingURL=value.d.ts.map