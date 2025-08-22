import { ValueReturnCallback } from "../core/value";
import { Scope } from "./scope";
import { FunctionMapExport } from "../global";
export interface SpringFactoryOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
}
export declare const spring: (goalValue: ValueReturnCallback<any>, scope: Scope, options?: SpringFactoryOptions) => FunctionMapExport;
export type Spring<T = any> = (goalValue: ValueReturnCallback<T>, scope?: Scope, options?: SpringFactoryOptions) => FunctionMapExport;
//# sourceMappingURL=spring.d.ts.map