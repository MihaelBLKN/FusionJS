"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import remoteRemove from "../../remoteRemove";
import { HTMLAttributes } from "../../global";
import { applyProperty } from "../new";

export default (element: HTMLElement, propertyMap: HTMLAttributes, cleanupCallback?: () => void) => {
    Object.entries(propertyMap).forEach(([key, value]) => {
        applyProperty(element, key, value);
    });

    remoteRemove(element);
    element.addEventListener("remove", () => {
        cleanupCallback && cleanupCallback();
    });
}
