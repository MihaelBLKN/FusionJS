"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { CallbackOnEvent, EventListenerCallback } from "./onEvent";
import { Scope } from "../../dom/scope/scope";

export const onEvent = (eventName: string, callback: CallbackOnEvent): EventListenerCallback => {
    return (element: HTMLElement, scope: Scope) => {
        element.addEventListener(eventName, (event) => {
            callback(element, event);
        });

        const cleanupFunc = () => {
            element.removeEventListener(eventName, () => { })
        };

        scope.getDeconstructors().onEvent.set(scope.getDeconstructors().onEvent.size + 1, cleanupFunc);

        return cleanupFunc;
    };
}
