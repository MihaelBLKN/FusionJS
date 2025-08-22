import { Scope } from "../../src/dom/scope";

export interface Props {
    text: string;
    appearAfter: number;
}

export default (scope: Scope, props: Props): HTMLElement => {
    const opacityGoalValue = scope.value(0);
    const heading = scope.newEl("h1", {
        innerText: props.text,
        style: {
            opacity: scope.tween(opacityGoalValue, 3000, (t) => t),
            // this version of FusionWebTs doesn't have easing methods exported yet,
            // nor a fully replicated TweenService api

            color: {
                hex: "#000000ff",
            },

            fontFamily: '"Sono", monospace'
        }
    });

    setTimeout(() => {
        opacityGoalValue.set(1);
    }, props.appearAfter);

    return heading;
}
