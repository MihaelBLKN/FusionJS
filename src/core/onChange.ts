"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Scope } from "../dom/scope/scope";

export default (property: string, callback: (newValue: any) => void) => {
    return (element: HTMLElement, scope: Scope) => {
        let previousValue = (element as any)[property];
        const observers: (() => void)[] = [];
        const deconstructorsScope = scope.getDeconstructors();
        const onEventDeconstructors = deconstructorsScope.onEvent;
        let onEventDeconstructorAmount = onEventDeconstructors.size;

        let descriptorSet = false;
        try {
            let descriptor = Object.getOwnPropertyDescriptor(element, property);
            let targetObj = element;

            if (!descriptor) {
                let proto = Object.getPrototypeOf(element);
                while (proto && !descriptor) {
                    descriptor = Object.getOwnPropertyDescriptor(proto, property);
                    if (descriptor) {
                        targetObj = element;
                    }
                    proto = Object.getPrototypeOf(proto);
                }
            }

            if (descriptor && descriptor.configurable) {
                let internalValue = (element as any)[property];

                Object.defineProperty(element, property, {
                    get() {
                        return internalValue;
                    },
                    set(newValue) {
                        const oldValue = internalValue;
                        internalValue = newValue;

                        if (descriptor.set) {
                            descriptor.set.call(this, newValue);
                        }

                        if (newValue !== oldValue) {
                            previousValue = newValue;
                            callback(newValue);
                        }
                    },
                    enumerable: descriptor.enumerable ?? true,
                    configurable: true
                });

                observers.push(() => {
                    try {
                        if (descriptor) {
                            Object.defineProperty(element, property, descriptor);
                        } else {
                            delete (element as any)[property];
                        }
                    } catch (e) {
                        console.warn(`Failed to restore descriptor for ${property}:`, e);
                    }
                });

                descriptorSet = true;
            }
        } catch (error) {
            console.warn(`Could not set up property descriptor for "${property}":`, error);
        }

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                let shouldTrigger = false;

                if (mutation.type === "attributes" && mutation.attributeName === property) {
                    shouldTrigger = true;
                } else if (mutation.type === "childList" || mutation.type === "characterData") {
                    const currentValue = (element as any)[property];
                    if (currentValue !== previousValue) {
                        previousValue = currentValue;
                        shouldTrigger = true;
                    }
                }

                if (shouldTrigger && !descriptorSet) {
                    callback((element as any)[property]);
                }
            });
        });

        mutationObserver.observe(element, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });

        observers.push(() => mutationObserver.disconnect());

        let pollInterval: number;
        if (!descriptorSet && (property in element || (element as any)[property] !== undefined)) {
            pollInterval = setInterval(() => {
                const currentValue = (element as any)[property];
                if (currentValue !== previousValue) {
                    previousValue = currentValue;
                    callback(currentValue);
                }
            }, 100);

            observers.push(() => clearInterval(pollInterval));
        }

        const cleanupFunc = () => {
            observers.forEach(cleanup => cleanup());
        }

        onEventDeconstructorAmount = onEventDeconstructors.size;
        onEventDeconstructorAmount++;
        onEventDeconstructors.set(onEventDeconstructorAmount, cleanupFunc);

        return cleanupFunc;
    }
}
