"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
const connections = {} as SignalConnectionMap

export function generateRandomSequence(length: number): number[] {
    const sequence: number[] = [];
    for (let i = 0; i < length; i++) {
        sequence.push(Math.floor(Math.random() * 1000000));
    }
    return sequence;
}

export const signal = (): Signal<any> => {
    const signalId = generateRandomSequence(4)[0];

    return {
        connect: async (callback) => {
            const connection: Connection = {
                disconnect: () => {
                    const signalConnections = connections[signalId as number];

                    if (signalConnections) {
                        const index = signalConnections.indexOf(connection);
                        if (index !== -1) {
                            signalConnections.splice(index, 1);
                        }
                    }
                },

                // can be any for now
                _callback: callback as (value: any) => void,
                _active: true,
            }

            if (!connections[signalId as number]) {
                connections[signalId as number] = [];
            }

            if (!connections[signalId as number]) {
                connections[signalId as number] = [];
            }
            connections[signalId as number]!.push(connection);

            return connection;
        },

        fire: (value) => {
            const signalConnections = connections[signalId as number];
            if (signalConnections) {
                signalConnections.forEach((connection) => {
                    if (connection._active) {
                        connection._callback(value);
                    }
                });
            }
        },

        disconnectAll: () => {
            const signalConnections = connections[signalId as number];
            if (signalConnections) {
                signalConnections.forEach((connection) => connection.disconnect());
                delete connections[signalId as number];
            }
        }
    }
}


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
export type SignalConnectionMap = { [signalId: number]: Connection[] };
