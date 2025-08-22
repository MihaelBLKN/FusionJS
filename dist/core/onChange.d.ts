import { Scope } from "../dom/scope";
export declare const onChange: (property: string, callback: (newValue: any) => void) => (element: HTMLElement, scope: Scope) => () => void;
export type OnChangeReturn = (element: HTMLElement, scope?: Scope) => () => void;
export type OnChange = (property: string, callback: (newValue: any) => void) => OnChangeReturn;
//# sourceMappingURL=onChange.d.ts.map