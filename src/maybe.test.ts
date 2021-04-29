import assert from "assert";
import { Maybe } from "./maybe";

const toString = Maybe.caseOf({
  Just: (value: number) => `Just ${value}`,
  Nothing: () => "Nothing",
});

function parseNumber(value: string): Maybe<number> {
  const n = parseFloat(value);

  if (isNaN(n)) {
    return Maybe.Nothing;
  }

  return Maybe.Just(n);
}

describe("Maybe", () => {
  describe(".caseOf", () => {
    it("calls Nothing when the value is Nothing", () => {
      assert.strictEqual(toString(Maybe.Nothing), "Nothing");
    });

    it("calls Just when the value is Just", () => {
      assert.strictEqual(toString(Maybe.Just(42)), "Just 42");
    });
  });

  describe(".map", () => {
    const twice = Maybe.map((value: number) => value * 2);

    it("returns Nothing when the value is Nothing", () => {
      assert.strictEqual(toString(twice(Maybe.Nothing)), "Nothing");
    });

    it("returns Just the mapped value when the value is Just", () => {
      assert.strictEqual(toString(twice(Maybe.Just(21))), "Just 42");
    });
  });

  describe(".flatMap", () => {
    const parse = Maybe.flatMap(parseNumber);

    it("returns Nothing when the value is Nothing", () => {
      assert.strictEqual(toString(parse(Maybe.Nothing)), "Nothing");
    });

    it("returns Just the mapped value when the value is Just", () => {
      assert.strictEqual(toString(parse(Maybe.Just("42"))), "Just 42");
    });
  });

  describe(".otherwise", () => {
    const or21 = Maybe.otherwise<number, number>(21);

    it("returns the default when the value is Nothing", () => {
      assert.strictEqual(toString(or21(Maybe.Nothing)), "Just 21");
    });

    it("returns the value when the value is Just", () => {
      assert.strictEqual(toString(or21(Maybe.Just(42))), "Just 42");
    });
  });

  describe(".of", () => {
    it("returns the Nothing when the value is undefined", () => {
      assert.strictEqual(toString(Maybe.of<number>(undefined)), "Nothing");
    });

    it("returns the Nothing when the value is null", () => {
      assert.strictEqual(toString(Maybe.of<number>(null)), "Nothing");
    });

    it("returns Just when the value is present", () => {
      assert.strictEqual(toString(Maybe.of(42)), "Just 42");
    });
  });
});
