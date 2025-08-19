"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { CallbackOnEvent, EventListenerCallback } from "./onEvent";

export const onEvent = (eventName: string, callback: CallbackOnEvent): EventListenerCallback => {
    return (element: HTMLElement) => {
        element.addEventListener(eventName, (event) => {
            callback(element, event);
        });

        return () => {
            element.removeEventListener(eventName, () => { })
        }
    };
}
