"use strict";
import { processProperty } from "../new";
import remoteRemove from "../../remoteRemove";
import { peek } from "../../core/peek";
export const createUseFactory = (onUpdate) => {
    const connections = new Map();
    const use = async (fusionValue) => {
        if (!connections.has(fusionValue)) {
            if (fusionValue && typeof fusionValue.getChangedSignal === "function") {
                const signal = fusionValue.getChangedSignal();
                if (signal && typeof signal.connect === "function") {
                    const connection = await signal.connect(async (value) => {
                        if (onUpdate) {
                            await onUpdate();
                        }
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
    const update = async () => {
        if (onUpdate) {
            await onUpdate();
        }
    };
    return {
        use,
        cleanup,
        getConnections: () => connections,
        update
    };
};
const handleComputedRenderCallback = async (callback, use, element, property) => {
    const result = await callback(use);
    if (property === "parent") {
        const newParent = result;
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
};
const createComputedFactory = (callback, cleanupCallback, scope) => {
    return (property, element) => {
        let onUpdateCallback;
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
            setOnUpdateCallback: (callback) => {
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
};
export const computed = (callback, cleanupCallback, scope) => {
    const factory = createComputedFactory(callback, cleanupCallback, scope);
    return {
        getSignature: () => "computed",
        getFactory: () => factory,
    };
};
//# sourceMappingURL=index.js.map