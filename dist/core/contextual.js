"use strict";
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
export const contextual = (initialValue) => {
    const stack = [];
    const getCurrent = () => {
        if (stack.length > 0)
            return stack[stack.length - 1];
        return initialValue;
    };
    return {
        now: () => getCurrent(),
        is: (overrideValue) => {
            return {
                during: (callback) => {
                    stack.push(overrideValue);
                    try {
                        callback();
                    }
                    finally {
                        stack.pop();
                    }
                }
            };
        }
    };
};
//# sourceMappingURL=contextual.js.map