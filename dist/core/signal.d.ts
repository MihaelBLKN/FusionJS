export declare function generateRandomSequence(length: number): number[];
export declare const signal: () => Signal<any>;
export type Callback = (value: any) => void;
export interface Connection {
    disconnect: () => void;
    _callback: Callback;
    _active?: boolean;
}
export interface Signal<T, U = undefined> {
    connect: (callback: Callback) => Promise<Connection>;
    disconnectAll: () => void;
    fire: (value: T | U) => void;
}
export type SignalArray = Signal<any>[];
export type SignalConnectionMap = {
    [signalId: number]: Connection[];
};
//# sourceMappingURL=signal.d.ts.map