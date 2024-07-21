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

export interface HandlerBase<T extends unknown[]> {
  id: string;
  handle: (...args: T) => HandlerResult;
  priority: number;
}
