import { expect } from "chai";
import { Maybe } from "../src";

const expect42 = Maybe.caseOf({
  Just: (value: number) => {
    expect(value).equals(42);
  },
  Nothing: () => {
    throw new TypeError("Expected Just but found Nothing");
  },
});

const expectNothing = Maybe.caseOf({
  Just: (value: number) => {
    throw new TypeError(`Expected Nothing but found Just ${value}`);
  },
  Nothing: () => {
    // success
  },
});

describe("Maybe", () => {
  describe("#caseOf", () => {
    it("should match Just", () => {
      expect42(Maybe.just(42));
    });

    it("should match Nothing", () => {
      expectNothing(Maybe.nothing());
    });
  });

  describe("#withDefault", () => {
    const orZero = Maybe.withDefault(0);

    it("should return the value for Just", () => {
      expect(orZero(Maybe.just(42))).equals(42);
    });

    it("should return the default for Nothing", () => {
      expect(orZero(Maybe.nothing())).equals(0);
    });
  });

  describe("#map", () => {
    const divideBy = Maybe.map((n: number) => 84 / n);

    it("should map the value for Just", () => {
      expect42(divideBy(Maybe.just(2)));
    });

    it("should not map for Nothing", () => {
      expectNothing(divideBy(Maybe.nothing()));
    });
  });

  describe("#flatMap", () => {
    const eightyFourOver = (n: number): Maybe.Maybe<number> =>
      (n === 0) ? Maybe.nothing() : Maybe.just(84 / n);

    const divideBy = Maybe.flatMap(eightyFourOver);

    it("should flatten to Just when mapped to Just", () => {
      expect42(divideBy(Maybe.just(2)));
    });

    it("should flatten to Nothing when mapped to Nothing", () => {
      expectNothing(divideBy(Maybe.just(0)));
    });

    it("should flatten to Nothing when passed Nothing", () => {
      expectNothing(divideBy(Maybe.just(0)));
    });
  });
});
