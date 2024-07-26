export interface BinaryPosition {
  x: number;
  y: number;
}

export interface TernaryPosition extends BinaryPosition {
  z: number;
}

export type Direction =
  | {
      begin: BinaryPosition;
      end: BinaryPosition;
    }
  | {
      begin: TernaryPosition;
      end: TernaryPosition;
    };

export enum HandlerResult {
  Abort = 'Abort',
  Break = 'Break',
  Continue = 'Continue',
  Skip = 'Skip',
}

export interface HandlerBase<T extends Parameters<any>> {
  id: string;
  handle: (...args: T) => HandlerResult;
  priority: number;
}

export const performHandlers = <
  Args extends Parameters<any>,
  MainFunc extends Function,
>(
  afterHandlers: HandlerBase<Args>[],
  beforeHandlers: HandlerBase<Args>[],
  process: MainFunc,
  ...args: Args
) => {};
