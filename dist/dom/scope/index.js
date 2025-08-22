"use strict";
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { newEl } from "../new";
import { computed } from "../computed";
import { value } from "../../core/value";
import { observer } from "../../core/observer";
import { onChange } from "../../core/onChange";
import { onEvent } from "../../core/onEvent";
import { forValues } from "../../core/forValues";
import { forKeys } from "../../core/forKeys";
import { forPairs } from "../../core/forPairs";
import { tween } from "../tween";
import { spring } from "../spring";
export const scope = (includeMapOrEvents, includeEvents) => {
    const elementDeconstructors = new Map();
    const valueDeconstructors = new Map();
    const computedDeconstructors = new Map();
    const observerDeconstructors = new Map();
    const onEventDeconstructors = new Map();
    const includeEventsActual = typeof includeMapOrEvents === "boolean" ? includeMapOrEvents : includeEvents;
    const scopeMap = {};
    const innerScopeMaps = new Map();
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
    scopeMap.doCleanup = (extraCallback) => {
        scopeMap.elementDeconstructors.forEach((destroy) => destroy());
        scopeMap.valueDeconstructors.forEach((destroy) => destroy());
        scopeMap.computedDeconstructors.forEach((destroy) => destroy());
        scopeMap.observerDeconstructors.forEach((destroy) => destroy());
        scopeMap.onEventDeconstructors.forEach((destroy) => destroy());
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
            const clonedInnerScopeMaps = new Map();
            innerScopeMaps.forEach((innerScope, key) => {
                if (typeof innerScope.deriveScope === "function") {
                    clonedInnerScopeMaps.set(key, innerScope.deriveScope());
                }
            });
            clonedScope.innerScopeMaps = clonedInnerScopeMaps;
        }
        return clonedScope;
    };
    scopeMap.innerScope = (includeMapOrEventsInner, includeEventsInner) => {
        const actualInnerMapOrEvents = typeof includeMapOrEventsInner === "boolean" ? includeMapOrEventsInner : includeMapOrEventsInner;
        const innerScopeMap = scope(actualInnerMapOrEvents);
        innerScopeMaps.set(String(innerScopeMaps.size + 1), innerScopeMap);
        return innerScopeMap;
    };
    if (includeEventsActual) {
        scopeMap.newEl = (tagName, props) => {
            return newEl(tagName, props, scopeMap);
        };
        scopeMap.computed = (callback, cleanupCallback) => {
            return computed(callback, cleanupCallback, scopeMap);
        };
        scopeMap.value = (initialValue) => {
            return value(initialValue, scopeMap);
        };
        scopeMap.observer = (value) => {
            return observer(value, scopeMap);
        };
        scopeMap.onChange = (property, callback) => {
            return onChange(property, callback);
        };
        scopeMap.onEvent = (event, callback) => {
            return onEvent(event, callback);
        };
        scopeMap.forValues = (haystack, callback) => {
            return forValues(haystack, callback, scopeMap);
        };
        scopeMap.forKeys = (haystack, callback) => {
            return forKeys(haystack, callback, scopeMap);
        };
        scopeMap.forPairs = (haystack, callback) => {
            return forPairs(haystack, callback, scopeMap);
        };
        scopeMap.tween = (goalValue, duration, easing) => {
            return tween(goalValue, duration, easing, scopeMap);
        };
        scopeMap.spring = (goalValue, scope, options) => {
            return spring(goalValue, scope, options);
        };
    }
    return scopeMap;
};
//# sourceMappingURL=index.js.map