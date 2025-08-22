import { Scope } from "../../dom/scope/scope";
import { ValueReturnCallback } from "../value/value";

export interface ObserverReturn { onChange: (callback: (newValue: any) => void) => () => void }
export type Observer = (
    value: ValueReturnCallback<any>,
    scope: Scope
) => ObserverReturn;
