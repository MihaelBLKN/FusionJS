"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Connection } from "./signal/signal"
import { ValueReturnCallback } from "./value/value"

export default (
    value: ValueReturnCallback<any>
): { onChange: (callback: (newValue: any) => void) => () => void } => {
    let signalConnection: Connection
    let changedSignal = value.getChangedSignal();

    return {
        onChange: (callback: (newValue: any) => void): () => void => {
            if (!signalConnection) {
                const connectionPromise = changedSignal.connect(callback);
                connectionPromise.then(connection => {
                    signalConnection = connection;
                });
            }

            return () => {
                if (signalConnection) {
                    signalConnection.disconnect();
                    signalConnection = undefined as any;
                }
            };
        }
    }
}
