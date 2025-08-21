import { doNothing, output, peek, scope, scoped } from "../src";
import { UseInstruction } from "../src/dom/computed/computed";

const testScope = scoped();
const testSoloScope = scope({ foo: "bar!" });
const testSoloDerivedScope = testSoloScope.deriveScope();
const innerTestScope = testScope.innerScope({
    foo: "bar!!"
});

const testValue = testScope.value("hello world!");
const testValue2 = testScope.value(undefined);
const paragraph = testScope.newEl("p", {
    innerText: output("innerText", testValue, true),

    onEvents: {
        exampleEvent: testScope.onEvent("click", (element, event) => {
            console.log("Element clicked:", element);
        }),

        exampleChanged: testScope.onChange("innerText", (newValue) => {
            console.log("Element changed:", newValue);
        })
    },

    parent: testScope.computed((use: UseInstruction<HTMLElement>) => {
        return use(testValue2)
    }, doNothing),
})

console.log(peek(testValue))
setTimeout(() => {
    paragraph.innerText = "Hello FusionJs!";
    console.log(peek(testValue));
    testValue2.set(document.body);
}, 2500);
