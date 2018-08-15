import { expect } from "chai";
import { Result } from "../src";

describe("Result", () => {
  describe("#caseOf", () => {
    it("should match ok", (done) => {
      Result.ok(42).caseOf({
        err: () => {
          throw new Error("should not match err");
        },
        ok: (value) => {
          expect(value).equals(42);
          done();
        },
      });
    });

    it("should match err", (done) => {
      Result.err("An error").caseOf({
        err: (error) => {
          expect(error).equals("An error");
          done();
        },
        ok: () => {
          throw new Error("should not match ok");
        },
      });
    });
  });

  describe("#withDefault", () => {
    const orZero = Result.withDefault(0);

    it("should return the value for ok", () => {
      expect(orZero(Result.ok(42))).equals(42);
    });

    it("should return the default for err", () => {
      expect(orZero(Result.err("An error"))).equals(0);
    });
  });

  describe("#map", () => {
    const divideBy = Result.map((n: number) => 84 / n);

    it("should map the value for ok", (done) => {
      divideBy(Result.ok(2)).caseOf({
        ok: (value) => {
          expect(value).equals(42);
          done();
        },
        err: () => {
          throw new Error("should not match err");
        },
      });
    });

    it("should not map for err", (done) => {
      divideBy(Result.err("An error")).caseOf({
        err: (error) => {
          expect(error).equals("An error");
          done();
        },
        ok: () => {
          throw new Error("should not match ok");
        },
      });
    });
  });

  describe("#flatMap", () => {
    const eightyFourOver = (n: number): Result.Result<string, number> =>
      (n === 0) ? Result.err("Cannot divide by zero") : Result.ok(84 / n);

    const divideBy = Result.flatMap(eightyFourOver);

    it("should flatten to ok when mapped to ok", (done) => {
      divideBy(Result.ok(2)).caseOf({
        err: () => {
          throw new Error("should not match err");
        },
        ok: (value) => {
          expect(value).equals(42);
          done();
        },
      });
    });

    it("should flatten to err when mapped to err", (done) => {
      divideBy(Result.ok(0)).caseOf({
        err: (error) => {
          expect(error).equals("Cannot divide by zero");
          done();
        },
        ok: () => {
          throw new Error("should not match ok");
        },
      });
    });

    it("should flatten, but not map, for err", (done) => {
      divideBy(Result.err("An error")).caseOf({
        err: (error) => {
          expect(error).equals("An error");
          done();
        },
        ok: () => {
          throw new Error("should not match ok");
        },
      });
    });
  });
});
