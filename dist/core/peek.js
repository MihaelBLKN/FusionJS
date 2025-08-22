"use strict";
export const peek = (value) => {
    // :p
    // ignore private usage
    return value && value._PRIVATE_DANGEROUS_isState
        ? value._PRIVATE_DANGEROUS_get()
        : value;
};
//# sourceMappingURL=peek.js.map