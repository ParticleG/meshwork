import { Cell } from 'types/cell';

export enum Direction {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left',
}

export class Field extends Array<Array<Cell>> {
  constructor(column: number, row: number) {
    super(column);
    for (let i = 0; i < column; i++) {
      this[i] = new Array<Cell>(row);
      for (let j = 0; j < row; j++) {
        this[i][j] = null;
      }
    }
  }
}
