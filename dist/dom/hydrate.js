"use strict";
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import remoteRemove from "../remoteRemove";
import { applyProperty } from "./new";
import { scope } from "./scope";
const hydrationScope = scope();
const eventCleanupCallbacks = {};
const computedCleanupCallbacks = {};
export const hydrate = (element, propertyMap, cleanupCallback) => {
    Object.entries(propertyMap).forEach(([key, value]) => {
        applyProperty(element, key, value, eventCleanupCallbacks, computedCleanupCallbacks, hydrationScope);
    });
    remoteRemove(element);
    element.addEventListener("remove", () => {
        cleanupCallback && cleanupCallback();
    });
};
//# sourceMappingURL=hydrate.js.map