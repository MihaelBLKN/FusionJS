import { ComputedCallback, ComputedCleanup, UseInstruction } from "./computed";
import { Connection } from "../../core/signal/signal";
import { ComputedFactoryCallback } from "../new/new";
import { Scope } from "../scope/scope";
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
//# sourceMappingURL=index.d.ts.map