import { newEl, value, signal, onEvent, computed } from "../src";
import { UseInstruction } from "../src/dom/computed/computed";

const testValue = value("test");
const testButton = newEl(
    "button",
    {
        onEvents: {
            exampleEvent: onEvent("click", (element, event) => {
                testValue.set(testValue.get() === "test" ? "clicked" : "test");
            })
        },

        innerText: computed((use: UseInstruction<string>) => {
            return use(testValue)
        }),

        parent: document.body,
    }
);
