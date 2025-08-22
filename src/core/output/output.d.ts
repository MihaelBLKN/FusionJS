import { FunctionMapExport } from "../../global";
import { ValueReturnCallback } from "../value/value";

export type Output = (property: string, value: ValueReturnCallback<any>, changePropertyOnValueChange?: boolean) => FunctionMapExport
