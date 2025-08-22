"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { newEl, NewEl } from "./new";
import { HTMLAttributes } from "../global";
import { ComputedCallback, Computed, computed } from "./computed";
import { FunctionMapExport } from "../global";
import { ValueReturnCallback } from "../core/value";
import { ObserverReturn } from "../core/observer";
import { value, Value } from "../core/value";
import { observer } from "../core/observer";
import { onChange, OnChange } from "../core/onChange";
import { onEvent, OnEvent } from "../core/onEvent";
import { forValues, ForValues } from "../core/forValues";
import { forKeys, ForKeys } from "../core/forKeys";
import { forPairs, ForPairs } from "../core/forPairs";
import { tween, Tween } from "./tween";
import { CallbackOnEvent } from "../core/onEvent";
import { EventListenerCallback } from "../core/onEvent";
import { ForValuesCallback } from "../core/forValues";
import { ForKeysCallback } from "../core/forKeys";
import { ForPairsCallback } from "../core/forPairs";
import { SpringFactoryOptions } from "./spring";
import { spring, Spring } from "./spring";
import { Observer } from "../core/observer";

export const scope = (includeMapOrEvents?: { [key: string]: any } | boolean, includeEvents?: boolean): Scope => {
    const elementDeconstructors = new Map<number, () => void>();
    const valueDeconstructors = new Map<number, () => void>();
    const computedDeconstructors = new Map<number, () => void>();
    const observerDeconstructors = new Map<number, () => void>();
    const onEventDeconstructors = new Map<number, () => void>();

    const includeEventsActual = typeof includeMapOrEvents === "boolean" ? includeMapOrEvents : includeEvents;
    const scopeMap: any = {};
    const innerScopeMaps = new Map<string, Scope>();

    if (includeMapOrEvents && typeof includeMapOrEvents === "object") {
        Object.entries(includeMapOrEvents).forEach(([key, value]) => {
            if (scopeMap.hasOwnProperty(key)) {
                throw new Error(`Key "${key}" already exists in scopeMap.`);
            }
            scopeMap[key] = value;
        });
    }

    scopeMap.elementDeconstructors = elementDeconstructors;
    scopeMap.valueDeconstructors = valueDeconstructors;
    scopeMap.computedDeconstructors = computedDeconstructors;
    scopeMap.observerDeconstructors = observerDeconstructors;
    scopeMap.onEventDeconstructors = onEventDeconstructors;

    scopeMap.doCleanup = (extraCallback?: () => void) => {
        scopeMap.elementDeconstructors.forEach((destroy: () => void) => destroy());
        scopeMap.valueDeconstructors.forEach((destroy: () => void) => destroy());
        scopeMap.computedDeconstructors.forEach((destroy: () => void) => destroy());
        scopeMap.observerDeconstructors.forEach((destroy: () => void) => destroy());
        scopeMap.onEventDeconstructors.forEach((destroy: () => void) => destroy());

        scopeMap.elementDeconstructors.clear();
        scopeMap.valueDeconstructors.clear();
        scopeMap.computedDeconstructors.clear();
        scopeMap.observerDeconstructors.clear();
        scopeMap.onEventDeconstructors.clear();

        innerScopeMaps.forEach((innerScope) => {
            if (typeof innerScope.doCleanup === "function") {
                innerScope.doCleanup();
            }
        });
        innerScopeMaps.clear();

        extraCallback && extraCallback();
    };

    scopeMap.getDeconstructors = () => {
        return {
            element: scopeMap.elementDeconstructors,
            value: scopeMap.valueDeconstructors,
            computed: scopeMap.computedDeconstructors,
            observer: scopeMap.observerDeconstructors,
            onEvent: scopeMap.onEventDeconstructors,
        };
    };

    scopeMap.deriveScope = () => {
        const clonedScope = scope(includeMapOrEvents, includeEventsActual);

        if (innerScopeMaps && innerScopeMaps.size > 0) {
            const clonedInnerScopeMaps = new Map<string, Scope>();
            innerScopeMaps.forEach((innerScope, key) => {
                if (typeof innerScope.deriveScope === "function") {
                    clonedInnerScopeMaps.set(key, innerScope.deriveScope());
                }
            });

            (clonedScope as any).innerScopeMaps = clonedInnerScopeMaps;
        }

        return clonedScope;
    }

    scopeMap.innerScope = (includeMapOrEventsInner?: boolean | { [key: string]: any }, includeEventsInner?: boolean) => {
        const actualInnerMapOrEvents = typeof includeMapOrEventsInner === "boolean" ? includeMapOrEventsInner : includeMapOrEventsInner;
        const innerScopeMap = scope(actualInnerMapOrEvents);
        innerScopeMaps.set(String(innerScopeMaps.size + 1), innerScopeMap);
        return innerScopeMap;
    }

    if (includeEventsActual) {
        scopeMap.newEl = (tagName: string, props: HTMLAttributes): HTMLElement => {
            return newEl(tagName, props, scopeMap);
        };

        scopeMap.computed = (callback: ComputedCallback<any>, cleanupCallback: () => void): FunctionMapExport => {
            return computed(callback, cleanupCallback, scopeMap);
        };

        scopeMap.value = (initialValue: any): ValueReturnCallback<any> => {
            return value(initialValue, scopeMap);
        };

        scopeMap.observer = (value: ValueReturnCallback<any>): ObserverReturn => {
            return observer(value, scopeMap);
        };

        scopeMap.onChange = (property: string, callback: (newValue: any) => void): (element: HTMLElement, scope: Scope) => () => void => {
            return onChange(property, callback);
        };

        scopeMap.onEvent = (event: string, callback: CallbackOnEvent): EventListenerCallback => {
            return onEvent(event, callback);
        };

        scopeMap.forValues = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForValuesCallback): Promise<any> => {
            return forValues(haystack, callback, scopeMap);
        };

        scopeMap.forKeys = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForKeysCallback): Promise<any> => {
            return forKeys(haystack, callback, scopeMap);
        };

        scopeMap.forPairs = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForPairsCallback): Promise<any> => {
            return forPairs(haystack, callback, scopeMap);
        };

        scopeMap.tween = (goalValue: ValueReturnCallback<any>, duration: number, easing: (...args: number[]) => number): FunctionMapExport => {
            return tween(goalValue, duration, easing, scopeMap);
        }

        scopeMap.spring = (goalValue: ValueReturnCallback<any>, scope: Scope, options?: SpringFactoryOptions): FunctionMapExport => {
            return spring(goalValue, scope, options);
        }
    }

    return scopeMap;
}

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
    newEl: NewEl,
    computed: Computed,
    value: Value,
    observer: Observer,
    onChange: OnChange,
    onEvent: OnEvent,
    forValues: ForValues,
    forKeys: ForKeys,
    forPairs: ForPairs,
    tween: Tween,
    spring: Spring,
}
