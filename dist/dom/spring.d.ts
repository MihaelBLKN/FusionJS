import { ValueReturnCallback } from "../core/value/value";
import { FunctionMapExport } from "../global";
import { Scope } from "./scope/scope";
export interface SpringFactoryOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
}
export declare const spring: (goalValue: ValueReturnCallback<any>, scope: Scope, options?: SpringFactoryOptions) => FunctionMapExport;
//# sourceMappingURL=spring.d.ts.map