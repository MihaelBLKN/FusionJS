"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Connection, Signal, SignalConnectionMap } from "./signal"

const connections = {} as SignalConnectionMap

export function generateRandomSequence(length: number): number[] {
    const sequence: number[] = [];
    for (let i = 0; i < length; i++) {
        sequence.push(Math.floor(Math.random() * 1000000));
    }
    return sequence;
}

export default (): Signal<any> => {
    const signalId = generateRandomSequence(4)[0];

    return {
        connect: async (callback) => {
            const connection: Connection = {
                disconnect: () => {
                    const signalConnections = connections[signalId];

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

            if (!connections[signalId]) {
                connections[signalId] = [];
            }

            connections[signalId].push(connection);

            return connection;
        },

        fire: (value) => {
            const signalConnections = connections[signalId];
            if (signalConnections) {
                signalConnections.forEach((connection) => {
                    if (connection._active) {
                        connection._callback(value);
                    }
                });
            }
        },

        disconnectAll: () => {
            connections[signalId].forEach((connection) => connection.disconnect());
            delete connections[signalId];
        }
    }
}
