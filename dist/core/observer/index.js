"use strict";
export const observer = (value, scope) => {
    let signalConnection;
    let changedSignal = value.getChangedSignal();
    const deconstructorsScope = scope.getDeconstructors();
    const observerDeconstructors = deconstructorsScope.observer;
    observerDeconstructors.set(observerDeconstructors.size + 1, () => {
        if (signalConnection) {
            signalConnection.disconnect();
            signalConnection = undefined;
        }
    });
    return {
        onChange: (callback) => {
            if (!signalConnection && changedSignal) {
                const connectionPromise = changedSignal.connect(callback);
                connectionPromise.then(connection => {
                    signalConnection = connection;
                });
            }
            return () => {
                if (signalConnection) {
                    signalConnection.disconnect();
                    signalConnection = undefined;
                }
            };
        }
    };
};
//# sourceMappingURL=index.js.map