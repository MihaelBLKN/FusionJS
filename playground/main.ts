import { doNothing, output, peek, scope, scoped } from "../src";
import { UseInstruction } from "../src/dom/computed/computed";
import { Scope } from "../src/dom/scope/scope";
import { EasingStyles } from "../src/services/tweenService";

const testScope = scoped();
const testSoloScope = scope({ foo: "bar!" });
const testSoloDerivedScope = testSoloScope.deriveScope();
const innerTestScope = testScope.innerScope({
    foo: "bar!!"
});

const testObjectValue = testScope.value({
    test1: 1,
    test2: 2,
    test3: 3,
});

const multiplied = await testScope.forValues(testObjectValue, (use: UseInstruction<any>, scope: Scope, v: number) => {
    const full = use(testObjectValue);
    return v * 2;
});

const idk = await testScope.forKeys(testObjectValue, (use: UseInstruction<any>, scope: Scope, key: string) => {
    console.log(key)
    return Promise.resolve(key);
});

const idk2 = await testScope.forPairs(testObjectValue, (use: UseInstruction<any>, scope: Scope, key: string | number, value: any) => {
    console.log(key, value);
    return Promise.resolve([key, value]);
});

console.log(multiplied);

testObjectValue.set({ test1: 5, test2: 6, test3: 7 });

const opacityValue = testScope.value(1);
const testValue = testScope.value("hello world!");
const testValue2 = testScope.value(undefined);
const paragraph = testScope.newEl("p", {
    innerText: "testText",

    onEvents: {
        exampleEvent: testScope.onEvent("click", (element, event) => {
            console.log("Element clicked:", element);
        }),

        exampleChanged: testScope.onChange("innerText", (newValue) => {
            console.log("Element changed:", newValue);
        })
    },

    style: {
        opacity: testScope.tween(opacityValue, 1000, EasingStyles.easeInQuad)
    },

    parent: document.body,
})

setTimeout(() => {
    paragraph.innerText = "Hello FusionJs!";
    console.log(peek(testValue));
    testValue2.set(document.body);
    console.log(multiplied);
    opacityValue.set(1);
}, 2500);
