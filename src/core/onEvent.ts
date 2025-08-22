"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Scope } from "../dom/scope";

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

export type CallbackOnEvent = (element: HTMLElement, event: Event) => void
export type CleanupFunctionListener = () => void
export type EventListenerCallback = ((element: HTMLElement, scope: Scope) => CleanupFunctionListener)
export type OnEvent = (eventName: string, callback: CallbackOnEvent) => EventListenerCallback
