import { ValueReturnCallback } from "./value";
import { Scope } from "../dom/scope";
export declare const forPairs: (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForPairsCallback, scope: Scope) => Promise<any>;
export type ForPairsCallback = (use: any, scope: Scope, key: string | number, value: any) => Promise<[string | number, any]>;
export type ForPairs = (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForPairsCallback, scope?: Scope) => Promise<any>;
//# sourceMappingURL=forPairs.d.ts.map