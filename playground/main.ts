import { doNothing, scope, scoped } from "../src";
import { onEvent } from "../src/core/onEvent";
import { UseInstruction } from "../src/dom/computed/computed";

const testScope = scoped();
const testSoloScope = scope({ foo: "bar!" });
const testSoloDerivedScope = testSoloScope.deriveScope();
const innerTestScope = testScope.innerScope({
    foo: "bar!!"
});

const testValue = testScope.value("hello world!");
testScope.newEl("p", {
    innerText: testScope.computed((use: UseInstruction<string>) => {
        return use(testValue)
    }, doNothing),

    onEvents: {
        exampleEvent: testScope.onEvent("click", (element, event) => {
            console.log("Element clicked:", element);
        }),

        exampleChanged: testScope.onChange("innerText", (newValue) => {
            console.log("Element changed:", newValue);
        })
    },

    parent: document.body,
})


setTimeout(() => {
    testValue.set("hello fusion!");
}, 2500);
