export interface BinaryPosition {
  x: number;
  y: number;
}

export interface TernaryPosition extends BinaryPosition {
  z: number;
}

export interface Direction<T extends BinaryPosition> {
  begin: T;
  end: T;
}

export interface Item<T extends BinaryPosition> {
  position: T;
  skin: {
    name: string;
    index: number;
  };
  data: unknown;
}
