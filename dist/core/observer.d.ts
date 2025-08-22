import { ValueReturnCallback } from "./value";
import { Scope } from "../dom/scope";
export declare const observer: (value: ValueReturnCallback<any>, scope: Scope) => ObserverReturn;
export interface ObserverReturn {
    onChange: (callback: (newValue: any) => void) => () => void;
}
export type Observer = (value: ValueReturnCallback<any>, scope: Scope) => ObserverReturn;
//# sourceMappingURL=observer.d.ts.map