import { FrameActor } from 'types/container/index';
import { Cell, FaceData } from 'types/item/types';
import { BinaryPosition } from 'types/common';

export enum ModifyHandlerType {
  AfterExtract = 'AfterExtract',
  AfterInsert = 'AfterInsert',
  BeforeExtract = 'BeforeExtract',
  BeforeInsert = 'BeforeInsert',
}

export interface PositionedFace {
  position: BinaryPosition;
  value?: FaceData;
}

export interface ModifyHandler {
  id: string;
  handle: (
    context: FrameActor,
    data: PositionedFace[],
  ) => PositionedFace[] | void;
  priority: number;
}

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

export class Frame extends Array<Array<FaceData | undefined>> {
  constructor(column: number, row: number) {
    super(column);
    for (let i = 0; i < column; i++) {
      this[i] = new Array<FaceData>(row);
    }
  }
}
