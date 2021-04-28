import { Maybe } from "./maybe";
import { CaseOfPattern, OneOf } from "./one-of";
import { Result } from "./result";

export type RemoteDataVariants<Err, Ok> = {
  NotAsked: [];
  Loading: [];
  Failure: [err: Err];
  Success: [value: Ok];
};

export type RemoteDataPattern<Err, Ok, Return> = CaseOfPattern<
  RemoteDataVariants<Err, Ok>,
  Return
>;

export class RemoteData<Err, Ok> extends OneOf<RemoteDataVariants<Err, Ok>> {
  static NotAsked = new RemoteData<any, any>("NotAsked");
  static Loading = new RemoteData<any, any>("Loading");

  static Failure<T>(err: T): RemoteData<T, any> {
    return new RemoteData("Failure", err);
  }

  static Success<T>(value: T): RemoteData<any, T> {
    return new RemoteData("Success", value);
  }

  static caseOf<Err, Ok, Return>(
    pattern: RemoteDataPattern<Err, Ok, Return>
  ): (data: RemoteData<Err, Ok>) => Return {
    return (data) => data.caseOf(pattern);
  }

  static map<Err, Ok, Return>(
    fn: (value: Ok) => Return
  ): (data: RemoteData<Err, Ok>) => RemoteData<Err, Return> {
    return (data) => data.map(fn);
  }

  map<Return>(fn: (value: Ok) => Return): RemoteData<Err, Return> {
    return this.caseOf<RemoteData<Err, Return>>({
      NotAsked: () => RemoteData.NotAsked,
      Loading: () => RemoteData.Loading,
      Failure: (err) => RemoteData.Failure(err),
      Success: (value) => RemoteData.Success(fn(value)),
    });
  }

  static flatMap<Err, Ok, Return>(
    fn: (value: Ok) => RemoteData<Err, Return>
  ): (data: RemoteData<Err, Ok>) => RemoteData<Err, Return> {
    return (data) => data.flatMap(fn);
  }

  flatMap<Return>(
    fn: (value: Ok) => RemoteData<Err, Return>
  ): RemoteData<Err, Return> {
    return this.caseOf<RemoteData<Err, Return>>({
      NotAsked: () => RemoteData.NotAsked,
      Loading: () => RemoteData.Loading,
      Failure: (err) => RemoteData.Failure(err),
      Success: (value) => fn(value),
    });
  }

  static mapError<Err, Ok, Return>(
    fn: (err: Err) => Return
  ): (data: RemoteData<Err, Ok>) => RemoteData<Return, Ok> {
    return (data) => data.mapError(fn);
  }

  mapError<Return>(fn: (err: Err) => Return): RemoteData<Return, Ok> {
    return this.caseOf<RemoteData<Return, Ok>>({
      NotAsked: () => RemoteData.NotAsked,
      Loading: () => RemoteData.Loading,
      Failure: (err) => RemoteData.Failure(fn(err)),
      Success: (value) => RemoteData.Success(value),
    });
  }

  static withDefault<Err, Ok>(value: Ok): (data: RemoteData<Err, Ok>) => Ok {
    return (data) => data.withDefault(value);
  }

  withDefault(def: Ok): Ok {
    return this.caseOf<Ok>({
      Success: (value) => value,
      _: () => def,
    });
  }

  static toMaybe<Err, Ok>(data: RemoteData<Err, Ok>): Maybe<Ok> {
    return data.toMaybe();
  }

  toMaybe(): Maybe<Ok> {
    return this.caseOf({
      Success: (value) => Maybe.Just(value),
      _: () => Maybe.Nothing,
    });
  }

  static fromMaybe<Err, Ok>(err: Err, maybe: Maybe<Ok>): RemoteData<Err, Ok> {
    return maybe.caseOf({
      Just: (value) => RemoteData.Success(value),
      Nothing: () => RemoteData.Failure(err),
    });
  }

  static fromResult<Err, Ok>(result: Result<Err, Ok>): RemoteData<Err, Ok> {
    return result.caseOf({
      Err: (err) => RemoteData.Failure(err),
      Ok: (value) => RemoteData.Success(value),
    });
  }
}
