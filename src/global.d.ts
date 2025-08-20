import { CleanupOnEventReturnFunction } from "./core/onEvent/onEvent";
import { Compu } from "./dom/computed/computed";

type CSSProperties = Partial<Record<keyof CSSStyleDeclaration, string | number>>;
type HTMLProperties = Partial<Record<keyof HTMLElement, string | number>>;
type CleanupFunctionMap = { [key: string]: CleanupOnEventReturnFunction };
interface HTMLAttributes {
    id?: string;
    class?: string;
    style?: CSSProperties;
    htmlProperties?: HTMLProperties;
    parent?: HTMLElement;
    onEvents?: CleanupFunctionMap;
    children?: HTMLElement[] | ((property: string, element: HTMLElement) => ComputedReturn);
    [key: string]: any; // any cuz who's there to stop me?
}
