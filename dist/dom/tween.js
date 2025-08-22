"use strict";
import { peek } from "../core/peek";
import { TweenService } from "../services/tweenService";
const tweenFactory = (goalValue, duration, easing, scope) => {
    return (property) => {
        var _a;
        const progressValue = scope.value(undefined);
        let to = {
            [property]: peek(goalValue)
        };
        (_a = goalValue.getChangedSignal()) === null || _a === void 0 ? void 0 : _a.connect((newValue) => {
            TweenService.Create({
                to: { [property]: newValue },
                duration: duration,
                easing: easing,
                progressValue: progressValue,
                onUpdate: (current) => {
                    progressValue.set(current);
                }
            });
            setTimeout(() => {
                progressValue.set(newValue);
            }, 10);
        });
        const tween = TweenService.Create({
            to: to,
            duration: duration,
            easing: easing,
            progressValue: progressValue,
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