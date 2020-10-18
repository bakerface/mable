import assert from "assert";
import { Maybe, RemoteData, RemoteDataPattern, Result } from ".";

const pattern: RemoteDataPattern<string, number, string> = {
  NotAsked: () => "NotAsked",
  Loading: () => "Loading",
  Failure: (value) => `Failure: ${value}`,
  Success: (value) => `Success: ${value}`,
};

const toMessage = RemoteData.fold(pattern);

function parseNumber(value: string): RemoteData<string, number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return RemoteData.Failure(`Expected ${value} to be a number`);
  }

  return RemoteData.Success(n);
}

describe("RemoteData", () => {
  describe("RemoteData.caseOf", () => {
    it("can match NotAsked", () => {
      const result = RemoteData.NotAsked;
      const message = RemoteData.caseOf(result, pattern);

      assert.strictEqual(message, "NotAsked");
    });

    it("can match Loading", () => {
      const result = RemoteData.Loading;
      const message = RemoteData.caseOf(result, pattern);

      assert.strictEqual(message, "Loading");
    });

    it("can match Failure", () => {
      const result = RemoteData.Failure("An error");
      const message = RemoteData.caseOf(result, pattern);

      assert.strictEqual(message, "Failure: An error");
    });

    it("can match Success", () => {
      const result = RemoteData.Success(42);
      const message = RemoteData.caseOf(result, pattern);

      assert.strictEqual(message, "Success: 42");
    });
  });

  describe("RemoteData.fold", () => {
    it("can fold NotAsked", () => {
      const message = toMessage(RemoteData.NotAsked);
      assert.strictEqual(message, "NotAsked");
    });

    it("can fold Loading", () => {
      const message = toMessage(RemoteData.Loading);
      assert.strictEqual(message, "Loading");
    });

    it("can fold Failure", () => {
      const message = toMessage(RemoteData.Failure("An error"));
      assert.strictEqual(message, "Failure: An error");
    });

    it("can fold Success", () => {
      const message = toMessage(RemoteData.Success(42));
      assert.strictEqual(message, "Success: 42");
    });
  });

  describe("RemoteData.map", () => {
    const twice = RemoteData.map<string, number, number>((value) => value * 2);

    it("can map NotAsked", () => {
      const message = toMessage(twice(RemoteData.NotAsked));
      assert.strictEqual(message, "NotAsked");
    });

    it("can map Loading", () => {
      const message = toMessage(twice(RemoteData.Loading));
      assert.strictEqual(message, "Loading");
    });

    it("can map Failure", () => {
      const message = toMessage(twice(RemoteData.Failure("An error")));
      assert.strictEqual(message, "Failure: An error");
    });

    it("can map Success", () => {
      const message = toMessage(twice(RemoteData.Success(21)));
      assert.strictEqual(message, "Success: 42");
    });
  });

  describe("RemoteData.mapError", () => {
    const exclaim = RemoteData.mapError<string, number, string>(
      (err) => err + "!"
    );

    it("can map NotAsked", () => {
      const message = toMessage(exclaim(RemoteData.NotAsked));
      assert.strictEqual(message, "NotAsked");
    });

    it("can map Loading", () => {
      const message = toMessage(exclaim(RemoteData.Loading));
      assert.strictEqual(message, "Loading");
    });

    it("can map Failure", () => {
      const message = toMessage(exclaim(RemoteData.Failure("An error")));
      assert.strictEqual(message, "Failure: An error!");
    });

    it("can map Success", () => {
      const message = toMessage(exclaim(RemoteData.Success(42)));
      assert.strictEqual(message, "Success: 42");
    });
  });

  describe("RemoteData.flatMap", () => {
    const parse = RemoteData.flatMap(parseNumber);

    it("can map NotAsked", () => {
      const message = toMessage(parse(RemoteData.NotAsked));
      assert.strictEqual(message, "NotAsked");
    });

    it("can map Loading", () => {
      const message = toMessage(parse(RemoteData.Loading));
      assert.strictEqual(message, "Loading");
    });

    it("can map Failure", () => {
      const message = toMessage(parse(RemoteData.Failure("An error")));
      assert.strictEqual(message, "Failure: An error");
    });

    it("can map Success to Success", () => {
      const message = toMessage(parse(RemoteData.Success("42")));
      assert.strictEqual(message, "Success: 42");
    });

    it("can map Success to Failure", () => {
      const message = toMessage(parse(RemoteData.Success("foo")));
      assert.strictEqual(message, "Failure: Expected foo to be a number");
    });
  });

  describe("RemoteData.withDefault", () => {
    const or21 = RemoteData.withDefault(21);

    it("can provide default for NotAsked", () => {
      const value = or21(RemoteData.NotAsked);
      assert.strictEqual(value, 21);
    });

    it("can provide default for Loading", () => {
      const value = or21(RemoteData.Loading);
      assert.strictEqual(value, 21);
    });

    it("can provide default for Failure", () => {
      const value = or21(RemoteData.Failure("An error"));
      assert.strictEqual(value, 21);
    });

    it("can provide default for Success", () => {
      const value = or21(RemoteData.Success(42));
      assert.strictEqual(value, 42);
    });
  });

  describe("RemoteData.toMaybe", () => {
    const toMessage = Maybe.fold({
      Nothing: () => "Nothing",
      Just: (value) => `Just: ${value}`,
    });

    it("can convert NotAsked to maybe", () => {
      const maybe = RemoteData.toMaybe(RemoteData.NotAsked);
      const message = toMessage(maybe);

      assert.strictEqual(message, "Nothing");
    });

    it("can convert Loading to maybe", () => {
      const maybe = RemoteData.toMaybe(RemoteData.Loading);
      const message = toMessage(maybe);

      assert.strictEqual(message, "Nothing");
    });

    it("can convert Failure to maybe", () => {
      const maybe = RemoteData.toMaybe(RemoteData.Failure("An error"));
      const message = toMessage(maybe);

      assert.strictEqual(message, "Nothing");
    });

    it("can convert Success to maybe", () => {
      const maybe = RemoteData.toMaybe(RemoteData.Success(42));
      const message = toMessage(maybe);

      assert.strictEqual(message, "Just: 42");
    });
  });

  describe("RemoteData.fromMaybe", () => {
    const fromMaybe = RemoteData.fromMaybe<string, number>("An error");

    it("can convert Nothing to remote data", () => {
      const message = toMessage(fromMaybe(Maybe.Nothing));
      assert.strictEqual(message, "Failure: An error");
    });

    it("can convert Just to remote data", () => {
      const message = toMessage(fromMaybe(Maybe.Just(42)));
      assert.strictEqual(message, "Success: 42");
    });
  });

  describe("RemoteData.fromResult", () => {
    it("can convert Err to remote data", () => {
      const message = toMessage(RemoteData.fromResult(Result.Err("An error")));
      assert.strictEqual(message, "Failure: An error");
    });

    it("can convert Ok to remote data", () => {
      const message = toMessage(RemoteData.fromResult(Result.Ok(42)));
      assert.strictEqual(message, "Success: 42");
    });
  });
});
