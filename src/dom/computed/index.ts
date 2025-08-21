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
import { ComputedFactoryCallback } from "../new/new";
import { Scope } from "../scope/scope";

const handleComputedRenderCallback = async (callback: ComputedCallback<any>, use: UseInstruction<any>, element: HTMLElement, property: string) => {
    const result = await (callback as (use: UseInstruction<any>) => any)(use);

    if (property === "parent") {
        const newParent = result as HTMLElement | null;
        const currentParent = element.parentElement;

        if (newParent === currentParent) {
            return result;
        }

        if (currentParent) {
            currentParent.removeChild(element);
        }

        if (newParent && newParent instanceof HTMLElement) {
            newParent.appendChild(element);
        }

        return result;
    }

    if (property === "children") {
        return result;
    }

    processProperty(property, element, result);
    return result;
}

const createComputedFactory = (callback: ComputedCallback<any>, cleanupCallback: ComputedCleanup, scope: Scope): ComputedFactoryCallback => {
    return (property: string, element: HTMLElement): ComputedReturn => {
        const connections = new Map<any, Connection>();
        let onUpdateCallback: (value: any) => void;
        const deconstructorsScope = scope.getDeconstructors();
        const computedDeconstructors = deconstructorsScope.computed;
        let computedDeconstructorsAmount = computedDeconstructors.size;

        const use: UseInstruction<any> = async (fusionValue) => {
            if (!connections.has(fusionValue)) {
                if (fusionValue && typeof fusionValue.getChangedSignal === "function") {
                    const signal = fusionValue.getChangedSignal();
                    if (signal && typeof signal.connect === "function") {
                        const connection = await signal.connect(async (value: any) => {
                            const result = await handleComputedRenderCallback(callback, use, element, property);
                            onUpdateCallback && onUpdateCallback(result);
                        });
                        connections.set(fusionValue, connection);
                    }
                }
            }

            return peek(fusionValue);
        };

        const computedReturn = {
            cleanup: () => {
                connections.forEach(connection => connection.disconnect());
                connections.clear();
                cleanupCallback && cleanupCallback();
            },

            __callback: async () => {
                return await handleComputedRenderCallback(callback, use, element, property);
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

        computedDeconstructorsAmount++;
        computedDeconstructors.set(computedDeconstructorsAmount, () => {
            computedReturn.cleanup();
        });

        handleComputedRenderCallback(callback, use, element, property);

        return computedReturn;
    };
}

export default (callback: ComputedCallback<any>, cleanupCallback: ComputedCleanup, scope: Scope) => {
    const factory = createComputedFactory(callback, cleanupCallback, scope);

    return {
        getSignature: () => "computed",
        getFactory: () => factory,
    }
}
