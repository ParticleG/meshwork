import { Actor, EasingFunctions, vec } from 'excalibur';
import { Direction, Field } from 'types/field/types';
import { CellPosition, PositionLink } from 'types/common';
import { onAfterMutateField, onBeforeMutateField } from 'types/field/rules';
import { ActorArgs } from 'excalibur/build/dist/Actor';

export class FieldEntity extends Actor {
  public column: number;
  public row: number;
  public direction: Direction;

  private _field: Field;
  private _beforeMutateFieldRules: onBeforeMutateField[] = [];
  private _afterMutateFieldRules: onAfterMutateField[] = [];

  constructor(
    column: number,
    row: number,
    direction: Direction,
    configs?: ActorArgs
  ) {
    super(configs);
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
      const fromCell = this._field[from.column][from.row];
      const toCell = this._field[to.column][to.row];
      if (fromCell) {
        fromCell.actions.easeTo(
          vec(to.column * fromCell.width, to.row * fromCell.height),
          250,
          EasingFunctions.EaseInOutCubic
        );
      }
      if (toCell) {
        toCell.actions.fade(0, 250).die();
      }
      this._field[to.column][to.row] = this._field[from.column][from.row];
      this._field[from.column][from.row] = null;
    });
    cellsToSet.forEach(({ cell, column, row }) => {
      const previousCell = this._field[column][row];
      if (previousCell) {
        previousCell.actions.die();
        // this.removeChild(previousCell);
      }
      this._field[column][row] = cell;
      if (cell) {
        cell.pos.x = column * cell.width;
        cell.pos.y = row * cell.height;
        this.addChild(cell);
      }
    });
    cellsToSwap.forEach(({ from, to }) => {
      const fromCell = this._field[from.column][from.row];
      const toCell = this._field[to.column][to.row];
      if (fromCell) {
        fromCell.actions.easeTo(
          vec(to.column * fromCell.width, to.row * fromCell.height),
          250,
          EasingFunctions.EaseInOutCubic
        );
      }
      if (toCell) {
        toCell.actions.easeTo(
          vec(from.column * toCell.width, from.row * toCell.height),
          250,
          EasingFunctions.EaseInOutCubic
        );
      }
      this._field[from.column][from.row] = toCell;
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
