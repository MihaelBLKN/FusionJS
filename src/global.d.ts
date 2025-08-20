import { CleanupOnEventReturnFunction } from "./core/onEvent/onEvent";
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

type CSSProperties = Partial<Record<keyof CSSStyleDeclaration, string | number | CSSRGBData | CSSHexData | ComputedFactoryFunction>>;
type CleanupFunctionMap = { [key: string]: CleanupOnEventReturnFunction };
interface HTMLAttributes {
    id?: string;
    class?: string;
    style?: CSSProperties;
    parent?: HTMLElement;
    onEvents?: CleanupFunctionMap;
    children?: HTMLElement[] | ComputedFactoryFunction;
    [key: string]: any; // any cuz who's there to stop me?
}
