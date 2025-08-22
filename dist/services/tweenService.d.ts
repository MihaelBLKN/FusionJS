import { ValueReturnCallback } from "../core/value";
type EasingFunction = (t: number) => number;
interface TweenOptions {
    element?: HTMLElement;
    to: Record<string, any>;
    duration: number;
    progressValue: ValueReturnCallback<any>;
    easing?: EasingFunction;
    onComplete?: () => void;
    onUpdate?: (current: Record<string, any>) => void;
}
declare class Tween {
    private startTime;
    private rafId;
    private options;
    private from;
    private current;
    constructor(options: TweenOptions, from?: Record<string, any>);
    getCurrentValues(): Record<string, any>;
    isRunning(): boolean;
    start(): void;
    private update;
    stop(): void;
}
export declare const TweenService: {
    Create: (options: TweenOptions) => Tween;
};
export interface IEasingStyles {
    linear: (t: number) => number;
    easeInQuad: (t: number) => number;
    easeOutQuad: (t: number) => number;
    easeInOutQuad: (t: number) => number;
}
export declare const EasingStyles: IEasingStyles;
export {};
//# sourceMappingURL=tweenService.d.ts.map