import { expect } from "chai";
import { Result, Task } from "../src";

interface FetchNumberError {
  readonly type: "FetchNumberError";
  readonly payload: string;
}

interface FetchNumberSuccess {
  readonly type: "FetchNumberSuccess";
  readonly payload: number;
}

type Msg = FetchNumberError | FetchNumberSuccess;

const fetchNumberError = (payload: string): Msg =>
  ({ type: "FetchNumberError", payload });

const fetchNumberSuccess = (payload: number): Msg =>
  ({ type: "FetchNumberSuccess", payload });

describe("Task", () => {
  describe("#attempt", () => {
    it("should map the Task to a Command", (done) => {
      const fetchNumberResponse = Result.caseOf({
        Err: fetchNumberError,
        Ok: fetchNumberSuccess,
      });

      const fetchNumberRequest = (callback: Task.Callback<string, number>) =>
        setTimeout(() => callback(Result.ok(42)), 10);

      const cmd = Task.attempt(fetchNumberResponse)(fetchNumberRequest);

      cmd((message) => {
        expect(message).has.property("type", "FetchNumberSuccess");
        expect(message).has.property("payload", 42);
        done();
      });
    });
  });
});
