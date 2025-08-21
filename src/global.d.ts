import { CleanupOnEventReturnFunction } from "./core/onEvent/onEvent";
import { ValueReturnCallback } from "./core/value/value";
import { Compu, ComputedFactoryFunction, ComputedReturn } from "./dom/computed/computed";

interface CSSRGBData {
    r?: number,
    g?: number,
    b?: number,
    red?: number,
    green?: number,
    blue?: number,
    alpha?: number,
}

type CSSHexData = {
    hex: string,
    alpha?: number,
}

export type FunctionMapExport = {
    getSignature: () => string,
    getFactory: (...args: any[]) => any,
}

export type UsedAs<T> = T | ValueReturnCallback<T>
type CSSProperties = Partial<Record<keyof CSSStyleDeclaration, string | number | CSSRGBData | CSSHexData | FunctionMapExport>>;
type CleanupFunctionMap = { [key: string]: CleanupOnEventReturnFunction };
interface HTMLAttributes {
    id?: string;
    class?: string;
    style?: CSSProperties;
    parent?: HTMLElement | FunctionMapExport;
    onEvents?: CleanupFunctionMap;
    children?: HTMLElement[] | FunctionMapExport;
    [key: string]: any; // any cuz who's there to stop me?
}
