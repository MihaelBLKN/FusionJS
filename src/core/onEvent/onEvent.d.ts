import { Scope } from "../../dom/scope/scope"

export type CallbackOnEvent = (element: HTMLElement, event: Event) => void
export type CleanupFunctionListener = () => void
export type EventListenerCallback = ((element: HTMLElement, scope: Scope) => CleanupFunctionListener)
export type OnEvent = (eventName: string, callback: CallbackOnEvent) => EventListenerCallback
