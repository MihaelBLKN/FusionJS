export interface SpringOptions {
    element?: HTMLElement;
    to: Record<string, any>;
    stiffness?: number; // spring stiffness
    damping?: number;   // damping coefficient
    mass?: number;      // mass
    initialVelocity?: Record<string, number>; // optional per-property initial velocity
    onComplete?: () => void;
    onUpdate?: (current: Record<string, any>) => void;
}

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

class Spring {
    private rafId: number | null = null;
    private options: SpringOptions;
    private from: Record<string, any> = {};
    private current: Record<string, any> = {};
    private velocity: Record<string, number> = {};

    constructor(options: SpringOptions, from?: Record<string, any>) {
        this.options = { stiffness: 0.1, damping: 0.8, mass: 1, ...options };
        this.from = from || Object.fromEntries(
            Object.entries(this.options.to).map(([key, toVal]) => {
                if (typeof toVal === "number") return [key, 0];
                if (typeof toVal === "string" && toVal.startsWith("#")) return [key, "#000000"];
                return [key, ""];
            })
        );

        this.current = { ...this.from };

        this.velocity = Object.fromEntries(
            Object.keys(this.from).map(key => [key, this.options.initialVelocity?.[key] ?? 0])
        );
    }

    getCurrentValues() {
        return this.current;
    }

    isRunning() {
        return this.rafId !== null;
    }

    start() {
        this.update();
    }

    private update() {
        let allAtRest = true;
        const dt = 1 / 60;

        const next: Record<string, any> = {};

        for (const key in this.from) {
            const fromVal = this.current[key];
            const toVal = this.options.to[key];

            if (typeof fromVal === "string" && fromVal.startsWith("#")) {
                const fromRGB = hexToRgb(fromVal);
                const toRGB = hexToRgb(toVal);
                const velocity = this.velocity[key];

                const newRGB = { r: 0, g: 0, b: 0 } as any;

                (["r", "g", "b"] as const).forEach((channel) => {
                    const force = this.options.stiffness! * (toRGB[channel] - fromRGB[channel]);
                    const damping = this.options.damping! * (velocity ?? 0);
                    const acceleration = (force - damping) / this.options.mass!;
                    if (this.velocity[key] === undefined) this.velocity[key] = 0;
                    this.velocity[key] += acceleration * dt;
                    newRGB[channel] = Math.round(fromRGB[channel] + this.velocity[key] * dt);
                    if (Math.abs(this.velocity[key]) > 0.001 || Math.abs(toRGB[channel] - newRGB[channel]) > 0.001) allAtRest = false;
                });

                next[key] = rgbToHex(newRGB);
            } else {
                const force = this.options.stiffness! * (toVal - fromVal);
                const damping = this.options.damping! * (this.velocity[key] ?? 0);
                const acceleration = (force - damping) / this.options.mass!;
                this.velocity[key] = (this.velocity[key] ?? 0) + acceleration * dt;
                next[key] = fromVal + this.velocity[key] * dt;

                if (Math.abs(this.velocity[key]) > 0.001 || Math.abs(toVal - next[key]) > 0.001) allAtRest = false;
            }
        }

        this.current = next;

        if (this.options.element) {
            for (const key in next) {
                if (key === "transform") {
                    this.options.element.style.transform = next[key];
                } else {
                    this.options.element.style[key as any] = next[key].toString();
                }
            }
        }

        this.options.onUpdate?.(next);

        if (!allAtRest) {
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

export const SpringService = {
    Create: (options: SpringOptions) => {
        const spring = new Spring(options);
        spring.start();
        return spring;
    },
};
