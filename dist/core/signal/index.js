"use strict";
const connections = {};
export function generateRandomSequence(length) {
    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(Math.floor(Math.random() * 1000000));
    }
    return sequence;
}
export const signal = () => {
    const signalId = generateRandomSequence(4)[0];
    return {
        connect: async (callback) => {
            const connection = {
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
                _callback: callback,
                _active: true,
            };
            if (!connections[signalId]) {
                connections[signalId] = [];
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
            const signalConnections = connections[signalId];
            if (signalConnections) {
                signalConnections.forEach((connection) => connection.disconnect());
                delete connections[signalId];
            }
        }
    };
};
//# sourceMappingURL=index.js.map