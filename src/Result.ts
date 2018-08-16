interface Err<T> {
  readonly type: "Err";
  readonly payload: T;
}

interface Ok<T> {
  readonly type: "Ok";
  readonly payload: T;
}

export type Result<E, T> = Err<E> | Ok<T>;

export const ok = <E, T>(payload: T): Result<E, T> =>
  ({ type: "Ok", payload });

export const err = <E, T>(payload: E): Result<E, T> =>
  ({ type: "Err", payload });

interface ResultPattern<E, T, R> {
  Err(value: E): R;
  Ok(value: T): R;
}

export const caseOf = <E, T, R>(pattern: ResultPattern<E, T, R>) =>
  (res: Result<E, T>) => {
    switch (res.type) {
      case "Ok":
        return pattern.Ok(res.payload);

      case "Err":
        return pattern.Err(res.payload);
    }
  };

export const withDefault = <E, T>(defaultValue: T) =>
  caseOf({
    Err: (_: E) => defaultValue,
    Ok: (value: T) => value,
  });

type Map<A, R> = (a: A) => R;
type ResultMap<X, A, R> = (a: Result<X, A>) => Result<X, R>;

export const map = <X, A, R>(fn: Map<A, R>) =>
  caseOf<X, A, Result<X, R>>({
    Err: (e) => err<X, R>(e),
    Ok: (a) => ok<X, R>(fn(a)),
  });

type Map2<A, B, R> = (a: A) => Map<B, R>;
type ResultMap2<X, A, B, R> = (a: Result<X, A>) => ResultMap<X, B, R>;

export const map2 = <X, A, B, R>(fn: Map2<A, B, R>) =>
  caseOf<X, A, ResultMap<X, B, R>>({
    Err: (e) => () => err<X, R>(e),
    Ok: (a) => map(fn(a)),
  });

type Map3<A, B, C, R> = (a: A) => Map2<B, C, R>;
type ResultMap3<X, A, B, C, R> = (a: Result<X, A>) => ResultMap2<X, B, C, R>;

export const map3 = <X, A, B, C, R>(fn: Map3<A, B, C, R>) =>
  caseOf<X, A, ResultMap2<X, B, C, R>>({
    Err: (e) => () => () => err<X, R>(e),
    Ok: (a) => map2(fn(a)),
  });

type Map4<A, B, C, D, R> = (a: A) => Map3<B, C, D, R>;

type ResultMap4<X, A, B, C, D, R> = (a: Result<X, A>) =>
  ResultMap3<X, B, C, D, R>;

export const map4 = <X, A, B, C, D, R>(fn: Map4<A, B, C, D, R>) =>
  caseOf<X, A, ResultMap3<X, B, C, D, R>>({
    Err: (e) => () => () => () => err<X, R>(e),
    Ok: (a) => map3(fn(a)),
  });

type Map5<A, B, C, D, E, R> = (a: A) => Map4<B, C, D, E, R>;

export const map5 = <X, A, B, C, D, E, R>(fn: Map5<A, B, C, D, E, R>) =>
  caseOf<X, A, ResultMap4<X, B, C, D, E, R>>({
    Err: (e) => () => () => () => () => err<X, R>(e),
    Ok: (a) => map4(fn(a)),
  });

type FlatMap<X, A, R> = (a: A) => Result<X, R>;

export const flatMap = <X, A, R>(fn: FlatMap<X, A, R>) =>
  caseOf<X, A, Result<X, R>>({
    Err: (e) => err<X, R>(e),
    Ok: (a) => fn(a),
  });

type FlatMap2<X, A, B, R> = (a: A) => FlatMap<X, B, R>;

export const flatMap2 = <X, A, B, R>(fn: FlatMap2<X, A, B, R>) =>
  caseOf<X, A, ResultMap<X, B, R>>({
    Err: (e) => () => err<X, R>(e),
    Ok: (a) => flatMap(fn(a)),
  });

type FlatMap3<X, A, B, C, R> = (a: A) => FlatMap2<X, B, C, R>;

export const flatMap3 = <X, A, B, C, R>(fn: FlatMap3<X, A, B, C, R>) =>
  caseOf<X, A, ResultMap2<X, B, C, R>>({
    Err: (e) => () => () => err<X, R>(e),
    Ok: (a) => flatMap2(fn(a)),
  });

type FlatMap4<X, A, B, C, D, R> = (a: A) => FlatMap3<X, B, C, D, R>;

export const flatMap4 = <X, A, B, C, D, R>(fn: FlatMap4<X, A, B, C, D, R>) =>
  caseOf<X, A, ResultMap3<X, B, C, D, R>>({
    Err: (e) => () => () => () => err<X, R>(e),
    Ok: (a) => flatMap3(fn(a)),
  });

type FlatMap5<X, A, B, C, D, E, R> = (a: A) => FlatMap4<X, B, C, D, E, R>;

export const flatMap5 = <X, A, B, C, D, E, R>(
  fn: FlatMap5<X, A, B, C, D, E, R>,
) =>
  caseOf<X, A, ResultMap4<X, B, C, D, E, R>>({
    Err: (e) => () => () => () => () => err<X, R>(e),
    Ok: (a) => flatMap4(fn(a)),
  });
