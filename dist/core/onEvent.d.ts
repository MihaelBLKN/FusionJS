import { Scope } from "../dom/scope";
export declare const onEvent: (eventName: string, callback: CallbackOnEvent) => EventListenerCallback;
export type CallbackOnEvent = (element: HTMLElement, event: Event) => void;
export type CleanupFunctionListener = () => void;
export type EventListenerCallback = ((element: HTMLElement, scope?: Scope) => CleanupFunctionListener);
export type OnEvent = (eventName: string, callback: CallbackOnEvent) => EventListenerCallback;
//# sourceMappingURL=onEvent.d.ts.map