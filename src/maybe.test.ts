import assert from "assert";
import { Maybe, MaybePattern } from ".";

const pattern: MaybePattern<number, string> = {
  Just: (value: number) => `the value is just ${value}`,
  Nothing: () => "the value is nothing",
};

const toMessage = Maybe.fold(pattern);

function parseNumber(value: string): Maybe<number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return Maybe.Nothing;
  }

  return Maybe.Just(n);
}

describe("Maybe", () => {
  describe("Maybe.caseOf", () => {
    it("calls Nothing when the value is Nothing", () => {
      const maybe = Maybe.Nothing;
      const message = Maybe.caseOf(maybe, pattern);

      assert.strictEqual(message, "the value is nothing");
    });

    it("calls Just when the value is Just", () => {
      const maybe = Maybe.Just(42);
      const message = Maybe.caseOf(maybe, pattern);

      assert.strictEqual(message, "the value is just 42");
    });
  });

  describe("Maybe.fold", () => {
    it("calls Nothing when the value is Nothing", () => {
      assert.strictEqual(toMessage(Maybe.Nothing), "the value is nothing");
    });

    it("calls Just when the value is Just", () => {
      assert.strictEqual(toMessage(Maybe.Just(42)), "the value is just 42");
    });
  });

  describe("Maybe.map", () => {
    const twice = Maybe.map((value: number) => value * 2);

    it("returns Nothing when the value is Nothing", () => {
      assert.strictEqual(
        toMessage(twice(Maybe.Nothing)),
        "the value is nothing"
      );
    });

    it("returns Just the mapped value when the value is Just", () => {
      assert.strictEqual(
        toMessage(twice(Maybe.Just(21))),
        "the value is just 42"
      );
    });
  });

  describe("Maybe.flatMap", () => {
    const parse = Maybe.flatMap(parseNumber);

    it("returns Nothing when the value is Nothing", () => {
      assert.strictEqual(
        toMessage(parse(Maybe.Nothing)),
        "the value is nothing"
      );
    });

    it("returns Just the mapped value when the value is Just", () => {
      assert.strictEqual(
        toMessage(parse(Maybe.Just("42"))),
        "the value is just 42"
      );
    });
  });

  describe("Maybe.withDefault", () => {
    const or21 = Maybe.withDefault(21);

    it("returns the default when the value is Nothing", () => {
      assert.strictEqual(or21(Maybe.Nothing), 21);
    });

    it("returns the value when the value is Just", () => {
      assert.strictEqual(or21(Maybe.Just(42)), 42);
    });
  });

  describe("Maybe.of", () => {
    it("returns the Nothing when the value is undefined", () => {
      assert.strictEqual(
        toMessage(Maybe.of<number>(undefined)),
        "the value is nothing"
      );
    });

    it("returns the Nothing when the value is null", () => {
      assert.strictEqual(
        toMessage(Maybe.of<number>(null)),
        "the value is nothing"
      );
    });

    it("returns Just when the value is present", () => {
      assert.strictEqual(toMessage(Maybe.of(42)), "the value is just 42");
    });
  });
});
