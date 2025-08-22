import { SpringFactoryOptions } from ".";
import { ValueReturnCallback } from "../../core/value/value";
import { FunctionMapExport } from "../../global";

export type Spring<T> = (
    goalValue: ValueReturnCallback<T>,
    scope: Scope,
    options?: SpringFactoryOptions
) => FunctionMapExport
