import { ObserverReturn } from "../../core/observer";
import { CallbackOnEvent } from "../../core/onEvent/onEvent";
import { ValueReturnCallback } from "../../core/value/value";
import { FunctionMapExport, HTMLAttributes } from "../../global";
import { ComputedCallback, ComputedReturn } from "../computed/computed";

export interface Scope {
    doCleanup: (extraCallback?: () => void) => void,
    getDeconstructors: () => {
        element: Map<number, () => void>,
        value: Map<number, () => void>,
        computed: Map<number, () => void>,
        observer: Map<number, () => void>,
        onEvent: Map<number, () => void>,
    },

    deriveScope: () => Scope,
    innerScope: (includeMapOrEventsInner?: boolean | { [key: string]: any }, includeEventsInner?: boolean) => Scope,
    newEl: (tagName: string, props: HTMLAttributes) => HTMLElement,
    computed: (callback: ComputedCallback<any>, cleanupCallback: () => void) => FunctionMapExport,
    value: (initialValue: any) => ValueReturnCallback<any>,
    observer: (value: ValueReturnCallback<any>) => ObserverReturn,
    onChange: (property: string, callback: (newValue: any) => void) => (element: HTMLElement, scope: Scope) => () => void,
    onEvent: (event: string, callback: CallbackOnEvent) => EventListenerCallback,

    [key: string]: (...args: any[]) => any,
}
