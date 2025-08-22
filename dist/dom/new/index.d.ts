import { HTMLAttributes } from "../../global";
import { EventCleanupCallbacks } from "./new";
import { Scope } from "../scope/scope";
export declare const processProperty: (key: string, newElement: HTMLElement, value: any) => void;
export type PropertyHandler = (key: string, value: any, element: HTMLElement, context: {
    eventCleanupCallbacks: EventCleanupCallbacks;
    computedCleanupCallbacks: {
        [key: string]: () => void;
    };
}, scope: Scope) => void;
export declare const propertyHandlers: Record<string, PropertyHandler>;
export declare const newEl: (elementClass: string, elementProperties: HTMLAttributes, scope: Scope) => HTMLElement;
export declare const applyProperty: (element: HTMLElement, key: string, value: any, eventCleanupCallbacks: EventCleanupCallbacks | undefined, computedCleanupCallbacks: {
    [key: string]: () => void;
} | undefined, scope: Scope) => void;
//# sourceMappingURL=index.d.ts.map