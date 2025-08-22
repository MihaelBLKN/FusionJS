import { HTMLAttributes } from "../../global";
export type Hydrate = (element: HTMLElement, propertyMap: HTMLAttributes, cleanupCallback?: () => void) => void;
