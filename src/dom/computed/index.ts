"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ComputedCallback, ComputedCleanup, ComputedReturn, UseInstruction } from "./computed";
import { Connection } from "../../core/signal/signal";
import { processProperty } from "../new";
import remoteRemove from "../../remoteRemove";
import peek from "../../core/peek";

const handleComputedRenderCallback = async (callback: ComputedCallback<any>, use: UseInstruction<any>, element: HTMLElement, property: string) => {
    const result = await (callback as (use: UseInstruction<any>) => any)(use);

    if (property === "children") {
        return result;
    }

    processProperty(property, element, result);
    return result;
}

export default (callback: ComputedCallback<any>, cleanupCallback?: ComputedCleanup) => {
    return (property: string, element: HTMLElement): ComputedReturn => {
        const connections = new Map<any, Connection>();
        let onUpdateCallback: (value: any) => void;

        const use: UseInstruction<any> = async (fusionValue) => {
            if (!connections.has(fusionValue)) {
                const connection = await fusionValue.getChangedSignal().connect(async (value: any) => {
                    const result = await handleComputedRenderCallback(callback, use, element, property);
                    onUpdateCallback && onUpdateCallback(result);
                });
                connections.set(fusionValue, connection);
            }

            return peek(fusionValue);
        };

        const computedReturn = {
            cleanup: () => {
                connections.forEach(connection => connection.disconnect());
                connections.clear();
                cleanupCallback && cleanupCallback();
            },

            __callback: () => {
                return handleComputedRenderCallback(callback, use, element, property);
            },

            setOnUpdateCallback: (callback: (newValue: any) => void) => {
                onUpdateCallback = callback
            }
        };

        if (element) {
            remoteRemove(element);
            element.addEventListener("remove", () => {
                connections.forEach(connection => connection.disconnect());
                connections.clear();
                cleanupCallback && cleanupCallback();
            });
        }

        handleComputedRenderCallback(callback, use, element, property);

        return computedReturn;
    };
}
