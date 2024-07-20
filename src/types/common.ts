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
