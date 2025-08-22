import { NewEl } from "./new";
import { Computed } from "./computed";
import { Value } from "../core/value";
import { OnChange } from "../core/onChange";
import { OnEvent } from "../core/onEvent";
import { ForValues } from "../core/forValues";
import { ForKeys } from "../core/forKeys";
import { ForPairs } from "../core/forPairs";
import { Tween } from "./tween";
import { Spring } from "./spring";
import { Observer } from "../core/observer";
export declare const scope: (includeMapOrEvents?: {
    [key: string]: any;
} | boolean, includeEvents?: boolean) => Scope;
export interface Scope {
    doCleanup: (extraCallback?: () => void) => void;
    getDeconstructors: () => {
        element: Map<number, () => void>;
        value: Map<number, () => void>;
        computed: Map<number, () => void>;
        observer: Map<number, () => void>;
        onEvent: Map<number, () => void>;
    };
    deriveScope: () => Scope;
    innerScope: (includeMapOrEventsInner?: boolean | {
        [key: string]: any;
    }, includeEventsInner?: boolean) => Scope;
    newEl: NewEl;
    computed: Computed;
    value: Value;
    observer: Observer;
    onChange: OnChange;
    onEvent: OnEvent;
    forValues: ForValues;
    forKeys: ForKeys;
    forPairs: ForPairs;
    tween: Tween;
    spring: Spring;
}
//# sourceMappingURL=scope.d.ts.map