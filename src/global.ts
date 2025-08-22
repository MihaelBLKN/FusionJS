import { ValueReturnCallback } from "./core/value"

export interface CSSRGBData {
    r?: number,
    g?: number,
    b?: number,
    red?: number,
    green?: number,
    blue?: number,
    alpha?: number,
}

export type CSSHexData = {
    hex: string,
    alpha?: number,
}

export type FunctionMapExport = {
    getSignature: () => string,
    getFactory: (...args: any[]) => any,
}

export type UsedAs<T> = T | ValueReturnCallback<T>
export type CSSProperties = Partial<Record<keyof CSSStyleDeclaration, string | number | CSSRGBData | CSSHexData | FunctionMapExport>>;
export type CleanupFunctionMap = { [key: string]: (...args: any[]) => any };
export interface HTMLAttributes {
    id?: string;
    class?: string;
    style?: CSSProperties;
    parent?: HTMLElement | FunctionMapExport;
    onEvents?: CleanupFunctionMap;
    children?: HTMLElement[] | FunctionMapExport;
    [key: string]: any; // any cuz who's there to stop me?
}
