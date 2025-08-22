"use strict";
import { SpringService } from "../services/springService";
import { peek } from "../core/peek";
const springFactory = (goalValue, scope, options) => {
    return (property) => {
        const progressValue = scope.value(undefined);
        const to = { [property]: peek(goalValue) };
        const spring = SpringService.Create(Object.assign(Object.assign({ to: to, element: undefined }, options), { onUpdate: (current) => {
                progressValue.set(current);
            } }));
        setTimeout(() => {
            spring.start();
        }, 10);
        return progressValue;
    };
};
export const spring = (goalValue, scope, options) => {
    const springStateValue = springFactory(goalValue, scope, options);
    return {
        getSignature: () => "spring",
        getFactory: () => springStateValue,
    };
};
//# sourceMappingURL=spring.js.map