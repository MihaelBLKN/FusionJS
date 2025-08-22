export interface SpringOptions {
    element?: HTMLElement;
    to: Record<string, any>;
    stiffness?: number;
    damping?: number;
    mass?: number;
    initialVelocity?: Record<string, number>;
    onComplete?: () => void;
    onUpdate?: (current: Record<string, any>) => void;
}
declare class Spring {
    private rafId;
    private options;
    private from;
    private current;
    private velocity;
    constructor(options: SpringOptions, from?: Record<string, any>);
    getCurrentValues(): Record<string, any>;
    isRunning(): boolean;
    start(): void;
    private update;
    stop(): void;
}
export declare const SpringService: {
    Create: (options: SpringOptions) => Spring;
};
export {};
//# sourceMappingURL=springService.d.ts.map