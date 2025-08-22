import { ValueReturnCallback } from "./value";
import { UseInstruction } from "../dom/computed";
import { Scope } from "../dom/scope";
export declare const forValues: (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForValuesCallback, scope: Scope) => Promise<any>;
export type ForValuesCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>;
export type ForValues = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForValuesCallback, scope?: Scope) => Promise<any>;
//# sourceMappingURL=forValues.d.ts.map