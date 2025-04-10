import { Maybe } from "./maybe";
import { CaseOfPattern, OneOf } from "./one-of";

type ResultVariants<Err, Ok> = {
  Err: Err;
  Ok: Ok;
};

type ResultPattern<Err, Ok, Return> = CaseOfPattern<
  ResultVariants<Err, Ok>,
  Return
>;

export class Result<Err, Ok> extends OneOf<ResultVariants<Err, Ok>> {
  static Err<T>(err: T): Result<T, any> {
    return new Result("Err", err);
  }

  static Ok<T>(value: T): Result<any, T> {
    return new Result("Ok", value);
  }

  static caseOf<Err, Ok, Return>(
    pattern: ResultPattern<Err, Ok, Return>,
  ): (result: Result<Err, Ok>) => Return {
    return (result) => result.caseOf(pattern);
  }

  static map<Ok, Return>(
    fn: (value: Ok) => Return,
  ): <Err>(result: Result<Err, Ok>) => Result<Err, Return> {
    return (result) => result.map(fn);
  }

  map<Return>(fn: (value: Ok) => Return): Result<Err, Return> {
    return this.caseOf<Result<Err, Return>>({
      Err: (err) => Result.Err(err),
      Ok: (value) => Result.Ok(fn(value)),
    });
  }

  static flatMap<Err, Ok, Return>(
    fn: (value: Ok) => Result<Err, Return>,
  ): (result: Result<Err, Ok>) => Result<Err, Return> {
    return (result) => result.flatMap(fn);
  }

  flatMap<Return>(fn: (value: Ok) => Result<Err, Return>): Result<Err, Return> {
    return this.caseOf<Result<Err, Return>>({
      Err: (err) => Result.Err(err),
      Ok: (value) => fn(value),
    });
  }

  static mapError<Err, Return>(
    fn: (err: Err) => Return,
  ): <Ok>(result: Result<Err, Ok>) => Result<Return, Ok> {
    return (result) => result.mapError(fn);
  }

  mapError<Return>(fn: (err: Err) => Return): Result<Return, Ok> {
    return this.caseOf<Result<Return, Ok>>({
      Err: (err) => Result.Err(fn(err)),
      Ok: (value) => Result.Ok(value),
    });
  }

  static withDefault<T>(
    value: T,
  ): <Err, Ok>(result: Result<Err, Ok>) => T | Ok {
    return (result) => result.withDefault(value);
  }

  withDefault<T>(value: T): T | Ok {
    return this.caseOf<T | Ok>({
      Err: () => value,
      Ok: (value) => value,
    });
  }

  static toMaybe<Err, Ok>(result: Result<Err, Ok>): Maybe<Ok> {
    return result.toMaybe();
  }

  toMaybe(): Maybe<Ok> {
    return this.caseOf({
      Err: () => Maybe.Nothing,
      Ok: (value) => Maybe.Just(value),
    });
  }

  static fromMaybe<Err, Ok>(err: Err, maybe: Maybe<Ok>): Result<Err, Ok> {
    return maybe.caseOf({
      Just: (value) => Result.Ok(value),
      Nothing: () => Result.Err(err),
    });
  }

  static assert<Err, Ok>(result: Result<Err, Ok>): Ok {
    return result.assert();
  }

  assert(): Ok {
    return this.caseOf<Ok>({
      Err: (err) => {
        throw err;
      },
      Ok: (value) => value,
    });
  }
}
