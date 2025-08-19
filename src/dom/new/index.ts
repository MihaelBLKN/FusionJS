"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { HTMLAttributes } from "../../global";
import { EventListenerCallback } from "../../core/onEvent/onEvent";
import { ComputedFactoryCallback, EventCleanupCallbacks } from "./new";
import remoteRemove from "../../remoteRemove";

const processOnEvents = (
    value: Record<string, EventListenerCallback>,
    eventCleanupCallbacks: EventCleanupCallbacks,
    newElement: HTMLElement
) => {
    Object.entries(value).forEach(([eventName, eventListener]) => {
        const cleanup = eventListener(newElement);
        if (cleanup) {
            eventCleanupCallbacks[eventName] = eventCleanupCallbacks[eventName] || [];
            eventCleanupCallbacks[eventName].push(cleanup);
        }
    });
};

const processParent = (value: HTMLElement | null, newElement: HTMLElement) => {
    if (value instanceof HTMLElement) {
        value.appendChild(newElement);
    }
};

export const processProperty = (key: string, newElement: HTMLElement, value: any) => {
    if (key in newElement) {
        (newElement as any)[key] = value;
    } else {
        newElement.setAttribute(key, value as string);
    }
};

const processComputed = (
    key: string,
    newElement: HTMLElement,
    computedFactoryCallback: ComputedFactoryCallback
): (() => void) => {
    const info = computedFactoryCallback(key, newElement);
    return info.cleanup;
};

export type PropertyHandler = (
    key: string,
    value: any,
    element: HTMLElement,
    context: {
        eventCleanupCallbacks: EventCleanupCallbacks,
        computedCleanupCallbacks: { [key: string]: () => void }
    }
) => void;

export const propertyHandlers: Record<string, PropertyHandler> = {
    onEvents: (key, value, element, ctx) => {
        processOnEvents(value, ctx.eventCleanupCallbacks, element);
    },
    parent: (key, value, element) => {
        processParent(value, element);
    },
    class: (key, value, element) => {
        element.classList.add(value as string);
    },
    default: (key, value, element) => {
        processProperty(key, element, value);
    },
    computed: (key, value, element, ctx) => {
        const cleanup = processComputed(key, element, value as ComputedFactoryCallback);
        if (cleanup) {
            ctx.computedCleanupCallbacks[key] = cleanup;
        }
    }
};

export const newEl = (elementClass: string, elementProperties: HTMLAttributes) => {
    const newElement = document.createElement(elementClass);
    const eventCleanupCallbacks = {} as EventCleanupCallbacks;
    const computedCleanupCallbacks = {} as { [key: string]: () => void };

    Object.entries(elementProperties).forEach(([key, value]) => {
        let handler: PropertyHandler;

        if (typeof value === "function") {
            handler = propertyHandlers.computed;
        } else if (key in propertyHandlers) {
            handler = propertyHandlers[key];
        } else {
            handler = propertyHandlers.default;
        }

        handler(key, value, newElement, { eventCleanupCallbacks, computedCleanupCallbacks });
    });

    remoteRemove(newElement);
    newElement.addEventListener("remove", () => {
        Object.values(eventCleanupCallbacks).forEach(cleanupCallbacks => {
            cleanupCallbacks.forEach(cleanup => cleanup());
        });
    });

    return newElement;
};

export const applyProperty = (
    element: HTMLElement,
    key: string,
    value: any,
    eventCleanupCallbacks: EventCleanupCallbacks = {},
    computedCleanupCallbacks: { [key: string]: () => void } = {}
) => {
    let handler: PropertyHandler;

    if (typeof value === "function") {
        handler = propertyHandlers.computed;
    } else if (key in propertyHandlers) {
        handler = propertyHandlers[key];
    } else {
        handler = propertyHandlers.default;
    }

    handler(key, value, element, { eventCleanupCallbacks, computedCleanupCallbacks });
};
