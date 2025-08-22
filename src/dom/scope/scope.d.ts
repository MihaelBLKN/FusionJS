import { ForKeys, ForKeysCallback } from "../../core/forKeys/forKeys";
import { ForPairsCallback } from "../../core/forPairs";
import { ForPairs } from "../../core/forPairs/forPairs";
import { ForValues } from "../../core/forValues/forValues";
import { ObserverReturn } from "../../core/observer";
import { Observer } from "../../core/observer/observer";
import { OnChange } from "../../core/onChange/onChange";
import { CallbackOnEvent, OnEvent } from "../../core/onEvent/onEvent";
import { Value, ValueReturnCallback } from "../../core/value/value";
import { FunctionMapExport, HTMLAttributes } from "../../global";
import { Computed, ComputedCallback, ComputedReturn } from "../computed/computed";
import { NewEl } from "../new/new";
import { SpringFactoryOptions } from "../spring";
import { Spring } from "../spring/spring";
import { Tween } from "../tween/tween";

export interface Scope {
    doCleanup: (extraCallback?: () => void) => void,
    getDeconstructors: () => {
        element: Map<number, () => void>,
        value: Map<number, () => void>,
        computed: Map<number, () => void>,
        observer: Map<number, () => void>,
        onEvent: Map<number, () => void>,
    },

    deriveScope: () => Scope,
    innerScope: (includeMapOrEventsInner?: boolean | { [key: string]: any }, includeEventsInner?: boolean) => Scope,
    newEl: NewEl,
    computed: Computed,
    value: Value,
    observer: Observer,
    onChange: OnChange,
    onEvent: OnEvent,
    forValues: ForValues,
    forKeys: ForKeys,
    forPairs: ForPairs,
    tween: Tween,
    spring: Spring,
}
