import { BinaryPosition, Direction } from 'types/common';
import { FrameActor } from 'types/container';
import { FacePosition } from 'types/item';

export type onBeforeMutateField = (
  oldField: FrameActor,
  facesToMove: Direction<BinaryPosition>[],
  facesToSet: FacePosition[],
  faceToSwap: Direction<BinaryPosition>[],
) => void | {
  facesToMove: Direction<BinaryPosition>[];
  facesToSet: FacePosition[];
  faceToSwap: Direction<BinaryPosition>[];
};

export type onAfterMutateField = (
  newField: FrameActor,
  facesToMove: Direction<BinaryPosition>[],
  facesToSet: FacePosition[],
  facesToSwap: Direction<BinaryPosition>[],
) => void | {
  facesToMove: Direction<BinaryPosition>[];
  facesToSet: FacePosition[];
  faceToSwap: Direction<BinaryPosition>[];
};
