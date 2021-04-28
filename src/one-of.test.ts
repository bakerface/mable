import assert from "assert";
import { OneOf } from "./one-of";

class Example extends OneOf<{ A: []; B: [] }> {
  static A = new Example("A");
  static B = new Example("B");
  static C = new Example("C" as "A");
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
      assert.throws(() => {
        Example.C.caseOf({
          A: () => "The value is A",
          B: () => "The value is B",
        });
      }, new Error(`The type "C" is not valid.`));
    });
  });
});
