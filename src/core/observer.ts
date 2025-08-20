"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Connection } from "./signal/signal"
import { ValueReturnCallback } from "./value/value"
import { Scope } from "../dom/scope/scope"

export interface ObserverReturn { onChange: (callback: (newValue: any) => void) => () => void }
export default (
    value: ValueReturnCallback<any>,
    scope: Scope
): ObserverReturn => {
    let signalConnection: Connection
    let changedSignal = value.getChangedSignal();

    return {
        onChange: (callback: (newValue: any) => void): () => void => {
            if (!signalConnection && changedSignal) {
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
