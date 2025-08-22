import { Scope } from "./scope";
import { ComputedReturn } from "./computed";
import { HTMLAttributes } from "../global";
import { CleanupFunctionListener } from "../core/onEvent";
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
export interface ElementProperties extends HTMLAttributes {
    [attr: string]: any;
}
export type EventCleanupCallbacks = {
    [key: string]: CleanupFunctionListener[];
};
export type ComputedFactoryCallback = (property: string, element: HTMLElement, scope?: Scope) => ComputedReturn;
export type NewEl = (elementClass: string, elementProperties: HTMLAttributes, scope?: Scope) => HTMLElement;
//# sourceMappingURL=new.d.ts.map