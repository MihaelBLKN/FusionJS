import { ValueReturnCallback } from "./value";
export declare const peek: (value: ValueReturnCallback<any>) => any;
export type Peek<T> = (value: T extends ValueReturnCallback<infer U> ? U : T) => T;
//# sourceMappingURL=peek.d.ts.map