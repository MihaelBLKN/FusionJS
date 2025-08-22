"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { Connection } from "./signal"
import { ValueReturnCallback } from "./value"
import { Scope } from "../dom/scope"

export const observer = (
    value: ValueReturnCallback<any>,
    scope: Scope
): ObserverReturn => {
    let signalConnection: Connection
    let changedSignal = value.getChangedSignal();
    const deconstructorsScope = scope.getDeconstructors();
    const observerDeconstructors = deconstructorsScope.observer;

    observerDeconstructors.set(observerDeconstructors.size + 1, () => {
        if (signalConnection) {
            signalConnection.disconnect();
            signalConnection = undefined as any;
        }
    });

    return {
        onChange: (callback: (newValue: any) => void): () => void => {
            if (!signalConnection && changedSignal) {
                const connectionPromise = changedSignal.connect(callback);
                connectionPromise.then((connection: Connection) => {
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

export interface ObserverReturn { onChange: (callback: (newValue: any) => void) => () => void }
export type Observer = (
    value: ValueReturnCallback<any>,
    scope: Scope
) => ObserverReturn;
