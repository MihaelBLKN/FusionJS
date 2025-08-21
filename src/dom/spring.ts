"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ValueReturnCallback } from "../core/value/value"
import { FunctionMapExport } from "../global";
import { SpringService } from "../services/springService";
import { Scope } from "./scope/scope"
import peek from "../core/peek";

export interface SpringFactoryOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
}

const springFactory = (
    goalValue: ValueReturnCallback<any>,
    scope: Scope,
    options?: SpringFactoryOptions
): ((property: string) => ValueReturnCallback<any>) => {
    return (property: string): ValueReturnCallback<any> => {
        const progressValue = scope.value(undefined);
        const to = { [property]: peek(goalValue) };

        const spring = SpringService.Create({
            to: to,
            element: undefined,
            ...options,
            onUpdate: (current) => {
                progressValue.set(current);
            },
        });

        setTimeout(() => {
            spring.start();
        }, 10);

        return progressValue;
    }
}

export default (
    goalValue: ValueReturnCallback<any>,
    scope: Scope,
    options?: SpringFactoryOptions
): FunctionMapExport => {
    const springStateValue = springFactory(goalValue, scope, options);

    return {
        getSignature: () => "spring",
        getFactory: () => springStateValue,
    }
}
