import assert from "node:assert";
import { describe, it } from "node:test";
import { CaseOfPattern, CaseOfPatternError, OneOf } from "../src";

interface ExampleVariants {
  A: void;
  B: void;
}

class Example extends OneOf<ExampleVariants> {
  static A = new Example("A", undefined);
  static B = new Example("B", undefined);
  static C = new Example("C" as "A", undefined);
}

describe("OneOf", () => {
  describe(".caseOf", () => {
    it("calls the function matching the type", () => {
      const value = Example.A.caseOf({
        A: () => "The value is A",
        B: () => "The value is B",
      });

      assert.strictEqual(value, "The value is A");
    });

    it("calls the fallback when a function is not provided", () => {
      const value = Example.B.caseOf({
        A: () => "The value is A",
        _: () => "The value is not A",
      });

      assert.strictEqual(value, "The value is not A");
    });

    it("throws an error for unexpected types", () => {
      const c = Example.C;

      const pattern: CaseOfPattern<ExampleVariants, string> = {
        A: () => "The value is A",
        B: () => "The value is B",
      };

      assert.throws(
        () => c.caseOf(pattern),
        new CaseOfPatternError(c, pattern),
      );
    });
  });
});
