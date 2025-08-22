import { ValueReturnCallback } from "../core/value";
import { Scope } from "./scope";
import { FunctionMapExport } from "../global";
export declare const tween: (goalValue: ValueReturnCallback<any>, duration: number, easing: (...args: any[]) => number, scope: Scope) => FunctionMapExport;
export type Tween<T = any> = (goalValue: ValueReturnCallback<T>, duration: number, easing: (...args: any[]) => number, scope: Scope) => FunctionMapExport;
//# sourceMappingURL=tween.d.ts.map