"use strict";
import { scope } from "../../dom/scope";
const outputScope = scope();
const outputFactory = (property, value, changePropertyOnValueChange) => {
    return async (element) => {
        const localScope = outputScope.innerScope(true);
        let valueChangedConnection;
        let changedSignal = value.getChangedSignal();
        localScope.onChange(property, (newValue) => {
            value.set(newValue);
        })(element, localScope);
        if (changedSignal) {
            valueChangedConnection = await changedSignal.connect((newValue) => {
                if (changePropertyOnValueChange) {
                    element[property] = newValue;
                }
            });
        }
        element.addEventListener("remove", () => {
            valueChangedConnection === null || valueChangedConnection === void 0 ? void 0 : valueChangedConnection.disconnect();
            localScope.doCleanup();
        });
        return element[property];
    };
};
export const output = (property, value, changePropertyOnValueChange) => {
    const factory = outputFactory(property, value, changePropertyOnValueChange);
    return {
        getSignature: () => "output",
        getFactory: () => factory,
    };
};
//# sourceMappingURL=index.js.map