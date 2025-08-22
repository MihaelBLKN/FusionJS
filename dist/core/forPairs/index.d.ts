import { ValueReturnCallback } from "../value/value";
import { Scope } from "../../dom/scope/scope";
export type ForPairsCallback = (use: any, scope: Scope, key: string | number, value: any) => Promise<[string | number, any]>;
export declare const forPairs: (haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>, callback: ForPairsCallback, scope: Scope) => Promise<any>;
//# sourceMappingURL=index.d.ts.map