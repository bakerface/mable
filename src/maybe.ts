import { CaseOfPattern, OneOf } from "./one-of";

type MaybeVariants<T> = {
  Nothing: void;
  Just: T;
};

type MaybePattern<T, R> = CaseOfPattern<MaybeVariants<T>, R>;

export class Maybe<T> extends OneOf<MaybeVariants<T>> {
  static Nothing = new Maybe<any>("Nothing", undefined);

  static Just<T>(value: T): Maybe<T> {
    return new Maybe("Just", value);
  }

  static of<T>(value?: T | null): Maybe<T> {
    if (typeof value === "undefined" || value === null) {
      return Maybe.Nothing;
    }

    return Maybe.Just(value);
  }

  static caseOf<T, Return>(
    pattern: MaybePattern<T, Return>
  ): (maybe: Maybe<T>) => Return {
    return (maybe) => maybe.caseOf(pattern);
  }

  static map<T, Return>(
    fn: (value: T) => Return
  ): (maybe: Maybe<T>) => Maybe<Return> {
    return (maybe) => maybe.map(fn);
  }

  static flatMap<T, Return>(
    fn: (value: T) => Maybe<Return>
  ): (maybe: Maybe<T>) => Maybe<Return> {
    return (maybe) => maybe.flatMap(fn);
  }

  static otherwise<T, O>(value?: O | null): (maybe: Maybe<T>) => Maybe<T | O> {
    return (maybe) => maybe.otherwise(value);
  }

  map<Return>(fn: (value: T) => Return): Maybe<Return> {
    return this.caseOf<Maybe<Return>>({
      Nothing: () => Maybe.Nothing,
      Just: (value) => Maybe.Just(fn(value)),
    });
  }

  flatMap<Return>(fn: (value: T) => Maybe<Return>): Maybe<Return> {
    return this.caseOf<Maybe<Return>>({
      Nothing: () => Maybe.Nothing,
      Just: (value) => fn(value),
    });
  }

  otherwise<O>(value?: O | null): Maybe<T | O> {
    return this.caseOf<Maybe<T | O>>({
      Nothing: () => Maybe.of(value),
      Just: (v) => Maybe.Just(v),
    });
  }
}
