import { UseInstruction } from "../../dom/computed/computed";
import { Scope } from "../../dom/scope/scope";
import { ValueReturnCallback } from "../value/value";

export type ForPairsCallback = (
    use: any,
    scope: Scope,
    key: string | number,
    value: any
) => Promise<[string | number, any]>;

export type ForPairs = (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForPairsCallback,
    scope: Scope
) => Promise<any>;
