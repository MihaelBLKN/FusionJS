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
import { Scope } from "../scope/scope";
import { peek } from "../../core/peek";

const processOnEvents = (
    value: Record<string, EventListenerCallback>,
    eventCleanupCallbacks: EventCleanupCallbacks,
    newElement: HTMLElement,
    scope: Scope
) => {
    Object.entries(value).forEach(([eventName, eventListener]) => {
        const cleanup = eventListener(newElement, scope);
        if (cleanup) {
            eventCleanupCallbacks[eventName] = eventCleanupCallbacks[eventName] || [];
            eventCleanupCallbacks[eventName].push(cleanup);
        }
    });
};

const processParent = (value: HTMLElement | null, newElement: HTMLElement, ctx: { eventCleanupCallbacks: EventCleanupCallbacks, computedCleanupCallbacks: { [key: string]: () => void } }, scope: Scope) => {
    if ((value as any).getSignature) {
        const signature = (value as any).getSignature();
        if (signature in propertyHandlers) {
            const handler = propertyHandlers[signature];
            handler("parent", value, newElement, ctx, scope);
        }

        return
    }

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

const processOutput = (key: string, newElement: HTMLElement, value: any) => {
    if (key === undefined || newElement === undefined) {
        return
    }

    value(newElement);
};

const processComputed = (
    key: string,
    newElement: HTMLElement,
    computedFactoryCallback: ComputedFactoryCallback,
    scope: Scope
): (() => void) => {
    const info = computedFactoryCallback(key, newElement, scope);
    return info.cleanup;
};

export type PropertyHandler = (
    key: string,
    value: any,
    element: HTMLElement,
    context: {
        eventCleanupCallbacks: EventCleanupCallbacks,
        computedCleanupCallbacks: { [key: string]: () => void }
    },
    scope: Scope
) => void;

const handleComputedWithCleanupReturn = (
    key: string,
    element: HTMLElement,
    value: any,
    ctx: { eventCleanupCallbacks: EventCleanupCallbacks, computedCleanupCallbacks: { [key: string]: () => void } },
    scope: Scope
) => {
    const cleanup = processComputed(key, element, value as ComputedFactoryCallback, scope);
    if (cleanup) {
        ctx.computedCleanupCallbacks[key] = cleanup;
    }

    return cleanup
}

export const propertyHandlers: Record<string, PropertyHandler> = {
    onEvents: (key, value, element, ctx, scope: Scope) => {
        processOnEvents(value, ctx.eventCleanupCallbacks, element, scope);
    },
    parent: (key, value, element, ctx, scope) => {
        processParent(value, element, ctx, scope);
    },
    class: (key, value, element) => {
        element.classList.add(value as string);
    },
    style: (key, value, element, ctx, scope) => {
        Object.entries(value).forEach(([prop, val]) => {
            if (typeof val === "object") {
                let signature: any = undefined;
                if ((val as any).getSignature) {
                    signature = (val as any).getSignature();
                }

                if (!signature) {
                    return;
                }

                if (typeof (val as any).getFactory === "function") {
                    if (signature == "computed") {
                        const computedInstance = (val as any).getFactory(prop, element, scope);
                        computedInstance.setOnUpdateCallback((newValue: any) => {
                            processStyleValue(prop, newValue, element);
                        });
                    } else if (signature == "tween" || signature == "spring") {
                        const tweenStateValue = (val as any).getFactory()(prop);
                        let changedSignal = tweenStateValue.getChangedSignal();
                        if (changedSignal) {
                            changedSignal.connect(() => {
                                processStyleValue(prop, peek(tweenStateValue)[prop], element)
                            });
                        }
                    }
                }
            } else {
                processStyleValue(prop, val, element);
            }
        });

        function processStyleValue(prop: string, val: any, element: HTMLElement) {
            if (
                val &&
                typeof val === "object" &&
                (
                    "r" in val ||
                    "g" in val ||
                    "b" in val ||
                    "red" in val ||
                    "green" in val ||
                    "blue" in val
                )
            ) {
                const colorVal = val as { r?: number; g?: number; b?: number; red?: number; green?: number; blue?: number; alpha?: number };
                const r = colorVal.r ?? colorVal.red ?? 0;
                const g = colorVal.g ?? colorVal.green ?? 0;
                const b = colorVal.b ?? colorVal.blue ?? 0;
                const a = colorVal.alpha ?? 1;

                const colorString = a !== 1
                    ? `rgba(${r},${g},${b},${a})`
                    : `rgb(${r},${g},${b})`;

                element.style.setProperty(prop, colorString);

                if (prop === 'backgroundColor') {
                    element.style.setProperty('background-color', colorString);
                }
            }
            else if (
                val &&
                typeof val === "object" &&
                "hex" in val
            ) {
                const hex = val.hex;
                const a = (val as { alpha?: number }).alpha;
                let finalValue: string;

                if (typeof a === "number" && a >= 0 && a < 1) {
                    let hexValue = (hex as string).replace(/^#/, "");
                    if (hexValue.length === 3) {
                        hexValue = hexValue.split("").map(x => x + x).join("");
                    }
                    const num = parseInt(hexValue, 16);
                    const r = (num >> 16) & 255;
                    const g = (num >> 8) & 255;
                    const b = num & 255;
                    finalValue = `rgba(${r},${g},${b},${a})`;
                } else {
                    finalValue = hex as string;
                }

                element.style.setProperty(prop, finalValue);

                if (prop === 'backgroundColor') {
                    element.style.setProperty('background-color', finalValue);
                }
            }
            else {
                element.style.setProperty(prop, val as string);
            }
        }
    },
    default: (key, value, element) => {
        processProperty(key, element, value);
    },
    computed: (key, value, element, ctx, scope) => {
        handleComputedWithCleanupReturn(key, element, value, ctx, scope);
    },
    output: (key, value, element, ctx, scope) => {
        processOutput(key, element, value);
    },
    children: async (key, value, element, ctx, scope) => {
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

            if (children && typeof children === "object") {
                if ((children as any).getSignature && typeof (children as any).getSignature === "function") {
                    try {
                        const factory = (children as any).getFactory();
                        const result = await factory.__callback();
                        if (result && result instanceof HTMLElement) {
                            element.appendChild(result);
                            currentChildren.push(result);
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
                        return;
                    } catch (error) {
                        console.warn("Error occurred while processing children:", error);
                    }
                }

                // Legacy format support
                if ((children as ComputedReturn).__callback) {
                    const result = await (children as ComputedReturn).__callback();
                    if (result && result instanceof HTMLElement) {
                        element.appendChild(result);
                        currentChildren.push(result);
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
                    return;
                }
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
            const cleanup = handleComputedWithCleanupReturn(key, element, value, ctx, scope);
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

export const newEl = (elementClass: string, elementProperties: HTMLAttributes, scope: Scope) => {
    const newElement = document.createElement(elementClass);
    const eventCleanupCallbacks = {} as EventCleanupCallbacks;
    const computedCleanupCallbacks = {} as { [key: string]: () => void };

    Object.entries(elementProperties).forEach(([key, value]) => {
        let handler: PropertyHandler;

        if (typeof value === "object" && key !== "onEvents" && value.getSignature) {
            try {
                const signature = value.getSignature();

                if (signature in propertyHandlers) {
                    handler = propertyHandlers[signature];
                } else {
                    handler = propertyHandlers.computed;
                }

                const factory = value.getFactory();
                value = factory;
            } catch (error) {
                console.warn(error)
                handler = propertyHandlers.computed;
            }
        } else if (key in propertyHandlers) {
            handler = propertyHandlers[key];
        } else {
            handler = propertyHandlers.default;
        }

        if (key == "children") {
            handler = propertyHandlers.children;
        }

        handler(key, value, newElement, { eventCleanupCallbacks, computedCleanupCallbacks }, scope);
    });

    const cleanupFunc = () => {
        Object.values(eventCleanupCallbacks).forEach(cleanupCallbacks => {
            cleanupCallbacks.forEach(cleanup => cleanup());
        });
    }

    const deconstructorsScope = scope.getDeconstructors();
    const elementDeconstructors = deconstructorsScope.element;
    elementDeconstructors.set(elementDeconstructors.size + 1, () => {
        cleanupFunc();

        if (newElement && newElement.parentElement) {
            newElement.parentElement.removeChild(newElement);
        }
    });

    remoteRemove(newElement);
    newElement.addEventListener("remove", () => {
        cleanupFunc();
    });

    return newElement;
};

export const applyProperty = (
    element: HTMLElement,
    key: string,
    value: any,
    eventCleanupCallbacks: EventCleanupCallbacks = {},
    computedCleanupCallbacks: { [key: string]: () => void } = {},
    scope: Scope
) => {
    let handler: PropertyHandler;

    if (typeof value === "object" && key !== "onEvents" && value.getSignature) {
        try {
            const signature = value.getSignature();

            if (signature in propertyHandlers) {
                handler = propertyHandlers[signature];
            } else {
                handler = propertyHandlers.computed;
            }

            const factory = value.getFactory();
            value = factory;
        } catch (error) {
            console.warn(error)
            handler = propertyHandlers.computed;
        }
    } else if (key in propertyHandlers) {
        handler = propertyHandlers[key];
    } else {
        handler = propertyHandlers.default;
    }

    if (key == "children") {
        handler = propertyHandlers.children;
    }

    handler(key, value, element, { eventCleanupCallbacks, computedCleanupCallbacks }, scope);
};
