//> -------------------------------- <//
//> MihaelBLKN 2025-2026
//> MIT License (usage without warranty)
//> https://opensource.org/licenses/MIT
//> -------------------------------- <//
import { ComputedReturn } from "../computed/computed";
import { Scope } from "../scope/scope";

export interface ElementProperties extends HTMLAttributes {
    [attr: string]: any;
}

export type EventCleanupCallbacks = { [key: string]: CleanupFunctionListener[] }
export type ComputedFactoryCallback = (property: string, element: HTMLElement, scope: Scope) => ComputedReturn;
export type NewEl = (elementClass: string, elementProperties: HTMLAttributes, scope: Scope) => HTMLElement;
