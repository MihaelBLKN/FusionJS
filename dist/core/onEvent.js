"use strict";
export const onEvent = (eventName, callback) => {
    return (element, scope) => {
        element.addEventListener(eventName, (event) => {
            callback(element, event);
        });
        const cleanupFunc = () => {
            element.removeEventListener(eventName, () => { });
        };
        scope.getDeconstructors().onEvent.set(scope.getDeconstructors().onEvent.size + 1, cleanupFunc);
        return cleanupFunc;
    };
};
//# sourceMappingURL=onEvent.js.map