import { Entity } from 'excalibur';
import { Direction, Field } from 'types/field/types';
import { CellPosition, PositionLink } from 'types/common';

export class FieldEntity extends Entity {
  public column: number;
  public direction: Direction;
  public row: number;

  private _field: Field;

  constructor(column: number, row: number, direction: Direction) {
    super();
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

    // Todo: Update rendering
  }

  mutateField(cellsToMove: PositionLink[], cellsToSet: CellPosition[]) {
    const mutatedField = this._field;
    cellsToSet.forEach(({ cell, column, row }) => {
      mutatedField[column][row] = cell;
    });
  }
}
