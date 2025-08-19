"use strict"
//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ComputedCallback, ComputedReturn, UseInstruction } from "./computed";
import { Connection } from "../../core/signal/signal";
import { processProperty } from "../new";

const handleComputedRenderCallback = async (callback: ComputedCallback<any>, use: UseInstruction<any>, element: HTMLElement, property: string) => {
    const result = await callback(use);
    processProperty(property, element, result);
}

export default (callback: ComputedCallback<any>) => {
    return (property: string, element: HTMLElement): ComputedReturn => {
        let connection: Connection;

        const use: UseInstruction<any> = (fusionValue) => {
            connection = connection ? connection : fusionValue.getChangedSignal().connect((value: any) => {
                handleComputedRenderCallback(callback, use, element, property);
            });

            return fusionValue.get();
        };

        handleComputedRenderCallback(callback, use, element, property);

        return {
            cleanup: () => {
                console.log("idk bro theres no cleanup yet for computeds")
            },

            __callback: () => {
                handleComputedRenderCallback(callback, use, element, property);
            }
        };
    };
}
