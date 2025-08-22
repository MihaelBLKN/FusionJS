"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { scope } from "./scope";
import { EventCleanupCallbacks } from "./new";
import { applyProperty } from "./new";
import { HTMLAttributes } from "../global";
import remoteRemove from "../remoteRemove";

const hydrationScope = scope();
const eventCleanupCallbacks: EventCleanupCallbacks = {};
const computedCleanupCallbacks: { [key: string]: () => void } = {};
export const hydrate = (element: HTMLElement, propertyMap: HTMLAttributes, cleanupCallback?: () => void) => {
    Object.entries(propertyMap).forEach(([key, value]) => {
        applyProperty(element, key, value, eventCleanupCallbacks, computedCleanupCallbacks, hydrationScope);
    });

    remoteRemove(element);
    element.addEventListener("remove", () => {
        cleanupCallback && cleanupCallback();
    });
}

export type Hydrate = (element: HTMLElement, propertyMap: HTMLAttributes, cleanupCallback?: () => void) => void;
