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

const processOnEvents = (value: Record<string, EventListenerCallback>, eventCleanupCallbacks: EventCleanupCallbacks, newElement: HTMLElement) => {
    Object.entries(value).forEach(([eventName, eventListener]) => {
        const cleanup = eventListener(newElement);
        if (cleanup) {
            eventCleanupCallbacks[eventName] = eventCleanupCallbacks[eventName] || [];
            eventCleanupCallbacks[eventName].push(cleanup);
        }
    });
}

const processParent = (value: HTMLElement | null, newElement: HTMLElement) => {
    if (value instanceof HTMLElement) {
        value.appendChild(newElement);
    }
};

export const processProperty = (key: string, newElement: HTMLElement, value: any) => { // any type cuz who's there to stop me
    if (key in newElement) {
        (newElement as any)[key] = value;
    } else {
        newElement.setAttribute(key, value as string);
    }
}

const processComputed = (key: string, newElement: HTMLElement, computedFactoryCallback: ComputedFactoryCallback): (() => void) => {
    const info = computedFactoryCallback(key, newElement);
    return info.cleanup;
}

export default (elementClass: string, elementProperties: HTMLAttributes) => {
    const newElement = document.createElement(elementClass);
    const eventCleanupCallbacks = {} as EventCleanupCallbacks;
    const computedCleanupCallbacks = {} as { [key: string]: () => void };

    Object.entries(elementProperties).forEach(([key, value]) => {
        if (typeof value === "function") {
            // idk lets just guess its a computed
            const cleanup = processComputed(key, newElement, value as ComputedFactoryCallback);
            if (cleanup) {
                computedCleanupCallbacks[key] = cleanup;
            }

            return;
        }

        if (key == "onEvents") {
            processOnEvents(value, eventCleanupCallbacks, newElement);
        } else if (key == "parent") {
            processParent(value, newElement);
        } else if (key == "class") {
            newElement.classList.add(value as string);
        } else {
            processProperty(key, newElement, value);
        }
    });

    remoteRemove(newElement);
    newElement.addEventListener("remove", () => {
        Object.values(eventCleanupCallbacks).forEach(cleanupCallbacks => {
            cleanupCallbacks.forEach(cleanup => cleanup());
        });
    });

    return newElement;
}
