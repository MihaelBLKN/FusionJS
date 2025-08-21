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

export const createUseFactory = (onUpdate?: () => Promise<void>): {
    use: UseInstruction<any>;
    cleanup: () => void;
    getConnections: () => Map<any, Connection>;
} => {
    const connections = new Map<any, Connection>();

    const use: UseInstruction<any> = async (fusionValue) => {
        if (!connections.has(fusionValue)) {
            if (fusionValue && typeof fusionValue.getChangedSignal === "function") {
                const signal = fusionValue.getChangedSignal();
                if (signal && typeof signal.connect === "function") {
                    const connection = await signal.connect(async (value: any) => {
                        onUpdate && await onUpdate();
                    });
                    connections.set(fusionValue, connection);
                }
            }
        }

        return peek(fusionValue);
    };

    const cleanup = () => {
        connections.forEach(connection => connection.disconnect());
        connections.clear();
    };

    return {
        use,
        cleanup,
        getConnections: () => connections
    };
};

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
        let onUpdateCallback: (value: any) => void;
        const deconstructorsScope = scope.getDeconstructors();
        const computedDeconstructors = deconstructorsScope.computed;
        let computedDeconstructorsAmount = computedDeconstructors.size;

        const useFactory = createUseFactory(async () => {
            const result = await handleComputedRenderCallback(callback, useFactory.use, element, property);
            onUpdateCallback && onUpdateCallback(result);
        });

        const computedReturn = {
            cleanup: () => {
                useFactory.cleanup();
                cleanupCallback && cleanupCallback();
            },

            __callback: async () => {
                return await handleComputedRenderCallback(callback, useFactory.use, element, property);
            },

            setOnUpdateCallback: (callback: (newValue: any) => void) => {
                onUpdateCallback = callback;
            }
        };

        if (element) {
            remoteRemove(element);
            element.addEventListener("remove", () => {
                useFactory.cleanup();
                cleanupCallback && cleanupCallback();
            });
        }

        computedDeconstructorsAmount++;
        computedDeconstructors.set(computedDeconstructorsAmount, () => {
            computedReturn.cleanup();
        });

        handleComputedRenderCallback(callback, useFactory.use, element, property);

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
