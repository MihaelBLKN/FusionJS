"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { newEl } from "../new";
import computed from "../computed";
import { FunctionMapExport, HTMLAttributes } from "../../global";
import { ComputedCallback } from "../computed/computed";
import value from "../../core/value";
import observer, { ObserverReturn } from "../../core/observer";
import { ValueReturnCallback } from "../../core/value/value";
import onChange from "../../core/onChange";
import { onEvent } from "../../core/onEvent";
import { CallbackOnEvent, EventListenerCallback } from "../../core/onEvent/onEvent";
import { Scope } from "./scope";
import forValues from "../../core/forValues";
import scope from ".";
import { ForValuesCallback } from "../../core/forValues/forValues";
import { ForKeysCallback } from "../../core/forKeys/forKeys";
import forKeys from "../../core/forKeys";
import forPairs, { ForPairsCallback } from "../../core/forPairs";
import tween from "../tween";
import spring, { SpringFactoryOptions } from "../spring";

export default (includeMapOrEvents?: { [key: string]: any } | boolean, includeEvents?: boolean): Scope => {
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
