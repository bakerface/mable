import { expect } from "chai";
import { Result } from "../src";

const expect42 = Result.caseOf({
  Err: (err: string) => {
    throw new TypeError(`Expected Ok but found Err ${err}`);
  },
  Ok: (value: number) => {
    expect(value).equals(42);
  },
});

const expectErrorOf = (message: string) => Result.caseOf({
  Err: (err: string) => {
    expect(err).equals(message);
  },
  Ok: (value: number) => {
    throw new TypeError(`Expected Err but found Ok ${value}`);
  },
});

const expectAnError = expectErrorOf("An error");
const expectDivideByZeroError = expectErrorOf("Cannot divide by zero");

describe("Result", () => {
  describe("#caseOf", () => {
    it("should match Ok", () => {
      expect42(Result.ok(42));
    });

    it("should match Err", () => {
      expectAnError(Result.err("An error"));
    });
  });

  describe("#withDefault", () => {
    const orZero = Result.withDefault(0);

    it("should return the value for Ok", () => {
      expect(orZero(Result.ok(42))).equals(42);
    });

    it("should return the default for Err", () => {
      expect(orZero(Result.err("An error"))).equals(0);
    });
  });

  describe("#map", () => {
    const divideBy = Result.map<string, number, number>((n: number) => 84 / n);

    it("should map the value for Ok", () => {
      expect42(divideBy(Result.ok(2)));
    });

    it("should not map for Err", () => {
      expectAnError(divideBy(Result.err("An error")));
    });
  });

  describe("#flatMap", () => {
    const eightyFourOver = (n: number): Result.Result<string, number> =>
      (n === 0) ? Result.err("Cannot divide by zero") : Result.ok(84 / n);

    const divideBy = Result.flatMap(eightyFourOver);

    it("should flatten to Ok when mapped to Ok", () => {
      expect42(divideBy(Result.ok(2)));
    });

    it("should flatten to Err when mapped to Err", () => {
      expectDivideByZeroError(divideBy(Result.ok(0)));
    });

    it("should flatten to Err when passed Err", () => {
      expectAnError(divideBy(Result.err("An error")));
    });
  });
});
