import { Signal } from "../signal/signal";

export interface ValueReturnCallback<T> {
    get: () => T;
    set: (value: T) => void;
    getChangedSignal: () => Signal<T>;
}
