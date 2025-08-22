import { ValueReturnCallback } from "./value/value";
import { Scope } from "../dom/scope/scope";
export interface ObserverReturn {
    onChange: (callback: (newValue: any) => void) => () => void;
}
export declare const observer: (value: ValueReturnCallback<any>, scope: Scope) => ObserverReturn;
//# sourceMappingURL=observer.d.ts.map