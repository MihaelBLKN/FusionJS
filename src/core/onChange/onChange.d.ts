export type OnChangeReturn = (element: HTMLElement, scope: Scope) => () => void;
export type OnChange = (property: string, callback: (newValue: any) => void) => OnChangeReturn;
