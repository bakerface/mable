interface Just<T> {
  readonly type: "Just";
  readonly payload: T;
}

interface Nothing {
  readonly type: "Nothing";
}

export type Maybe<T> = Just<T> | Nothing;

export const just = <T>(payload: T): Maybe<T> => ({ type: "Just", payload });
export const nothing = <T>(): Maybe<T> => ({ type: "Nothing" });

interface MaybePattern<T, R> {
  Just(value: T): R;
  Nothing(): R;
}

export const caseOf = <T, R>(pattern: MaybePattern<T, R>) =>
  (maybe: Maybe<T>) => {
    switch (maybe.type) {
      case "Just":
        return pattern.Just(maybe.payload);

      case "Nothing":
        return pattern.Nothing();
    }
  };

export const withDefault = <T>(defaultValue: T) =>
  caseOf({
    Just: (value: T) => value,
    Nothing: () => defaultValue,
  });

type Map<A, R> = (a: A) => R;
type MaybeMap<A, R> = (a: Maybe<A>) => Maybe<R>;

export const map = <A, R>(fn: Map<A, R>) =>
  caseOf<A, Maybe<R>>({
    Just: (a) => just<R>(fn(a)),
    Nothing: () => nothing<R>(),
  });

type Map2<A, B, R> = (a: A) => Map<B, R>;
type MaybeMap2<A, B, R> = (a: Maybe<A>) => MaybeMap<B, R>;

export const map2 = <A, B, R>(fn: Map2<A, B, R>) =>
  caseOf<A, MaybeMap<B, R>>({
    Just: (a) => map(fn(a)),
    Nothing: () => () => nothing<R>(),
  });

type Map3<A, B, C, R> = (a: A) => Map2<B, C, R>;
type MaybeMap3<A, B, C, R> = (a: Maybe<A>) => MaybeMap2<B, C, R>;

export const map3 = <A, B, C, R>(fn: Map3<A, B, C, R>) =>
  caseOf<A, MaybeMap2<B, C, R>>({
    Just: (a) => map2(fn(a)),
    Nothing: () => () => () => nothing<R>(),
  });

type Map4<A, B, C, D, R> = (a: A) => Map3<B, C, D, R>;
type MaybeMap4<A, B, C, D, R> = (a: Maybe<A>) => MaybeMap3<B, C, D, R>;

export const map4 = <A, B, C, D, R>(fn: Map4<A, B, C, D, R>) =>
  caseOf<A, MaybeMap3<B, C, D, R>>({
    Just: (a) => map3(fn(a)),
    Nothing: () => () => () => () => nothing<R>(),
  });

type Map5<A, B, C, D, E, R> = (a: A) => Map4<B, C, D, E, R>;

export const map5 = <A, B, C, D, E, R>(fn: Map5<A, B, C, D, E, R>) =>
  caseOf<A, MaybeMap4<B, C, D, E, R>>({
    Just: (a) => map4(fn(a)),
    Nothing: () => () => () => () => () => nothing<R>(),
  });

type FlatMap<A, R> = (a: A) => Maybe<R>;

export const flatMap = <A, R>(fn: FlatMap<A, R>) =>
  caseOf<A, Maybe<R>>({
    Just: (a) => fn(a),
    Nothing: () => nothing<R>(),
  });

type FlatMap2<A, B, R> = (a: A) => FlatMap<B, R>;

export const flatMap2 = <A, B, R>(fn: FlatMap2<A, B, R>) =>
  caseOf<A, MaybeMap<B, R>>({
    Just: (a) => flatMap(fn(a)),
    Nothing: () => () => nothing<R>(),
  });

type FlatMap3<A, B, C, R> = (a: A) => FlatMap2<B, C, R>;

export const flatMap3 = <A, B, C, R>(fn: FlatMap3<A, B, C, R>) =>
  caseOf<A, MaybeMap2<B, C, R>>({
    Just: (a) => flatMap2(fn(a)),
    Nothing: () => () => () => nothing<R>(),
  });

type FlatMap4<A, B, C, D, R> = (a: A) => FlatMap3<B, C, D, R>;

export const flatMap4 = <A, B, C, D, R>(fn: FlatMap4<A, B, C, D, R>) =>
  caseOf<A, MaybeMap3<B, C, D, R>>({
    Just: (a) => flatMap3(fn(a)),
    Nothing: () => () => () => () => nothing<R>(),
  });

type FlatMap5<A, B, C, D, E, R> = (a: A) => FlatMap4<B, C, D, E, R>;

export const flatMap5 = <A, B, C, D, E, R>(fn: FlatMap5<A, B, C, D, E, R>) =>
  caseOf<A, MaybeMap4<B, C, D, E, R>>({
    Just: (a) => flatMap4(fn(a)),
    Nothing: () => () => () => () => () => nothing<R>(),
  });
