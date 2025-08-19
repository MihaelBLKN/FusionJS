export type Callback = (value: any) => void;

export interface Connection {
    disconnect: () => void;
    _callback: Callback;
    _active: boolean?;
}

export interface Signal<T, U = undefined> {
    connect: (callback: Callback) => Connection;
    disconnectAll: () => void;
    fire: (value: T | U) => void;
}

export type SignalArray = Signal<any>[];
export type SignalConnectionMap = { [signalId: number]: Connection[] };
