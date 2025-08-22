"use strict";
import { peek } from "../core/peek";
import remoteRemove from "../remoteRemove";
const processOnEvents = (value, eventCleanupCallbacks, newElement, scope) => {
    Object.entries(value).forEach(([eventName, eventListener]) => {
        const cleanup = eventListener(newElement, scope);
        if (cleanup) {
            eventCleanupCallbacks[eventName] = eventCleanupCallbacks[eventName] || [];
            eventCleanupCallbacks[eventName].push(cleanup);
        }
    });
};
const processParent = (value, newElement, ctx, scope) => {
    if (value.getSignature) {
        const signature = value.getSignature();
        if (signature in propertyHandlers) {
            const handler = propertyHandlers[signature];
            handler("parent", value, newElement, ctx, scope);
        }
        return;
    }
    if (value instanceof HTMLElement) {
        value.appendChild(newElement);
    }
};
export const processProperty = (key, newElement, value) => {
    if (key === undefined || newElement === undefined) {
        return;
    }
    if (key in newElement) {
        newElement[key] = value;
    }
    else {
        newElement.setAttribute(key, value);
    }
};
const processOutput = (key, newElement, value) => {
    if (key === undefined || newElement === undefined) {
        return;
    }
    value(newElement);
};
const processComputed = (key, newElement, computedFactoryCallback, scope) => {
    const info = computedFactoryCallback(key, newElement, scope);
    return info.cleanup;
};
const handleComputedWithCleanupReturn = (key, element, value, ctx, scope) => {
    const cleanup = processComputed(key, element, value, scope);
    if (cleanup) {
        ctx.computedCleanupCallbacks[key] = cleanup;
    }
    return cleanup;
};
export const propertyHandlers = {
    onEvents: (key, value, element, ctx, scope) => {
        processOnEvents(value, ctx.eventCleanupCallbacks, element, scope);
    },
    parent: (key, value, element, ctx, scope) => {
        processParent(value, element, ctx, scope);
    },
    class: (key, value, element) => {
        element.classList.add(value);
    },
    style: (key, value, element, ctx, scope) => {
        Object.entries(value).forEach(([prop, val]) => {
            if (typeof val === "object") {
                let signature = undefined;
                if (val.getSignature) {
                    signature = val.getSignature();
                }
                if (!signature) {
                    return;
                }
                if (typeof val.getFactory === "function") {
                    if (signature == "computed") {
                        const computedInstance = val.getFactory(prop, element, scope);
                        computedInstance.setOnUpdateCallback((newValue) => {
                            processStyleValue(prop, newValue, element);
                        });
                    }
                    else if (signature == "tween" || signature == "spring") {
                        const tweenStateValue = val.getFactory()(prop);
                        let changedSignal = tweenStateValue.getChangedSignal();
                        if (changedSignal) {
                            changedSignal.connect(() => {
                                processStyleValue(prop, peek(tweenStateValue)[prop], element);
                            });
                        }
                    }
                }
            }
            else {
                processStyleValue(prop, val, element);
            }
        });
        function processStyleValue(prop, val, element) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (val &&
                typeof val === "object" &&
                ("r" in val ||
                    "g" in val ||
                    "b" in val ||
                    "red" in val ||
                    "green" in val ||
                    "blue" in val)) {
                const colorVal = val;
                const r = (_b = (_a = colorVal.r) !== null && _a !== void 0 ? _a : colorVal.red) !== null && _b !== void 0 ? _b : 0;
                const g = (_d = (_c = colorVal.g) !== null && _c !== void 0 ? _c : colorVal.green) !== null && _d !== void 0 ? _d : 0;
                const b = (_f = (_e = colorVal.b) !== null && _e !== void 0 ? _e : colorVal.blue) !== null && _f !== void 0 ? _f : 0;
                const a = (_g = colorVal.alpha) !== null && _g !== void 0 ? _g : 1;
                const colorString = a !== 1
                    ? `rgba(${r},${g},${b},${a})`
                    : `rgb(${r},${g},${b})`;
                element.style.setProperty(prop, colorString);
                if (prop === 'backgroundColor') {
                    element.style.setProperty('background-color', colorString);
                }
            }
            else if (val &&
                typeof val === "object" &&
                "hex" in val) {
                const hex = val.hex;
                const a = val.alpha;
                let finalValue;
                if (typeof a === "number" && a >= 0 && a < 1) {
                    let hexValue = hex.replace(/^#/, "");
                    if (hexValue.length === 3) {
                        hexValue = hexValue.split("").map(x => x + x).join("");
                    }
                    const num = parseInt(hexValue, 16);
                    const r = (num >> 16) & 255;
                    const g = (num >> 8) & 255;
                    const b = num & 255;
                    finalValue = `rgba(${r},${g},${b},${a})`;
                }
                else {
                    finalValue = hex;
                }
                element.style.setProperty(prop, finalValue);
                if (prop === 'backgroundColor') {
                    element.style.setProperty('background-color', finalValue);
                }
            }
            else {
                element.style.setProperty(prop, val);
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
        let currentChildren = [];
        let lastValue;
        const appendChildren = async (children) => {
            if (children === lastValue)
                return;
            lastValue = children;
            currentChildren.forEach(c => {
                if (c.parentElement === element)
                    element.removeChild(c);
            });
            currentChildren = [];
            if (children == null)
                return;
            if (children instanceof Promise) {
                children = await children;
            }
            if (children && typeof children === "object") {
                if (children.getSignature && typeof children.getSignature === "function") {
                    try {
                        const factory = children.getFactory();
                        const result = await factory.__callback();
                        if (result && result instanceof HTMLElement) {
                            element.appendChild(result);
                            currentChildren.push(result);
                        }
                        else if (Array.isArray(result)) {
                            result.forEach(child => {
                                if (!(child instanceof HTMLElement)) {
                                    throw new Error(`Invalid child: expected HTMLElement, got ${typeof child}`);
                                }
                                element.appendChild(child);
                                currentChildren.push(child);
                            });
                        }
                        return;
                    }
                    catch (error) {
                        console.warn("Error occurred while processing children:", error);
                    }
                }
                // Legacy format support
                if (children.__callback) {
                    const result = await children.__callback();
                    if (result && result instanceof HTMLElement) {
                        element.appendChild(result);
                        currentChildren.push(result);
                    }
                    else if (Array.isArray(result)) {
                        result.forEach(child => {
                            if (!(child instanceof HTMLElement)) {
                                throw new Error(`Invalid child: expected HTMLElement, got ${typeof child}`);
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
            }
            else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (!(child instanceof HTMLElement)) {
                        throw new Error(`Invalid child: expected HTMLElement, got ${typeof child}`);
                    }
                    element.appendChild(child);
                    currentChildren.push(child);
                });
            }
            else if (typeof children === "function") {
                appendChildren(children());
            }
            else {
                throw new Error(`Invalid children property: must be HTMLElement, HTMLElement[], function, or null/undefined`);
            }
        };
        if (value instanceof HTMLElement || Array.isArray(value) || value == null) {
            appendChildren(value);
        }
        else if (typeof value === "function") {
            const cleanup = handleComputedWithCleanupReturn(key, element, value, ctx, scope);
            value = await value();
            const originalCallback = value.__callback;
            value.__callback = () => {
                const result = originalCallback();
                value.setOnUpdateCallback((newValue) => {
                    appendChildren(newValue);
                });
                appendChildren(result);
                return result;
            };
            value.__callback();
            if (cleanup)
                ctx.computedCleanupCallbacks[key] = cleanup;
        }
        else {
            throw new Error(`Invalid children property: must be HTMLElement, HTMLElement[], computed, or null/undefined`);
        }
    }
};
export const newEl = (elementClass, elementProperties, scope) => {
    const newElement = document.createElement(elementClass);
    const eventCleanupCallbacks = {};
    const computedCleanupCallbacks = {};
    Object.entries(elementProperties).forEach(([key, value]) => {
        let handler;
        if (typeof value === "object" && key !== "onEvents" && value.getSignature) {
            try {
                const signature = value.getSignature();
                if (signature in propertyHandlers) {
                    handler = propertyHandlers[signature];
                }
                else {
                    handler = propertyHandlers.computed;
                }
                const factory = value.getFactory();
                value = factory;
            }
            catch (error) {
                console.warn(error);
                handler = propertyHandlers.computed;
            }
        }
        else if (key in propertyHandlers) {
            handler = propertyHandlers[key];
        }
        else {
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
    };
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
export const applyProperty = (element, key, value, eventCleanupCallbacks = {}, computedCleanupCallbacks = {}, scope) => {
    let handler;
    if (typeof value === "object" && key !== "onEvents" && value.getSignature) {
        try {
            const signature = value.getSignature();
            if (signature in propertyHandlers) {
                handler = propertyHandlers[signature];
            }
            else {
                handler = propertyHandlers.computed;
            }
            const factory = value.getFactory();
            value = factory;
        }
        catch (error) {
            console.warn(error);
            handler = propertyHandlers.computed;
        }
    }
    else if (key in propertyHandlers) {
        handler = propertyHandlers[key];
    }
    else {
        handler = propertyHandlers.default;
    }
    if (key == "children") {
        handler = propertyHandlers.children;
    }
    handler(key, value, element, { eventCleanupCallbacks, computedCleanupCallbacks }, scope);
};
//# sourceMappingURL=new.js.map