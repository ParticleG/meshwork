import { Frame } from 'types/container/types';
import { BinaryPosition, Direction } from 'types/common';
import { onAfterMutateField, onBeforeMutateField } from 'types/container/rules';
import { FacePosition } from 'types/item';
import { Actor } from 'excalibur';

export class FrameActor extends Actor {
  public column: number;
  public row: number;

  private _field: Frame;
  private _beforeMutateFieldRules: onBeforeMutateField[] = [];
  private _afterMutateFieldRules: onAfterMutateField[] = [];

  constructor(column: number, row: number) {
    super({
      height: 800,
      width: 800,
    });
    this.column = column;
    this.row = row;
    this._field = new Frame(column, row);
  }

  morphField(
    column: number,
    row: number,
    rearrangeRule: (
      oldField: FrameActor,
      column: number,
      row: number,
    ) => Frame,
  ) {
    this._field = rearrangeRule(this, column, row);
    this.column = column;
    this.row = row;
  }

  mutateField(
    itemsToMove: Direction<BinaryPosition>[],
    itemsToSet: FacePosition[],
    itemsToSwap: Direction<BinaryPosition>[],
  ) {
    for (const rule of this._beforeMutateFieldRules) {
      const result = rule(this, itemsToMove, itemsToSet, itemsToSwap);
      if (!result) {
        break;
      }
      itemsToMove = result.facesToMove;
      itemsToSet = result.facesToSet;
      itemsToSwap = result.faceToSwap;
    }
    itemsToMove.forEach(({ begin, end }) => {
      this._field[end.x][end.y] = this._field[begin.x][begin.y];
      this._field[begin.x][begin.y] = undefined;
    });
    itemsToSet.forEach(({ item, position }) => {
      this._field[position.x][position.y] = item;
    });
    itemsToSwap.forEach(({ begin, end }) => {
      const fromCell = this._field[begin.x][begin.y];
      this._field[begin.x][begin.y] = this._field[end.x][end.y];
      this._field[end.x][end.y] = fromCell;
    });
    for (const rule of this._afterMutateFieldRules) {
      const result = rule(this, itemsToMove, itemsToSet, itemsToSwap);
      if (!result) {
        break;
      }
      itemsToMove = result.facesToMove;
      itemsToSet = result.facesToSet;
      itemsToSwap = result.faceToSwap;
    }
  }
}
