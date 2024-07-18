import { Cell, Face } from 'types/item/types';

export class Field extends Array<Array<Array<Cell | undefined>>> {
  constructor(column: number, row: number, depth: number) {
    super(column);
    for (let i = 0; i < column; i++) {
      this[i] = new Array<Array<Cell | undefined>>(row);
      for (let j = 0; j < row; j++) {
        this[i][j] = new Array<Cell>(depth);
      }
    }
  }
}

export class Frame extends Array<Array<Face | undefined>> {
  constructor(column: number, row: number) {
    super(column);
    for (let i = 0; i < column; i++) {
      this[i] = new Array<Face>(row);
    }
  }
}
