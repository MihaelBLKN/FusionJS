import { Signal } from "../signal/signal";

export interface ValueReturnCallback<T> {
    _PRIVATE_DANGEROUS_get: () => T;
    set: (value: T) => void;
    getChangedSignal: () => Signal<T> | undefined;
    _PRIVATE_DANGEROUS_isState: boolean;
}
