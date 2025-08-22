import { UseInstruction } from "../../dom/computed/computed";
import { Scope } from "../../dom/scope/scope";
import { ValueReturnCallback } from "../value/value";

export type ForValuesCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>
export type ForValues = (
    haystack: any[] | Record<string, any> | Map<any, any> | ValueReturnCallback<any>,
    callback: ForValuesCallback,
    scope: Scope
) => Promise<any>;
