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
import { ComputedReturn } from "../computed/computed";

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
    if (key === undefined || newElement === undefined) {
        return
    }

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

const handleComputedWithCleanupReturn = (
    key: string,
    element: HTMLElement,
    value: any,
    ctx: { eventCleanupCallbacks: EventCleanupCallbacks, computedCleanupCallbacks: { [key: string]: () => void } }) => {
    const cleanup = processComputed(key, element, value as ComputedFactoryCallback);
    if (cleanup) {
        ctx.computedCleanupCallbacks[key] = cleanup;
    }

    return cleanup
}

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
        handleComputedWithCleanupReturn(key, element, value, ctx);
    },
    children: async (key, value, element, ctx) => {
        let currentChildren: HTMLElement[] = [];
        let lastValue: unknown;

        const appendChildren = async (children: unknown) => {
            if (children === lastValue) return;
            lastValue = children;

            currentChildren.forEach(c => {
                if (c.parentElement === element) element.removeChild(c);
            });
            currentChildren = [];

            if (children == null) return;

            if (children instanceof Promise) {
                children = await children;
            }

            if (typeof children === "object" && (children as ComputedReturn).__callback) {
                const result = await (children as ComputedReturn).__callback();
                if (result && result instanceof HTMLElement) {
                    element.appendChild(result);
                } else if (Array.isArray(result)) {
                    result.forEach(child => {
                        if (!(child instanceof HTMLElement)) {
                            throw new Error(
                                `Invalid child: expected HTMLElement, got ${typeof child}`
                            );
                        }
                        element.appendChild(child);
                        currentChildren.push(child);
                    });
                }

                return
            }

            if (children instanceof HTMLElement) {
                element.appendChild(children);
                currentChildren.push(children);
            } else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (!(child instanceof HTMLElement)) {
                        throw new Error(
                            `Invalid child: expected HTMLElement, got ${typeof child}`
                        );
                    }
                    element.appendChild(child);
                    currentChildren.push(child);
                });
            } else if (typeof children === "function") {
                appendChildren(children());
            } else {
                throw new Error(
                    `Invalid children property: must be HTMLElement, HTMLElement[], function, or null/undefined`
                );
            }
        };

        if (value instanceof HTMLElement || Array.isArray(value) || value == null) {
            appendChildren(value);
        } else if (typeof value === "function") {
            const cleanup = handleComputedWithCleanupReturn(key, element, value, ctx);
            value = await value();

            const originalCallback = value.__callback;
            value.__callback = () => {
                const result = originalCallback();

                value.setOnUpdateCallback((newValue: any) => {
                    appendChildren(newValue);
                });

                appendChildren(result);
                return result;
            };

            value.__callback();
            if (cleanup) ctx.computedCleanupCallbacks[key] = cleanup;

        } else {
            throw new Error(
                `Invalid children property: must be HTMLElement, HTMLElement[], computed, or null/undefined`
            );
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

        if (key == "children") {
            handler = propertyHandlers.children;
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
