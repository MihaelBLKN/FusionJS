"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
export default (property: string, callback: (newValue: any) => void) => {
    return (element: HTMLElement) => {
        let previousValue = (element as any)[property];
        const observers: (() => void)[] = [];

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                let shouldTrigger = false;

                if (mutation.type === "attributes" && mutation.attributeName === property) {
                    shouldTrigger = true;
                }

                if (mutation.type === "childList" || mutation.type === "characterData") {
                    const currentValue = (element as any)[property];
                    if (currentValue !== previousValue) {
                        previousValue = currentValue;
                        shouldTrigger = true;
                    }
                }

                if (shouldTrigger) {
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
        if (property in element || (element as any)[property] !== undefined) {
            pollInterval = setInterval(() => {
                const currentValue = (element as any)[property];
                if (currentValue !== previousValue) {
                    previousValue = currentValue;
                    callback(currentValue);
                }
            }, 100);

            observers.push(() => clearInterval(pollInterval));
        }

        try {
            const descriptor = Object.getOwnPropertyDescriptor(element, property) ||
                Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), property);

            if (descriptor && descriptor.configurable) {
                let internalValue = (element as any)[property];

                Object.defineProperty(element, property, {
                    get() {
                        return internalValue;
                    },
                    set(newValue) {
                        if (newValue !== internalValue) {
                            internalValue = newValue;
                            callback(newValue);
                        }

                        if (descriptor.set) {
                            descriptor.set.call(this, newValue);
                        }
                    },
                    enumerable: descriptor.enumerable,
                    configurable: true
                });

                observers.push(() => {
                    if (descriptor) {
                        Object.defineProperty(element, property, descriptor);
                    } else {
                        delete (element as any)[property];
                    }
                });
            }
        } catch (error) {
            console.warn(`Could not set up property descriptor for "${property}":`, error);
        }

        return () => {
            observers.forEach(cleanup => cleanup());
        }
    }
}
