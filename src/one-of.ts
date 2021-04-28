export class OneOf<T extends Variants> {
  private type: keyof T;
  private payload: unknown[];

  constructor(...args: Choice<T>) {
    this.type = args.shift() as keyof T;
    this.payload = args;
  }

  caseOf<Return>(pattern: CaseOfPattern<T, Return>): Return {
    if (this.type in pattern) {
      return (pattern[this.type] as any)(...this.payload);
    }

    if ("_" in pattern) {
      return pattern._();
    }

    throw new Error(`The type "${this.type}" is not valid.`);
  }
}

export type CaseOfPattern<T extends Variants, Return> =
  | ExhaustiveCaseOfPattern<T, Return>
  | PartialCaseOfPattern<T, Return>;

export type ExhaustiveCaseOfPattern<T extends Variants, Return> = {
  readonly [K in keyof T]: (...args: T[K]) => Return;
};

export type PartialCaseOfPattern<T extends Variants, Return> = {
  readonly _: () => Return;
} & Partial<ExhaustiveCaseOfPattern<T, Return>>;

export type Choice<T extends Variants> = Choices<T>[keyof T];

export type Choices<T extends Variants> = {
  readonly [K in keyof T]: Cons<K, T[K]>;
};

export interface Variants {
  readonly [type: string]: unknown[];
}

export type Cons<A, B extends any[]> = [A, ...B];
