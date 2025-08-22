import { Connection } from "../core/signal";
import { ValueReturnCallback } from "../core/value";
import { Scope } from "./scope";
import { FunctionMapExport } from "../global";
import { ComputedFactoryCallback } from "./new";
export declare const createUseFactory: (onUpdate?: () => Promise<void>) => {
    use: UseInstruction<any>;
    cleanup: () => void;
    getConnections: () => Map<any, Connection>;
    update: () => Promise<void>;
};
export declare const computed: (callback: ComputedCallback<any>, cleanupCallback: ComputedCleanup, scope: Scope) => {
    getSignature: () => string;
    getFactory: () => ComputedFactoryCallback;
};
export type UseInstruction<T> = (fusionValue: ValueReturnCallback<T>) => T;
export type ComputedFactoryFunction = (property: string, element: HTMLElement, scope: Scope) => ComputedReturn;
export type CleanupFunction = () => void;
export type ComputedCallback<T> = (use: UseInstruction<T>) => T;
export type ComputedCleanup = () => void;
export interface ComputedReturn {
    cleanup: CleanupFunction;
    __callback: () => any;
    setOnUpdateCallback: (callback: (newValue: any) => void) => void;
}
export type Computed<T = any> = (callback: ComputedCallback<T>, cleanupCallback: ComputedCleanup, scope?: Scope) => FunctionMapExport;
//# sourceMappingURL=computed.d.ts.map