export type CallbackOnEvent = (element: HTMLElement, event: Event) => void
export type CleanupFunctionListener = () => void
export type EventListenerCallback = ((element: HTMLElement) => CleanupFunctionListener)
