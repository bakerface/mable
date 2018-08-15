interface MaybePattern<T, R> {
  just(value: T): R;
  nothing(): R;
}

export interface Maybe<T> {
  caseOf<R>(pattern: MaybePattern<T, R>): R;
}

class Just<T> implements Maybe<T> {
  public constructor(private readonly value: T) {}

  public caseOf<R>(pattern: MaybePattern<T, R>): R {
    return pattern.just(this.value);
  }
}

class Nothing<T> implements Maybe<T> {
  public caseOf<R>(pattern: MaybePattern<T, R>): R {
    return pattern.nothing();
  }
}

export const just = <T>(value: T): Maybe<T> => new Just(value);
export const nothing = <T>(): Maybe<T> => new Nothing();

export const withDefault = <T>(defaultValue: T) =>
  (maybe: Maybe<T>) =>
    maybe.caseOf({
      just: (value) => value,
      nothing: () => defaultValue,
    });

export const map = <A, R>(
  fn: (a: A) => R,
) =>
  (a: Maybe<A>) =>
    a.caseOf({
      just: (va) => just<R>(fn(va)),
      nothing: () => nothing<R>(),
    });

export const map2 = <A, B, R>(
  fn: (a: A) => (b: B) => R,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      a.caseOf({
        just: (va) => b.caseOf({
          just: (vb) => just<R>(fn(va)(vb)),
          nothing: () => nothing<R>(),
        }),
        nothing: () => nothing<R>(),
      });

export const map3 = <A, B, C, R>(
  fn: (a: A) => (b: B) => (c: C) => R,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        a.caseOf({
          just: (va) => b.caseOf({
            just: (vb) => c.caseOf({
              just: (vc) => just<R>(fn(va)(vb)(vc)),
              nothing: () => nothing<R>(),
            }),
            nothing: () => nothing<R>(),
          }),
          nothing: () => nothing<R>(),
        });

export const map4 = <A, B, C, D, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => R,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        (d: Maybe<D>) =>
          a.caseOf({
            just: (va) => b.caseOf({
              just: (vb) => c.caseOf({
                just: (vc) => d.caseOf({
                  just: (vd) => just<R>(fn(va)(vb)(vc)(vd)),
                  nothing: () => nothing<R>(),
                }),
                nothing: () => nothing<R>(),
              }),
              nothing: () => nothing<R>(),
            }),
            nothing: () => nothing<R>(),
          });

export const map5 = <A, B, C, D, E, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => R,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        (d: Maybe<D>) =>
          (e: Maybe<E>) =>
            a.caseOf({
              just: (va) => b.caseOf({
                just: (vb) => c.caseOf({
                  just: (vc) => d.caseOf({
                    just: (vd) => e.caseOf({
                      just: (ve) => just<R>(fn(va)(vb)(vc)(vd)(ve)),
                      nothing: () => nothing<R>(),
                    }),
                    nothing: () => nothing<R>(),
                  }),
                  nothing: () => nothing<R>(),
                }),
                nothing: () => nothing<R>(),
              }),
              nothing: () => nothing<R>(),
            });

export const flatMap = <A, R>(
  fn: (a: A) => Maybe<R>,
) =>
  (a: Maybe<A>) =>
    a.caseOf({
      just: (va) => fn(va),
      nothing: () => nothing<R>(),
    });

export const flatMap2 = <A, B, R>(
  fn: (a: A) => (b: B) => Maybe<R>,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      a.caseOf({
        just: (va) => b.caseOf({
          just: (vb) => fn(va)(vb),
          nothing: () => nothing<R>(),
        }),
        nothing: () => nothing<R>(),
      });

export const flatMap3 = <A, B, C, R>(
  fn: (a: A) => (b: B) => (c: C) => Maybe<R>,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        a.caseOf({
          just: (va) => b.caseOf({
            just: (vb) => c.caseOf({
              just: (vc) => fn(va)(vb)(vc),
              nothing: () => nothing<R>(),
            }),
            nothing: () => nothing<R>(),
          }),
          nothing: () => nothing<R>(),
        });

export const flatMap4 = <A, B, C, D, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => Maybe<R>,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        (d: Maybe<D>) =>
          a.caseOf({
            just: (va) => b.caseOf({
              just: (vb) => c.caseOf({
                just: (vc) => d.caseOf({
                  just: (vd) => fn(va)(vb)(vc)(vd),
                  nothing: () => nothing<R>(),
                }),
                nothing: () => nothing<R>(),
              }),
              nothing: () => nothing<R>(),
            }),
            nothing: () => nothing<R>(),
          });

export const flatMap5 = <A, B, C, D, E, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => Maybe<R>,
) =>
  (a: Maybe<A>) =>
    (b: Maybe<B>) =>
      (c: Maybe<C>) =>
        (d: Maybe<D>) =>
          (e: Maybe<E>) =>
            a.caseOf({
              just: (va) => b.caseOf({
                just: (vb) => c.caseOf({
                  just: (vc) => d.caseOf({
                    just: (vd) => e.caseOf({
                      just: (ve) => fn(va)(vb)(vc)(vd)(ve),
                      nothing: () => nothing<R>(),
                    }),
                    nothing: () => nothing<R>(),
                  }),
                  nothing: () => nothing<R>(),
                }),
                nothing: () => nothing<R>(),
              }),
              nothing: () => nothing<R>(),
            });
