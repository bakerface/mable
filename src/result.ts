import { Maps } from "./helpers";
import { Just, Maybe, Nothing, fold as foldMaybe } from "./maybe";

export type Result<E, O> = Err<E> | Ok<O>;

export interface Err<T> {
  readonly type: "Err";
  readonly payload: T;
}

export function Err<T>(payload: T): Err<T> {
  return { type: "Err", payload };
}

export interface Ok<T> {
  readonly type: "Ok";
  readonly payload: T;
}

export function Ok<T>(payload: T): Ok<T> {
  return { type: "Ok", payload };
}

export interface Pattern<E, O, Return> {
  Err(error: E): Return;
  Ok(value: O): Return;
}

export function caseOf<E, O, Return>(
  result: Result<E, O>,
  pattern: Pattern<E, O, Return>
): Return {
  switch (result.type) {
    case "Err":
      return pattern.Err(result.payload);

    case "Ok":
      return pattern.Ok(result.payload);
  }
}

export function fold<E, O, Return>(
  pattern: Pattern<E, O, Return>
): Maps<Result<E, O>, Return> {
  return (result) => caseOf(result, pattern);
}

export function map<E, O, T>(fn: Maps<O, T>): Maps<Result<E, O>, Result<E, T>> {
  return fold<E, O, Result<E, T>>({
    Err,
    Ok: (x) => Ok(fn(x)),
  });
}

export function mapError<E, O, T>(
  fn: Maps<E, T>
): Maps<Result<E, O>, Result<T, O>> {
  return fold<E, O, Result<T, O>>({
    Err: (e) => Err(fn(e)),
    Ok,
  });
}

export function flatMap<E, A, B>(
  fn: Maps<A, Result<E, B>>
): Maps<Result<E, A>, Result<E, B>> {
  return fold<E, A, Result<E, B>>({
    Err,
    Ok: fn,
  });
}

export function withDefault<E, O>(value: O): Maps<Result<E, O>, O> {
  return fold<E, O, O>({
    Err: () => value,
    Ok: (x) => x,
  });
}

export function toMaybe<E, O>(result: Result<E, O>): Maybe<O> {
  return caseOf<E, O, Maybe<O>>(result, {
    Err: () => Nothing,
    Ok: Just,
  });
}

export function fromMaybe<E, O>(error: E): Maps<Maybe<O>, Result<E, O>> {
  return foldMaybe<O, Result<E, O>>({
    Just: Ok,
    Nothing: () => Err(error),
  });
}
