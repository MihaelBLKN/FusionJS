import { CleanupOnEventReturnFunction } from "./core/onEvent/onEvent";

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
    children?: HTMLElement[];
    [key: string]: any; // any cuz who's there to stop me?
}
