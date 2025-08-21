import { UseInstruction } from "../../dom/computed/computed";
import { Scope } from "../../dom/scope/scope";

export type ForValuesCallback = (use: UseInstruction<any>, scope: Scope, value: any) => Promise<any>

