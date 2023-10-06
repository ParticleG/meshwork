import { FieldEntity } from 'types/field';
import { CellPosition, PositionLink } from 'types/common';

export type onBeforeMutateField = (
  oldField: FieldEntity,
  cellsToMove: PositionLink[],
  cellsToSet: CellPosition[],
  cellsToSwap: PositionLink[]
) => void | {
  cellsToMove: PositionLink[];
  cellsToSet: CellPosition[];
  cellsToSwap: PositionLink[];
};

export type onAfterMutateField = (
  newField: FieldEntity,
  cellsToMove: PositionLink[],
  cellsToSet: CellPosition[],
  cellsToSwap: PositionLink[]
) => void | {
  cellsToMove: PositionLink[];
  cellsToSet: CellPosition[];
  cellsToSwap: PositionLink[];
};
