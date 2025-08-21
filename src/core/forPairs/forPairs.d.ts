import { UseInstruction } from "../../dom/computed/computed";
import { Scope } from "../../dom/scope/scope";

export type ForPairsCallback = (
    use: any,
    scope: Scope,
    key: string | number,
    value: any
) => Promise<[string | number, any]>;
