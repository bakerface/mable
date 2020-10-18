import { Maps } from "./helpers";

export type Maybe<T> = Just<T> | Nothing;

export interface Just<T> {
  readonly type: "Just";
  readonly payload: T;
}

export function Just<T>(payload: T): Just<T> {
  return { type: "Just", payload };
}

export interface Nothing {
  readonly type: "Nothing";
}

export const Nothing: Nothing = { type: "Nothing" };

export interface Pattern<T, Return> {
  Just(value: T): Return;
  Nothing(): Return;
}

export function caseOf<T, Return>(
  maybe: Maybe<T>,
  pattern: Pattern<T, Return>
): Return {
  switch (maybe.type) {
    case "Just":
      return pattern.Just(maybe.payload);

    case "Nothing":
      return pattern.Nothing();
  }
}

export function fold<T, Return>(
  pattern: Pattern<T, Return>
): Maps<Maybe<T>, Return> {
  return (maybe) => caseOf(maybe, pattern);
}

export function map<A, B>(fn: Maps<A, B>): Maps<Maybe<A>, Maybe<B>> {
  return fold<A, Maybe<B>>({
    Just: (x) => Just(fn(x)),
    Nothing: () => Nothing,
  });
}

export function flatMap<A, B>(fn: Maps<A, Maybe<B>>): Maps<Maybe<A>, Maybe<B>> {
  return fold<A, Maybe<B>>({
    Just: fn,
    Nothing: () => Nothing,
  });
}

export function withDefault<T>(value: T): Maps<Maybe<T>, T> {
  return fold<T, T>({
    Just: (x) => x,
    Nothing: () => value,
  });
}

export function of<T>(value: T | null | undefined): Maybe<T> {
  if (typeof value === "undefined" || value === null) {
    return Nothing;
  }

  return Just(value);
}
