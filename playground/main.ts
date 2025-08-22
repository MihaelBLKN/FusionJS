import appearHeading from "./components/appearHeading";
import { scoped } from "../src"
import "./global.css";
const app = scoped();
import { EasingStyles } from "../src";

const appDiv = app.newEl("div", {
    parent: document.body,
    class: "app",
    children: [
        appearHeading(app, {
            text: "Welcome to FusionWebTs!",
            appearAfter: 3000
        })
    ],
})

export default appDiv;
