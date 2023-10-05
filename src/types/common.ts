import { Cell } from 'types/cell';

export interface Position {
  column: number;
  row: number;
}

export interface CellPosition extends Position {
  cell: Cell;
}

export interface PositionLink {
  from: Position;
  to: Position;
}
