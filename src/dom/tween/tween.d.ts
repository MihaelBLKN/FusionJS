import { ValueReturnCallback } from "../../core/value/value";
import { FunctionMapExport } from "../../global";

export type Tween<T> = (goalValue: ValueReturnCallback<T>, duration: number, easing: (...args: any[]) => number, scope: Scope) => FunctionMapExport
