const Easing = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex({ r, g, b }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
class Tween {
    constructor(options, from) {
        this.startTime = 0;
        this.rafId = null;
        this.from = {};
        this.current = {};
        this.options = Object.assign({ easing: Easing.linear }, options);
        this.from = from || Object.fromEntries(Object.entries(this.options.to).map(([key, toVal]) => {
            if (typeof toVal === "number")
                return [key, 0];
            if (typeof toVal === "string" && toVal.startsWith("#"))
                return [key, "#000000"];
            return [key, ""]; // fallback for transforms etc.
        }));
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
    update() {
        var _a, _b, _c, _d;
        const now = performance.now();
        const elapsed = now - this.startTime;
        const t = Math.min(elapsed / this.options.duration, 1);
        const eased = this.options.easing(t);
        const current = {};
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
            }
            else {
                current[key] = fromVal + (toVal - fromVal) * eased;
            }
        }
        this.current = current;
        if (this.options.element) {
            for (const key in current) {
                if (key === "transform") {
                    this.options.element.style.transform = current[key];
                }
                else {
                    this.options.element.style[key] = current[key].toString();
                }
            }
        }
        (_b = (_a = this.options).onUpdate) === null || _b === void 0 ? void 0 : _b.call(_a, current);
        if (t < 1) {
            this.rafId = requestAnimationFrame(() => this.update());
        }
        else {
            this.rafId = null;
            (_d = (_c = this.options).onComplete) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
    }
    stop() {
        if (this.rafId)
            cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
}
const activeElementTweens = new WeakMap();
const activeValueTweens = new WeakMap();
export const TweenService = {
    Create: (options) => {
        const tween = new Tween(options);
        if (options.element) {
            const previousTween = activeElementTweens.get(options.element);
            if (previousTween) {
                previousTween.stop();
            }
            activeElementTweens.set(options.element, tween);
        }
        else {
            const previousTween = activeValueTweens.get(options.progressValue);
            if (previousTween) {
                previousTween.stop();
            }
            activeValueTweens.set(options.progressValue, tween);
        }
        tween.start();
        return tween;
    },
};
export const EasingStyles = Easing;
//# sourceMappingURL=tweenService.js.map