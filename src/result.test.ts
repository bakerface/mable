import assert from "assert";
import { Maybe, Result, ResultPattern } from ".";

const pattern: ResultPattern<string, number, string> = {
  Err: (value) => `Err: ${value}`,
  Ok: (value) => `Ok: ${value}`,
};

const toMessage = Result.fold(pattern);

function parseNumber(value: string): Result<string, number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return Result.Err(`Expected ${value} to be a number`);
  }

  return Result.Ok(n);
}

describe("Result", () => {
  describe("Result.caseOf", () => {
    it("matches Err when the value is an error", () => {
      const result = Result.Err("An error");
      const message = Result.caseOf(result, pattern);

      assert.strictEqual(message, "Err: An error");
    });

    it("matches Ok when the value is ok", () => {
      const result = Result.Ok(42);
      const message = Result.caseOf(result, pattern);

      assert.strictEqual(message, "Ok: 42");
    });
  });

  describe("Result.fold", () => {
    it("matches Err when the value is an error", () => {
      assert.strictEqual(toMessage(Result.Err("An error")), "Err: An error");
    });

    it("matches Ok when the value is ok", () => {
      assert.strictEqual(toMessage(Result.Ok(42)), "Ok: 42");
    });
  });

  describe("Result.map", () => {
    const twice = Result.map<string, number, number>((value) => value * 2);

    it("returns Err when the value is an error", () => {
      assert.strictEqual(
        toMessage(twice(Result.Err("An error"))),
        "Err: An error"
      );
    });

    it("maps the value when the value is ok", () => {
      assert.strictEqual(toMessage(twice(Result.Ok(21))), "Ok: 42");
    });
  });

  describe("Result.mapError", () => {
    const exclaim = Result.mapError<string, number, string>((err) => err + "!");

    it("maps the error when the value is an error", () => {
      assert.strictEqual(
        toMessage(exclaim(Result.Err("An error"))),
        "Err: An error!"
      );
    });

    it("returns Ok when the value is ok", () => {
      assert.strictEqual(toMessage(exclaim(Result.Ok(42))), "Ok: 42");
    });
  });

  describe("Result.flatMap", () => {
    const parse = Result.flatMap(parseNumber);

    it("returns Err when the value is an error", () => {
      assert.strictEqual(
        toMessage(parse(Result.Err("An error"))),
        "Err: An error"
      );
    });

    it("returns Ok when the value is ok", () => {
      assert.strictEqual(toMessage(parse(Result.Ok("42"))), "Ok: 42");
    });
  });

  describe("Result.withDefault", () => {
    const or21 = Result.withDefault(21);

    it("returns the default when the value is Nothing", () => {
      assert.strictEqual(or21(Result.Err("An error")), 21);
    });

    it("returns the value when the value is Just", () => {
      assert.strictEqual(or21(Result.Ok(42)), 42);
    });
  });

  describe("Result.toMaybe", () => {
    const toMessage = Maybe.fold({
      Nothing: () => "Nothing",
      Just: (value) => `Just: ${value}`,
    });

    it("returns Nothing when the value is an error", () => {
      const maybe = Result.toMaybe(Result.Err("An error"));
      const message = toMessage(maybe);

      assert.strictEqual(message, "Nothing");
    });

    it("returns Just when the value is ok", () => {
      const maybe = Result.toMaybe(Result.Ok(42));
      const message = toMessage(maybe);

      assert.strictEqual(message, "Just: 42");
    });
  });

  describe("Result.fromMaybe", () => {
    const fromMaybe = Result.fromMaybe<string, number>("An error");

    it("returns Err when the value is nothing", () => {
      const message = toMessage(fromMaybe(Maybe.Nothing));
      assert.strictEqual(message, "Err: An error");
    });

    it("returns Ok when the value is just a value", () => {
      const message = toMessage(fromMaybe(Maybe.Just(42)));
      assert.strictEqual(message, "Ok: 42");
    });
  });
});
