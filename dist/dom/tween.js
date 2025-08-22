"use strict";
import { TweenService } from "../services/tweenService";
import { peek } from "../core/peek";
const tweenFactory = (goalValue, duration, easing, scope) => {
    return (property) => {
        const progressValue = scope.value(undefined);
        let to = {
            [property]: peek(goalValue)
        };
        const tween = TweenService.Create({
            to: to,
            duration: duration,
            easing: easing,
            onUpdate: (current) => {
                progressValue.set(current);
            }
        });
        setTimeout(() => {
            tween.start();
        }, 10);
        return progressValue;
    };
};
export const tween = (goalValue, duration, easing, scope) => {
    const tweenStateValue = tweenFactory(goalValue, duration, easing, scope);
    return {
        getSignature: () => "tween",
        getFactory: () => tweenStateValue,
    };
};
//# sourceMappingURL=tween.js.map