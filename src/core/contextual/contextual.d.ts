export type Contextual = (initialValue: any) => {
    now: () => any;
    is: (overrideValue: any) => {
        during: (callback: () => void) => void;
    };
}
