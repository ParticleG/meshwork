import { FieldEntity } from 'types/field';
import { CellPosition, PositionLink } from 'types/common';

export type onBeforeMutateField = (
  oldField: FieldEntity,
  cellsToMove: PositionLink[],
  cellsToSet: CellPosition[]
) => void | {
  cellsToMove: PositionLink[];
  cellsToSet: CellPosition[];
};

export type onAfterMutateField = (
  newField: FieldEntity,
  cellsMoved: PositionLink[],
  cellsSet: CellPosition[]
) => void | {
  cellsMoved: PositionLink[];
  cellsSet: CellPosition[];
};
