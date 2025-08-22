import { UseInstruction } from "../../dom/computed/computed";
import { Scope } from "../../dom/scope/scope";
import { ValueReturnCallback } from "../value/value";

export type ForKeysCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>
export type ForKeys = (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForKeysCallback,
    scope: Scope
) => Promise<any>;
