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

const handleComputedRenderCallback = async (callback: ComputedCallback<any>, use: UseInstruction<any>, element: HTMLElement, property: string) => {
    const result = await callback(use);
    processProperty(property, element, result);
}

export default (callback: ComputedCallback<any>, cleanupCallback?: ComputedCleanup) => {
    return (property: string, element: HTMLElement): ComputedReturn => {
        let connection: Connection;

        const use: UseInstruction<any> = (fusionValue) => {
            connection = connection ? connection : fusionValue.getChangedSignal().connect((value: any) => {
                handleComputedRenderCallback(callback, use, element, property);
            });

            return fusionValue.get();
        };

        remoteRemove(element);
        element.addEventListener("remove", () => {
            connection && connection.disconnect();
            cleanupCallback && cleanupCallback();
        });

        handleComputedRenderCallback(callback, use, element, property);

        return {
            cleanup: () => {
                cleanupCallback && cleanupCallback();
            },

            __callback: () => {
                handleComputedRenderCallback(callback, use, element, property);
            }
        };
    };
}
