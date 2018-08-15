interface ResultPattern<E, O, R> {
  err(error: E): R;
  ok(value: O): R;
}

export interface Result<E, O> {
  caseOf<R>(pattern: ResultPattern<E, O, R>): R;
}

class Err<E, O> implements Result<E, O> {
  public constructor(private readonly error: E) {}

  public caseOf<R>(pattern: ResultPattern<E, O, R>): R {
    return pattern.err(this.error);
  }
}

class Ok<E, O> implements Result<E, O> {
  public constructor(private readonly value: O) {}

  public caseOf<R>(pattern: ResultPattern<E, O, R>): R {
    return pattern.ok(this.value);
  }
}

export const err = <E, O>(error: E): Result<E, O> => new Err(error);
export const ok = <E, O>(value: O): Result<E, O> => new Ok(value);

export const withDefault = <O>(defaultValue: O) =>
  <E>(result: Result<E, O>) =>
    result.caseOf({
      err: (_) => defaultValue,
      ok: (value) => value,
    });

export const map = <A, R>(
  fn: (a: A) => R,
) =>
  <Error>(a: Result<Error, A>) =>
    a.caseOf({
      err: (error) => err<Error, R>(error),
      ok: (va) => ok<Error, R>(fn(va)),
    });

export const map2 = <A, B, R>(
  fn: (a: A) => (b: B) => R,
) =>
  <Error>(a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      a.caseOf({
        err: (error) => err<Error, R>(error),
        ok: (va) => b.caseOf({
          err: (error) => err<Error, R>(error),
          ok: (vb) => ok<Error, R>(fn(va)(vb)),
        }),
      });

export const map3 = <A, B, C, R>(
  fn: (a: A) => (b: B) => (c: C) => R,
) =>
  <Error>(a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        a.caseOf({
          err: (error) => err<Error, R>(error),
          ok: (va) => b.caseOf({
            err: (error) => err<Error, R>(error),
            ok: (vb) => c.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (vc) => ok<Error, R>(fn(va)(vb)(vc)),
            }),
          }),
        });

export const map4 = <A, B, C, D, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => R,
) =>
  <Error>(a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        (d: Result<Error, D>) =>
          a.caseOf({
            err: (error) => err<Error, R>(error),
            ok: (va) => b.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (vb) => c.caseOf({
                err: (error) => err<Error, R>(error),
                ok: (vc) => d.caseOf({
                  err: (error) => err<Error, R>(error),
                  ok: (vd) => ok<Error, R>(fn(va)(vb)(vc)(vd)),
                }),
              }),
            }),
          });

export const map5 = <A, B, C, D, E, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => R,
) =>
  <Error>(a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        (d: Result<Error, D>) =>
          (e: Result<Error, E>) =>
            a.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (va) => b.caseOf({
                err: (error) => err<Error, R>(error),
                ok: (vb) => c.caseOf({
                  err: (error) => err<Error, R>(error),
                  ok: (vc) => d.caseOf({
                    err: (error) => err<Error, R>(error),
                    ok: (vd) => e.caseOf({
                      err: (error) => err<Error, R>(error),
                      ok: (ve) => ok<Error, R>(fn(va)(vb)(vc)(vd)(ve)),
                    }),
                  }),
                }),
              }),
            });

export const flatMap = <Error, A, R>(
  fn: (a: A) => Result<Error, R>,
) =>
  (a: Result<Error, A>) =>
    a.caseOf({
      err: (error) => err<Error, R>(error),
      ok: (va) => fn(va),
    });

export const flatMap2 = <Error, A, B, R>(
  fn: (a: A) => (b: B) => Result<Error, R>,
) =>
  (a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      a.caseOf({
        err: (error) => err<Error, R>(error),
        ok: (va) => b.caseOf({
          err: (error) => err<Error, R>(error),
          ok: (vb) => fn(va)(vb),
        }),
      });

export const flatMap3 = <Error, A, B, C, R>(
  fn: (a: A) => (b: B) => (c: C) => Result<Error, R>,
) =>
  (a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        a.caseOf({
          err: (error) => err<Error, R>(error),
          ok: (va) => b.caseOf({
            err: (error) => err<Error, R>(error),
            ok: (vb) => c.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (vc) => fn(va)(vb)(vc),
            }),
          }),
        });

export const flatMap4 = <Error, A, B, C, D, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => Result<Error, R>,
) =>
  (a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        (d: Result<Error, D>) =>
          a.caseOf({
            err: (error) => err<Error, R>(error),
            ok: (va) => b.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (vb) => c.caseOf({
                err: (error) => err<Error, R>(error),
                ok: (vc) => d.caseOf({
                  err: (error) => err<Error, R>(error),
                  ok: (vd) => fn(va)(vb)(vc)(vd),
                }),
              }),
            }),
          });

export const flatMap5 = <Error, A, B, C, D, E, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => Result<Error, R>,
) =>
  (a: Result<Error, A>) =>
    (b: Result<Error, B>) =>
      (c: Result<Error, C>) =>
        (d: Result<Error, D>) =>
          (e: Result<Error, E>) =>
            a.caseOf({
              err: (error) => err<Error, R>(error),
              ok: (va) => b.caseOf({
                err: (error) => err<Error, R>(error),
                ok: (vb) => c.caseOf({
                  err: (error) => err<Error, R>(error),
                  ok: (vc) => d.caseOf({
                    err: (error) => err<Error, R>(error),
                    ok: (vd) => e.caseOf({
                      err: (error) => err<Error, R>(error),
                      ok: (ve) => fn(va)(vb)(vc)(vd)(ve),
                    }),
                  }),
                }),
              }),
            });
