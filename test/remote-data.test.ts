import assert from "node:assert";
import { describe, it } from "node:test";
import { Maybe, RemoteData, Result } from "../src";

const toString = RemoteData.caseOf({
  NotAsked: () => "NotAsked",
  Loading: () => "Loading",
  Failure: (err) => `Failure ${err}`,
  Success: (value) => `Success ${value}`,
});

const toMaybeString = Maybe.caseOf({
  Just: (value) => `Just ${value}`,
  Nothing: () => "Nothing",
});

function parseNumber(value: string): RemoteData<string, number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return RemoteData.Failure("NaN");
  }

  return RemoteData.Success(n);
}

describe("RemoteData", () => {
  describe(".caseOf", () => {
    it("calls NotAsked when the value is NotAsked", () => {
      assert.strictEqual(toString(RemoteData.NotAsked), "NotAsked");
    });

    it("calls Loading when the value is Loading", () => {
      assert.strictEqual(toString(RemoteData.Loading), "Loading");
    });

    it("calls Failure when the value is Failure", () => {
      assert.strictEqual(
        toString(RemoteData.Failure("message")),
        "Failure message",
      );
    });

    it("calls Success when the value is Success", () => {
      assert.strictEqual(toString(RemoteData.Success(42)), "Success 42");
    });
  });

  describe(".map", () => {
    const twice = RemoteData.map<any, number, number>(
      (value: number) => value * 2,
    );

    it("returns NotAsked when the value is NotAsked", () => {
      assert.strictEqual(toString(twice(RemoteData.NotAsked)), "NotAsked");
    });

    it("returns Loading when the value is Loading", () => {
      assert.strictEqual(toString(twice(RemoteData.Loading)), "Loading");
    });

    it("returns Failure when the value is Failure", () => {
      assert.strictEqual(
        toString(twice(RemoteData.Failure("message"))),
        "Failure message",
      );
    });

    it("returns Success the mapped value when the value is Success", () => {
      assert.strictEqual(toString(twice(RemoteData.Success(21))), "Success 42");
    });
  });

  describe(".mapError", () => {
    const shout = RemoteData.mapError<string, any, any>((err: string) => {
      return err.toUpperCase();
    });

    it("returns NotAsked when the value is NotAsked", () => {
      assert.strictEqual(toString(shout(RemoteData.NotAsked)), "NotAsked");
    });

    it("returns Loading when the value is Loading", () => {
      assert.strictEqual(toString(shout(RemoteData.Loading)), "Loading");
    });

    it("returns Failure when the value is Failure", () => {
      assert.strictEqual(
        toString(shout(RemoteData.Failure("message"))),
        "Failure MESSAGE",
      );
    });

    it("returns Success the mapped value when the value is Success", () => {
      assert.strictEqual(toString(shout(RemoteData.Success(42))), "Success 42");
    });
  });

  describe(".flatMap", () => {
    const parse = RemoteData.flatMap(parseNumber);

    it("returns NotAsked when the value is NotAsked", () => {
      assert.strictEqual(toString(parse(RemoteData.NotAsked)), "NotAsked");
    });

    it("returns Loading when the value is Loading", () => {
      assert.strictEqual(toString(parse(RemoteData.Loading)), "Loading");
    });

    it("returns Failure when the value is Failure", () => {
      assert.strictEqual(
        toString(parse(RemoteData.Failure("message"))),
        "Failure message",
      );
    });

    it("returns Success the mapped value when the value is Success", () => {
      assert.strictEqual(
        toString(parse(RemoteData.Success("42"))),
        "Success 42",
      );
    });
  });

  describe(".withDefault", () => {
    const orZero = RemoteData.withDefault(0);

    it("returns the default value when the value is NotAsked", () => {
      assert.strictEqual(orZero(RemoteData.NotAsked), 0);
    });

    it("returns the default value when the value is Loading", () => {
      assert.strictEqual(orZero(RemoteData.Loading), 0);
    });

    it("returns the default value when the value is Failure", () => {
      assert.strictEqual(orZero(RemoteData.Failure("message")), 0);
    });

    it("returns the Success value when the value is Success", () => {
      assert.strictEqual(orZero(RemoteData.Success(42)), 42);
    });
  });

  describe(".toMaybe", () => {
    it("returns Nothing when the value is NotAsked", () => {
      assert.strictEqual(
        toMaybeString(RemoteData.toMaybe(RemoteData.NotAsked)),
        "Nothing",
      );
    });

    it("returns Nothing when the value is Loading", () => {
      assert.strictEqual(
        toMaybeString(RemoteData.toMaybe(RemoteData.Loading)),
        "Nothing",
      );
    });

    it("returns Nothing when the value is Failure", () => {
      assert.strictEqual(
        toMaybeString(RemoteData.toMaybe(RemoteData.Failure("message"))),
        "Nothing",
      );
    });

    it("returns Just when the value is Success", () => {
      assert.strictEqual(
        toMaybeString(RemoteData.toMaybe(RemoteData.Success(42))),
        "Just 42",
      );
    });
  });

  describe(".fromMaybe", () => {
    it("returns Failure when the value is Nothing", () => {
      assert.strictEqual(
        toString(RemoteData.fromMaybe("message", Maybe.Nothing)),
        "Failure message",
      );
    });

    it("returns Success when the value is Just", () => {
      assert.strictEqual(
        toString(RemoteData.fromMaybe("message", Maybe.Just(42))),
        "Success 42",
      );
    });
  });

  describe(".fromResult", () => {
    it("returns Failure when the value is Err", () => {
      assert.strictEqual(
        toString(RemoteData.fromResult(Result.Err("message"))),
        "Failure message",
      );
    });

    it("returns Success when the value is Just", () => {
      assert.strictEqual(
        toString(RemoteData.fromResult(Result.Ok(42))),
        "Success 42",
      );
    });
  });
});
