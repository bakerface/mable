import * as maybe from "./maybe";
import * as remoteData from "./remote-data";
import * as result from "./result";

export const Maybe = maybe;
export type Maybe<T> = maybe.Maybe<T>;
export type MaybePattern<T, Return> = maybe.Pattern<T, Return>;

export const RemoteData = remoteData;
export type RemoteData<F, S> = remoteData.RemoteData<F, S>;
export type RemoteDataPattern<F, S, Return> = remoteData.Pattern<F, S, Return>;

export const Result = result;
export type Result<E, O> = result.Result<E, O>;
export type ResultPattern<E, O, Return> = result.Pattern<E, O, Return>;
