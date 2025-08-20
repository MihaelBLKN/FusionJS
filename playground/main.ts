import { newEl, value, signal, onEvent, computed, peek, hydrate, observer } from "../src";
import { UseInstruction } from "../src/dom/computed/computed";

const testValue = value("test");
const testButton = newEl(
    "button",
    {
        onEvents: {
            exampleEvent: onEvent("click", (element, event) => {
                testValue.set(peek(testValue) === "test" ? "clicked" : "test");
            })
        },

        innerText: computed((use: UseInstruction<string>) => {
            return use(testValue)
        }),

        parent: document.body,
    }
);

const hydrateValue = value("HYDRATED TEXT: WAITING 5 SECONDS BEFORE REACTIVE STATE CHANGE");
const hydrateText = document.createElement("p");
document.body.appendChild(hydrateText);
hydrateText.innerText = peek(hydrateValue);

hydrate(hydrateText, {
    innerText: computed((use: UseInstruction<string>) => {
        return use(hydrateValue)
    })
});

const hydrateObserver = observer(hydrateValue);
const disconnect = hydrateObserver.onChange((newValue: string) => {
    console.log("Hydrate value changed:", newValue);
});

setTimeout(() => {
    hydrateValue.set("HYDRATED TEXT: REACTIVE STATE CHANGE");
    disconnect();
    hydrateValue.set("TEST DISCONNECTING");
}, 5000);


const computedValue = value([]);
newEl("div", {
    children: computed((use: UseInstruction<HTMLElement[]>) => {
        return use(computedValue);
    }),

    parent: document.body
})

setTimeout(() => {
    computedValue.set([
        newEl("p", {
            innerText: "This is a child paragraph."
        }),
        newEl("button", {
            innerText: "Click me",
            onEvents: {
                click: onEvent("click", (element, event) => {
                    console.log("Button clicked!");
                })
            }
        })
    ])
}, 5000)