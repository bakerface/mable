import { expect } from "chai";
import { Maybe } from "../src";

describe("Maybe", () => {
  describe("#caseOf", () => {
    it("should match just", (done) => {
      Maybe.just(42).caseOf({
        just: (value) => {
          expect(value).equals(42);
          done();
        },
        nothing: () => {
          throw new Error("should not match nothing");
        },
      });
    });

    it("should match nothing", (done) => {
      Maybe.nothing().caseOf({
        just: () => {
          throw new Error("should not match just");
        },
        nothing: done,
      });
    });
  });

  describe("#withDefault", () => {
    const orZero = Maybe.withDefault(0);

    it("should return the value for just", () => {
      expect(orZero(Maybe.just(42))).equals(42);
    });

    it("should return the default for nothing", () => {
      expect(orZero(Maybe.nothing())).equals(0);
    });
  });

  describe("#map", () => {
    const divideBy = Maybe.map((n: number) => 84 / n);

    it("should map the value for just", (done) => {
      divideBy(Maybe.just(2)).caseOf({
        just: (value) => {
          expect(value).equals(42);
          done();
        },
        nothing: () => {
          throw new Error("should not match nothing");
        },
      });
    });

    it("should not map for nothing", (done) => {
      divideBy(Maybe.nothing()).caseOf({
        just: () => {
          throw new Error("should not match just");
        },
        nothing: done,
      });
    });
  });

  describe("#flatMap", () => {
    const eightyFourOver = (n: number): Maybe.Maybe<number> =>
      (n === 0) ? Maybe.nothing() : Maybe.just(84 / n);

    const divideBy = Maybe.flatMap(eightyFourOver);

    it("should flatten to just when mapped to just", (done) => {
      divideBy(Maybe.just(2)).caseOf({
        just: (value) => {
          expect(value).equals(42);
          done();
        },
        nothing: () => {
          throw new Error("should not match nothing");
        },
      });
    });

    it("should flatten to nothing when mapped to nothing", (done) => {
      divideBy(Maybe.just(0)).caseOf({
        just: () => {
          throw new Error("should not match just");
        },
        nothing: done,
      });
    });

    it("should flatten, but not map, for nothing", (done) => {
      divideBy(Maybe.nothing()).caseOf({
        just: () => {
          throw new Error("should not match just");
        },
        nothing: done,
      });
    });
  });
});
