type EasingFunction = (t: number) => number;

const Easing = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

interface TweenOptions {
    element?: HTMLElement;
    to: Record<string, any>;
    duration: number;
    easing?: EasingFunction;
    onComplete?: () => void;
    onUpdate?: (current: Record<string, any>) => void;
}

class Tween {
    private startTime: number = 0;
    private rafId: number | null = null;
    private options: TweenOptions;
    private from: Record<string, any> = {};
    private current: Record<string, any> = {};

    constructor(options: TweenOptions, from?: Record<string, any>) {
        this.options = { easing: Easing.linear, ...options };
        this.from = from || Object.fromEntries(
            Object.entries(this.options.to).map(([key, toVal]) => {
                if (typeof toVal === "number") return [key, 0];
                if (typeof toVal === "string" && toVal.startsWith("#")) return [key, "#000000"];
                return [key, ""]; // fallback for transforms etc.
            })
        );
    }

    getCurrentValues() {
        return this.current;
    }

    isRunning() {
        return this.rafId !== null;
    }

    start() {
        this.startTime = performance.now();
        this.update();
    }

    private update() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        const t = Math.min(elapsed / this.options.duration, 1);
        const eased = (this.options.easing as EasingFunction)(t);

        const current: Record<string, any> = {};

        for (const key in this.from) {
            const fromVal = this.from[key];
            const toVal = this.options.to[key];

            if (typeof fromVal === "string" && fromVal.startsWith("#")) {
                const fromRGB = hexToRgb(fromVal);
                const toRGB = hexToRgb(toVal);
                current[key] = rgbToHex({
                    r: Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * eased),
                    g: Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * eased),
                    b: Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * eased),
                });
            } else {
                current[key] = fromVal + (toVal - fromVal) * eased;
            }
        }

        this.current = current;

        if (this.options.element) {
            for (const key in current) {
                if (key === "transform") {
                    this.options.element.style.transform = current[key];
                } else {
                    this.options.element.style[key as any] = current[key].toString();
                }
            }
        }

        this.options.onUpdate?.(current);

        if (t < 1) {
            this.rafId = requestAnimationFrame(() => this.update());
        } else {
            this.rafId = null;
            this.options.onComplete?.();
        }
    }

    stop() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
}

const activeTweens = new WeakMap<HTMLElement, Tween>();
export const TweenService = {
    Create: (options: TweenOptions) => {
        const tween = new Tween(options);

        if (options.element) {
            const previousTween = activeTweens.get(options.element);
            if (previousTween) {
                previousTween.stop();
            }
            activeTweens.set(options.element, tween);
        }

        tween.start();
        return tween;
    },
};

export const EasingStyles = Easing