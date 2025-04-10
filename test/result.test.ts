import assert from "node:assert";
import { describe, it } from "node:test";
import { Maybe, Result } from "../src";

const toString = Result.caseOf({
  Err: (err) => `Err ${err}`,
  Ok: (value) => `Ok ${value}`,
});

const toMaybeString = Maybe.caseOf({
  Just: (value) => `Just ${value}`,
  Nothing: () => "Nothing",
});

function parseNumber(value: string): Result<string, number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return Result.Err("NaN");
  }

  return Result.Ok(n);
}

describe("Result", () => {
  describe(".caseOf", () => {
    it("calls Err when the value is Err", () => {
      assert.strictEqual(toString(Result.Err("message")), "Err message");
    });

    it("calls Ok when the value is Ok", () => {
      assert.strictEqual(toString(Result.Ok(42)), "Ok 42");
    });
  });

  describe(".map", () => {
    const twice = Result.map((value: number) => value * 2);

    it("returns Err when the value is Err", () => {
      assert.strictEqual(toString(twice(Result.Err("message"))), "Err message");
    });

    it("returns Ok the mapped value when the value is Ok", () => {
      assert.strictEqual(toString(twice(Result.Ok(21))), "Ok 42");
    });
  });

  describe(".mapError", () => {
    const shout = Result.mapError((err: string) => err.toUpperCase());

    it("returns Err when the value is Err", () => {
      assert.strictEqual(toString(shout(Result.Err("message"))), "Err MESSAGE");
    });

    it("returns Ok the mapped value when the value is Ok", () => {
      assert.strictEqual(toString(shout(Result.Ok(42))), "Ok 42");
    });
  });

  describe(".flatMap", () => {
    const parse = Result.flatMap(parseNumber);

    it("returns Err when the value is Err", () => {
      assert.strictEqual(toString(parse(Result.Err("message"))), "Err message");
    });

    it("returns Ok the mapped value when the value is Ok", () => {
      assert.strictEqual(toString(parse(Result.Ok("42"))), "Ok 42");
    });
  });

  describe(".withDefault", () => {
    const orZero = Result.withDefault(0);

    it("returns the default value when the value is Err", () => {
      assert.strictEqual(orZero(Result.Err("message")), 0);
    });

    it("returns the Ok value when the value is Ok", () => {
      assert.strictEqual(orZero(Result.Ok(42)), 42);
    });
  });

  describe(".toMaybe", () => {
    it("returns Nothing when the value is Err", () => {
      assert.strictEqual(
        toMaybeString(Result.toMaybe(Result.Err("message"))),
        "Nothing",
      );
    });

    it("returns Just when the value is Ok", () => {
      assert.strictEqual(
        toMaybeString(Result.toMaybe(Result.Ok(42))),
        "Just 42",
      );
    });
  });

  describe(".fromMaybe", () => {
    it("returns Err when the value is Nothing", () => {
      assert.strictEqual(
        toString(Result.fromMaybe("message", Maybe.Nothing)),
        "Err message",
      );
    });

    it("returns Ok when the value is Just", () => {
      assert.strictEqual(
        toString(Result.fromMaybe("message", Maybe.Just(42))),
        "Ok 42",
      );
    });
  });

  describe(".assert", () => {
    it("throws the Err when the value is Err", () => {
      const err = new Error("message");
      assert.throws(() => Result.assert(Result.Err(err)), err);
    });

    it("returns the Ok value when the value is Ok", () => {
      assert.strictEqual(Result.assert(Result.Ok(42)), 42);
    });
  });

  describe(".combine", () => {
    it("returns a combined error when some are Err", () => {
      const result = Result.combine({
        one: Result.Ok(1),
        two: Result.Err("error"),
      });

      assert.deepStrictEqual(result, Result.Err({ two: "error" }));
    });

    it("returns a combined value when all are Ok", () => {
      const result = Result.combine({
        one: Result.Ok(1),
        two: Result.Ok(2),
      });

      assert.deepStrictEqual(result, Result.Ok({ one: 1, two: 2 }));
    });
  });
});
