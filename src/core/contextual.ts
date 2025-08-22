"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
export const contextual = (initialValue: any) => {
    const stack: any[] = [];

    const getCurrent = () => {
        if (stack.length > 0) return stack[stack.length - 1];
        return initialValue;
    };

    return {
        now: () => getCurrent(),
        is: (overrideValue: any) => {
            return {
                during: (callback: () => void) => {
                    stack.push(overrideValue);
                    try {
                        callback();
                    } finally {
                        stack.pop();
                    }
                }
            }
        }
    };
};


export type Contextual = (initialValue: any) => {
    now: () => any;
    is: (overrideValue: any) => {
        during: (callback: () => void) => void;
    };
}
