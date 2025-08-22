import { ValueReturnCallback } from "./value";
import { Scope } from "../dom/scope";
import { UseInstruction } from "../dom/computed";
export declare const forKeys: (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForKeysCallback, scope: Scope) => Promise<any>;
export type ForKeysCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>;
export type ForKeys = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForKeysCallback, scope: Scope) => Promise<any>;
//# sourceMappingURL=forKeys.d.ts.map