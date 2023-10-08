import { Direction, Field } from 'types/field/types';
import { CellPosition, PositionLink } from 'types/common';
import { onAfterMutateField, onBeforeMutateField } from 'types/field/rules';

export class FieldEntity {
  public column: number;
  public row: number;
  public direction: Direction;

  private _field: Field;
  private _beforeMutateFieldRules: onBeforeMutateField[] = [];
  private _afterMutateFieldRules: onAfterMutateField[] = [];

  constructor(column: number, row: number, direction: Direction) {
    this.column = column;
    this.direction = direction;
    this.row = row;
    this._field = new Field(column, row);
  }

  morphField(
    column: number,
    row: number,
    direction: Direction,
    rearrangeRule: (
      oldField: FieldEntity,
      column: number,
      row: number,
      direction: Direction
    ) => Field
  ) {
    this._field = rearrangeRule(this, column, row, direction);
    this.column = column;
    this.direction = direction;
    this.row = row;
  }

  mutateField(
    cellsToMove: PositionLink[],
    cellsToSet: CellPosition[],
    cellsToSwap: PositionLink[]
  ) {
    for (const rule of this._beforeMutateFieldRules) {
      const result = rule(this, cellsToMove, cellsToSet, cellsToSwap);
      if (!result) {
        break;
      }
      cellsToMove = result.cellsToMove;
      cellsToSet = result.cellsToSet;
      cellsToSwap = result.cellsToSwap;
    }
    cellsToMove.forEach(({ from, to }) => {
      this._field[to.column][to.row] = this._field[from.column][from.row];
      this._field[from.column][from.row] = null;
    });
    cellsToSet.forEach(({ cell, column, row }) => {
      this._field[column][row] = cell;
    });
    cellsToSwap.forEach(({ from, to }) => {
      const fromCell = this._field[from.column][from.row];
      this._field[from.column][from.row] = this._field[to.column][to.row];
      this._field[to.column][to.row] = fromCell;
    });
    for (const rule of this._afterMutateFieldRules) {
      const result = rule(this, cellsToMove, cellsToSet, cellsToSwap);
      if (!result) {
        break;
      }
      cellsToMove = result.cellsToMove;
      cellsToSet = result.cellsToSet;
      cellsToSwap = result.cellsToSwap;
    }
  }
}
