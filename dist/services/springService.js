function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex({ r, g, b }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
class Spring {
    constructor(options, from) {
        this.rafId = null;
        this.from = {};
        this.current = {};
        this.velocity = {};
        this.options = Object.assign({ stiffness: 0.1, damping: 0.8, mass: 1 }, options);
        this.from = from || Object.fromEntries(Object.entries(this.options.to).map(([key, toVal]) => {
            if (typeof toVal === "number")
                return [key, 0];
            if (typeof toVal === "string" && toVal.startsWith("#"))
                return [key, "#000000"];
            return [key, ""];
        }));
        this.current = Object.assign({}, this.from);
        this.velocity = Object.fromEntries(Object.keys(this.from).map(key => { var _a, _b; return [key, (_b = (_a = this.options.initialVelocity) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : 0]; }));
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
    update() {
        var _a, _b, _c, _d, _e, _f;
        let allAtRest = true;
        const dt = 1 / 60;
        const next = {};
        for (const key in this.from) {
            const fromVal = this.current[key];
            const toVal = this.options.to[key];
            if (typeof fromVal === "string" && fromVal.startsWith("#")) {
                const fromRGB = hexToRgb(fromVal);
                const toRGB = hexToRgb(toVal);
                const velocity = this.velocity[key];
                const newRGB = { r: 0, g: 0, b: 0 };
                ["r", "g", "b"].forEach((channel) => {
                    const force = this.options.stiffness * (toRGB[channel] - fromRGB[channel]);
                    const damping = this.options.damping * (velocity !== null && velocity !== void 0 ? velocity : 0);
                    const acceleration = (force - damping) / this.options.mass;
                    if (this.velocity[key] === undefined)
                        this.velocity[key] = 0;
                    this.velocity[key] += acceleration * dt;
                    newRGB[channel] = Math.round(fromRGB[channel] + this.velocity[key] * dt);
                    if (Math.abs(this.velocity[key]) > 0.001 || Math.abs(toRGB[channel] - newRGB[channel]) > 0.001)
                        allAtRest = false;
                });
                next[key] = rgbToHex(newRGB);
            }
            else {
                const force = this.options.stiffness * (toVal - fromVal);
                const damping = this.options.damping * ((_a = this.velocity[key]) !== null && _a !== void 0 ? _a : 0);
                const acceleration = (force - damping) / this.options.mass;
                this.velocity[key] = ((_b = this.velocity[key]) !== null && _b !== void 0 ? _b : 0) + acceleration * dt;
                next[key] = fromVal + this.velocity[key] * dt;
                if (Math.abs(this.velocity[key]) > 0.001 || Math.abs(toVal - next[key]) > 0.001)
                    allAtRest = false;
            }
        }
        this.current = next;
        if (this.options.element) {
            for (const key in next) {
                if (key === "transform") {
                    this.options.element.style.transform = next[key];
                }
                else {
                    this.options.element.style[key] = next[key].toString();
                }
            }
        }
        (_d = (_c = this.options).onUpdate) === null || _d === void 0 ? void 0 : _d.call(_c, next);
        if (!allAtRest) {
            this.rafId = requestAnimationFrame(() => this.update());
        }
        else {
            this.rafId = null;
            (_f = (_e = this.options).onComplete) === null || _f === void 0 ? void 0 : _f.call(_e);
        }
    }
    stop() {
        if (this.rafId)
            cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
}
export const SpringService = {
    Create: (options) => {
        const spring = new Spring(options);
        spring.start();
        return spring;
    },
};
//# sourceMappingURL=springService.js.map