"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "../core/value/value"
import { FunctionMapExport } from "../global";
import { TweenService } from "../services/tweenService";
import { Scope } from "./scope/scope"
import peek from "../core/peek";

const tweenFactory = (goalValue: ValueReturnCallback<any>, duration: number, easing: (...args: any[]) => number, scope: Scope): (property: string) => ValueReturnCallback<any> => {
    return (property: string): ValueReturnCallback<any> => {
        const progressValue = scope.value(undefined);
        let to = {
            [property]: peek(goalValue)
        }

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

        return progressValue
    }
}

export default (goalValue: ValueReturnCallback<any>, duration: number, easing: (...args: any[]) => number, scope: Scope): FunctionMapExport => {
    const tweenStateValue = tweenFactory(goalValue, duration, easing, scope);

    return {
        getSignature: () => "tween",
        getFactory: () => tweenStateValue,
    }
}
