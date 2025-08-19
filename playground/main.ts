import { newEl, value, signal, onEvent, computed } from "../src";
import peek from "../src/core/peek";
import { UseInstruction } from "../src/dom/computed/computed";
import hydrate from "../src/dom/hydrate";

const testValue = value("test");
const testButton = newEl(
    "button",
    {
        onEvents: {
            exampleEvent: onEvent("click", (element, event) => {
                testValue.set(peek(hydrateValue) === "test" ? "clicked" : "test");
            })
        },

        innerText: computed((use: UseInstruction<string>) => {
            return use(testValue)
        }),

        parent: document.body,
    }
);

const hydrateValue = value("HYDRATED TEXT: WAITING 5 SECONDS BEFORE REACTIE STATE CHANGE");
const hydrateText = document.createElement("p");
document.body.appendChild(hydrateText);
hydrateText.innerText = peek(hydrateValue);

hydrate(hydrateText, {
    innerText: computed((use: UseInstruction<string>) => {
        return use(hydrateValue)
    })
});

setTimeout(() => {
    hydrateValue.set("HYDRATED TEXT: REACTIVE STATE CHANGE");
}, 5000);
