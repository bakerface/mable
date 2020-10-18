import * as maybe from "./maybe";
import * as result from "./result";

export const Maybe = maybe;
export type Maybe<T> = maybe.Maybe<T>;
export type MaybePattern<T, Return> = maybe.Pattern<T, Return>;

export const Result = result;
export type Result<Err, Ok> = result.Result<Err, Ok>;
export type ResultPattern<Err, Ok, Return> = result.Pattern<Err, Ok, Return>;
