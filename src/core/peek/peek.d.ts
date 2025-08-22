import { ValueReturnCallback } from "../value/value"
export type Peek<T> = (value: T extends ValueReturnCallback<infer U> ? U : T) => T;
