export declare const contextual: (initialValue: any) => {
    now: () => any;
    is: (overrideValue: any) => {
        during: (callback: () => void) => void;
    };
};
export type Contextual = (initialValue: any) => {
    now: () => any;
    is: (overrideValue: any) => {
        during: (callback: () => void) => void;
    };
};
//# sourceMappingURL=contextual.d.ts.map