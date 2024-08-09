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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HandlerBase<T extends Parameters<any>> {
  id: string;
  handle: (...args: T) => HandlerResult;
  priority: number;
}
