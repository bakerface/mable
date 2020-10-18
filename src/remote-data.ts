import { Maps } from "./helpers";
import * as Maybe from "./maybe";
import * as Result from "./result";

export type RemoteData<F, S> = NotAsked | Loading | Failure<F> | Success<S>;

export interface NotAsked {
  readonly type: "NotAsked";
}

export const NotAsked: NotAsked = { type: "NotAsked" };

export interface Loading {
  readonly type: "Loading";
}

export const Loading: Loading = { type: "Loading" };

export interface Failure<T> {
  readonly type: "Failure";
  readonly payload: T;
}

export function Failure<T>(payload: T): Failure<T> {
  return { type: "Failure", payload };
}

export interface Success<T> {
  readonly type: "Success";
  readonly payload: T;
}

export function Success<T>(payload: T): Success<T> {
  return { type: "Success", payload };
}

export interface Pattern<F, S, Return> {
  NotAsked(): Return;
  Loading(): Return;
  Failure(value: F): Return;
  Success(value: S): Return;
}

export function caseOf<F, S, Return>(
  data: RemoteData<F, S>,
  pattern: Pattern<F, S, Return>
): Return {
  switch (data.type) {
    case "NotAsked":
      return pattern.NotAsked();

    case "Loading":
      return pattern.Loading();

    case "Failure":
      return pattern.Failure(data.payload);

    case "Success":
      return pattern.Success(data.payload);
  }
}

export function fold<F, S, Return>(
  pattern: Pattern<F, S, Return>
): Maps<RemoteData<F, S>, Return> {
  return (data) => caseOf(data, pattern);
}

export function map<F, S, T>(
  fn: Maps<S, T>
): Maps<RemoteData<F, S>, RemoteData<F, T>> {
  return fold<F, S, RemoteData<F, T>>({
    NotAsked: () => NotAsked,
    Loading: () => Loading,
    Failure,
    Success: (x) => Success(fn(x)),
  });
}

export function mapError<F, S, T>(
  fn: Maps<F, T>
): Maps<RemoteData<F, S>, RemoteData<T, S>> {
  return fold<F, S, RemoteData<T, S>>({
    NotAsked: () => NotAsked,
    Loading: () => Loading,
    Failure: (value) => Failure(fn(value)),
    Success,
  });
}

export function flatMap<F, A, B>(
  fn: Maps<A, RemoteData<F, B>>
): Maps<RemoteData<F, A>, RemoteData<F, B>> {
  return fold<F, A, RemoteData<F, B>>({
    NotAsked: () => NotAsked,
    Loading: () => Loading,
    Failure,
    Success: fn,
  });
}

export function withDefault<F, S>(value: S): Maps<RemoteData<F, S>, S> {
  return fold<F, S, S>({
    NotAsked: () => value,
    Loading: () => value,
    Failure: () => value,
    Success: (x) => x,
  });
}

export function toMaybe<F, S>(data: RemoteData<F, S>): Maybe.Maybe<S> {
  return caseOf<F, S, Maybe.Maybe<S>>(data, {
    NotAsked: () => Maybe.Nothing,
    Loading: () => Maybe.Nothing,
    Failure: () => Maybe.Nothing,
    Success: Maybe.Just,
  });
}

export function fromMaybe<F, S>(
  error: F
): Maps<Maybe.Maybe<S>, RemoteData<F, S>> {
  return Maybe.fold<S, RemoteData<F, S>>({
    Just: Success,
    Nothing: () => Failure(error),
  });
}

export function fromResult<F, S>(
  result: Result.Result<F, S>
): RemoteData<F, S> {
  return Result.caseOf<F, S, RemoteData<F, S>>(result, {
    Err: Failure,
    Ok: Success,
  });
}
