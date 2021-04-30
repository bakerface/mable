export class OneOf<T> {
  private type: keyof T;
  private payload: unknown;

  constructor(...choice: Choice<T>) {
    this.type = choice[0];
    this.payload = choice[1];
  }

  caseOf<Return>(pattern: CaseOfPattern<T, Return>): Return {
    if (this.type in pattern) {
      return (pattern[this.type] as any)(this.payload);
    }

    if ("_" in pattern) {
      return pattern._();
    }

    throw new Error(`The type "${this.type}" is not valid.`);
  }
}

export type CaseOfPattern<T, Return> =
  | ExhaustiveCaseOfPattern<T, Return>
  | PartialCaseOfPattern<T, Return>;

type ExhaustiveCaseOfPattern<T, Return> = {
  readonly [K in keyof T]: (payload: T[K]) => Return;
};

type PartialCaseOfPattern<T, Return> = {
  readonly _: () => Return;
} & Partial<ExhaustiveCaseOfPattern<T, Return>>;

type Choice<T> = Choices<T>[keyof T];

type Choices<T> = {
  readonly [K in keyof T]: [type: K, payload: T[K]];
};
