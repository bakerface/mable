import { Result } from "./Result";

export type Callback<E, T> = (result: Result<E, T>) => void;
export type Task<E, T> = (callback: Callback<E, T>) => void;

export const attempt = <E, T, M>(map: (res: Result<E, T>) => M) =>
  (task: Task<E, T>) =>
    (callback: (msg: M) => void) =>
      task((res) => callback(map(res)));
